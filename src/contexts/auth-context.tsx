'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
  UserCredential,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  EmailAuthProvider,
  linkWithCredential,
} from 'firebase/auth';
import { auth, db, googleProvider } from '@/lib/firebase-client';
import { CustomLoader } from '@/components/ui/custom-loader';
import { doc, setDoc, serverTimestamp, getDoc, collection, getDocs, updateDoc, query, orderBy } from 'firebase/firestore';

interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  role: 'borrower' | 'broker' | 'workforce' | 'admin';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
  authProvider?: string;
  hasPassword?: boolean;
  updatedAt?: any;
  generatedPassword?: string; // Temporary field to store the generated password
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userProfile: UserProfile | null;
  signUp: (email: string, pass: string, fullName: string, role: string) => Promise<UserCredential>;
  signIn: (email: string, pass: string) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<UserCredential>;
  signUpWithGoogle: (role: string) => Promise<{ credential: UserCredential; generatedPassword: string }>;
  checkEmailExists: (email: string) => Promise<boolean>;
  sendPasswordReset: (email: string) => Promise<void>;
  logOut: () => Promise<void>;
  // Admin functions
  getAllUsers: () => Promise<UserProfile[]>;
  updateUserRole: (uid: string, newRole: UserProfile['role']) => Promise<void>;
  updateUserStatus: (uid: string, newStatus: UserProfile['status']) => Promise<void>;
  isAdmin: boolean;
  getRedirectPath: () => string;
  isLoggingOut: boolean;
  resetLogoutFlag: () => void;
  redirectAfterAuth: (router: any) => Promise<void>;
  addPasswordToGoogleAccount: (password: string) => Promise<boolean>;
  canSignInWithPassword: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Use a ref to track logout state to avoid dependency array issues
  const isLoggingOutRef = useRef(false);
  
  // Add a ref to track the last sign-in attempt to prevent duplicates
  const lastSignInAttemptRef = useRef<number>(0);

  // Check if current user is admin
  const isAdmin = useMemo(() => {
    // First check if we have a user profile with admin role
    if (userProfile?.role === 'admin') {
      return true;
    }
    
    // Then check if the user UID matches hardcoded admin UIDs
    if (user?.uid === 'UCqwzQPlG4Xcb3BzcxGQ8JvjDba2' || 
        user?.uid === 'LQYGVdjvcAOB58nnK4lzP3sgW6B2') {
      return true;
    }
    
    return false;
  }, [userProfile?.role, user?.uid]);

  const signUp = useCallback(async (email: string, pass: string, fullName: string, role: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(userCredential.user, { displayName: fullName });
      
      const userData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        fullName: fullName,
        role: role,
        status: role === 'workforce' || role === 'admin' ? 'approved' : 'pending',
        createdAt: serverTimestamp(),
      };
      
      try {
        await setDoc(doc(db, "users", userCredential.user.uid), userData);
      } catch (firestoreError) {
        console.error('Failed to save user profile to Firestore:', firestoreError);
        // Continue anyway - the user is authenticated even if profile save fails
      }
      
      // Update local state
      setUserProfile(userData as UserProfile);
      
      // Manually set the user in the context after sign-up and profile update
      setUser(userCredential.user);
      
      return userCredential;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }, []);

  const signIn = useCallback(async (email: string, pass: string) => {
    try {
      console.log('signIn function called with email:', email);
      const result = await signInWithEmailAndPassword(auth, email, pass);
      console.log('signIn successful, user:', result.user.uid);
      
      // Simple sign-in - let onAuthStateChanged handle the redirect
      return result;
    } catch (error: any) {
      console.error('Sign in error:', error);
      // Provide more user-friendly error messages
      if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email address. Please check your email or sign up.');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password. Please try again.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address format.');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many failed attempts. Please try again later.');
      } else if (error.code === 'auth/user-disabled') {
        throw new Error('This account has been disabled. Please contact support.');
      } else {
        throw new Error('Sign in failed. Please check your credentials and try again.');
      }
    }
  }, []);

  const signInWithGoogle = useCallback(async (): Promise<UserCredential> => {
    const now = Date.now();
    const timeSinceLastAttempt = now - lastSignInAttemptRef.current;
    
    // Prevent multiple rapid attempts (within 2 seconds)
    if (timeSinceLastAttempt < 2000) {
      throw new Error('Please wait a moment before trying again.');
    }
    
    if (isGoogleSigningIn) {
      throw new Error('Google sign-in already in progress');
    }

    // Record this attempt
    lastSignInAttemptRef.current = now;
    setIsGoogleSigningIn(true);
    
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      console.log('Google sign-in successful, user:', result.user.uid);
      
      // Simple Google sign-in - let onAuthStateChanged handle the redirect
      
      // Reset the signing in flag
      setIsGoogleSigningIn(false);
      
      return result;
    } catch (error: any) {
      setIsGoogleSigningIn(false);
      
      // Handle specific Google sign-in errors
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in was cancelled. Please try again.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        throw new Error('Sign-in was cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Pop-up was blocked. Please allow pop-ups and try again.');
      } else if (error.code === 'auth/network-request-failed') {
        throw new Error('Network error. Please check your connection and try again.');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many sign-in attempts. Please wait a moment and try again.');
      } else {
        console.error('Google sign-in error:', error);
        throw new Error('Sign-in failed. Please try again.');
      }
    }
  }, [isGoogleSigningIn]);

  const signUpWithGoogle = useCallback(async (role: string): Promise<{ credential: UserCredential; generatedPassword: string }> => {
    if (isGoogleSigningIn) {
      throw new Error('Google sign-up already in progress');
    }

    setIsGoogleSigningIn(true);
    
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Generate a secure random password for the user
      const generatedPassword = Math.random().toString(36).slice(-8) + 
                               Math.random().toString(36).slice(-8) + 
                               Math.random().toString(36).slice(-8);
      
      // Create a credential with the generated password
      const emailCredential = EmailAuthProvider.credential(user.email!, generatedPassword);
      
      // Link the password credential to the user
      await linkWithCredential(user, emailCredential);
      
      // Check if user already exists in Firestore
      let userDoc;
      try {
        userDoc = await getDoc(doc(db, "users", user.uid));
      } catch (firestoreError) {
        console.warn('Could not check Firestore for existing user, creating new profile:', firestoreError);
        userDoc = { exists: () => false, data: () => null };
      }
      
      if (!userDoc.exists()) {
        // Create new user document for first-time Google sign-up
        const userData = {
          uid: user.uid,
          email: user.email,
          fullName: user.displayName || 'Unknown',
          role: role,
          status: 'pending',
          createdAt: serverTimestamp(),
          authProvider: 'google',
          hasPassword: true, // Indicate they now have a password
          generatedPassword: generatedPassword, // Store the generated password temporarily
        };
        
        try {
          await setDoc(doc(db, "users", user.uid), userData);
          console.log('User profile created with both Google and password auth');
        } catch (createError) {
          console.warn('Failed to create user profile in Firestore:', createError);
          // Continue anyway - the user is authenticated even if profile save fails
        }
        
        setUserProfile(userData as UserProfile);
        
        // Show success message with the generated password
        console.log('Account created successfully!');
        console.log('Generated password:', generatedPassword);
        console.log('You can now sign in with either Google or email/password');
        
      } else {
        // Check if this is an admin user and ensure their role is set correctly
        const userData = userDoc.data() as UserProfile;
        const isAdminUser = user.uid === 'UCqwzQPlG4Xcb3BzcxGQ8JvjDba2' || 
                           user.uid === 'LQYGVdjvcAOB58nnK4lzP3sgW6B2' || 
                           user.uid === 'Wvzsq4sWJWf3NOjwMgMhqpw4O9b2';
        
        if (isAdminUser && userData.role !== 'admin') {
          // Update the user's role to admin if they're one of the hardcoded admin UIDs
          const updatedUserData = {
            ...userData,
            role: 'admin' as const,
            status: 'approved' as const,
            hasPassword: true,
            generatedPassword: generatedPassword,
          };
          try {
            await updateDoc(doc(db, "users", user.uid), updatedUserData);
          } catch (updateError) {
            console.warn('Failed to update admin user role in Firestore:', updateError);
            // Continue anyway - the user is authenticated even if role update fails
          }
          setUserProfile(updatedUserData);
        } else {
          // Update existing user to have password auth as well
          const updatedUserData = {
            ...userData,
            hasPassword: true,
            generatedPassword: generatedPassword,
          };
          try {
            await updateDoc(doc(db, "users", user.uid), updatedUserData);
          } catch (updateError) {
            console.warn('Failed to update user with password auth:', updateError);
          }
          setUserProfile(updatedUserData);
        }
      }
      
      // Reset the signing in flag
      setIsGoogleSigningIn(false);
      
      return { credential: result, generatedPassword };
    } catch (error: any) {
      setIsGoogleSigningIn(false);
      
      // Handle specific Google sign-up errors
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-up was cancelled. Please try again.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        throw new Error('Sign-up was cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Pop-up was blocked. Please allow pop-ups and try again.');
      } else if (error.code === 'auth/network-request-failed') {
        throw new Error('Network error. Please check your connection and try again.');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many sign-up attempts. Please wait a moment and try again.');
      } else if (error.code === 'auth/email-already-in-use') {
        throw new Error('An account with this email already exists. Please sign in instead.');
      } else {
        console.error('Google sign-up error:', error);
        throw new Error('Sign-up failed. Please try again.');
      }
    }
  }, [isGoogleSigningIn]);

  const checkEmailExists = useCallback(async (email: string) => {
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      return methods.length > 0;
    } catch (error) {
      console.error('Email check error:', error);
      // If there's an error checking, we'll assume the email doesn't exist for security
      return false;
    }
  }, []);

  const sendPasswordReset = useCallback(async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }, []);

  const logOut = useCallback(async () => {
    setIsLoggingOut(true);
    isLoggingOutRef.current = true;
    
    // Clear all state immediately to prevent any redirects
    setUserProfile(null);
    setUser(null);
    
    try {
      // Sign out from Firebase
      await signOut(auth);
      
      // Force redirect to home page
      if (typeof window !== 'undefined') {
        // Use a more aggressive redirect approach
        window.location.href = '/';
        // Fallback to replace if href doesn't work
        setTimeout(() => {
          window.location.replace('/');
        }, 50);
      }
    } catch (error) {
      console.error('Error during logout:', error);
      // Force redirect even if there's an error
      if (typeof window !== 'undefined') {
        window.location.href = '/';
        setTimeout(() => {
          window.location.replace('/');
        }, 50);
      }
    }
  }, []);

  // Reset logout flag when user successfully logs in
  const resetLogoutFlag = useCallback(() => {
    setIsLoggingOut(false);
    isLoggingOutRef.current = false;
  }, []);

  // Admin functions
  const getAllUsers = useCallback(async (): Promise<UserProfile[]> => {
    if (!isAdmin) {
      throw new Error('Unauthorized: Admin access required');
    }
    
    try {
      const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() })) as UserProfile[];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }, [isAdmin]);

  const updateUserRole = useCallback(async (uid: string, newRole: UserProfile['role']) => {
    if (!isAdmin) {
      throw new Error('Unauthorized: Admin access required');
    }
    
    try {
      const userDoc = doc(db, "users", uid);
      await updateDoc(userDoc, { role: newRole });
      
      // Update local state if it's the current user
      if (userProfile?.uid === uid) {
        setUserProfile(prev => prev ? { ...prev, role: newRole } : null);
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }, [isAdmin, userProfile]);

  const updateUserStatus = useCallback(async (uid: string, newStatus: UserProfile['status']) => {
    if (!isAdmin) {
      throw new Error('Unauthorized: Admin access required');
    }
    
    try {
      const userDoc = doc(db, "users", uid);
      await updateDoc(userDoc, { status: newStatus });
      
      // Update local state if it's the current user
      if (userProfile?.uid === uid) {
        setUserProfile(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }, [isAdmin, userProfile]);

  // Simple function to get redirect path - no complex waiting
  const getRedirectPath = useCallback((): string => {
    console.log('=== GET REDIRECT PATH START ===');
    console.log('isLoggingOutRef.current:', isLoggingOutRef.current);
    console.log('userProfile:', userProfile);
    console.log('user:', user);
    
    // If logging out, go to home
    if (isLoggingOutRef.current) {
      console.log('Logging out, going to home');
      return '/';
    }
    
    // If we have a user profile, route based on role
    if (userProfile && userProfile.uid) {
      console.log('User profile exists, role:', userProfile.role);
      console.log('User profile status:', userProfile.status);
      console.log('User UID:', userProfile.uid);
      
      if (userProfile.role === 'admin' || userProfile.role === 'workforce') {
        console.log('User is admin/workforce, redirecting to workforce-office');
        return '/workforce-office';
      } else if (userProfile.role === 'broker') {
        console.log('User is broker, redirecting to broker-office');
        return '/broker-office';
      } else {
        console.log('User is borrower, redirecting to dashboard');
        return '/dashboard';
      }
    }
    
    // If we have a user but no profile, check if they're a known admin
    if (user && (user.uid === 'UCqwzQPlG4Xcb3BzcxGQ8JvjDba2' || 
                 user.uid === 'LQYGVdjvcAOB58nnK4lzP3sgW6B2')) {
      console.log('Known admin user without profile, going to workforce office');
      return '/workforce-office';
    }
    
    // Default to home
    console.log('No profile or user, going to home');
    return '/';
  }, [userProfile, user, isLoggingOutRef]);

  // Simple redirect function - wait for profile to be loaded
  const redirectAfterAuth = useCallback(async (router: any) => {
    console.log('=== REDIRECT AFTER AUTH START ===');
    console.log('Current state - user:', !!user, 'userProfile:', !!userProfile, 'loading:', loading);
    
    // If we already have the profile, redirect immediately
    if (user && userProfile) {
      const path = getRedirectPath();
      console.log('Profile already loaded, redirecting to:', path);
      router.push(path);
      return;
    }
    
    // Wait for profile to be loaded (up to 5 seconds)
    let attempts = 0;
    const maxAttempts = 10; // 10 attempts * 500ms = 5 seconds
    
    while (attempts < maxAttempts) {
      if (user && userProfile && !loading) {
        const path = getRedirectPath();
        console.log('Profile loaded, redirecting to:', path);
        router.push(path);
        return;
      }
      
      console.log(`Attempt ${attempts + 1}: Waiting for profile... (user: ${!!user}, profile: ${!!userProfile}, loading: ${loading})`);
      await new Promise(resolve => setTimeout(resolve, 500));
      attempts++;
    }
    
    // If we still don't have a profile after waiting, use fallback
    console.log('Profile loading timeout, using fallback redirect');
    const path = getRedirectPath();
    console.log('Fallback redirect to:', path);
    router.push(path);
  }, [user, userProfile, loading, getRedirectPath]);

  // Function to add password to existing Google account
  const addPasswordToGoogleAccount = useCallback(async (password: string) => {
    if (!user) {
      throw new Error('No user is currently signed in');
    }
    
    try {
      // Create a new credential with email and password
      const credential = EmailAuthProvider.credential(user.email!, password);
      
      // Link the credential to the current user
      await linkWithCredential(user, credential);
      
      console.log('Password successfully added to Google account');
      
      // Update the user profile to indicate they now have a password
      if (userProfile) {
        await updateDoc(doc(db, "users", user.uid), {
          hasPassword: true,
          updatedAt: serverTimestamp(),
        });
      }
      
      return true;
    } catch (error: any) {
      console.error('Error adding password to Google account:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('This email is already associated with a password-based account. Please use the password sign-in instead.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password is too weak. Please choose a stronger password.');
      } else {
        throw new Error('Failed to add password to account. Please try again.');
      }
    }
  }, [user, userProfile]);

  // Function to check if user can sign in with password
  const canSignInWithPassword = useCallback(async (email: string): Promise<boolean> => {
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      return methods.includes('password');
    } catch (error) {
      console.error('Error checking sign-in methods:', error);
      return false;
    }
  }, []);

  // Main auth state listener - simplified and reliable
  useEffect(() => {
    console.log('=== AUTH STATE CHANGE START ===');
    console.log('Setting up onAuthStateChanged listener...');
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed - User:', user?.uid);
      
      if (isLoggingOutRef.current) {
        console.log('Logging out, ignoring auth state change');
        return;
      }
      
      if (!user) {
        // User signed out
        console.log('No user, clearing profile');
        setUserProfile(null);
        setUser(null);
        setLoading(false);
        console.log('=== AUTH STATE CHANGE END (LOGOUT) ===');
        return;
      }
      
      // User signed in
      console.log('User signed in, fetching profile...');
      setUser(user);
      setLoading(true);
      
      try {
        // Fetch user profile
        const userDoc = await getDoc(doc(db, "users", user.uid));
        
        // Set the user profile in state (but don't auto-redirect)
        if (userDoc.exists()) {
          const userData = userDoc.data() as UserProfile;
          console.log('Profile found:', userData);
          
          // Check if this is an admin user and ensure their role is set correctly
          const isAdminUser = user.uid === 'UCqwzQPlG4Xcb3BzcxGQ8JvjDba2' || 
                             user.uid === 'LQYGVdjvcAOB58nnK4lzP3sgW6B2';
          
          // Special case: Force update this specific user to borrower role
          if (user.uid === 'Wvzsq4sWJWf3NOjwMgMhqpw4O9b2' && userData.role !== 'borrower') {
            console.log('Force updating user to borrower role');
            const updatedUserData = {
              ...userData,
              role: 'borrower' as const,
              status: 'pending' as const,
            };
            
            try {
              await updateDoc(doc(db, "users", user.uid), {
                role: 'borrower',
                status: 'pending',
              });
              console.log('User role updated to borrower successfully in Firestore');
              setUserProfile(updatedUserData);
            } catch (updateError) {
              console.error('Error updating user to borrower role:', updateError);
              // Still set the profile even if update fails
              setUserProfile(updatedUserData);
            }
          } else if (isAdminUser && userData.role !== 'admin') {
            // Update the user's role to admin if they're one of the hardcoded admin UIDs
            console.log('Updating existing user role from', userData.role, 'to admin');
            const updatedUserData = {
              ...userData,
              role: 'admin' as const,
              status: 'approved' as const,
            };
            
            try {
              await updateDoc(doc(db, "users", user.uid), {
                role: 'admin',
                status: 'approved',
              });
              console.log('Admin role updated successfully in Firestore');
              setUserProfile(updatedUserData);
            } catch (updateError) {
              console.error('Error updating admin user role:', updateError);
              // Still set the profile even if update fails
              setUserProfile(updatedUserData);
            }
          } else {
            setUserProfile(userData);
          }
        } else {
          // Create new profile
          console.log('Creating new profile...');
          const isAdminUser = user.uid === 'UCqwzQPlG4Xcb3BzcxGQ8JvjDba2' || 
                             user.uid === 'LQYGVdjvcAOB58nnK4lzP3sgW6B2';
          
          const newProfile: UserProfile = {
            uid: user.uid,
            email: user.email || '',
            fullName: user.displayName || 'Unknown User',
            role: isAdminUser ? 'admin' : 'borrower',
            status: isAdminUser ? 'approved' : 'pending',
            createdAt: serverTimestamp(),
            authProvider: 'google',
          };
          
          await setDoc(doc(db, "users", user.uid), newProfile);
          setUserProfile(newProfile);
        }
        
        // Don't set loading to false yet - keep it true until redirect completes
        console.log('=== AUTH STATE CHANGE END (SUCCESS) ===');
        
        // SIMPLE DIRECT REDIRECT - No complex logic, just redirect immediately
        // Keep loading true until redirect completes to prevent flash back to sign-in
        setTimeout(() => {
          if (typeof window !== 'undefined' && window.location.pathname.startsWith('/auth/')) {
            // Get the redirect path based on current state
            let redirectPath = '/';
            
            if (userProfile?.role === 'admin' || userProfile?.role === 'workforce') {
              redirectPath = '/workforce-office';
            } else if (userProfile?.role === 'broker') {
              redirectPath = '/broker-office';
            } else if (userProfile?.role === 'borrower') {
              redirectPath = '/dashboard';
            } else {
              // Fallback based on UID for admin users
              const isAdminUser = user.uid === 'UCqwzQPlG4Xcb3BzcxGQ8JvjDba2' || 
                                 user.uid === 'LQYGVdjvcAOB58nnK4lzP3sgW6B2';
              if (isAdminUser) {
                redirectPath = '/workforce-office';
              } else {
                redirectPath = '/dashboard';
              }
            }
            
            console.log('SIMPLE DIRECT REDIRECT to:', redirectPath);
            // Redirect immediately - loading will be cleared when page changes
            window.location.replace(redirectPath);
          } else {
            // If not on auth page, clear loading
            setLoading(false);
          }
        }, 500); // Short delay to ensure state is set
        
      } catch (error) {
        console.error('Error handling auth state change:', error);
        setLoading(false);
        console.log('=== AUTH STATE CHANGE END (ERROR) ===');
      }
    });

    return () => unsubscribe();
  }, []);

  // Safety timeout to prevent loading state from getting stuck
  useEffect(() => {
    if (loading) {
      const safetyTimeout = setTimeout(() => {
        console.log('Safety timeout - forcing loading to false');
        setLoading(false);
      }, 10000); // 10 seconds

      return () => clearTimeout(safetyTimeout);
    }
  }, [loading]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      userProfile,
      signUp, 
      signIn, 
      signInWithGoogle, 
      signUpWithGoogle, 
      checkEmailExists, 
      sendPasswordReset, 
      logOut,
      getAllUsers,
      updateUserRole,
      updateUserStatus,
      isAdmin,
      getRedirectPath,
      isLoggingOut,
      resetLogoutFlag,
      redirectAfterAuth,
      addPasswordToGoogleAccount,
      canSignInWithPassword
    }}>
      {loading ? (
         <div className="flex min-h-screen items-center justify-center flex-col">
            <CustomLoader className="h-10 w-10" />
            <div className="mt-4 text-sm text-gray-500">
              Loading your account...
            </div>
        </div>
      ) : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

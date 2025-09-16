
'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
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
import { auth, db, googleProvider, markExplicitLogout, clearExplicitLogout, clearAllAuthCache, clearAuthCache } from '@/lib/firebase-client';
import { doc, setDoc, serverTimestamp, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { useRouter, usePathname } from 'next/navigation';

interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  role: 'borrower' | 'broker' | 'workforce' | 'admin';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
  authProvider?: string;
  hasPassword?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  isLoggingOut: boolean;
  signUp: (email: string, pass: string, fullName: string, role: string) => Promise<UserCredential>;
  signIn: (email: string, pass: string) => Promise<UserCredential>;
  signInWithGoogle: (role?: string) => Promise<UserCredential>;
  signUpWithGoogle: (role: string) => Promise<UserCredential>;
  checkEmailExists: (email: string) => Promise<boolean>;
  sendPasswordReset: (email: string) => Promise<void>;
  logOut: () => Promise<void>;
  forceLogout: () => Promise<void>;
  clearAuthCache: () => void;
  clearAllAuthCache: () => void;
  addPasswordToGoogleAccount: (password: string) => Promise<void>;
  canSignInWithPassword: (email: string) => Promise<boolean>;
  getAllUsers: () => Promise<UserProfile[]>;
  updateUserRole: (uid: string, newRole: UserProfile['role']) => Promise<void>;
  updateUserStatus: (uid: string, newStatus: UserProfile['status']) => Promise<void>;
  getRedirectPath: (profile?: UserProfile | null) => string;
  debugAuthState: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isAdmin = userProfile?.role === 'admin';
  
  const getRedirectPath = useCallback((profile?: UserProfile | null) => {
    if (!profile) return '/auth/signin';
    switch (profile.role) {
      case 'admin':
      case 'workforce':
        return '/workforce-office';
      case 'broker':
        return '/broker-office';
      case 'borrower':
      default:
        return '/dashboard';
    }
  }, []);


  const handleAuthRedirect = useCallback((profile: UserProfile) => {
    const authPages = ['/auth/signin', '/auth/signup', '/auth/forgot-password', '/auth/reset-password'];
    if (authPages.includes(pathname)) {
        const path = getRedirectPath(profile);
        router.push(path);
    }
  }, [pathname, router, getRedirectPath]);

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates after unmount
    
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (!isMounted) return; // Prevent state updates if component unmounted
      
      setLoading(true);
      console.log('🔄 Auth state changed:', userAuth ? `User: ${userAuth.email}` : 'No user');
      
      try {
        if (userAuth) {
          console.log('👤 User authenticated, fetching profile...');
          
          // Retry logic for fetching user profile
          const maxRetries = 3;
          let profile: UserProfile | null = null;
          
          for (let attempt = 1; attempt <= maxRetries && isMounted; attempt++) {
            try {
              const userDocRef = doc(db, 'users', userAuth.uid);
              const userDoc = await getDoc(userDocRef);
              
              if (!isMounted) return; // Check if still mounted
              
              if (userDoc.exists()) {
                profile = { uid: userDoc.id, ...userDoc.data() } as UserProfile;
                console.log(`✅ User profile loaded on attempt ${attempt}:`, profile.email, profile.role);
                break;
              } else {
                console.warn(`⚠️ User profile not found in Firestore on attempt ${attempt}`);
              }
            } catch (error) {
              console.error(`❌ Error fetching user profile on attempt ${attempt}:`, error);
              if (attempt < maxRetries && isMounted) {
                const delay = Math.pow(2, attempt) * 1000;
                console.log(`⏳ Waiting ${delay}ms before retry...`);
                await new Promise(resolve => setTimeout(resolve, delay));
              }
            }
          }
          
          if (!isMounted) return; // Check if still mounted before state updates
          
          setUser(userAuth);

          if (profile) {
            setUserProfile(profile);
            handleAuthRedirect(profile);
          } else {
            // This case handles a user that exists in Firebase Auth but not in Firestore.
            // It could happen if the Firestore document creation failed during signup.
            console.error('❌ User exists in Firebase Auth but not in Firestore');
            setUserProfile(null);
            router.push('/auth/signin');
          }
        } else {
          if (!isMounted) return; // Check if still mounted
          console.log('👤 No user authenticated');
          setUser(null);
          setUserProfile(null);
        }
      } catch (error) {
        console.error('❌ Error in auth state change handler:', error);
        if (isMounted) {
          setUser(null);
          setUserProfile(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false; // Mark as unmounted
      unsubscribe(); // Clean up listener
    };
  }, []); // Empty dependency array to prevent recreation

  const signUp = async (email: string, pass: string, fullName: string, role: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(userCredential.user, { displayName: fullName });
      
      const newProfile: UserProfile = {
        uid: userCredential.user.uid,
        email: userCredential.user.email!,
        fullName: fullName,
        role: role as UserProfile['role'],
        status: (role === 'workforce' || role === 'admin') ? 'approved' : 'pending',
        createdAt: serverTimestamp(),
        authProvider: 'password',
        hasPassword: true,
      };
      
      // Create Firestore document - if this fails, we need to clean up the auth user
      try {
        await setDoc(doc(db, "users", userCredential.user.uid), newProfile);
        setUserProfile(newProfile);
        
        // Clear explicit logout flag since user is signing up
        clearExplicitLogout();
        
        return userCredential;
      } catch (firestoreError) {
        console.error('Failed to create user profile in Firestore:', firestoreError);
        // Clean up the Firebase Auth user since Firestore creation failed
        await userCredential.user.delete();
        throw new Error('Failed to create user profile. Please try again.');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };
  
  const signIn = async (email: string, pass: string) => {
    const maxRetries = 3;
    let lastError: any;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Sign in attempt ${attempt}/${maxRetries} for ${email}`);
        const result = await signInWithEmailAndPassword(auth, email, pass);
        console.log(`✅ Sign in successful on attempt ${attempt}`);
        // Clear explicit logout flag since user is signing in
        clearExplicitLogout();
        return result;
      } catch (error: any) {
        lastError = error;
        console.error(`❌ Sign in attempt ${attempt} failed:`, error.code, error.message);
        
        // Don't retry for certain errors
        if (error.code === 'auth/user-not-found' || 
            error.code === 'auth/wrong-password' || 
            error.code === 'auth/invalid-email') {
          throw error;
        }
        
        // Wait before retrying (exponential backoff)
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
          console.log(`⏳ Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    console.error(`❌ All ${maxRetries} sign in attempts failed`);
    throw lastError;
  };
  
  const signUpWithGoogle = async (role: string = 'borrower') => {
    const maxRetries = 3;
    let lastError: any;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Google sign in attempt ${attempt}/${maxRetries}`);
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        console.log(`✅ Google sign in successful on attempt ${attempt} for user:`, user.email);
        // Clear explicit logout flag since user is signing in
        clearExplicitLogout();
        
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
            const newProfile: UserProfile = {
              uid: user.uid,
              email: user.email!,
              fullName: user.displayName || 'New User',
              role: role as UserProfile['role'],
              status: (role === 'workforce' || role === 'admin') ? 'approved' : 'pending',
              createdAt: serverTimestamp(),
              authProvider: 'google',
              hasPassword: false,
            };
            await setDoc(userDocRef, newProfile);
            setUserProfile(newProfile);
            console.log(`✅ New user profile created for Google user:`, user.email);
        } else {
            const profile = userDoc.data() as UserProfile;
            setUserProfile(profile);
            console.log(`✅ Existing user profile loaded for Google user:`, user.email);
        }
        
        return result;
      } catch (error: any) {
        lastError = error;
        console.error(`❌ Google sign in attempt ${attempt} failed:`, error.code, error.message);
        
        // Don't retry for certain errors
        if (error.code === 'auth/popup-closed-by-user' || 
            error.code === 'auth/cancelled-popup-request' ||
            error.code === 'auth/popup-blocked') {
          throw error;
        }
        
        // Wait before retrying (exponential backoff)
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
          console.log(`⏳ Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    console.error(`❌ All ${maxRetries} Google sign in attempts failed`);
    throw lastError;
  };

  const signInWithGoogle = async () => {
    const maxRetries = 3;
    let lastError: any;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Google sign in attempt ${attempt}/${maxRetries}`);
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        console.log(`✅ Google sign in successful on attempt ${attempt} for user:`, user.email);
        // Clear explicit logout flag since user is signing in
        clearExplicitLogout();
        
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
          // User doesn't exist in Firestore - this shouldn't happen for sign-in
          console.error('❌ User exists in Firebase Auth but not in Firestore - this is a sign-in error');
          throw new Error('Account not found. Please sign up first.');
        } else {
          const profile = userDoc.data() as UserProfile;
          setUserProfile(profile);
          console.log(`✅ Existing user profile loaded for Google user:`, user.email);
        }
        
        return result;
      } catch (error: any) {
        lastError = error;
        console.error(`❌ Google sign in attempt ${attempt} failed:`, error.code, error.message);
        
        // Don't retry for certain errors
        if (error.code === 'auth/popup-closed-by-user' || 
            error.code === 'auth/cancelled-popup-request' ||
            error.code === 'auth/popup-blocked') {
          throw error;
        }
        
        // Wait before retrying (exponential backoff)
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
          console.log(`⏳ Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    console.error(`❌ All ${maxRetries} Google sign in attempts failed`);
    throw lastError;
  };

  const addPasswordToGoogleAccount = async (password: string) => {
    if (!user || !user.email) {
        throw new Error("User not eligible or email not available.");
    }
    const methods = await fetchSignInMethodsForEmail(auth, user.email);
    if (methods.includes('password')) {
       throw new Error("An account with this email and a password already exists.");
    }

    const credential = EmailAuthProvider.credential(user.email, password);
    await linkWithCredential(user, credential);
    await updateDoc(doc(db, "users", user.uid), { authProvider: 'google,password', hasPassword: true });
    const updatedUserDoc = await getDoc(doc(db, 'users', user.uid));
    if (updatedUserDoc.exists()) {
        setUserProfile(updatedUserDoc.data() as UserProfile);
    }
  };

  const logOut = async () => {
    setIsLoggingOut(true);
    console.log('🔒 User explicitly logging out...');
    
    try {
      // Mark explicit logout to prevent auto-restoration
      markExplicitLogout();
      
      // Sign out from Firebase Auth
      await signOut(auth);
      
      // Clear all local state
      setUser(null);
      setUserProfile(null);
      
      // Clear authentication cache (but preserve explicit logout flag)
      clearAuthCache();
      
      // Clear application-specific data
      if (typeof window !== 'undefined') {
        // Clear any application-specific local storage
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (
            key.includes('loanApplication') ||
            key.includes('groundUpConstruction') ||
            key.includes('document') ||
            key.includes('userData')
          )) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        console.log('🧹 Cleared application-specific storage');
      }
      
      // Redirect to sign-in page
      router.push('/auth/signin');
      console.log('✅ User successfully logged out and redirected');
      
    } catch (error) {
      console.error('❌ Error during logout:', error);
      // Even if logout fails, clear local state and redirect
      setUser(null);
      setUserProfile(null);
      router.push('/auth/signin');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const checkEmailExists = async (email: string) => {
    const methods = await fetchSignInMethodsForEmail(auth, email);
    return methods.length > 0;
  };

  const sendPasswordReset = (email: string) => sendPasswordResetEmail(auth, email);

  const canSignInWithPassword = async (email: string) => {
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      return methods.includes('password');
    } catch (error) {
      console.error("Error checking sign in methods:", error);
      return false;
    }
  };

  // Admin functions - Use API routes instead of direct Firestore calls to avoid CORS issues
  const getAllUsers = async (): Promise<UserProfile[]> => {
    if (!isAdmin) throw new Error("Unauthorized");
    
    try {
      const response = await fetch('/api/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching users via API:', error);
      throw error;
    }
  };

  const updateUserRole = async (uid: string, newRole: UserProfile['role']) => {
    if (!isAdmin) throw new Error("Unauthorized");
    
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateRole',
          uid,
          newRole
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating user role via API:', error);
      throw error;
    }
  };

  const updateUserStatus = async (uid: string, newStatus: UserProfile['status']) => {
    if (!isAdmin) throw new Error("Unauthorized");
    
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateStatus',
          uid,
          newStatus
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating user status via API:', error);
      throw error;
    }
  };

  // Debug function to help troubleshoot auth issues
  const debugAuthState = () => {
    console.log('🔍 === AUTH DEBUG INFO ===');
    console.log('Current user:', user ? {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      displayName: user.displayName,
      metadata: {
        creationTime: user.metadata.creationTime,
        lastSignInTime: user.metadata.lastSignInTime
      }
    } : 'No user');
    console.log('User profile:', userProfile);
    console.log('Loading state:', loading);
    console.log('Is admin:', isAdmin);
    console.log('Current path:', pathname);
    console.log('Firebase auth current user:', auth.currentUser);
    console.log('Explicit logout flag:', typeof window !== 'undefined' ? localStorage.getItem('userExplicitlyLoggedOut') : 'N/A');
    console.log('========================');
  };

  // Function to force logout and clear all data (for admin/debugging purposes)
  const forceLogout = async () => {
    console.log('🔒 Force logout initiated...');
    await logOut();
    
    // Use the comprehensive cache clearing function
    clearAllAuthCache();
  };

  // Function to clear authentication cache (for troubleshooting)
  const handleClearAuthCache = () => {
    console.log('🧹 Manual auth cache clear initiated...');
    clearAuthCache();
    console.log('✅ Auth cache cleared - you may need to sign in again');
  };

  // Function to clear all cache (nuclear option for troubleshooting)
  const handleClearAllCache = () => {
    console.log('🧹 Manual full cache clear initiated...');
    clearAllAuthCache();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      userProfile, 
      isAdmin, 
      isLoggingOut,
      signUp, 
      signIn, 
      signInWithGoogle,
      signUpWithGoogle,
      checkEmailExists, 
      sendPasswordReset, 
      logOut,
      forceLogout,
      clearAuthCache: handleClearAuthCache,
      clearAllAuthCache: handleClearAllCache,
      addPasswordToGoogleAccount,
      canSignInWithPassword,
      getAllUsers,
      updateUserRole,
      updateUserStatus,
      getRedirectPath,
      debugAuthState
    }}>
      {children}
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

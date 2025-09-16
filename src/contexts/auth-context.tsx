
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
import { authenticatedGet, authenticatedPost } from '@/lib/api-client';
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

  // Production-ready page exit detection with proper cleanup and error handling
  useEffect(() => {
    if (!user || typeof window === 'undefined') return;

    let isLoggingOut = false; // Prevent multiple simultaneous logouts
    let visibilityTimeout: NodeJS.Timeout | null = null;
    let isPageVisible = !document.hidden;

    const handlePageExit = () => {
      if (isLoggingOut) return; // Prevent multiple calls
      isLoggingOut = true;

      try {
        // Immediate state cleanup for responsive UI
        setUser(null);
        setUserProfile(null);
        markExplicitLogout();
        clearAuthCache();
        
        // Sign out from Firebase to clean up all listeners
        if (auth.currentUser) {
          signOut(auth).catch((error) => {
            console.error('Error signing out from Firebase during page exit:', error);
          });
        }
        
        // Log only in development
        if (process.env.NODE_ENV === 'development') {
          console.log('🚪 User exiting page - logged out');
        }
      } catch (error) {
        console.error('Error during page exit logout:', error);
      }
    };

    const handleVisibilityChange = () => {
      const currentlyVisible = !document.hidden;
      
      // Clear previous timeout
      if (visibilityTimeout) {
        clearTimeout(visibilityTimeout);
        visibilityTimeout = null;
      }

      // Only handle transition from visible to hidden
      // Add additional checks to prevent false triggers
      if (isPageVisible && !currentlyVisible) {
        // Only logout if page has been visible for at least 2 seconds
        // This prevents logout during rapid tab switching or page loads
        const timeVisible = Date.now() - (window as any).pageVisibleStartTime || 0;
        
        if (timeVisible > 2000) { // 2 seconds minimum
          // Debounce visibility change to prevent rapid firing
          visibilityTimeout = setTimeout(() => {
            if (!document.hidden) return; // Double-check page is still hidden
            
            if (process.env.NODE_ENV === 'development') {
              console.log('👁️ Page hidden - logging out');
            }
            handlePageExit();
          }, 500); // Increased debounce to 500ms
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.log('👁️ Page hidden too quickly, not logging out');
          }
        }
      }
      
      isPageVisible = currentlyVisible;
      
      // Track when page becomes visible
      if (currentlyVisible) {
        (window as any).pageVisibleStartTime = Date.now();
      }
    };

    const handlePageHide = () => {
      // pagehide is more reliable than beforeunload on mobile
      handlePageExit();
    };

    const handleBeforeUnload = () => {
      // beforeunload is unreliable on mobile, but good for desktop
      if (navigator.userAgent.includes('Mobile')) return;
      handlePageExit();
    };

    // Initialize page visible start time
    (window as any).pageVisibleStartTime = Date.now();
    
    // Add event listeners with passive option where possible
    const eventOptions = { passive: true, capture: false };
    
    window.addEventListener('beforeunload', handleBeforeUnload, eventOptions);
    document.addEventListener('visibilitychange', handleVisibilityChange, eventOptions);
    window.addEventListener('pagehide', handlePageHide, eventOptions);
    
    // Additional mobile-specific events
    if (navigator.userAgent.includes('Mobile')) {
      window.addEventListener('blur', handlePageExit, eventOptions);
    }

    return () => {
      // Cleanup function with proper error handling
      try {
        if (visibilityTimeout) {
          clearTimeout(visibilityTimeout);
        }
        
        window.removeEventListener('beforeunload', handleBeforeUnload);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('pagehide', handlePageHide);
        
        if (navigator.userAgent.includes('Mobile')) {
          window.removeEventListener('blur', handlePageExit);
        }
      } catch (error) {
        console.error('Error cleaning up page exit listeners:', error);
      }
    };
  }, [user]); // Only re-run when user changes

  // Handle logout when navigating to home page
  useEffect(() => {
    if (!user || typeof window === 'undefined') return;

    // Only trigger logout if user is fully authenticated and we're on home page
    // Add additional checks to prevent race conditions during auth flow
    if (user && userProfile && !loading && (pathname === '/' || pathname === '/home')) {
      // Check if this is a direct navigation to home page (not a redirect)
      // by checking if we came from an authenticated page
      const isDirectNavigation = !document.referrer || 
        document.referrer.includes(window.location.origin) ||
        pathname === '/';
      
      if (isDirectNavigation) {
        // Add a small delay to ensure auth state is stable
        const timeoutId = setTimeout(() => {
          // Double-check conditions haven't changed
          if (user && userProfile && !loading && (pathname === '/' || pathname === '/home')) {
            if (process.env.NODE_ENV === 'development') {
              console.log('🏠 On home page - logging out');
            }
            
            // Perform logout when on home page
            try {
              setUser(null);
              setUserProfile(null);
              markExplicitLogout();
              clearAuthCache();
              
              // Sign out from Firebase (async but don't block UI)
              if (auth.currentUser) {
                signOut(auth).catch((error) => {
                  console.error('Error signing out from Firebase:', error);
                });
              }
            } catch (error) {
              console.error('Error during home page logout:', error);
            }
          }
        }, 500); // Increased delay to prevent race conditions

        return () => clearTimeout(timeoutId);
      }
    }
  }, [pathname, user, userProfile, loading]); // Include loading state to prevent race conditions

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates after unmount
    let timeoutId: NodeJS.Timeout | null = null;
    
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (!isMounted) return; // Prevent state updates if component unmounted
      
      setLoading(true);
      console.log('🔄 Auth state changed:', userAuth ? `User: ${userAuth.email}` : 'No user');
      
      // Set a timeout to prevent infinite loading
      timeoutId = setTimeout(() => {
        if (isMounted) {
          console.warn('⚠️ Auth state change timeout - forcing loading to false');
          setLoading(false);
        }
      }, 10000); // 10 second timeout
      
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
                          // If this is the first attempt and profile doesn't exist, 
                          // it might be a new user - don't retry immediately
                          if (attempt === 1) {
                            console.log('🔄 First attempt - user profile may not exist yet, waiting before retry...');
                            await new Promise(resolve => setTimeout(resolve, 2000));
                          }
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
                      // Handle redirect inline to avoid dependency issues
                      const authPages = ['/auth/signin', '/auth/signup', '/auth/forgot-password', '/auth/reset-password'];
                      if (authPages.includes(pathname)) {
                        const path = getRedirectPath(profile);
                        console.log(`🔄 Redirecting to: ${path}`);
                        router.push(path);
                      }
                    } else {
                      // This case handles a user that exists in Firebase Auth but not in Firestore.
                      // It could happen if the Firestore document creation failed during signup.
                      console.error('❌ User exists in Firebase Auth but not in Firestore');
                      setUserProfile(null);
                      
                      // Only redirect to signin if we're not already on an auth page
                      const authPages = ['/auth/signin', '/auth/signup', '/auth/forgot-password', '/auth/reset-password'];
                      if (!authPages.includes(pathname)) {
                        router.push('/auth/signin');
                      }
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
          // Clear timeout since we're done processing
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false; // Mark as unmounted
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      unsubscribe(); // Clean up listener
    };
  }, [pathname, router, getRedirectPath]); // Include dependencies for redirect logic

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

  // Production-ready logout function with comprehensive error handling
  const logOut = async () => {
    setIsLoggingOut(true);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🔒 User explicitly logging out...');
    }
    
    try {
      // Mark explicit logout to prevent auto-restoration
      markExplicitLogout();
      
      // Clear local state immediately for responsive UI
      setUser(null);
      setUserProfile(null);
      
      // Sign out from Firebase Auth (async but don't block UI)
      if (auth.currentUser) {
        signOut(auth).catch((error) => {
          console.error('Error signing out from Firebase:', error);
        });
      }
      
      // Clear authentication cache
      clearAuthCache();
      
      // Clear application-specific data
      if (typeof window !== 'undefined') {
        try {
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
          
          if (process.env.NODE_ENV === 'development') {
            console.log('🧹 Cleared application-specific storage');
          }
        } catch (storageError) {
          console.error('Error clearing application storage:', storageError);
        }
      }
      
      // Redirect to sign-in page
      router.push('/auth/signin');
      
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ User successfully logged out and redirected');
      }
      
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
      const response = await authenticatedGet('/api/users');
      
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
      const response = await authenticatedPost('/api/users', {
        action: 'updateRole',
        uid,
        newRole
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
      const response = await authenticatedPost('/api/users', {
        action: 'updateStatus',
        uid,
        newStatus
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


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
import { createAuthRetryWrapper, getAuthError } from '@/lib/auth-utils';
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

// Global flag to prevent multiple auth listeners
let authListenerSet = false;
let authUnsubscribe: (() => void) | null = null;

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

  // DISABLED: Page exit detection that was causing logout on refresh
  // Users should stay logged in on browser refresh
  // Only logout on explicit navigation to home page (handled below)
  /*
  useEffect(() => {
    if (!user || typeof window === 'undefined') return;

    let isLoggingOut = false; // Prevent multiple simultaneous logouts
    let visibilityTimeout: NodeJS.Timeout | null = null;
    let isPageVisible = !document.hidden;
    let isRefreshing = false; // Track if this is a refresh

    const handlePageExit = () => {
      if (isLoggingOut) return; // Prevent multiple calls
      
      // Don't logout on browser refresh - only on actual page exits
      if (isRefreshing) {
        if (process.env.NODE_ENV === 'development') {
          console.log('🔄 Browser refresh detected - keeping user logged in');
        }
        return;
      }
      
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
      // DISABLED: Don't logout on tab switching - only on actual page exit
      if (isPageVisible && !currentlyVisible) {
        if (process.env.NODE_ENV === 'development') {
          console.log('👁️ Page hidden - but NOT logging out (tab switching allowed)');
        }
        // Don't logout on visibility change - only on actual page exit events
      }
      
      isPageVisible = currentlyVisible;
      
      // Track when page becomes visible
      if (currentlyVisible) {
        (window as any).pageVisibleStartTime = Date.now();
      }
    };

    const handlePageHide = () => {
      // pagehide is more reliable than beforeunload on mobile
      // Check if this is a refresh by looking at performance navigation type
      const navigationType = performance.navigation?.type || (performance as any).getEntriesByType?.('navigation')?.[0]?.type;
      if (navigationType === 1) { // TYPE_RELOAD
        isRefreshing = true;
        if (process.env.NODE_ENV === 'development') {
          console.log('🔄 Page hide detected as refresh - keeping user logged in');
        }
        return;
      }
      handlePageExit();
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // beforeunload is unreliable on mobile, but good for desktop
      if (navigator.userAgent.includes('Mobile')) return;
      
      // Check if this is a refresh by looking at the event
      // If the user is pressing F5 or Ctrl+R, it's a refresh
      if (event.type === 'beforeunload') {
        // Check if this might be a refresh (not a navigation away)
        const isRefresh = performance.navigation?.type === 1 || 
                         (performance as any).getEntriesByType?.('navigation')?.[0]?.type === 1;
        if (isRefresh) {
          isRefreshing = true;
          if (process.env.NODE_ENV === 'development') {
            console.log('🔄 Before unload detected as refresh - keeping user logged in');
          }
          return;
        }
      }
      handlePageExit();
    };

    // Initialize page visible start time
    (window as any).pageVisibleStartTime = Date.now();
    
    // Add refresh detection using multiple methods
    const detectRefresh = () => {
      // Method 1: Check performance navigation type
      const navigationType = performance.navigation?.type || (performance as any).getEntriesByType?.('navigation')?.[0]?.type;
      if (navigationType === 1) { // TYPE_RELOAD
        return true;
      }
      
      // Method 2: Check if page is being refreshed (not navigated away)
      const isRefresh = window.performance && 
                       window.performance.getEntriesByType && 
                       window.performance.getEntriesByType('navigation').length > 0 &&
                       (window.performance.getEntriesByType('navigation')[0] as any).type === 'reload';
      
      return isRefresh;
    };
    
    // Set refresh flag if this is a refresh
    if (detectRefresh()) {
      isRefreshing = true;
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Page load detected as refresh - keeping user logged in');
      }
    }
    
    // Add event listeners with passive option where possible
    const eventOptions = { passive: true, capture: false };
    
    window.addEventListener('beforeunload', handleBeforeUnload, eventOptions);
    document.addEventListener('visibilitychange', handleVisibilityChange, eventOptions);
    window.addEventListener('pagehide', handlePageHide, eventOptions);
    
    // Mobile blur event removed - too aggressive for tab switching
    // Only use pagehide and beforeunload for actual page exits

    return () => {
      // Cleanup function with proper error handling
      try {
        if (visibilityTimeout) {
          clearTimeout(visibilityTimeout);
        }
        
        window.removeEventListener('beforeunload', handleBeforeUnload);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('pagehide', handlePageHide);
      } catch (error) {
        console.error('Error cleaning up page exit listeners:', error);
      }
    };
  }, [user]); // Only re-run when user changes
  */

  // Handle logout when navigating to home page - DISABLED for better UX
  // This was causing users to be logged out unexpectedly when visiting the home page
  // Commenting out this logic to prevent unexpected logouts
  /*
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
  */

  useEffect(() => {
    // Clean up existing listener if any
    if (authUnsubscribe) {
      console.log('🧹 Cleaning up existing auth listener...');
      authUnsubscribe();
      authUnsubscribe = null;
    }
    
    // Prevent multiple auth listeners
    if (authListenerSet) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Auth listener already set, skipping...');
      }
      return;
    }
    
    authListenerSet = true;
    if (process.env.NODE_ENV === 'development') {
      console.log('Setting up auth state listener...');
    }
    
    let isMounted = true; // Flag to prevent state updates after unmount
    let timeoutId: NodeJS.Timeout | null = null;
    
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (!isMounted) return; // Prevent state updates if component unmounted
      
      setLoading(true);
      if (process.env.NODE_ENV === 'development') {
        console.log('Auth state changed:', userAuth?.email || 'No user');
      }
      
      // Set a timeout to prevent infinite loading
      timeoutId = setTimeout(() => {
        if (isMounted) {
          console.warn('Auth state change timeout - forcing loading to false');
          setLoading(false);
        }
      }, 10000); // 10 second timeout
      
      try {
        if (userAuth) {
          if (process.env.NODE_ENV === 'development') {
            console.log('User authenticated, fetching profile...');
          }
          
          try {
            const userDocRef = doc(db, 'users', userAuth.uid);
            const userDoc = await getDoc(userDocRef);
            
            if (!isMounted) return; // Check if still mounted
            
            setUser(userAuth);
            
            if (userDoc.exists()) {
              const profile = { uid: userDoc.id, ...userDoc.data() } as UserProfile;
              setUserProfile(profile);
              
              if (process.env.NODE_ENV === 'development') {
                console.log(`Profile loaded: ${profile.email}`);
              }
              
              // Handle redirect inline to avoid dependency issues
              const authPages = ['/auth/signin', '/auth/signup', '/auth/forgot-password', '/auth/reset-password'];
              if (authPages.includes(pathname)) {
                const path = getRedirectPath(profile);
                if (process.env.NODE_ENV === 'development') {
                  console.log(`Redirecting to: ${path}`);
                }
                router.push(path);
              }
            } else {
              // User exists in Firebase Auth but not in Firestore
              console.error('User exists in Firebase Auth but not in Firestore');
              setUserProfile(null);
              
              // Only redirect to signin if we're not already on an auth page
              const authPages = ['/auth/signin', '/auth/signup', '/auth/forgot-password', '/auth/reset-password'];
              if (!authPages.includes(pathname)) {
                router.push('/auth/signin');
              }
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
            setUser(userAuth);
            setUserProfile(null);
          }
        } else {
          if (!isMounted) return; // Check if still mounted
          if (process.env.NODE_ENV === 'development') {
            console.log('No user authenticated');
          }
          setUser(null);
          setUserProfile(null);
        }
      } catch (error) {
        console.error('Error in auth state change handler:', error);
        if (isMounted) {
          setUser(null);
          setUserProfile(null);
        }
      } finally {
        if (isMounted) {
          // Clear timeout since we're done processing
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }
          setLoading(false);
        }
      }
    });

    // Store unsubscribe function globally for cleanup
    authUnsubscribe = unsubscribe;
    
    return () => {
      isMounted = false; // Mark as unmounted
      authListenerSet = false; // Reset flag for cleanup
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      unsubscribe(); // Clean up listener
      authUnsubscribe = null; // Clear global reference
      if (process.env.NODE_ENV === 'development') {
        console.log('Auth listener cleaned up');
      }
    };
  }, []); // Only run once on mount - don't recreate listener on pathname changes

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
  
  const signIn = createAuthRetryWrapper(async (email: string, pass: string) => {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    // Clear explicit logout flag since user is signing in
    clearExplicitLogout();
    return result;
  }, 3);
  
  const signUpWithGoogle = async (role: string = 'borrower') => {
    const maxRetries = 3;
    let lastError: any;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Google sign in attempt ${attempt}/${maxRetries}`);
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`Google sign in: ${user.email}`);
        }
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
            if (process.env.NODE_ENV === 'development') {
              console.log(`New profile created: ${user.email}`);
            }
        } else {
            const profile = userDoc.data() as UserProfile;
            setUserProfile(profile);
            if (process.env.NODE_ENV === 'development') {
              console.log(`Profile loaded: ${user.email}`);
            }
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

  const signInWithGoogle = createAuthRetryWrapper(async () => {
    console.log(`🔄 Google sign in attempt`);
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`Google sign in: ${user.email}`);
    }
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
      if (process.env.NODE_ENV === 'development') {
        console.log(`Profile loaded: ${user.email}`);
      }
    }
    
    return result;
  }, 3);

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
        console.log('User logged out');
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
    console.log('Auth Debug:', {
      user: user?.email || 'No user',
      profile: userProfile?.role || 'No profile',
      loading,
      path: pathname
    });
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
    clearAuthCache();
    if (process.env.NODE_ENV === 'development') {
      console.log('Auth cache cleared');
    }
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

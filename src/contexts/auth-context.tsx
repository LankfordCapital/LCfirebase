
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
import { auth, db, googleProvider } from '@/lib/firebase-client';
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
  addPasswordToGoogleAccount: (password: string) => Promise<void>;
  canSignInWithPassword: (email: string) => Promise<boolean>;
  getAllUsers: () => Promise<UserProfile[]>;
  updateUserRole: (uid: string, newRole: UserProfile['role']) => Promise<void>;
  updateUserStatus: (uid: string, newStatus: UserProfile['status']) => Promise<void>;
  getRedirectPath: (profile?: UserProfile | null) => string;
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
  
  const getRedirectPath = useCallback((profile: UserProfile | null) => {
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
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      setLoading(true); // Ensure loading is true until profile is fetched
      if (userAuth) {
        const userDocRef = doc(db, 'users', userAuth.uid);
        const userDoc = await getDoc(userDocRef);
        
        setUser(userAuth);

        if (userDoc.exists()) {
          const profile = { uid: userDoc.id, ...userDoc.data() } as UserProfile;
          setUserProfile(profile);
          handleAuthRedirect(profile);
        } else {
            // This case handles a user that exists in Firebase Auth but not in Firestore.
            // It could happen if the Firestore document creation failed during signup.
            // We set profile to null and stop loading. The ProtectedRoute will handle the redirect.
            setUserProfile(null);
            router.push('/auth/signin');
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false); // Set loading to false only after all checks are done
    });

    return () => unsubscribe();
  }, [handleAuthRedirect, router]);

  const signUp = async (email: string, pass: string, fullName: string, role: string) => {
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
    await setDoc(doc(db, "users", userCredential.user.uid), newProfile);
    
    setUserProfile(newProfile);
    return userCredential;
  };
  
  const signIn = async (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  };
  
  const signUpWithGoogle = async (role: string = 'borrower') => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
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
    } else {
        const profile = userDoc.data() as UserProfile;
        setUserProfile(profile);
    }
    return result;
  };

  const signInWithGoogle = signUpWithGoogle;

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
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
    router.push('/auth/signin');
    setIsLoggingOut(false);
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
      addPasswordToGoogleAccount,
      canSignInWithPassword,
      getAllUsers,
      updateUserRole,
      updateUserStatus,
      getRedirectPath
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

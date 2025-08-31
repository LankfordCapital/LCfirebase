
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
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  isLoggingOut: boolean;
  signUp: (email: string, pass: string, fullName: string, role: string) => Promise<UserCredential>;
  signIn: (email: string, pass: string) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<UserCredential>;
  signUpWithGoogle: (role: string) => Promise<{ credential: UserCredential; generatedPassword: string }>;
  checkEmailExists: (email: string) => Promise<boolean>;
  sendPasswordReset: (email: string) => Promise<void>;
  logOut: () => Promise<void>;
  addPasswordToGoogleAccount: (password: string) => Promise<void>;
  canSignInWithPassword: (email: string) => Promise<boolean>;
  getAllUsers: () => Promise<UserProfile[]>;
  updateUserRole: (uid: string, newRole: UserProfile['role']) => Promise<void>;
  updateUserStatus: (uid: string, newStatus: UserProfile['status']) => Promise<void>;
  getRedirectPath: () => string;
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
  
  const getRedirectPath = useCallback(() => {
    if (!userProfile) return '/auth/signin';
    switch (userProfile.role) {
      case 'admin':
      case 'workforce':
        return '/workforce-office';
      case 'broker':
        return '/broker-office';
      case 'borrower':
      default:
        return '/dashboard';
    }
  }, [userProfile]);


  const handleAuthRedirect = useCallback((profile: UserProfile) => {
    const authPages = ['/auth/signin', '/auth/signup', '/auth/forgot-password', '/auth/reset-password'];
    if (authPages.includes(pathname)) {
        const path = getRedirectPath();
        router.push(path);
    }
  }, [pathname, router, getRedirectPath]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        setUser(userAuth);
        try {
          const userDocRef = doc(db, 'users', userAuth.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const profile = userDoc.data() as UserProfile;
            setUserProfile(profile);
            handleAuthRedirect(profile);
          } else {
            // This case handles users who might exist in Firebase Auth but not in Firestore.
            // A default profile is created.
            console.warn(`No Firestore document for user ${userAuth.uid}, creating one.`);
            const newProfile: UserProfile = {
              uid: userAuth.uid,
              email: userAuth.email || '',
              fullName: userAuth.displayName || 'New User',
              role: 'borrower',
              status: 'pending',
              createdAt: serverTimestamp(),
              authProvider: userAuth.providerData[0]?.providerId || 'password',
            };
            await setDoc(userDocRef, newProfile);
            setUserProfile(newProfile);
            handleAuthRedirect(newProfile);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUserProfile(null);
        } finally {
            setLoading(false);
        }
      } else {
        setUser(null);
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [handleAuthRedirect]);

  const signUp = async (email: string, pass: string, fullName: string, role: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(userCredential.user, { displayName: fullName });
    
    const newProfile: UserProfile = {
      uid: userCredential.user.uid,
      email: userCredential.user.email!,
      fullName: fullName,
      role: role as UserProfile['role'],
      status: role === 'workforce' || role === 'admin' ? 'approved' : 'pending',
      createdAt: serverTimestamp(),
      authProvider: 'password',
    };
    await setDoc(doc(db, "users", userCredential.user.uid), newProfile);
    
    setUserProfile(newProfile);
    handleAuthRedirect(newProfile);
    
    return userCredential;
  };
  
  const signIn = async (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  };
  
  const signInWithGoogle = async () => {
    return signInWithPopup(auth, googleProvider);
  };

  const signUpWithGoogle = async (role: string) => {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      let generatedPassword = '';

      if (!userDoc.exists()) {
        generatedPassword = Math.random().toString(36).slice(-10);
        try {
            if(user.email) {
                await linkWithCredential(user, EmailAuthProvider.credential(user.email, generatedPassword));
            }
        } catch (error: any) {
            if (error.code !== 'auth/credential-already-in-use') throw error;
        }

        const newProfile = {
          uid: user.uid,
          email: user.email!,
          fullName: user.displayName || 'New User',
          role: role as UserProfile['role'],
          status: 'pending' as UserProfile['status'],
          createdAt: serverTimestamp(),
          authProvider: 'google',
        };
        await setDoc(userDocRef, newProfile);
        setUserProfile(newProfile);
        handleAuthRedirect(newProfile);
      } else {
        const profile = userDoc.data() as UserProfile;
        setUserProfile(profile);
        handleAuthRedirect(profile);
      }
      
      return { credential: result, generatedPassword };
  };

  const addPasswordToGoogleAccount = async (password: string) => {
    if (!user || !user.email || user.providerData.some(p => p.providerId === 'password')) {
        throw new Error("User not eligible or already has a password.");
    }
    const credential = EmailAuthProvider.credential(user.email!, password);
    await linkWithCredential(user, credential);
    await updateDoc(doc(db, "users", user.uid), { authProvider: 'google,password' });
  };

  const logOut = async () => {
    setIsLoggingOut(true);
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
    window.location.href = '/';
  };

  const checkEmailExists = async (email: string) => {
    const methods = await fetchSignInMethodsForEmail(auth, email);
    return methods.length > 0;
  };

  const sendPasswordReset = (email: string) => sendPasswordResetEmail(auth, email);

  const canSignInWithPassword = async (email: string) => {
    const methods = await fetchSignInMethodsForEmail(auth, email);
    return methods.includes('password');
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

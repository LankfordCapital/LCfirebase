
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
  signInWithGoogle: () => Promise<UserCredential>;
  signUpWithGoogle: (role: string) => Promise<UserCredential>;
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
    const authPages = ['/auth/signin', '/auth/signup', '/auth/forgot-password', '/auth/reset-password', '/auth/workforce-signin'];
    if (authPages.includes(pathname)) {
        const path = getRedirectPath();
        router.push(path);
    }
  }, [pathname, router, getRedirectPath]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      setLoading(true);
      if (userAuth) {
        setUser(userAuth);
        try {
          const userDocRef = doc(db, 'users', userAuth.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const profile = { uid: userDoc.id, ...userDoc.data() } as UserProfile;
            setUserProfile(profile);
            handleAuthRedirect(profile);
          } else {
            // This case should ideally not happen if signUp is always used
            // But as a fallback, we create a basic profile.
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
      hasPassword: true,
    };
    await setDoc(doc(db, "users", userCredential.user.uid), newProfile);
    
    setUserProfile(newProfile);
    return userCredential;
  };
  
  const signIn = async (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  };
  
  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
        // This is a first-time Google sign-in for this user. We need to know their role.
        // For now, we'll default them to 'borrower'. In a real app, you might redirect
        // them to a role selection page.
        const newProfile = {
          uid: user.uid,
          email: user.email!,
          fullName: user.displayName || 'New User',
          role: 'borrower' as UserProfile['role'],
          status: 'pending' as UserProfile['status'],
          createdAt: serverTimestamp(),
          authProvider: 'google',
          hasPassword: false,
        };
        await setDoc(userDocRef, newProfile);
        setUserProfile(newProfile);
    }
    return result;
  };

  const signUpWithGoogle = async (role: string): Promise<UserCredential> => {
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
          status: role === 'workforce' || role === 'admin' ? 'approved' : 'pending',
          createdAt: serverTimestamp(),
          authProvider: 'google',
          hasPassword: false,
        };
        await setDoc(userDocRef, newProfile);
        setUserProfile(newProfile);
      } else {
         const existingProfile = userDoc.data() as UserProfile;
         setUserProfile(existingProfile);
      }
      
      return result;
  };

  const addPasswordToGoogleAccount = async (password: string) => {
    if (!user || !user.email) {
        throw new Error("User not eligible or email not available.");
    }
    // Check if a password provider is already linked
    const methods = await fetchSignInMethodsForEmail(auth, user.email);
    if (methods.includes('password')) {
       throw new Error("An account with this email and a password already exists.");
    }

    const credential = EmailAuthProvider.credential(user.email, password);
    await linkWithCredential(user, credential);
    await updateDoc(doc(db, "users", user.uid), { authProvider: 'google,password', hasPassword: true });
    // Refetch profile to update UI
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
    router.push('/');
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

  // Admin functions
  const getAllUsers = async (): Promise<UserProfile[]> => {
    if (!isAdmin) throw new Error("Unauthorized");
    const querySnapshot = await getDocs(collection(db, "users"));
    return querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile));
  };

  const updateUserRole = async (uid: string, newRole: UserProfile['role']) => {
    if (!isAdmin) throw new Error("Unauthorized");
    await updateDoc(doc(db, "users", uid), { role: newRole });
  };

  const updateUserStatus = async (uid: string, newStatus: UserProfile['status']) => {
    if (!isAdmin) throw new Error("Unauthorized");
    await updateDoc(doc(db, "users", uid), { status: newStatus });
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

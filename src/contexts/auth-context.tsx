
'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useRef,
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
import { doc, setDoc, serverTimestamp, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

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
  
  // Ref to prevent multiple sign-in attempts
  const signInAttemptedRef = useRef(false);

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

  const handleUserAuth = useCallback(async (userAuth: User | null, forceRedirect = false) => {
    if (userAuth) {
      setUser(userAuth);
      try {
        const userDocRef = doc(db, 'users', userAuth.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const profile = userDoc.data() as UserProfile;
          setUserProfile(profile);
        } else {
          // If user exists in Auth but not Firestore, create a profile
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
        }

        // Redirect after sign-in if on an auth page
        if (forceRedirect) {
          const path = getRedirectPath();
          router.push(path);
        }
      } catch (error) {
        console.error("Error fetching/creating user profile:", error);
        setUserProfile(null);
      }
    } else {
      setUser(null);
      setUserProfile(null);
    }
    setLoading(false);
  }, [router, getRedirectPath]);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      handleUserAuth(user);
    });
    return () => unsubscribe();
  }, [handleUserAuth]);

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
    
    // Manually update state and redirect
    await handleUserAuth(userCredential.user, true);

    return userCredential;
  };
  
  const signIn = async (email: string, pass: string) => {
    if(signInAttemptedRef.current) return auth.currentUser ? { user: auth.currentUser } as UserCredential : Promise.reject("Sign in already in progress");
    signInAttemptedRef.current = true;
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      await handleUserAuth(userCredential.user, true);
      return userCredential;
    } finally {
      signInAttemptedRef.current = false;
    }
  };
  
  const signInWithGoogle = async () => {
    if(signInAttemptedRef.current) return Promise.reject("Sign in already in progress");
    signInAttemptedRef.current = true;
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await handleUserAuth(result.user, true);
      return result;
    } finally {
      signInAttemptedRef.current = false;
    }
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
            await linkWithCredential(user, EmailAuthProvider.credential(user.email!, generatedPassword));
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
      } else {
        setUserProfile(userDoc.data() as UserProfile);
      }
      
      await handleUserAuth(user, true);
      
      return { credential: result, generatedPassword };
  };

  const addPasswordToGoogleAccount = async (password: string) => {
    if (!user || user.providerData.some(p => p.providerId === 'password')) {
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
    // Use a hard redirect to clear state and prevent component flashes
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

    
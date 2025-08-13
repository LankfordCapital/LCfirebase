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
  UserCredential,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth, db, googleProvider } from '@/lib/firebase-client';
import { CustomLoader } from '@/components/ui/custom-loader';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, pass: string, fullName: string, role: string) => Promise<UserCredential>;
  signIn: (email: string, pass: string) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<UserCredential>;
  signUpWithGoogle: (role: string) => Promise<UserCredential>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signUp = useCallback(async (email: string, pass: string, fullName: string, role: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(userCredential.user, { displayName: fullName });
    
    await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        fullName: fullName,
        role: role,
        status: role === 'workforce' || role === 'admin' ? 'approved' : 'pending',
        createdAt: serverTimestamp(),
      });
      
    // Manually set the user in the context after sign-up and profile update
    setUser(userCredential.user);
    
    return userCredential;
  }, []);

  const signIn = useCallback(async (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user already exists in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (!userDoc.exists()) {
        // Create new user document for first-time Google sign-in
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          fullName: user.displayName || 'Unknown',
          role: 'borrower', // Default role for Google sign-ins
          status: 'pending',
          createdAt: serverTimestamp(),
          authProvider: 'google',
        });
      }
      
      return result;
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  }, []);

  const signUpWithGoogle = useCallback(async (role: string) => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Always create/update user document for Google sign-up
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        fullName: user.displayName || 'Unknown',
        role: role,
        status: role === 'workforce' || role === 'admin' ? 'approved' : 'pending',
        createdAt: serverTimestamp(),
        authProvider: 'google',
      });
      
      return result;
    } catch (error) {
      console.error('Google sign-up error:', error);
      throw error;
    }
  }, []);

  const logOut = useCallback(async () => {
    return signOut(auth);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signInWithGoogle, signUpWithGoogle, logOut }}>
      {loading ? (
         <div className="flex min-h-screen items-center justify-center">
            <CustomLoader className="h-10 w-10" />
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

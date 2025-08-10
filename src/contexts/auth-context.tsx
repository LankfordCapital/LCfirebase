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
  signOut,
  UserCredential,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '@/lib/firebase-client';
import { CustomLoader } from '@/components/ui/custom-loader';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase-client';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, pass: string, fullName: string, role: string) => Promise<UserCredential>;
  signIn: (email: string, pass: string) => Promise<UserCredential>;
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
    await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        fullName: fullName,
        role: role,
        status: 'approved',
        createdAt: new Date(),
      });
    return userCredential;
  }, []);

  const signIn = useCallback(async (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  }, []);

  const logOut = useCallback(async () => {
    return signOut(auth);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, logOut }}>
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

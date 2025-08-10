
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
  type Auth,
  UserCredential,
  onAuthStateChanged,
} from 'firebase/auth';
import { getClientAuth } from '@/lib/firebase';
import { CustomLoader } from '@/components/ui/custom-loader';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, pass: string) => Promise<UserCredential>;
  signIn: (email: string, pass: string) => Promise<UserCredential>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<Auth | null>(null);

  useEffect(() => {
    getClientAuth().then(authInstance => {
      setAuth(authInstance);
      const unsubscribe = onAuthStateChanged(authInstance, (user) => {
        setUser(user);
        setLoading(false);
      });
      return () => unsubscribe();
    }).catch(error => {
        console.error("Failed to initialize Firebase Auth", error);
        setLoading(false);
    });
  }, []);

  const signUp = useCallback(async (email: string, pass: string) => {
    if (!auth) throw new Error("Auth service is not available.");
    return createUserWithEmailAndPassword(auth, email, pass);
  }, [auth]);

  const signIn = useCallback(async (email: string, pass: string) => {
    if (!auth) throw new Error("Auth service is not available.");
    return signInWithEmailAndPassword(auth, email, pass);
  }, [auth]);

  const logOut = useCallback(async () => {
    if (!auth) throw new Error("Auth service is not available.");
    return signOut(auth);
  }, [auth]);

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

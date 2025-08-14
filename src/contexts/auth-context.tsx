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
} from 'firebase/auth';
import { auth, db, googleProvider } from '@/lib/firebase-client';
import { CustomLoader } from '@/components/ui/custom-loader';
import { doc, setDoc, serverTimestamp, getDoc, collection, getDocs, updateDoc, query, orderBy } from 'firebase/firestore';

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
  signUp: (email: string, pass: string, fullName: string, role: string) => Promise<UserCredential>;
  signIn: (email: string, pass: string) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<UserCredential>;
  signUpWithGoogle: (role: string) => Promise<UserCredential>;
  checkEmailExists: (email: string) => Promise<boolean>;
  sendPasswordReset: (email: string) => Promise<void>;
  logOut: () => Promise<void>;
  // Admin functions
  getAllUsers: () => Promise<UserProfile[]>;
  updateUserRole: (uid: string, newRole: UserProfile['role']) => Promise<void>;
  updateUserStatus: (uid: string, newStatus: UserProfile['status']) => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Check if current user is admin
  const isAdmin = userProfile?.role === 'admin' || 
                  user?.uid === 'UCqwzQPlG4Xcb3BzcxGQ8JvjDba2' || 
                  user?.uid === 'LQYGVdjvcAOB58nnK4lzP3sgW6B2';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed - User:', user?.uid);
      setUser(user);
      if (user) {
        try {
          console.log('Fetching user profile for:', user.uid);
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserProfile;
            console.log('User profile data:', userData);
            const isAdminUser = user.uid === 'UCqwzQPlG4Xcb3BzcxGQ8JvjDba2' || user.uid === 'LQYGVdjvcAOB58nnK4lzP3sgW6B2';
            console.log('Is admin user:', isAdminUser);
            
            if (isAdminUser && userData.role !== 'admin') {
              // Update the user's role to admin if they're one of the hardcoded admin UIDs
              const updatedUserData = {
                ...userData,
                role: 'admin' as const,
                status: 'approved' as const,
              };
              console.log('Updating admin user role');
              await updateDoc(doc(db, "users", user.uid), {
                role: 'admin',
                status: 'approved',
              });
              setUserProfile(updatedUserData);
            } else {
              setUserProfile(userData);
            }
          } else {
            console.log('User document does not exist');
            setUserProfile(null);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUserProfile(null);
        }
      } else {
        console.log('No user, setting profile to null');
        setUserProfile(null);
      }
      console.log('Setting loading to false');
      setLoading(false);
    });

    // Add a timeout to ensure loading doesn't get stuck
    const timeout = setTimeout(() => {
      console.log('Auth loading timeout - forcing loading to false');
      setLoading(false);
    }, 10000); // 10 second timeout

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const signUp = useCallback(async (email: string, pass: string, fullName: string, role: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(userCredential.user, { displayName: fullName });
    
    const userData = {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      fullName: fullName,
      role: role,
      status: role === 'workforce' || role === 'admin' ? 'approved' : 'pending',
      createdAt: serverTimestamp(),
    };
    
    await setDoc(doc(db, "users", userCredential.user.uid), userData);
    
    // Update local state
    setUserProfile(userData as UserProfile);
    
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
        const userData = {
          uid: user.uid,
          email: user.email,
          fullName: user.displayName || 'Unknown',
          role: 'borrower', // Default role for Google sign-ins
          status: 'pending',
          createdAt: serverTimestamp(),
          authProvider: 'google',
        };
        await setDoc(doc(db, "users", user.uid), userData);
        setUserProfile(userData as UserProfile);
      } else {
        // Check if this is an admin user and ensure their role is set correctly
        const userData = userDoc.data() as UserProfile;
        const isAdminUser = user.uid === 'UCqwzQPlG4Xcb3BzcxGQ8JvjDba2' || user.uid === 'LQYGVdjvcAOB58nnK4lzP3sgW6B2';
        
        if (isAdminUser && userData.role !== 'admin') {
          // Update the user's role to admin if they're one of the hardcoded admin UIDs
          const updatedUserData = {
            ...userData,
            role: 'admin' as const,
            status: 'approved' as const,
          };
          await updateDoc(doc(db, "users", user.uid), {
            role: 'admin',
            status: 'approved',
          });
          setUserProfile(updatedUserData);
        } else {
          setUserProfile(userData);
        }
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
      const userData = {
        uid: user.uid,
        email: user.email,
        fullName: user.displayName || 'Unknown',
        role: role,
        status: role === 'workforce' || role === 'admin' ? 'approved' : 'pending',
        createdAt: serverTimestamp(),
        authProvider: 'google',
      };
      
      await setDoc(doc(db, "users", user.uid), userData);
      setUserProfile(userData as UserProfile);
      
      return result;
    } catch (error) {
      console.error('Google sign-up error:', error);
      throw error;
    }
  }, []);

  const checkEmailExists = useCallback(async (email: string) => {
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      return methods.length > 0;
    } catch (error) {
      console.error('Email check error:', error);
      // If there's an error checking, we'll assume the email doesn't exist for security
      return false;
    }
  }, []);

  const sendPasswordReset = useCallback(async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }, []);

  const logOut = useCallback(async () => {
    setUserProfile(null);
    return signOut(auth);
  }, []);

  // Admin functions
  const getAllUsers = useCallback(async (): Promise<UserProfile[]> => {
    if (!isAdmin) {
      throw new Error('Unauthorized: Admin access required');
    }
    
    try {
      const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() })) as UserProfile[];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }, [isAdmin]);

  const updateUserRole = useCallback(async (uid: string, newRole: UserProfile['role']) => {
    if (!isAdmin) {
      throw new Error('Unauthorized: Admin access required');
    }
    
    try {
      const userDoc = doc(db, "users", uid);
      await updateDoc(userDoc, { role: newRole });
      
      // Update local state if it's the current user
      if (userProfile?.uid === uid) {
        setUserProfile(prev => prev ? { ...prev, role: newRole } : null);
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }, [isAdmin, userProfile]);

  const updateUserStatus = useCallback(async (uid: string, newStatus: UserProfile['status']) => {
    if (!isAdmin) {
      throw new Error('Unauthorized: Admin access required');
    }
    
    try {
      const userDoc = doc(db, "users", uid);
      await updateDoc(userDoc, { status: newStatus });
      
      // Update local state if it's the current user
      if (userProfile?.uid === uid) {
        setUserProfile(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }, [isAdmin, userProfile]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      userProfile,
      signUp, 
      signIn, 
      signInWithGoogle, 
      signUpWithGoogle, 
      checkEmailExists, 
      sendPasswordReset, 
      logOut,
      getAllUsers,
      updateUserRole,
      updateUserStatus,
      isAdmin
    }}>
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

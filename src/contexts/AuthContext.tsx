import { createContext, useContext, useState, useEffect } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import LoadingScreen from '../components/LoadingScreen';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Check if user is an admin
  const checkAdminStatus = async (user: User) => {
    try {
      const userRef = doc(db, 'admins', user.uid);
      const userDoc = await getDoc(userRef);
      return userDoc.exists();
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Set up authentication state observer
    const unsubscribe = onAuthStateChanged(auth, 
      async (user) => {
        setUser(user);
        if (user) {
          const adminStatus = await checkAdminStatus(user);
          setIsAdmin(adminStatus);
        } else {
          setIsAdmin(false);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Auth state change error:', error);
        setError(error.message);
        setLoading(false);
      }
    );

    // Cleanup subscription
    return () => unsubscribe();
  }, [isClient]);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const adminStatus = await checkAdminStatus(userCredential.user);
      
      if (!adminStatus) {
        await firebaseSignOut(auth);
        throw new Error('You do not have admin privileges');
      }
      
      setIsAdmin(true);
    } catch (error) {
      console.error('Sign in error:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred during sign in');
      }
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if this is a new user
      const details = getAdditionalUserInfo(result);
      
      if (details?.isNewUser) {
        // Create a new user document in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: new Date(),
        });
      }
      
      // Check if user is an admin
      const adminStatus = await checkAdminStatus(user);
      setIsAdmin(adminStatus);
    } catch (error) {
      console.error('Google sign in error:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred during Google sign in');
      }
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await firebaseSignOut(auth);
      setIsAdmin(false);
    } catch (error) {
      console.error('Sign out error:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred during sign out');
      }
      throw error;
    }
  };

  const value = {
    user,
    loading,
    error,
    isAdmin,
    signInWithEmail,
    signInWithGoogle,
    signOut
  };

  // Don't show loading screen during SSR, only on client side
  if (loading && isClient) {
    return <LoadingScreen />;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

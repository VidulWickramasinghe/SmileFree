import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as AuthUser, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../lib/firebase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      // Real Firebase Auth
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          setUser({
            id: firebaseUser.uid,
            name: 'Dr. Chandima Weerasekera',
            role: 'doctor',
            email: firebaseUser.email || ''
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Mock Auth for Demo
      const stored = localStorage.getItem('smilefree_mock_user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    setError(null);
    
    if (isFirebaseConfigured && auth) {
      // Real Login
      try {
        await signInWithEmailAndPassword(auth, email, pass);
      } catch (err: any) {
        console.error("Login Error:", err);
        setError("Invalid email or password.");
        throw err;
      }
    } else {
      // Mock Login
      return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          if (email === 'doctor@example.com' && pass === 'password') {
            const mockUser: User = {
              id: 'mock-doc-1',
              name: 'Dr. Chandima Weerasekera (Demo)',
              role: 'doctor',
              email: email
            };
            setUser(mockUser);
            localStorage.setItem('smilefree_mock_user', JSON.stringify(mockUser));
            resolve();
          } else {
            setError("Demo Mode: Use doctor@example.com / password");
            reject(new Error("Invalid credentials"));
          }
        }, 800);
      });
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    } else {
      setUser(null);
      localStorage.removeItem('smilefree_mock_user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading, error }}>
      {!loading && children}
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
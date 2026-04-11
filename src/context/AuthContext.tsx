import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider, db } from '../firebase';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  role: string | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeSnapshot: () => void;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      
      if (currentUser) {
        setUser(currentUser);

        // Escuchar cambios en el documento del usuario en tiempo real
        const userDocRef = doc(db, 'users', currentUser.uid);
        
        unsubscribeSnapshot = onSnapshot(userDocRef, async (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setRole(data.role || 'user');
            
            // Actualizar datos de perfil si son diferentes (opcional pero recomendado para "priorizar foto original")
            if (data.photoURL !== currentUser.photoURL || data.displayName !== currentUser.displayName) {
               await setDoc(userDocRef, {
                 ...data,
                 displayName: currentUser.displayName,
                 email: currentUser.email,
                 photoURL: currentUser.photoURL
               }, { merge: true });
            }
          } else {
            // Si el documento no existe (primer login), lo creamos
            const defaultRole = 'user';
            await setDoc(userDocRef, {
              displayName: currentUser.displayName,
              email: currentUser.email,
              photoURL: currentUser.photoURL,
              role: defaultRole,
              createdAt: new Date()
            });
            setRole(defaultRole);
          }
          setLoading(false);
        });

      } else {
        setUser(null);
        setRole(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error during Google sign-in:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, loginWithGoogle, logout }}>
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

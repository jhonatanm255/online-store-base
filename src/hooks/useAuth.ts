import { useEffect, useState } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { auth as firebaseAuth } from "../lib/firebase";

interface AuthState {
  user: FirebaseUser | null;
  isAdmin: boolean;
  loading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAdmin: false,
    loading: true,
  });

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setAuthState({
          user: firebaseUser,
          isAdmin: firebaseUser.email === "jhonatan@store.com", // Verificar si el usuario es admin
          loading: false,
        });
      } else {
        setAuthState({
          user: null,
          isAdmin: false,
          loading: false,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return authState;
}

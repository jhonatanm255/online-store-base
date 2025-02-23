// import { useEffect, useState } from 'react';
// import { User as FirebaseUser } from 'firebase/auth';
// import { User as SupabaseUser } from '@supabase/supabase-js';
// import { auth as firebaseAuth } from '../lib/firebase';
// import { supabase } from '../lib/supabase';

// interface AuthState {
//   user: FirebaseUser | SupabaseUser | null;
//   isAdmin: boolean;
//   loading: boolean;
// }

// export function useAuth() {
//   const [authState, setAuthState] = useState<AuthState>({
//     user: null,
//     isAdmin: false,
//     loading: true,
//   });

//   useEffect(() => {
//     // Listen for Firebase auth changes (client users)
//     const unsubscribeFirebase = firebaseAuth.onAuthStateChanged(async (firebaseUser) => {
//       if (firebaseUser) {
//         setAuthState({
//           user: firebaseUser,
//           isAdmin: false,
//           loading: false,
//         });
//         return;
//       }

//       // If no Firebase user, check Supabase (admin)
//       const { data: { session } } = await supabase.auth.getSession();
//       const supabaseUser = session?.user;

//       setAuthState({
//         user: supabaseUser,
//         isAdmin: supabaseUser?.email === 'admin@store.com',
//         loading: false,
//       });
//     });

//     // Listen for Supabase auth changes (admin)
//     const {
//       data: { subscription: supabaseSubscription },
//     } = supabase.auth.onAuthStateChange(async (_event, session) => {
//       const supabaseUser = session?.user;

//       if (supabaseUser) {
//         setAuthState({
//           user: supabaseUser,
//           isAdmin: supabaseUser.email === 'admin@store.com',
//           loading: false,
//         });
//       }
//     });

//     return () => {
//       unsubscribeFirebase();
//       supabaseSubscription.unsubscribe();
//     };
//   }, []);

//   return authState;
// }








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

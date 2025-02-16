import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  // apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  // authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  // messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  // appId: import.meta.env.VITE_FIREBASE_APP_ID,
  // measurementId: import.meta.env.

  apiKey: "AIzaSyDbt6MgaHgL60TM4r3wZoX7VxNJ1TwOS2w",
  authDomain: "furniture-store-2c12c.firebaseapp.com",
  projectId: "furniture-store-2c12c",
  storageBucket: "furniture-store-2c12c.firebasestorage.app",
  messagingSenderId: "696120617814",
  appId: "1:696120617814:web:2298350cbc55049ee984f7",
  measurementId: "G-YQ08LB9PQ5",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
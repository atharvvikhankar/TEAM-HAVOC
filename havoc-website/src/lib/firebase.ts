import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Defensively initialize to prevent Vercel prerender crashes if env vars are missing
const isConfigured = !!firebaseConfig.apiKey;
const app = isConfigured ? (!getApps().length ? initializeApp(firebaseConfig) : getApp()) : null as any;

const auth = isConfigured ? getAuth(app) : null as any;
const db = isConfigured ? getFirestore(app) : null as any;
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };

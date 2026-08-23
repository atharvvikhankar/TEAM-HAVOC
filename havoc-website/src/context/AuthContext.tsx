"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User as FirebaseUser, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export type HavocUser = {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  status: "pending" | "approved" | "rejected";
  chatAccess: boolean;
  isAdmin?: boolean;
  [key: string]: any;
};

type AuthContextType = {
  user: FirebaseUser | null;
  havocUser: HavocUser | null;
  loading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  havocUser: null,
  loading: true,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [havocUser, setHavocUser] = useState<HavocUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We only initialize Auth state if API key is present
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      console.warn("Firebase config is missing. Auth will not work.");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Fetch or listen to Firestore user document
        const userRef = doc(db, "users", firebaseUser.uid);
        
        const unsubscribeSnapshot = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setHavocUser(docSnap.data() as HavocUser);
          } else {
            setHavocUser(null);
          }
          setLoading(false);
        });

        return () => unsubscribeSnapshot();
      } else {
        setHavocUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, havocUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

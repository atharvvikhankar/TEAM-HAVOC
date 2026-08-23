"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function PendingPage() {
  const { user, havocUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (!loading && havocUser) {
      if (havocUser.isAdmin) router.push("/admin/applications");
      else if (havocUser.status === "approved") router.push("/dashboard");
      // else they stay on pending
    }
  }, [user, havocUser, loading, router]);

  if (loading || !user) return <div className="min-h-screen bg-white" />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg text-center bg-[#f9f9f9] border border-border rounded-3xl p-10"
      >
        <div className="w-16 h-16 bg-foreground text-background rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-black tracking-tighter uppercase mb-3">Application Received</h1>
        <p className="text-foreground/50 font-medium mb-8 leading-relaxed">
          Your HAVOC application has been submitted. An admin will review your application soon. Check back later.
        </p>
        
        <div className="flex flex-col gap-3">
          <a
            href="/"
            className="w-full py-4 bg-[#0a0a0a] text-white rounded-full font-bold hover:bg-[#1a1a1a] transition-colors"
          >
            Back to HAVOC
          </a>
        </div>
      </motion.div>
    </div>
  );
}

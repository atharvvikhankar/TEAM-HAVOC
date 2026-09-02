"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { toast } from "sonner";

// Slug → display name mapping for team members
const MEMBER_SLUGS: Record<string, string> = {
  "atharv-vikhankar": "Atharv Vikhankar",
  "shreya-kale": "Shreya Kale",
  "atharv-sampal": "Atharv Sampal",
  "musab-shaikh": "Musab Shaikh",
  "samiksha-sangave": "Samiksha Sangave",
};

// Slug → Firestore UID mapping (set these to the actual Firebase UIDs)
// If a member hasn't signed up yet, their slug just shows the form for whoever is logged in.
const SLUG_TO_UID: Record<string, string> = {
  // Fill in real UIDs here once members sign up, e.g.:
  // "shreya-kale": "abc123uid",
};

export default function MemberProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { user, havocUser, loading: authLoading } = useAuth();

  const [profileData, setProfileData] = useState<any>(null);
  const [fetching, setFetching] = useState(true);

  // form fields
  const [displayName, setDisplayName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [saving, setSaving] = useState(false);

  const expectedName = MEMBER_SLUGS[slug as string];

  // Determine whose UID to load:
  // 1. If slug has a hardcoded UID → use that
  // 2. Else if logged-in user exists → use their UID
  const targetUid = SLUG_TO_UID[slug as string] || user?.uid;

  useEffect(() => {
    if (!expectedName) {
      router.push("/");
      return;
    }

    if (authLoading) return; // wait for auth to resolve

    if (!targetUid) {
      // No one is logged in and no hardcoded UID — just show empty form
      setFetching(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const docSnap = await getDoc(doc(db, "users", targetUid));
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() };
          setProfileData(data);
          setDisplayName((data as any).name || expectedName);
          setRollNo((data as any).rollNo || "");
          setBirthDate((data as any).birthDate || "");
        } else {
          // Doc doesn't exist yet — pre-fill name from slug
          setDisplayName(expectedName);
        }
      } catch (e) {
        console.error(e);
        setDisplayName(expectedName);
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, [authLoading, targetUid, expectedName, router]);

  const handleUpdate = async () => {
    if (!user) {
      toast.error("You need to be logged in to update your profile.");
      return;
    }
    if (!targetUid) return;

    // Validation — all 3 fields are compulsory
    if (!displayName.trim()) return toast.error("Display Name is required.");
    if (!rollNo.trim()) return toast.error("Roll No is required.");
    if (!birthDate) return toast.error("Birth Date is required.");

    setSaving(true);
    try {
      const userRef = doc(db, "users", targetUid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        await updateDoc(userRef, {
          name: displayName.trim(),
          rollNo: rollNo.trim(),
          birthDate,
        });
      } else {
        // Create a new document if it doesn't exist yet
        await setDoc(userRef, {
          uid: targetUid,
          name: displayName.trim(),
          rollNo: rollNo.trim(),
          birthDate,
          email: user.email || "",
          photoURL: user.photoURL || "",
          status: "pending",
          chatAccess: false,
          isAdmin: false,
        });
      }

      setProfileData((prev: any) => ({
        ...prev,
        name: displayName.trim(),
        rollNo: rollNo.trim(),
        birthDate,
      }));
      toast.success("Profile updated successfully!");
      router.push("/");
    } catch (e) {
      console.error(e);
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || fetching) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  if (!expectedName) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-black uppercase tracking-tight text-black">Member not found</p>
          <button onClick={() => router.push("/")} className="mt-4 text-sm font-bold text-black/40 hover:text-black transition-colors">
            ← Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-28 pb-24 px-6">
      <div className="max-w-xl mx-auto">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="text-[10px] font-bold uppercase tracking-widest text-black/40 hover:text-black mb-8 flex items-center gap-1.5 transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white border border-black/[0.06] rounded-3xl p-8 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.06)]"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-black/5">
            <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center text-white font-black text-xl">
              {expectedName.charAt(0)}
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-black/30 mb-0.5">Team Member</p>
              <h1 className="text-xl font-black tracking-tight text-black">{expectedName}</h1>
            </div>
          </div>

          {/* Not logged in warning */}
          {!user && (
            <div className="mb-6 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-xs font-bold text-amber-700">
                You need to be logged in to edit this profile.{" "}
                <a href="/login" className="underline hover:text-amber-900">Log in →</a>
              </p>
            </div>
          )}

          {/* Form */}
          <div className="flex flex-col gap-6">

            {/* Display Name */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">
                Display Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder={`e.g. ${expectedName}`}
                disabled={!user}
                className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent focus:border-black/20 focus:bg-white rounded-xl text-sm font-semibold text-black placeholder:text-black/25 outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Roll No */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">
                Roll No <span className="text-red-400">*</span>
                <span className="ml-2 text-[9px] font-bold bg-black/5 text-black/40 px-1.5 py-0.5 rounded-full">Admin Only</span>
              </label>
              <input
                type="text"
                value={rollNo}
                onChange={e => setRollNo(e.target.value)}
                placeholder="e.g. 2310810"
                disabled={!user}
                className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent focus:border-black/20 focus:bg-white rounded-xl text-sm font-semibold text-black placeholder:text-black/25 outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p className="text-[10px] text-black/30 font-medium">Your roll number will only be visible to the admin.</p>
            </div>

            {/* Birth Date */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">
                Birth Date <span className="text-red-400">*</span>
                <span className="ml-2 text-[9px] font-bold bg-black/5 text-black/40 px-1.5 py-0.5 rounded-full">Admin Only</span>
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={e => setBirthDate(e.target.value)}
                disabled={!user}
                max={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent focus:border-black/20 focus:bg-white rounded-xl text-sm font-semibold text-black outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p className="text-[10px] text-black/30 font-medium">Your birth date will only be visible to the admin.</p>
            </div>

            {/* Update Button */}
            <button
              onClick={handleUpdate}
              disabled={saving || !user}
              className="w-full mt-2 bg-black text-white font-black uppercase tracking-[0.15em] text-xs py-4 rounded-xl hover:bg-black/80 active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
                  </svg>
                  Update Profile
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Saved Info preview */}
        {(profileData?.rollNo || profileData?.birthDate) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-4 bg-white border border-black/[0.06] rounded-2xl p-5"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30 mb-3">Saved Info</p>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold uppercase tracking-wide text-black/40">Roll No</span>
                <span className="font-semibold text-black font-mono">{profileData.rollNo}</span>
              </div>
              {profileData?.birthDate && (
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold uppercase tracking-wide text-black/40">Birth Date</span>
                  <span className="font-semibold text-black font-mono">
                    {new Date(profileData.birthDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

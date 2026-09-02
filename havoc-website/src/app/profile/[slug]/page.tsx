"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { toast } from "sonner";

// Slug → display name mapping for the 5 team members
const MEMBER_SLUGS: Record<string, string> = {
  "atharv-vikhankar": "Atharv Vikhankar",
  "shreya-kale": "Shreya Kale",
  "atharv-sampal": "Atharv Sampal",
  "musab-shaikh": "Musab Shaikh",
  "samiksha-sangave": "Samiksha Sangave",
};

export default function MemberProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { user, havocUser, loading: authLoading } = useAuth();

  const [member, setMember] = useState<any>(null);
  const [fetching, setFetching] = useState(true);

  // form fields
  const [displayName, setDisplayName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [saving, setSaving] = useState(false);

  const expectedName = MEMBER_SLUGS[slug as string];

  useEffect(() => {
    if (!expectedName) {
      router.push("/");
      return;
    }
    // Fetch the member from Firestore by matching name
    const fetch = async () => {
      try {
        const q = query(collection(db, "users"), where("name", "==", expectedName));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const data = { id: snap.docs[0].id, ...snap.docs[0].data() };
          setMember(data);
          setDisplayName((data as any).name || "");
          setRollNo((data as any).rollNo || "");
        }
      } catch (e) {
        console.error(e);
      } finally {
        setFetching(false);
      }
    };
    fetch();
  }, [expectedName, router]);

  const handleUpdate = async () => {
    if (!member) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", member.id), {
        name: displayName.trim(),
        rollNo: rollNo.trim(),
      });
      setMember((prev: any) => ({ ...prev, name: displayName.trim(), rollNo: rollNo.trim() }));
      toast.success("Profile updated successfully!");
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

  if (!expectedName || !member) {
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

          {/* Form */}
          <div className="flex flex-col gap-6">

            {/* Display Name */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="e.g. Atharv Vikhankar"
                className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent focus:border-black/20 focus:bg-white rounded-xl text-sm font-semibold text-black placeholder:text-black/25 outline-none transition-all duration-200"
              />
            </div>



            {/* Roll No */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">
                Roll No
                <span className="ml-2 text-[9px] font-bold bg-black/5 text-black/40 px-1.5 py-0.5 rounded-full">Admin Only</span>
              </label>
              <input
                type="text"
                value={rollNo}
                onChange={e => setRollNo(e.target.value)}
                placeholder="e.g. 2310810"
                className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent focus:border-black/20 focus:bg-white rounded-xl text-sm font-semibold text-black placeholder:text-black/25 outline-none transition-all duration-200"
              />
              <p className="text-[10px] text-black/30 font-medium">Your roll number will only be visible to the admin.</p>
            </div>

            {/* Update Button */}
            <button
              onClick={handleUpdate}
              disabled={saving}
              className="w-full mt-2 bg-black text-white font-black uppercase tracking-[0.15em] text-xs py-4 rounded-xl hover:bg-black/80 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

        {/* Current saved info (readonly preview) */}
        {member.rollNo && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-4 bg-white border border-black/[0.06] rounded-2xl p-5"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30 mb-3">Saved Info</p>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold uppercase tracking-wide text-black/40">Roll No</span>
                <span className="font-semibold text-black">{member.rollNo}</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useUI } from "@/context/UIContext";

export default function MembersPage() {
  const { user, havocUser, loading } = useAuth();
  const { confirm } = useUI();
  const router = useRouter();
  const [members, setMembers] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
    else if (!loading && havocUser?.status !== "approved" && !havocUser?.isAdmin) {
      router.push("/dashboard");
    }
  }, [user, havocUser, loading, router]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const q = query(collection(db, "users"), where("status", "==", "approved"));
        const snapshot = await getDocs(q);
        const mems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMembers(mems);
      } catch (e) {
        console.error(e);
      } finally {
        setFetching(false);
      }
    };
    if (havocUser?.status === "approved" || havocUser?.isAdmin) {
      fetchMembers();
    }
  }, [havocUser]);

  const handleRoleChange = async (uid: string, newRole: string) => {
    if (!havocUser?.isAdmin) return;
    try {
      await updateDoc(doc(db, "users", uid), { primaryRole: newRole });
      setMembers(prev => prev.map(m => m.id === uid ? { ...m, primaryRole: newRole } : m));
      toast.success("Role updated successfully.");
    } catch (e) {
      console.error(e);
      toast.error("Failed to update user role.");
    }
  };

  const handleRemoveUser = async (uid: string) => {
    if (!havocUser?.isAdmin) return;
    
    const isConfirmed = await confirm({
      title: "Remove User",
      message: "Are you sure you want to completely remove this user from the platform? They will lose access immediately.",
      confirmText: "Remove User",
      destructive: true
    });

    if (isConfirmed) {
      try {
        await updateDoc(doc(db, "users", uid), { status: "rejected" });
        setMembers(prev => prev.filter(m => m.id !== uid));
        toast.success("User removed successfully.");
      } catch (e) {
        console.error(e);
        toast.error("Failed to remove user.");
      }
    }
  };

  if (loading || fetching || (!havocUser?.isAdmin && havocUser?.status !== "approved")) {
    return <div className="min-h-screen bg-[#FAFAFA]" />;
  }

  const roleOptions = ["Developer", "Backend", "AI / ML", "UI/UX", "Product", "Research", "Presentation", "Pitching", "Admin"];

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-24 px-6 pb-20">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <button onClick={() => router.push("/dashboard")} className="text-[10px] font-bold uppercase tracking-widest text-black/40 hover:text-black mb-6 flex items-center gap-1 transition-colors">
            &larr; Back to Dashboard
          </button>
          <h1 className="text-3xl font-black uppercase tracking-tight text-black">Member Directory</h1>
          <p className="text-black/50 font-medium mt-1">The people building HAVOC.</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {members.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white border border-black/5 rounded-2xl p-5 flex flex-col hover:border-black/10 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col gap-3 mb-4 border-b border-black/5 pb-4">
                <div className="flex justify-between items-start">
                  <img src={member.photoURL || ""} alt="" className="w-12 h-12 rounded-full bg-zinc-100 border border-black/5 shadow-sm" />
                  {havocUser?.isAdmin ? (
                    <button 
                      onClick={() => handleRemoveUser(member.id)}
                      className="text-[10px] font-bold uppercase text-red-400 hover:text-white hover:bg-red-500 px-2 py-1 rounded transition-colors border border-transparent hover:border-red-600"
                      title="Remove User"
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
                <div>
                  <h3 className="font-extrabold text-base leading-tight tracking-tight text-black">{member.name}</h3>
                  
                  {havocUser?.isAdmin ? (
                    <select 
                      value={member.primaryRole || ""}
                      onChange={(e) => handleRoleChange(member.id, e.target.value)}
                      className="mt-1 text-[9px] font-bold uppercase tracking-wider text-black/60 bg-black/5 border border-black/10 rounded px-1.5 py-0.5 outline-none hover:bg-black/10 cursor-pointer transition-colors"
                    >
                      {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
                      {!roleOptions.includes(member.primaryRole) && member.primaryRole && (
                        <option value={member.primaryRole}>{member.primaryRole}</option>
                      )}
                    </select>
                  ) : (
                    <p className="text-[9px] font-bold text-black/40 uppercase tracking-wider mt-0.5">{member.primaryRole || "Member"}</p>
                  )}
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-2">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-bold uppercase tracking-wide text-black/40">Year</span>
                  <span className="font-semibold text-black">{member.year || "-"}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-bold uppercase tracking-wide text-black/40">College</span>
                  <span className="font-semibold text-black text-right max-w-[130px] truncate" title={member.college}>{member.college || "-"}</span>
                </div>
                
                <div className="pt-2 mt-auto">
                  <div className="flex flex-wrap gap-1">
                    {(member.skills || []).slice(0, 4).map((s: string) => (
                      <span key={s} className="px-2 py-0.5 bg-black/5 rounded-[4px] text-[8px] font-bold uppercase tracking-wider text-black/60 border border-black/5">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {members.length === 0 && (
            <div className="col-span-full py-20 text-center text-black/40 font-bold uppercase tracking-widest text-xs">
              No approved members found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

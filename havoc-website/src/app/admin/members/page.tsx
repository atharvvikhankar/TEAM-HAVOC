"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";

export default function AdminMembersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "users"), where("status", "==", "approved"));
      const snapshot = await getDocs(q);
      setMembers(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const toggleChatAccess = async (uid: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, "users", uid), { chatAccess: !currentStatus });
      setMembers(prev => prev.map(m => m.id === uid ? { ...m, chatAccess: !currentStatus } : m));
      toast.success("Chat access updated.");
    } catch (e) {
      console.error(e);
      toast.error("Failed to update chat access.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-10">
        <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
        <span className="text-sm font-bold text-black/40 uppercase tracking-widest">Loading members...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">Approved Members</h1>
          <p className="text-sm text-black/40 font-medium mt-1">Full Name and Roll No are private — visible only to admin.</p>
        </div>
        <button
          onClick={fetchMembers}
          className="text-[10px] font-black uppercase tracking-widest text-black/40 hover:text-black border border-black/10 hover:border-black/30 rounded-lg px-3 py-2 transition-all"
        >
          ↻ Refresh
        </button>
      </div>

      <div className="bg-white border border-black/[0.06] rounded-3xl overflow-hidden shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-black/5 bg-[#FAFAFA]">
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-black/30">Member</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-black/30">Full Name</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-black/30">Roll No</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-black/30 hidden sm:table-cell">Role</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-black/30 hidden md:table-cell">Year / College</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-black/30 text-right">Chat Access</th>
              </tr>
            </thead>
            <tbody>
              {members.map(member => (
                <tr key={member.id} className="border-b border-black/5 last:border-0 hover:bg-[#FAFAFA] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={member.photoURL} alt="" className="w-8 h-8 rounded-full bg-zinc-100 border border-black/5" />
                      <div>
                        <p className="font-bold text-sm text-black">{member.name}</p>
                        <p className="text-[10px] font-medium text-black/40">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    {member.fullName ? (
                      <span className="text-sm font-semibold text-black">{member.fullName}</span>
                    ) : (
                      <span className="text-[11px] font-bold text-black/20 uppercase tracking-wider">Not set</span>
                    )}
                  </td>
                  <td className="p-4">
                    {member.rollNo ? (
                      <span className="text-sm font-semibold text-black font-mono">{member.rollNo}</span>
                    ) : (
                      <span className="text-[11px] font-bold text-black/20 uppercase tracking-wider">Not set</span>
                    )}
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <span className="px-2 py-1 bg-black/5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-black/60">
                      {member.primaryRole || "Member"}
                    </span>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <p className="text-xs font-semibold text-black">{member.year || "-"}</p>
                    <p className="text-[10px] font-medium text-black/40 truncate max-w-[150px]">{member.college || "-"}</p>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => toggleChatAccess(member.id, !!member.chatAccess)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${member.chatAccess ? 'bg-black' : 'bg-black/10'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${member.chatAccess ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-black/30 font-bold uppercase tracking-widest text-xs">
                    No approved members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

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

  if (loading) return <div className="animate-pulse">Loading members...</div>;

  return (
    <div>
      <h1 className="text-3xl font-black uppercase tracking-tight mb-8">Approved Members</h1>

      <div className="bg-white border border-border rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-light-gray/50">
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Member</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Role</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 hidden sm:table-cell">Year / College</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-right">Chat Access</th>
              </tr>
            </thead>
            <tbody>
              {members.map(member => (
                <tr key={member.id} className="border-b border-border last:border-0 hover:bg-light-gray/20 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={member.photoURL} alt="" className="w-8 h-8 rounded-full bg-light-gray" />
                      <div>
                        <p className="font-bold text-sm">{member.name}</p>
                        <p className="text-[10px] font-medium text-foreground/50">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-light-gray rounded text-[10px] font-bold uppercase tracking-wider">{member.primaryRole || "Member"}</span>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <p className="text-xs font-semibold">{member.year || "-"}</p>
                    <p className="text-[10px] font-medium text-foreground/50 truncate max-w-[150px]">{member.college || "-"}</p>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => toggleChatAccess(member.id, !!member.chatAccess)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${member.chatAccess ? 'bg-green-500' : 'bg-gray-200'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${member.chatAccess ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-foreground/40 font-medium">No members found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

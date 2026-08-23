"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { useUI } from "@/context/UIContext";
import { toast } from "sonner";

export default function ApplicationsPage() {
  const { confirm } = useUI();
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);

  const fetchApps = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "users"), where("status", "==", "pending"));
      const snapshot = await getDocs(q);
      setApps(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleAction = async (uid: string, action: "approved" | "rejected") => {
    const isConfirmed = await confirm({
      title: `${action === "approved" ? "Approve" : "Reject"} Application`,
      message: `Are you sure you want to ${action === "approved" ? "approve" : "reject"} this application?`,
      confirmText: action === "approved" ? "Approve" : "Reject",
      destructive: action === "rejected"
    });

    if (isConfirmed) {
      try {
        await updateDoc(doc(db, "users", uid), { status: action });
        setSelectedApp(null);
        fetchApps();
        toast.success(`Application ${action === "approved" ? "approved" : "rejected"} successfully.`);
      } catch (e) {
        console.error(e);
        toast.error("Action failed.");
      }
    }
  };

  if (loading) return <div className="animate-pulse">Loading applications...</div>;

  return (
    <div>
      <h1 className="text-3xl font-black uppercase tracking-tight mb-8 text-black">Pending Applications</h1>
      
      {apps.length === 0 ? (
        <div className="bg-white border border-border rounded-[2rem] p-16 text-center text-foreground/40 font-bold uppercase tracking-widest text-sm shadow-sm">
          No pending applications.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          {/* List */}
          <div className="flex flex-col gap-3">
            <AnimatePresence>
              {apps.map((app) => (
                <motion.button
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={`group relative flex items-center gap-4 p-5 rounded-[20px] text-left transition-all duration-300 ease-out border overflow-hidden ${selectedApp?.id === app.id ? 'border-black bg-black text-white shadow-xl scale-[1.02] z-10' : 'border-black/5 bg-white hover:border-black/20 hover:shadow-md'}`}
                >
                  {/* Active Indicator Background for unselected hover */}
                  {selectedApp?.id !== app.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                  
                  <img src={app.photoURL} className={`w-14 h-14 rounded-full object-cover shadow-inner ${selectedApp?.id === app.id ? 'border-2 border-white/20' : 'bg-light-gray'}`} alt="" />
                  <div className="flex-1 overflow-hidden z-10">
                    <h3 className="font-bold text-lg tracking-tight truncate">{app.name}</h3>
                    <p className={`text-[11px] font-bold uppercase tracking-widest truncate mt-0.5 ${selectedApp?.id === app.id ? 'text-white/60' : 'text-foreground/40'}`}>
                      {app.primaryRole || 'No Role'} • {app.year || 'Unknown'}
                    </p>
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${selectedApp?.id === app.id ? 'bg-white/10 text-white rotate-0' : 'bg-black/5 text-black group-hover:-rotate-45'}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          {/* Detail View */}
          <AnimatePresence mode="wait">
            {selectedApp ? (
              <motion.div
                key={selectedApp.id}
                initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="bg-white/80 backdrop-blur-xl border border-white rounded-[2rem] p-6 md:p-10 sticky top-24 shadow-[0_8px_40px_rgba(0,0,0,0.06)]"
              >
                <div className="flex items-center gap-5 mb-8 pb-8 border-b border-black/5">
                  <div className="relative">
                    <img src={selectedApp.photoURL} className="w-20 h-20 rounded-full object-cover shadow-md" alt="" />
                    <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-black/10" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black tracking-tight">{selectedApp.name}</h2>
                    <p className="text-sm text-foreground/50 font-semibold mt-1">{selectedApp.email}</p>
                    {selectedApp.phone && <p className="text-sm text-foreground/50 font-semibold">{selectedApp.phone}</p>}
                  </div>
                </div>
                
                <div className="space-y-6 max-h-[50vh] overflow-y-auto custom-scrollbar pr-4 -mr-4">
                  <Section title="Basic Profile">
                    <Row label="Gender" value={selectedApp.gender} />
                    <Row label="College" value={selectedApp.college} />
                    <Row label="Year" value={selectedApp.year} />
                  </Section>

                  <Section title="Role & Expertise">
                    <Row label="Primary Role" value={selectedApp.primaryRole} />
                    <Row label="Secondary Role" value={selectedApp.secondaryRole} />
                    {selectedApp.skills?.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-black/5">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30 block mb-3">Capabilities</span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedApp.skills.map((s: string) => (
                            <span key={s} className="bg-black/5 border border-black/5 px-3 py-1.5 rounded-lg text-xs font-bold text-black/70">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </Section>

                  <Section title="Experience">
                    <Row label="Hackathons" value={selectedApp.hackathonExperience} />
                    <Row label="Projects" value={selectedApp.projectExperience} />
                    <Row label="Programming" value={selectedApp.programmingLevel} />
                  </Section>
                  
                  <Section title="AI Toolkit">
                    <Row label="Claude Code" value={selectedApp.claudeCodeExperience} />
                    <Row label="Antigravity" value={selectedApp.antigravityExperience} />
                    <Row label="AI Comfort" value={selectedApp.aiCodingComfort} />
                    {selectedApp.aiTools?.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-black/5">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30 block mb-3">Tools Used</span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedApp.aiTools.map((s: string) => (
                            <span key={s} className="bg-blue-500/10 text-blue-700 border border-blue-500/10 px-3 py-1.5 rounded-lg text-xs font-bold">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </Section>

                  <Section title="Logistics">
                    <Row label="Deadline Comfort" value={selectedApp.deadlineComfort} />
                    <Row label="Availability" value={selectedApp.availability} />
                  </Section>
                </div>

                <div className="flex gap-4 mt-8 pt-8 border-t border-black/5">
                  <button onClick={() => handleAction(selectedApp.id, "rejected")} className="flex-1 py-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl font-bold hover:bg-red-100 transition-colors shadow-sm">Reject</button>
                  <button onClick={() => handleAction(selectedApp.id, "approved")} className="flex-1 py-4 bg-black text-white rounded-2xl font-bold hover:bg-black/80 hover:shadow-xl transition-all shadow-md">Approve Member</button>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white/50 border border-border border-dashed rounded-[2rem] p-12 flex items-center justify-center text-foreground/30 font-bold uppercase tracking-widest text-xs hidden lg:flex shadow-inner">
                Select an application to review
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="bg-black/[0.02] rounded-2xl p-5 border border-black/5">
      <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/40 mb-4">{title}</h4>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-black/5 last:border-0 last:pb-0">
      <span className="text-foreground/60 font-semibold text-sm">{label}</span>
      <span className="font-bold text-sm text-right max-w-[60%] text-foreground/90">{value || "—"}</span>
    </div>
  );
}

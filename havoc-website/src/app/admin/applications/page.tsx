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
      <AnimatePresence mode="wait">
        {!selectedApp ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h1 className="text-3xl font-black uppercase tracking-tight mb-8 text-black">Pending Applications</h1>
            
            {apps.length === 0 ? (
              <div className="bg-white border border-border rounded-[2rem] p-16 text-center text-foreground/40 font-bold uppercase tracking-widest text-sm shadow-sm">
                No pending applications.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {apps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className="group relative flex items-center gap-4 p-5 bg-white rounded-[20px] text-left transition-all duration-300 border border-black/5 hover:border-black/20 hover:shadow-md"
                  >
                    <img src={app.photoURL} className="w-14 h-14 rounded-full object-cover bg-light-gray" alt="" />
                    <div className="flex-1 overflow-hidden">
                      <h3 className="font-bold text-lg tracking-tight truncate">{app.name}</h3>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-foreground/40 truncate mt-0.5">
                        {app.primaryRole || 'No Role'} • {app.year || 'Unknown'}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-black/5 text-black flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:bg-black group-hover:text-white group-hover:-rotate-45">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="detail" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-3xl mx-auto pb-20">
            <button onClick={() => setSelectedApp(null)} className="flex items-center gap-2 text-sm font-bold text-foreground/50 hover:text-black transition-colors mb-8">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5m7-7-7 7 7 7"/></svg>
              Back to Applications
            </button>

            <div className="bg-white border border-black/5 rounded-[2rem] p-8 md:p-12 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10 pb-10 border-b border-black/5">
                <img src={selectedApp.photoURL} className="w-24 h-24 rounded-full object-cover shadow-sm" alt="" />
                <div className="flex-1">
                  <h2 className="text-3xl md:text-4xl font-black tracking-tight">{selectedApp.name}</h2>
                  <p className="text-foreground/50 font-semibold mt-1">{selectedApp.email}</p>
                  {selectedApp.phone && <p className="text-foreground/50 font-semibold">{selectedApp.phone}</p>}
                </div>
                <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
                  <button onClick={() => handleAction(selectedApp.id, "rejected")} className="px-6 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors">Reject</button>
                  <button onClick={() => handleAction(selectedApp.id, "approved")} className="px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-black/80 transition-colors shadow-md">Approve Member</button>
                </div>
              </div>

              <div className="space-y-8">
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
                      <div className="flex flex-wrap gap-2">
                        {selectedApp.skills.map((s: string) => (
                          <span key={s} className="bg-black/5 px-3 py-1.5 rounded-lg text-xs font-bold text-black/70">{s}</span>
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
                      <div className="flex flex-wrap gap-2">
                        {selectedApp.aiTools.map((s: string) => (
                          <span key={s} className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold">{s}</span>
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="bg-black/[0.02] rounded-2xl p-6 border border-black/5">
      <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/40 mb-4">{title}</h4>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-black/5 last:border-0 last:pb-0">
      <span className="text-foreground/60 font-semibold text-sm">{label}</span>
      <span className="font-bold text-sm text-right max-w-[60%] text-foreground/90">{value || "—"}</span>
    </div>
  );
}

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
      <h1 className="text-3xl font-black uppercase tracking-tight mb-8">Pending Applications</h1>
      
      {apps.length === 0 ? (
        <div className="bg-white border border-border rounded-2xl p-12 text-center text-foreground/50 font-medium">
          No pending applications.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* List */}
          <div className="flex flex-col gap-3">
            {apps.map((app) => (
              <button
                key={app.id}
                onClick={() => setSelectedApp(app)}
                className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${selectedApp?.id === app.id ? 'border-foreground bg-white shadow-sm' : 'border-border bg-white hover:border-foreground/30'}`}
              >
                <img src={app.photoURL} className="w-12 h-12 rounded-full bg-light-gray" alt="" />
                <div className="flex-1 overflow-hidden">
                  <h3 className="font-bold truncate">{app.name}</h3>
                  <p className="text-xs text-foreground/50 font-semibold uppercase tracking-wider truncate">{app.primaryRole} • {app.year}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-light-gray flex items-center justify-center shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                </div>
              </button>
            ))}
          </div>

          {/* Detail View */}
          <AnimatePresence mode="wait">
            {selectedApp ? (
              <motion.div
                key={selectedApp.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="bg-white border border-border rounded-3xl p-6 md:p-8 sticky top-24"
              >
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
                  <img src={selectedApp.photoURL} className="w-16 h-16 rounded-full" alt="" />
                  <div>
                    <h2 className="text-2xl font-bold">{selectedApp.name}</h2>
                    <p className="text-sm text-foreground/50 font-medium">{selectedApp.email}</p>
                  </div>
                </div>
                
                <div className="space-y-6 max-h-[50vh] overflow-y-auto custom-scrollbar pr-4">
                  <Section title="Basic Info">
                    <Row label="Gender" value={selectedApp.gender} />
                    <Row label="Age" value={selectedApp.age} />
                    <Row label="College" value={selectedApp.college} />
                    <Row label="Year" value={selectedApp.year} />
                  </Section>

                  <Section title="Role & Skills">
                    <Row label="Primary Role" value={selectedApp.primaryRole} />
                    <Row label="Secondary Role" value={selectedApp.secondaryRole} />
                    <div className="mt-2">
                      <span className="text-xs font-bold uppercase text-foreground/40 block mb-1">Skills</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedApp.skills?.map((s: string) => <span key={s} className="bg-light-gray px-2 py-1 rounded text-[10px] font-bold">{s}</span>)}
                      </div>
                    </div>
                  </Section>

                  <Section title="Experience">
                    <Row label="Hackathons" value={selectedApp.hackathonExperience} />
                    <Row label="Projects" value={selectedApp.projectExperience} />
                    <Row label="Programming" value={selectedApp.programmingLevel} />
                  </Section>
                  
                  <Section title="AI & Tools">
                    <Row label="Claude Code" value={selectedApp.claudeCodeExperience} />
                    <Row label="Antigravity" value={selectedApp.antigravityExperience} />
                    <Row label="AI Comfort" value={selectedApp.aiCodingComfort} />
                  </Section>

                  <Section title="Motivation">
                    <p className="text-sm font-medium bg-light-gray p-4 rounded-xl leading-relaxed whitespace-pre-wrap">{selectedApp.motivation}</p>
                    <div className="mt-4">
                      <Row label="Deadlines" value={selectedApp.deadlineComfort} />
                      <Row label="Availability" value={selectedApp.availability} />
                    </div>
                  </Section>
                </div>

                <div className="flex gap-3 mt-8 pt-6 border-t border-border">
                  <button onClick={() => handleAction(selectedApp.id, "rejected")} className="flex-1 py-3 border border-red-200 text-red-500 rounded-full font-bold hover:bg-red-50 transition-colors">Reject</button>
                  <button onClick={() => handleAction(selectedApp.id, "approved")} className="flex-1 py-3 bg-[#0a0a0a] text-white rounded-full font-bold hover:bg-[#1a1a1a] transition-colors">Approve</button>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white/50 border border-border border-dashed rounded-3xl p-12 flex items-center justify-center text-foreground/40 font-bold uppercase tracking-widest text-xs hidden lg:flex">
                Select an application
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
    <div>
      <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground/30 mb-3">{title}</h4>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-start text-sm">
      <span className="text-foreground/60 font-medium">{label}</span>
      <span className="font-semibold text-right max-w-[60%]">{value || "-"}</span>
    </div>
  );
}

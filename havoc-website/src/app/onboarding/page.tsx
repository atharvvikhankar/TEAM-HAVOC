"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function OnboardingPage() {
  const { user, havocUser, loading } = useAuth();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    gender: "",
    college: "JNEC MGM",
    year: "",
    skills: [] as string[],
    hackathonExperience: "",
    projectExperience: "",
    programmingLevel: "",
    aiTools: [] as string[],
    claudeCodeExperience: "",
    antigravityExperience: "",
    aiCodingComfort: "",
    primaryRole: "",
    secondaryRole: "",
    workInterests: [] as string[],
    motivation: "",
    deadlineComfort: "",
    availability: "",
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (!loading && havocUser) {
      if (havocUser.isAdmin) router.push("/admin/applications");
      else if (havocUser.status === "approved") router.push("/dashboard");
      else router.push("/pending");
    }
  }, [user, havocUser, loading, router]);

  if (loading || !user || havocUser) return <div className="min-h-screen bg-white" />;

  const updateData = (key: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const toggleArray = (key: "skills" | "aiTools" | "workInterests", value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: prev[key].includes(value) 
        ? prev[key].filter(i => i !== value)
        : [...prev[key], value]
    }));
  };

  const handleSubmit = async () => {
    if (!formData.deadlineComfort) return toast.error("Deadline comfort is required");
    if (!formData.availability) return toast.error("Availability is required");

    setSubmitting(true);
    try {
      const userRef = doc(db, "users", user.uid);
      const dataToSave = { ...formData };
      if (!dataToSave.name.trim()) dataToSave.name = "Anonymous Builder";

      await setDoc(userRef, {
        ...dataToSave,
        uid: user.uid,
        email: user.email,
        photoURL: user.photoURL,
        status: "pending",
        chatAccess: false,
        isAdmin: false,
        createdAt: new Date().toISOString(),
      });
      // Context will pick up the new document and route automatically, or we can manually push
      router.push("/pending");
    } catch (e) {
      console.error(e);
      toast.error("Failed to submit application.");
    } finally {
      setSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.name.trim()) return toast.error("Full Name is required");
      if (!formData.phone.trim()) return toast.error("Phone number is required");
      if (!formData.gender) return toast.error("Gender is required");
    }
    if (step === 2 && formData.skills.length === 0) {
      return toast.error("Please select at least one contribution");
    }
    if (step === 3) {
      if (!formData.projectExperience) return toast.error("Project experience is required");
      if (!formData.programmingLevel) return toast.error("Programming level is required");
    }
    if (step === 4 && formData.aiTools.length === 0) {
      return toast.error("Please select at least one AI tool");
    }
    if (step === 5 && !formData.primaryRole) {
      return toast.error("Primary Role is required");
    }
    setStep(s => Math.min(s + 1, 6));
  };
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="flex flex-col gap-5">
            <div>
              <label className="text-xs font-bold uppercase text-foreground/50 mb-2 block">Full Name <span className="text-red-500">*</span></label>
              <input type="text" value={formData.name} onChange={e => updateData("name", e.target.value)} placeholder="Full Name" className="w-full bg-white border border-border px-4 py-3 rounded-xl outline-none font-medium text-foreground/80 hover:border-black/20 focus:border-black/40 transition-colors shadow-sm" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-foreground/50 mb-2 block">Phone Number <span className="text-red-500">*</span></label>
              <input type="tel" value={formData.phone} onChange={e => updateData("phone", e.target.value)} placeholder="e.g. +91 9876543210" className="w-full bg-white border border-border px-4 py-3 rounded-xl outline-none font-medium text-foreground/80 hover:border-black/20 focus:border-black/40 transition-colors shadow-sm" required />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-foreground/50 mb-2 block">Email</label>
              <input type="email" readOnly value={user.email || ""} className="w-full bg-black/5 px-4 py-3 rounded-xl outline-none font-medium text-foreground/60 shadow-inner" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold uppercase text-foreground/50 mb-2 block">Gender <span className="text-red-500">*</span></label>
                <select value={formData.gender} onChange={e => updateData("gender", e.target.value)} className="w-full bg-white border border-border px-4 py-3 rounded-xl outline-none font-medium hover:border-black/20 focus:border-black/40 transition-colors shadow-sm appearance-none">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-foreground/50 mb-2 block">Year</label>
                <select value={formData.year} onChange={e => updateData("year", e.target.value)} className="w-full bg-white border border-border px-4 py-3 rounded-xl outline-none font-medium hover:border-black/20 focus:border-black/40 transition-colors shadow-sm appearance-none">
                  <option value="">Select Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-foreground/50 mb-2 block">College</label>
              <input type="text" value={formData.college} onChange={e => updateData("college", e.target.value)} placeholder="College Name" className="w-full bg-white border border-border px-4 py-3 rounded-xl outline-none font-medium" />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col gap-8 pt-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-black mb-6">What can you contribute to HAVOC? <span className="text-red-500 text-xl">*</span></h2>
              <div className="flex flex-wrap gap-2">
                {["Frontend", "Backend", "Full Stack", "AI / ML", "Mobile Development", "UI/UX", "Cybersecurity", "Cloud / DevOps", "Blockchain", "Research", "Product", "Presentation", "Video / Design", "Other"].map(s => (
                  <button key={s} onClick={() => toggleArray("skills", s)} className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${formData.skills.includes(s) ? "bg-foreground text-background border-foreground" : "bg-white border-border text-foreground/60 hover:border-foreground/30"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col gap-8 pt-4">
            <div>
              <h3 className="text-xl font-black tracking-tight text-black mb-4">Have you participated in hackathons before?</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {["Never", "1–2", "3–5", "6+"].map(opt => (
                  <button key={opt} onClick={() => updateData("hackathonExperience", opt)} className={`py-3 rounded-xl text-sm font-semibold border transition-all ${formData.hackathonExperience === opt ? "bg-foreground text-background border-foreground" : "bg-white border-border text-foreground/60"}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight text-black mb-4">Have you built a complete project? <span className="text-red-500 text-lg">*</span></h3>
              <div className="grid grid-cols-2 gap-2">
                {["No", "College project", "Personal project", "Production project"].map(opt => (
                  <button key={opt} onClick={() => updateData("projectExperience", opt)} className={`py-3 rounded-xl text-sm font-semibold border transition-all ${formData.projectExperience === opt ? "bg-foreground text-background border-foreground" : "bg-white border-border text-foreground/60"}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight text-black mb-4">Programming Level <span className="text-red-500 text-lg">*</span></h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {["Beginner", "Basic", "Intermediate", "Advanced", "Expert"].map(opt => (
                  <button key={opt} onClick={() => updateData("programmingLevel", opt)} className={`py-3 rounded-xl text-sm font-semibold border transition-all ${formData.programmingLevel === opt ? "bg-foreground text-background border-foreground" : "bg-white border-border text-foreground/60"}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col gap-8 pt-4">
            <div>
              <h3 className="text-xl font-black tracking-tight text-black mb-4">Which AI development tools have you used? <span className="text-red-500 text-lg">*</span></h3>
              <div className="flex flex-wrap gap-2">
                {["Claude Code", "Antigravity", "Cursor", "GitHub Copilot", "ChatGPT", "Gemini", "Windsurf", "Replit", "Other", "None"].map(opt => (
                  <button key={opt} onClick={() => toggleArray("aiTools", opt)} className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${formData.aiTools.includes(opt) ? "bg-foreground text-background border-foreground" : "bg-white border-border text-foreground/60"}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-black tracking-tight text-black mb-3">Claude Code Experience</h4>
                <div className="flex flex-col gap-2">
                  {["Never used", "Tried it", "Occasionally", "Frequently"].map(opt => (
                    <button key={opt} onClick={() => updateData("claudeCodeExperience", opt)} className={`py-2 px-4 text-left rounded-xl text-sm font-semibold border transition-all ${formData.claudeCodeExperience === opt ? "bg-foreground text-background border-foreground" : "bg-white border-border text-foreground/60"}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-lg font-black tracking-tight text-black mb-3">Antigravity Experience</h4>
                <div className="flex flex-col gap-2">
                  {["Never used", "Tried it", "Occasionally", "Frequently"].map(opt => (
                    <button key={opt} onClick={() => updateData("antigravityExperience", opt)} className={`py-2 px-4 text-left rounded-xl text-sm font-semibold border transition-all ${formData.antigravityExperience === opt ? "bg-foreground text-background border-foreground" : "bg-white border-border text-foreground/60"}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight text-black mb-4">AI Coding Experience</h3>
              <div className="grid grid-cols-2 gap-2">
                {["Beginner", "Basic", "Intermediate", "Advanced"].map(opt => (
                  <button key={opt} onClick={() => updateData("aiCodingComfort", opt)} className={`py-3 rounded-xl text-sm font-semibold border transition-all ${formData.aiCodingComfort === opt ? "bg-foreground text-background border-foreground" : "bg-white border-border text-foreground/60"}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="flex flex-col gap-6 pt-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-black mb-8">Where do you fit in HAVOC?</h2>
              
              <label className="text-xs font-bold uppercase text-foreground/50 mb-3 block">Primary Role <span className="text-red-500">*</span></label>
              <select value={formData.primaryRole} onChange={e => updateData("primaryRole", e.target.value)} className="w-full bg-white border border-border px-4 py-3 rounded-xl outline-none font-medium mb-4 hover:border-black/20 focus:border-black/40 transition-colors shadow-sm appearance-none">
                <option value="">Select Primary Role</option>
                {["Full-Stack / Backend Lead", "AI/ML Lead", "Frontend & UI/UX Lead", "Data & Research Lead", "Design & Pitch Lead"].map(r => <option key={r} value={r}>{r}</option>)}
              </select>

              <label className="text-xs font-bold uppercase text-foreground/50 mb-3 block">Secondary Role (Optional)</label>
              <select value={formData.secondaryRole} onChange={e => updateData("secondaryRole", e.target.value)} className="w-full bg-white border border-border px-4 py-3 rounded-xl outline-none font-medium mb-6 hover:border-black/20 focus:border-black/40 transition-colors shadow-sm appearance-none">
                <option value="">Select Secondary Role</option>
                {["Full-Stack / Backend Lead", "AI/ML Lead", "Frontend & UI/UX Lead", "Data & Research Lead", "Design & Pitch Lead"].map(r => <option key={r} value={r}>{r}</option>)}
              </select>

              <h3 className="text-xl font-black tracking-tight text-black mb-4 mt-8">What type of work do you enjoy most?</h3>
              <div className="flex flex-wrap gap-2">
                {["Building", "Designing", "Researching", "Brainstorming", "Presenting", "Pitching", "Managing", "Experimenting"].map(opt => (
                  <button key={opt} onClick={() => toggleArray("workInterests", opt)} className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${formData.workInterests.includes(opt) ? "bg-foreground text-background border-foreground" : "bg-white border-border text-foreground/60"}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="flex flex-col gap-8 pt-4">
            <div>
              <h3 className="text-xl font-black tracking-tight text-black mb-4">Are you comfortable working under hackathon deadlines? <span className="text-red-500 text-lg">*</span></h3>
              <div className="grid grid-cols-3 gap-2">
                {["Yes", "Somewhat", "No"].map(opt => (
                  <button key={opt} onClick={() => updateData("deadlineComfort", opt)} className={`py-3 rounded-xl text-sm font-semibold border transition-all ${formData.deadlineComfort === opt ? "bg-foreground text-background border-foreground" : "bg-white border-border text-foreground/60"}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight text-black mb-4">How much time can you contribute? <span className="text-red-500 text-lg">*</span></h3>
              <div className="grid grid-cols-2 gap-2">
                {["Low", "Moderate", "High", "All-in during hackathons"].map(opt => (
                  <button key={opt} onClick={() => updateData("availability", opt)} className={`py-3 rounded-xl text-sm font-semibold border transition-all ${formData.availability === opt ? "bg-foreground text-background border-foreground" : "bg-white border-border text-foreground/60"}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] py-20 px-6">
      <div className="max-w-2xl mx-auto">
        
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Join HAVOC</h1>
          <p className="text-foreground/50 font-medium">Tell us about yourself.</p>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-10">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className={`h-1 flex-1 rounded-full ${step >= i ? "bg-foreground" : "bg-border"}`} />
          ))}
        </div>

        {/* Form Container */}
        <div className="bg-white border border-black/10 rounded-[2rem] p-8 sm:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.04)] min-h-[400px] flex flex-col relative overflow-hidden">
          {/* Subtle gradient background for premium feel */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/[0.01] to-transparent pointer-events-none" />
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-10 pt-6 border-t border-border">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className="px-6 py-3 font-semibold text-foreground/50 hover:text-foreground disabled:opacity-30 transition-colors"
            >
              Back
            </button>
            
            {step < 6 ? (
              <button
                onClick={nextStep}
                className="px-8 py-3 bg-[#0a0a0a] text-white rounded-full font-bold hover:bg-[#1a1a1a] transition-colors"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-8 py-3 bg-[#0a0a0a] text-white rounded-full font-bold hover:bg-[#1a1a1a] transition-colors disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

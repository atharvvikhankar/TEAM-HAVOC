"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function DashboardPage() {
  const { user, havocUser, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (!loading && havocUser) {
      if (havocUser.isAdmin) router.push("/admin/applications");
      else if (havocUser.status === "pending") router.push("/pending");
      else if (havocUser.status === "rejected") router.push("/");
    }
  }, [user, havocUser, loading, router]);

  if (loading || !user || !havocUser || havocUser.status !== "approved") {
    return <div className="min-h-screen bg-[#FAFAFA]" />;
  }

  const animProps = {
    initial: { opacity: 0, y: 30, rotateX: 10 },
    animate: { opacity: 1, y: 0, rotateX: 0 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }
  };

  return (
    <div className="relative min-h-screen bg-[#FAFAFA] pt-24 px-6 pb-12 overflow-hidden perspective-[1000px]">
      
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[600px] bg-gradient-to-b from-black/[0.03] to-transparent rounded-[100%] blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto z-10">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
          <motion.div {...animProps} transition={{ ...animProps.transition, delay: 0 }}>
            <h1 className="text-4xl md:text-[3.5rem] leading-none font-black uppercase tracking-[-0.04em] mb-3 text-black">
              Welcome to HAVOC
            </h1>
            <p className="text-black/50 font-semibold text-lg tracking-tight">
              Good to see you, <span className="text-black">{user.displayName?.split(" ")[0] || "Builder"}</span>.
            </p>
          </motion.div>
          
          <motion.button
            {...animProps} transition={{ ...animProps.transition, delay: 0.1 }}
            onClick={logout}
            className="group px-6 py-2.5 bg-white border border-black/5 rounded-full text-xs font-bold uppercase tracking-wider text-black/60 hover:text-black hover:border-black/20 hover:shadow-sm transition-all duration-300"
          >
            Sign Out
          </motion.button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Profile Card */}
          <motion.div 
            {...animProps} transition={{ ...animProps.transition, delay: 0.1 }}
            className="group relative bg-white rounded-[2rem] p-8 col-span-1 md:col-span-1 border border-black/[0.04] hover:border-black/10 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-500 overflow-hidden"
          >
            {/* Inner background gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-black/30 mb-8">My Profile</p>
              
              <div className="flex flex-col gap-5 mb-8">
                <img src={user.photoURL || ""} alt={user.displayName || ""} className="w-20 h-20 rounded-full bg-zinc-100 shadow-sm border border-black/5" />
                <div>
                  <h2 className="font-extrabold text-xl tracking-tight text-black leading-tight mb-1">{user.displayName}</h2>
                  <p className="text-[11px] font-bold text-black/40 uppercase tracking-widest">{havocUser.primaryRole || "Member"}</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center py-2.5 border-b border-black/[0.04] group-hover:border-black/10 transition-colors">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-black/40">Year</span>
                  <span className="text-sm font-semibold text-black">{havocUser.year || "-"}</span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-black/[0.04] group-hover:border-black/10 transition-colors">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-black/40">College</span>
                  <span className="text-sm font-semibold text-black text-right max-w-[150px] truncate" title={havocUser.college}>{havocUser.college || "-"}</span>
                </div>
                
                <div className="pt-4">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-black/40 block mb-3">Skills</span>
                  <div className="flex flex-wrap gap-2">
                    {((havocUser as any).skills || []).slice(0, 4).map((s: string) => (
                      <span key={s} className="px-2.5 py-1 bg-black/5 text-black/70 rounded-md text-[10px] font-bold tracking-wider uppercase border border-black/5 group-hover:bg-black/[0.08] transition-colors">{s}</span>
                    ))}
                    {((havocUser as any).skills?.length || 0) > 4 && <span className="px-2.5 py-1 bg-black/5 text-black/70 rounded-md text-[10px] font-bold tracking-wider uppercase border border-black/5 group-hover:bg-black/[0.08] transition-colors">+{Math.max(0, ((havocUser as any).skills?.length || 0) - 4)}</span>}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            
            {/* Chat Card (The War Room) */}
            <motion.div 
              {...animProps} transition={{ ...animProps.transition, delay: 0.2 }}
              className={`group relative rounded-[2rem] p-8 flex flex-col justify-between border hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] transition-all duration-500 overflow-hidden ${
                havocUser.chatAccess 
                  ? 'bg-gradient-to-br from-[#18181b] to-black border-black text-white' 
                  : 'bg-white border-black/[0.04]'
              }`}
            >
              {havocUser.chatAccess && (
                <>
                  {/* Subtle noise/texture overlay for the dark card */}
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05] mix-blend-overlay group-hover:opacity-10 transition-opacity duration-500" />
                  {/* Inner glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </>
              )}

              <div className="relative z-10">
                <p className={`text-[10px] font-bold tracking-[0.25em] uppercase mb-6 ${havocUser.chatAccess ? 'text-white/30' : 'text-black/30'}`}>Group Chat</p>
                <h3 className={`text-3xl font-black uppercase tracking-[-0.03em] mb-3 ${havocUser.chatAccess ? 'text-white' : 'text-black'}`}>The War Room</h3>
                <p className={`text-sm font-medium leading-relaxed max-w-[250px] ${havocUser.chatAccess ? 'text-white/50' : 'text-black/50'}`}>
                  Connect with other builders, form teams, and share ideas.
                </p>
              </div>
              
              <div className="mt-12 relative z-10">
                {havocUser.chatAccess ? (
                  <button onClick={() => router.push("/chat")} className="w-full py-4 bg-white text-black rounded-2xl text-[13px] font-bold uppercase tracking-wider hover:bg-zinc-200 transition-colors shadow-[0_4px_14px_0_rgba(255,255,255,0.1)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.2)]">
                    Enter HAVOC Chat
                  </button>
                ) : (
                  <button disabled className="w-full py-4 bg-zinc-100 text-black/30 rounded-2xl text-[13px] font-bold uppercase tracking-wider cursor-not-allowed border border-black/5">
                    Chat Access Pending
                  </button>
                )}
              </div>
            </motion.div>

            {/* Members Card (Directory) */}
            <motion.div 
              {...animProps} transition={{ ...animProps.transition, delay: 0.3 }}
              className="group relative bg-white rounded-[2rem] p-8 flex flex-col justify-between border border-black/[0.04] hover:border-black/10 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-zinc-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-black/30 mb-6">HAVOC Members</p>
                <h3 className="text-3xl font-black uppercase tracking-[-0.03em] mb-3 text-black">Directory</h3>
                <p className="text-sm font-medium leading-relaxed text-black/50 max-w-[250px]">
                  Find teammates, see who's building what, and connect.
                </p>
              </div>

              <div className="mt-12 relative z-10">
                <button onClick={() => router.push("/members")} className="group/btn flex items-center justify-center w-full py-4 bg-transparent border border-black/10 rounded-2xl text-[13px] font-bold uppercase tracking-wider text-black hover:bg-black/5 hover:border-black/20 transition-all duration-300">
                  View Members
                  <svg className="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}

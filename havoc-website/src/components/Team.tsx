"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const team = [
  { name: "Team Member 01", role: "Full-Stack / Backend Lead", skills: ["Next.js", "Node.js", "Architecture"] },
  { name: "Team Member 02", role: "AI/ML Lead", skills: ["Python", "LLMs", "Agents"] },
  { name: "Team Member 03", role: "Frontend & UI/UX Lead", skills: ["React", "Figma", "Animations"] },
  { name: "Team Member 04", role: "Data & Research Lead", skills: ["Analytics", "Research", "Strategy"] },
  { name: "Team Member 05", role: "Design & Pitch Lead", skills: ["Storytelling", "Pitch Deck", "Branding"] },
];

const GithubIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
);
const LinkedinIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
  </svg>
);

export default function Team() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="team" className="relative bg-[#FAFAFA] border-t border-black/5 overflow-hidden w-full">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-gradient-to-b from-black/[0.02] to-transparent rounded-[100%] blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32" ref={ref}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <p className="text-[11px] font-bold tracking-[0.35em] uppercase text-black/40 mb-3">Meet the Squad</p>
            <h2 className="text-4xl md:text-6xl font-black tracking-[-0.04em] uppercase text-black">
              The People<br />
              <span className="text-black/30">Behind HAVOC</span>
            </h2>
          </div>
          <div className="hidden md:block w-32 h-[1px] bg-black/10 mb-4" />
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 perspective-[1000px]">
          {team.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, rotateX: 10 }}
              animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex flex-col will-change-transform"
            >
              {/* Outer Glow Effect on Hover */}
              <div className="absolute -inset-0.5 bg-gradient-to-b from-black/5 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              {/* Photo placeholder Container */}
              <div className="relative w-full aspect-[4/5] bg-gradient-to-br from-zinc-100 to-zinc-50 rounded-2xl overflow-hidden mb-6 border border-black/[0.04] group-hover:border-black/10 group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-500">
                
                {/* Image / Avatar (Scales on hover) */}
                <div className="absolute inset-0 flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat opacity-[0.03] group-hover:scale-105 group-hover:opacity-[0.06] transition-all duration-700 ease-out will-change-transform" />
                
                <div className="absolute inset-0 flex items-center justify-center transform group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-700 ease-[0.16,1,0.3,1]">
                  <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center border border-black/5">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                </div>

                {/* Refined Glass Overlay gradient */}
                <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-zinc-200/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>

              {/* Info Details */}
              <div className="flex flex-col relative z-10 px-1">
                <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-black/40 mb-1.5 transition-colors duration-300 group-hover:text-black/60">
                  {member.role}
                </p>
                <h3 className="font-extrabold text-lg mb-4 text-black tracking-tight">{member.name}</h3>

                {/* Polished Skill Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {member.skills.map((skill) => (
                    <span 
                      key={skill} 
                      className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase bg-black/5 text-black/60 rounded-md border border-black/5 group-hover:bg-black/[0.07] group-hover:text-black/80 transition-colors duration-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Sophisticated Interactive Social Links */}
                <div className="flex gap-5 mt-auto">
                  <a href="#" className="group/link flex items-center gap-2 text-[11px] font-bold tracking-wide uppercase text-black/30 hover:text-black transition-colors duration-300">
                    <span className="p-1.5 rounded-full bg-transparent group-hover/link:bg-black/5 transition-colors duration-300">
                      <GithubIcon />
                    </span>
                    GitHub
                  </a>
                  <a href="#" className="group/link flex items-center gap-2 text-[11px] font-bold tracking-wide uppercase text-black/30 hover:text-[#0077b5] transition-colors duration-300">
                    <span className="p-1.5 rounded-full bg-transparent group-hover/link:bg-[#0077b5]/10 transition-colors duration-300">
                      <LinkedinIcon />
                    </span>
                    LinkedIn
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      className="relative flex flex-col bg-white overflow-hidden w-full"
      style={{ height: "100svh", minHeight: "500px" }}
    >
      {/* Subtle dot grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #d4d4d8 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          opacity: 0.6,
          maskImage: "radial-gradient(ellipse 85% 85% at 50% 50%, black, transparent)",
          WebkitMaskImage: "radial-gradient(ellipse 85% 85% at 50% 50%, black, transparent)",
        }}
      />

      {/* Content — fills remaining space below 64px nav */}
      <div
        className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 text-center"
        style={{ paddingTop: "64px" }}
      >
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground/35 mb-6"
        >
          Student Hackathon Team
        </motion.p>

        {/* Headline — viewport-height aware font scale */}
        <div className="w-full mb-6">
          {["BUILD.", "BREAK.", "REBUILD."].map((word, i) => (
            <div key={i} className="overflow-hidden leading-none">
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                transition={{
                  delay: 0.25 + i * 0.12,
                  duration: 0.9,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <span
                  className={`block font-black tracking-[-0.045em] uppercase ${
                    i === 1 ? "text-foreground/12" : "text-foreground"
                  }`}
                  style={{
                    fontSize: "clamp(2.6rem, min(14vw, 12vh), 9rem)",
                    lineHeight: 0.92,
                  }}
                >
                  {word}
                </span>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Divider line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-12 h-px bg-foreground/20 mb-6 origin-left"
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7, ease: "easeOut" }}
          className="text-sm md:text-base text-foreground/45 font-medium max-w-md mx-auto mb-8 leading-relaxed"
        >
          A student team building bold ideas and turning problems into working products through technology.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.82, duration: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm mx-auto"
        >
          <a
            href="/login"
            className="w-full sm:w-auto px-6 py-3 bg-foreground text-background text-sm font-semibold rounded-full flex items-center justify-center gap-2 hover:opacity-75 transition-opacity"
          >
            Join HAVOC
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a
            href="#team"
            className="w-full sm:w-auto px-6 py-3 border border-border text-foreground/60 text-sm font-semibold rounded-full flex items-center justify-center hover:border-foreground/40 hover:text-foreground transition-all"
          >
            Meet the Team
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-6 bg-gradient-to-b from-foreground/25 to-transparent"
        />
        <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-foreground/25">Scroll</span>
      </motion.div>
    </section>
  );
}

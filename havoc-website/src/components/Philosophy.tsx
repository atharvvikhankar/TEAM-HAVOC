"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Philosophy() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      id="philosophy"
      ref={ref}
      className="bg-[#0a0a0a] text-white"
      style={{ paddingTop: "100px", paddingBottom: "100px" }}
    >
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/30 mb-8"
        >
          Our Philosophy
        </motion.p>

        {/* Large statement */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="font-black uppercase tracking-[-0.03em] text-white mb-10 leading-tight"
          style={{ fontSize: "clamp(2.4rem, 6vw, 5rem)" }}
        >
          Think Bold.<br />
          Build Fast.<br />
          Break Limits.
        </motion.h2>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={inView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ delay: 0.25, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-10 h-px bg-white/15 mx-auto mb-10 origin-left"
        />

        {/* Body */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
          className="text-base md:text-lg text-white/50 font-medium leading-relaxed max-w-xl mx-auto"
        >
          We believe the best way to learn technology is to build with it. Every hackathon is a chance to experiment, fail fast, learn faster, and ship something real.
        </motion.p>
      </div>
    </section>
  );
}

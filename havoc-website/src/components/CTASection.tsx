"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function CTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="cta" className="bg-white border-t border-border overflow-hidden w-full">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32" ref={ref}>
        <div className="relative overflow-hidden rounded-3xl bg-[#0a0a0a] px-8 md:px-16 py-16 md:py-20">

          {/* Subtle noise texture */}
          <div
            className="absolute inset-0 opacity-[0.025] pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-lg"
            >
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/30 mb-4">
                Get Involved
              </p>
              <h2 className="text-3xl md:text-5xl font-black tracking-[-0.03em] uppercase text-white leading-tight mb-4">
                Ready to create<br />some HAVOC?
              </h2>
              <p className="text-sm text-white/50 font-medium leading-relaxed">
                Follow what we&apos;re building, explore our projects, and see where HAVOC goes next.
              </p>
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
              className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full sm:w-auto lg:min-w-[180px]"
            >
              <a
                href="/login"
                className="px-6 py-3.5 bg-white text-foreground text-sm font-bold rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
              >
                Join HAVOC
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

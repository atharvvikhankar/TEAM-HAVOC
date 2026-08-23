"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  { num: "01", title: "DISCOVER", desc: "Identify a meaningful problem worth solving." },
  { num: "02", title: "DEFINE", desc: "Understand users, constraints, and goals deeply." },
  { num: "03", title: "DESIGN", desc: "Architect the product experience and system." },
  { num: "04", title: "BUILD", desc: "Develop the MVP with speed and precision." },
  { num: "05", title: "TEST", desc: "Expose weaknesses, iterate fast, improve hard." },
  { num: "06", title: "SHIP", desc: "Present a polished, working solution." },
];

export default function HowWeWork() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section id="how-we-work" className="bg-[#f9f9f9] border-t border-border overflow-hidden w-full">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32" ref={ref}>

        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground/35 mb-3">
              Process
            </p>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-sm text-foreground/50 font-medium max-w-xs leading-relaxed"
          >
            Every hackathon is a sprint through this cycle — from raw problem to working product in hours.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="group relative bg-white border border-border rounded-2xl p-8 hover:border-foreground/20 hover:shadow-sm transition-all duration-300"
            >
              {/* Step number */}
              <span className="text-[10px] font-black tracking-[0.2em] text-foreground/25 mb-6 block">
                {step.num}
              </span>
              {/* Content */}
              <h3 className="text-sm font-black tracking-[0.1em] uppercase mb-2 text-foreground">
                {step.title}
              </h3>
              <p className="text-sm text-foreground/50 leading-relaxed font-medium">
                {step.desc}
              </p>
              {/* Accent line on hover */}
              <div className="absolute bottom-0 left-8 right-8 h-px bg-foreground scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 rounded-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

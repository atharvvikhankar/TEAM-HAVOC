"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Simple passive scroll listener — only fires on actual scroll, no jitter
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Check initial position
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const displayLinks = [
    { name: "How We Work", href: "/#how-we-work" },
    { name: "Team", href: "/#team" },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "64px",
        zIndex: 9999,
        border: "none",
        outline: "none",
        transition: "background 0.5s ease, box-shadow 0.5s ease",
        background: mounted && isScrolled ? "rgba(255,255,255,0.88)" : "transparent",
        backdropFilter: mounted && isScrolled ? "blur(24px)" : "none",
        WebkitBackdropFilter: mounted && isScrolled ? "blur(24px)" : "none",
        boxShadow: mounted && isScrolled ? "0 1px 0 rgba(0,0,0,0.05)" : "none",
      }}
    >
      <div
        style={{ height: "64px" }}
        className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between"
      >
        <motion.a
          href="#"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg font-black tracking-[-0.05em] uppercase text-foreground hover:opacity-60 transition-opacity duration-300"
        >
          HAVOC
        </motion.a>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden md:flex items-center gap-8"
        >
          {displayLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-semibold tracking-wide hover:opacity-70 transition-opacity"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/login"
            className="px-5 py-2.5 bg-foreground text-background text-sm font-bold rounded-full hover:opacity-90 transition-opacity"
          >
            Join HAVOC
          </Link>
        </motion.div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-5 flex flex-col gap-1.5">
            <motion.span
              animate={isMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
              className="block h-px bg-foreground origin-center"
            />
            <motion.span
              animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="block h-px bg-foreground"
            />
            <motion.span
              animate={isMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
              className="block h-px bg-foreground origin-center"
            />
          </div>
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.98)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderTop: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <div className="flex flex-col gap-6 p-6 pb-12">
              {displayLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-3xl font-black uppercase tracking-tighter"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="mt-4 px-6 py-4 bg-foreground text-background text-center text-lg font-bold rounded-full"
              >
                Join HAVOC
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

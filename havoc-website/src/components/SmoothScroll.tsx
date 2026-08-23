"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { frame } from "framer-motion";

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      // Apple-like fluid momentum (lerp instead of fixed duration)
      lerp: 0.07,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      // Disable touch syncing to ensure native, lag-free scrolling on mobile devices
      syncTouch: false,
      infinite: false,
    });

    // Sync Lenis with Framer Motion's frame loop — no jitter, perfectly smooth
    function update(data: { timestamp: number }) {
      lenis.raf(data.timestamp);
    }
    frame.update(update, true);

    // Smooth anchor link scrolling
    function handleAnchorClick(e: Event) {
      const anchor = e.currentTarget as HTMLAnchorElement;
      const href = anchor.getAttribute("href");
      if (href && href.startsWith("#") && href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          lenis.scrollTo(target as HTMLElement, {
            offset: -64,
            duration: 1.4,
            easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
          });
        }
      }
    }

    const anchors = document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');
    anchors.forEach((a) => a.addEventListener("click", handleAnchorClick));

    return () => {
      frame.update(update, false);
      anchors.forEach((a) => a.removeEventListener("click", handleAnchorClick));
      lenis.destroy();
    };
  }, []);

  return null;
}

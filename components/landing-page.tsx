"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { Section } from "./section";

const Scene = dynamic(() => import("./3d/scene").then((mod) => mod.Scene), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-gradient-to-br from-white via-white to-[rgb(100,200,255)] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin" />
    </div>
  ),
});
import { ProgressBar } from "./progress-bar";
import { SectionIndicators } from "./section-indicators";
import { Header } from "./header";
import { ContactForm } from "./contact-form";

const sections = [
  {
    id: "hero",
    title: "S.R.C. Labs",
    subtitle: "Where vision meets execution",
    description:
      "We build software that scales, research that matters, and partnerships that last. Let’s turn your boldest ideas into reality.",
    alignment: "left" as const,
  },
  {
    id: "research",
    title: "Research & Intelligence",
    subtitle: "Our Expertise",
    items: [
      "🔍 OSINT Audits – Uncover hidden threats and opportunities",
      "📊 Strategic Consulting – Data‑driven decisions for competitive advantage",
      "🧪 STEM Research & IP – From lab to market, protect and monetize innovation",
    ],
    alignment: "right" as const,
  },
  {
    id: "development",
    title: "Development & DevOps",
    subtitle: "Our Services",
    items: [
      "🌐 Web Development – Modern, fast, conversion‑optimized platforms",
      "⚙️ DevOps & Cloud – Automate, scale, and secure your infrastructure",
      "📈 STEM to Software – Turn complex algorithms into production‑ready solutions",
    ],
    alignment: "left" as const,
  },
  {
    id: "vision",
    title: "Our Vision & Mission",
    subtitle: "Purpose driven",
    description:
      "We exist to democratize access to world‑class software and technology. By breaking monopolies and lowering barriers, we empower businesses across Africa, the Middle East, Southeast Asia, and South America to compete globally.",
    alignment: "right" as const,
  },
  {
    id: "contact",
    title: "Ready to accelerate?",
    subtitle: "Contact Us",
    alignment: "center" as const,
    hasForm: true,
  },
];

// Zig‑zag path offsets (X shift per section, in pixels)
// Positive = right, negative = left. Adjust amplitude as desired.
const zigzagAmplitude = 180; // px
const sectionXOffsets = sections.map((_, i) =>
  i % 2 === 0 ? zigzagAmplitude : -zigzagAmplitude
);
// For the last section (contact) we can centre it: X offset 0
sectionXOffsets[sectionXOffsets.length - 1] = 0;

// Vertical offset per section (one viewport height)
// Since sections are 100vh tall, we shift Y by 100vh per step.
const getSectionYOffset = (index: number) => -index * window.innerHeight;

export function LandingPage() {
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const currentProgress = useRef(0);
  const animationFrame = useRef<number>();

  // Smooth animation of transform (shorter duration for snappier feel)
  const animateTransform = useCallback((targetProgress: number) => {
    if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    const startProgress = currentProgress.current;
    const duration = 400; // reduced from 600ms
    const startTime = performance.now();
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const step = (now: number) => {
      const elapsed = now - startTime;
      let t = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(t);
      const newProgress = startProgress + (targetProgress - startProgress) * eased;
      currentProgress.current = newProgress;
      applyTransformFromProgress(newProgress);
      if (t < 1) {
        animationFrame.current = requestAnimationFrame(step);
      } else {
        currentProgress.current = targetProgress;
        applyTransformFromProgress(targetProgress);
        animationFrame.current = undefined;
        isScrollingRef.current = false;
      }
    };
    animationFrame.current = requestAnimationFrame(step);
  }, []);

  const applyTransformFromProgress = useCallback((progress: number) => {
    if (!scrollContainerRef.current) return;
    // Find the two sections we are between
    const indexLow = Math.floor(progress);
    const indexHigh = Math.min(indexLow + 1, sections.length - 1);
    const t = progress - indexLow;

    // Interpolate X offset
    const xStart = sectionXOffsets[indexLow];
    const xEnd = sectionXOffsets[indexHigh];
    const x = xStart + (xEnd - xStart) * t;

    // Interpolate Y offset (viewport height)
    const yStart = getSectionYOffset(indexLow);
    const yEnd = getSectionYOffset(indexHigh);
    const y = yStart + (yEnd - yStart) * t;

    scrollContainerRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    setScrollProgress(progress * (100 / (sections.length - 1)));
    const newActive = Math.round(progress);
    setActiveSection(Math.min(newActive, sections.length - 1));
  }, []);

  const scrollToSection = useCallback(
    (index: number) => {
      if (isScrollingRef.current) return;
      isScrollingRef.current = true;
      animateTransform(index);
    },
    [animateTransform]
  );

  // Handle wheel / trackpad (increased sensitivity)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isScrollingRef.current) return;
      // Increased delta from 0.05 to 0.25
      const delta = e.deltaY > 0 ? 0.7 : -0.7;
      let newProgress = currentProgress.current + delta;
      newProgress = Math.min(Math.max(0, newProgress), sections.length - 1);
      if (newProgress !== currentProgress.current) {
        isScrollingRef.current = true;
        animateTransform(newProgress);
      }
    };
    // Handle touch move with dynamic step based on swipe distance
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (isScrollingRef.current) return;
      const deltaY = touchStartY - e.touches[0].clientY;
      if (Math.abs(deltaY) > 10) {
        // Map swipe distance to progress change: 100px ≈ 0.25 progress
        const step = deltaY / 400;
        let newProgress = currentProgress.current + step;
        newProgress = Math.min(Math.max(0, newProgress), sections.length - 1);
        if (newProgress !== currentProgress.current) {
          isScrollingRef.current = true;
          animateTransform(newProgress);
        }
        touchStartY = e.touches[0].clientY;
      }
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [animateTransform]);

  // Initial positioning and resize handler
  useEffect(() => {
    const handleResize = () => {
      // Recalculate Y offsets based on new viewport height
      const getY = (index: number) => -index * window.innerHeight;
      const currentProgressValue = currentProgress.current;
      const indexLow = Math.floor(currentProgressValue);
      const indexHigh = Math.min(indexLow + 1, sections.length - 1);
      const t = currentProgressValue - indexLow;
      const yStart = getY(indexLow);
      const yEnd = getY(indexHigh);
      const y = yStart + (yEnd - yStart) * t;
      if (scrollContainerRef.current) {
        const currentX = sectionXOffsets[indexLow] + (sectionXOffsets[indexHigh] - sectionXOffsets[indexLow]) * t;
        scrollContainerRef.current.style.transform = `translate3d(${currentX}px, ${y}px, 0)`;
      }
    };
    window.addEventListener("resize", handleResize);
    // Disable native scrolling on body
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    // Initial transform
    applyTransformFromProgress(0);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, [applyTransformFromProgress]);

  return (
    <div ref={containerRef} className="relative min-h-screen">
      {/* Background animations (unchanged) */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-[rgb(100,200,255)] animate-gradient-shift" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tl from-[rgb(100,200,255)]/60 via-transparent to-white/80 animate-gradient-shift-reverse" />
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-white/40 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-1/4 -right-20 w-[450px] h-[450px] bg-[rgb(100,200,255)]/50 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[rgb(100,200,255)]/30 rounded-full blur-3xl animate-blob animation-delay-4000" />
        <div className="absolute top-3/4 left-1/4 w-96 h-96 bg-white/50 rounded-full blur-3xl animate-blob animation-delay-3000" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-[rgb(100,200,255)]/40 rounded-full blur-3xl animate-blob animation-delay-1000" />
      </div>

      <ProgressBar progress={scrollProgress} />
      <Header />
      <Scene
        activeSection={activeSection}
        position={
          sections[activeSection]?.alignment === "left"
            ? "right"
            : sections[activeSection]?.alignment === "right"
            ? "left"
            : "center"
        }
      />
      <SectionIndicators
        totalSections={sections.length}
        activeSection={activeSection}
        onSectionClick={scrollToSection}
      />

      {/* Diagonal scroll container */}
      <div
        ref={scrollContainerRef}
        className="fixed top-0 left-0 w-full h-full will-change-transform"
        style={{ transform: "translate3d(0,0,0)" }}
      >
        <main className="relative z-10">
          {sections.map((section, index) => (
            <Section
              key={section.id}
              id={section.id}
              title={section.title}
              subtitle={section.subtitle}
              description={section.description}
              items={section.items}
              index={index}
              isActive={activeSection === index}
              alignment={section.alignment}
            >
              {section.hasForm && (
                <>
                  <ContactForm />
                  <div className="mt-8 text-center">
                    <p className="text-neutral-600 text-sm">Or contact us directly:</p>
                    <a
                      href="mailto:Lesedi@aucegypt.edu"
                      className="text-black font-medium underline hover:opacity-70 transition"
                    >
                      Lesedi@aucegypt.edu
                    </a>
                  </div>
                </>
              )}
            </Section>
          ))}
        </main>

        <footer className="relative z-10 py-8 px-8 border-t border-black/10 bg-white/40 backdrop-blur-md">
          <div className="flex items-center justify-between text-neutral-500 text-sm">
            <span>2026 S.R.C. Labs. All rights reserved.</span>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-black transition-colors">
                Twitter
              </a>
              <a href="#" className="hover:text-black transition-colors">
                Instagram
              </a>
              <a href="#" className="hover:text-black transition-colors">
                LinkedIn
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
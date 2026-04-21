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

export function LandingPage() {
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  const scrollToSection = useCallback((index: number) => {
    const section = document.getElementById(sections[index].id);
    if (section) {
      isScrollingRef.current = true;
      section.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 1000);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || isScrollingRef.current) return;

      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);

      const sectionHeight = window.innerHeight;
      const currentSection = Math.round(scrollTop / sectionHeight);
      setActiveSection(Math.min(currentSection, sections.length - 1));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen">
      {/* Animated shifting gradient background - white to light blue */}
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
        position={sections[activeSection]?.alignment === "left" ? "right" : sections[activeSection]?.alignment === "right" ? "left" : "center"} 
      />
      <SectionIndicators
        totalSections={sections.length}
        activeSection={activeSection}
        onSectionClick={scrollToSection}
      />

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
  );
}
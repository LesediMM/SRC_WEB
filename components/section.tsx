"use client"

import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface SectionProps {
  id: string
  title: string
  subtitle: string
  description?: string
  items?: string[]
  index: number
  isActive: boolean
  alignment?: "left" | "right" | "center"
  children?: ReactNode
}

export function Section({
  id,
  title,
  subtitle,
  description,
  items,
  isActive,
  alignment = "left",
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative min-h-screen flex items-center",
        alignment === "left" && "justify-start",
        alignment === "right" && "justify-end",
        alignment === "center" && "justify-center"
      )}
    >
      <div
        className={cn(
          "relative z-10 w-full max-w-2xl lg:max-w-3xl px-6 md:px-12 transition-all duration-700",
          alignment === "right" && "text-right",
          alignment === "center" && "text-center mx-auto",
          isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
      >
        <div className="bg-white/15 backdrop-blur-3xl border border-white/25 rounded-3xl p-10 md:p-14 lg:p-16 shadow-xl shadow-black/5">
          <span className="text-sm md:text-base font-mono uppercase tracking-[0.3em] text-neutral-500 mb-6 block">
            {subtitle}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-light tracking-tight text-black mb-8 leading-[1.1]">
            {title}
          </h2>
          {description && (
            <p className="text-lg md:text-xl lg:text-2xl text-neutral-600 leading-relaxed">
              {description}
            </p>
          )}
          {items && items.length > 0 && (
            <ul className={cn(
              "space-y-4 text-lg md:text-xl lg:text-2xl text-neutral-600",
              alignment === "right" && "text-right",
              alignment === "center" && "text-center"
            )}>
              {items.map((item, idx) => (
                <li key={idx} className="leading-relaxed">{item}</li>
              ))}
            </ul>
          )}
          {children}
        </div>
      </div>
    </section>
  )
}

"use client"

import { cn } from "@/lib/utils"

interface SectionIndicatorsProps {
  totalSections: number
  activeSection: number
  onSectionClick: (index: number) => void
}

export function SectionIndicators({
  totalSections,
  activeSection,
  onSectionClick,
}: SectionIndicatorsProps) {
  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
      {Array.from({ length: totalSections }).map((_, index) => (
        <button
          key={index}
          onClick={() => onSectionClick(index)}
          className={cn(
            "w-2 h-2 rounded-full transition-all duration-300 hover:scale-150",
            index === activeSection
              ? "bg-black scale-125"
              : "bg-neutral-300 hover:bg-neutral-500"
          )}
          aria-label={`Go to section ${index + 1}`}
        />
      ))}
    </div>
  )
}

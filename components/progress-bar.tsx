"use client"

interface ProgressBarProps {
  progress: number
}

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-neutral-200">
      <div
        className="h-full bg-black transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

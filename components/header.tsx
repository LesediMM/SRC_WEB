"use client"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 bg-white/40 backdrop-blur-md border-b border-black/5">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 border border-black/30 rotate-45 flex items-center justify-center">
          <div className="w-3 h-3 bg-black rotate-0" />
        </div>
        <span className="text-black font-light tracking-widest text-sm ml-2">
          S.R.C. LABS
        </span>
      </div>
      <nav className="hidden md:flex items-center gap-8">
        <a
          href="#studio"
          className="text-neutral-500 hover:text-black transition-colors text-sm tracking-wide"
        >
          Studio
        </a>
        <a
          href="#work"
          className="text-neutral-500 hover:text-black transition-colors text-sm tracking-wide"
        >
          Work
        </a>
        <a
          href="#about"
          className="text-neutral-500 hover:text-black transition-colors text-sm tracking-wide"
        >
          About
        </a>
        <a
          href="#contact"
          className="text-black border border-black/30 px-4 py-2 text-sm tracking-wide hover:bg-black hover:text-white transition-all"
        >
          Contact
        </a>
      </nav>
    </header>
  )
}

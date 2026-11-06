import { useState, useEffect, useCallback } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface HeaderProps {
  onOpenContact: () => void;
  activeSection?: string;
}

export default function Header({ onOpenContact, activeSection = 'hero' }: HeaderProps) {
  const [isHeroEnded, setIsHeroEnded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const updateScroll = useCallback(() => {
    const y = window.scrollY;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const p = h > 0 ? Math.min(Math.max(y / h, 0), 1) : 0;
    setScrollProgress(p);

    // Hero height detection: React only once the user finishes the hero scroll
    const heroEl = document.getElementById('hero');
    const heroThreshold = heroEl ? heroEl.offsetHeight * 0.85 : window.innerHeight * 0.85;

    // The header reacts and appears ONLY once we reach the end of the hero scroll
    setIsHeroEnded(y >= heroThreshold);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll();
    return () => window.removeEventListener('scroll', updateScroll);
  }, [updateScroll]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setMobileMenuOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { id: 'hero', label: 'Vision', href: '#hero' },
    { id: 'expertise', label: 'Expertises', href: '#expertise' },
    { id: 'transformations', label: 'Transformations', href: '#transformations' },
    { id: 'methodologie', label: 'Méthodologie', href: '#methodologie' },
    { id: 'contact', label: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-out ${
        isHeroEnded
          ? 'translate-y-0 opacity-100 pointer-events-auto bg-[#121312]/95 backdrop-blur-xl py-3.5 border-b border-[#EAE6DD]/10 shadow-[0_10px_35px_rgba(0,0,0,0.6)]'
          : '-translate-y-full opacity-0 pointer-events-none'
      }`}
      aria-label="Navigation principale"
    >
      {/* Discreet Bottom Progress Hairline */}
      <div
        className="absolute bottom-0 left-0 h-[1.5px] bg-gradient-to-r from-[#92795E] via-[#B49B7E] to-[#92795E] origin-left transition-transform duration-75 ease-linear pointer-events-none"
        style={{ transform: `scaleX(${scrollProgress})`, width: '100%' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Brand Wordmark (Single Text Element) */}
        <a
          href="#hero"
          className="group flex items-center gap-2.5 focus:outline-none focus:ring-1 focus:ring-[#92795E] rounded-xs select-none shrink-0"
        >
          <span className="font-serif text-xl sm:text-2xl md:text-[28px] tracking-[0.22em] sm:tracking-[0.28em] text-[#EAE6DD] font-light transition-colors group-hover:text-[#B49B7E]">
            AUREN
          </span>
        </a>

        {/* Zone 2: Navigation Links */}
        <nav
          className="hidden lg:flex items-center gap-8 xl:gap-10 text-xs uppercase tracking-[0.2em] font-medium"
          aria-label="Navigation principale"
        >
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors duration-300 focus:outline-none focus:ring-1 focus:ring-[#92795E] rounded-xs ${
                  isActive ? 'text-[#EAE6DD]' : 'text-[#BDB3A3]/80 hover:text-[#EAE6DD]'
                }`}
              >
                <span>{link.label}</span>
                <span
                  className={`absolute -bottom-1 left-0 h-[1px] bg-[#B49B7E] transition-all duration-300 ${
                    isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action (Étude de projet) */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Hidden on the narrowest phones: the same CTA is available inside the mobile menu */}
          <button
            onClick={onOpenContact}
            className="group hidden sm:inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-xs uppercase tracking-[0.2em] font-medium text-[#151615] bg-[#EAE6DD] hover:bg-[#B49B7E] hover:text-[#151615] transition-all duration-300 shadow-md focus:outline-none focus:ring-1 focus:ring-[#92795E] rounded-xs cursor-pointer whitespace-nowrap"
          >
            <span>Étude de projet</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#EAE6DD] hover:text-[#B49B7E] transition-colors focus:outline-none focus:ring-1 focus:ring-[#92795E] rounded-xs border border-[#EAE6DD]/15 bg-[#1C1E1C]/80 cursor-pointer"
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Fullscreen Mobile Architectural Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-[#121312]/98 backdrop-blur-3xl flex flex-col justify-between p-7 sm:p-10 animate-fadeIn">
          {/* Mobile Header Bar */}
          <div className="flex items-center justify-between border-b border-[#EAE6DD]/10 pb-5">
            <span className="font-serif text-2xl tracking-[0.28em] text-[#EAE6DD] font-light">
              AUREN
            </span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 text-[#EAE6DD] hover:text-[#B49B7E] border border-[#EAE6DD]/20 rounded-full cursor-pointer"
              aria-label="Fermer le menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Nav Links */}
          <nav className="flex flex-col gap-6 my-auto" aria-label="Navigation mobile">
            {navLinks.map((link, idx) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-2xl font-serif tracking-wider transition-colors flex items-center justify-between ${
                    isActive ? 'text-[#EAE6DD] font-medium' : 'text-[#BDB3A3]/70 hover:text-[#EAE6DD]'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[#B49B7E]">0{idx + 1}</span>
                    <span>{link.label}</span>
                  </span>
                  <span className="text-xs font-mono text-[#B49B7E]">↗</span>
                </a>
              );
            })}
          </nav>

          {/* Mobile CTA */}
          <div className="pt-6 border-t border-[#EAE6DD]/10 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              className="w-full py-4 text-xs uppercase tracking-[0.2em] font-semibold text-[#151615] bg-[#EAE6DD] hover:bg-[#B49B7E] transition-colors rounded-xs shadow-lg cursor-pointer"
            >
              Étude de projet
            </button>
            <p className="text-[10px] font-mono text-center text-[#BDB3A3]/60 uppercase tracking-widest">
              Atelier AUREN • Haute Architecture
            </p>
          </div>
        </div>
      )}
    </header>
  );
}

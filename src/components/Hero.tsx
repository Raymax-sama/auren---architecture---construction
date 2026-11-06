import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { MAS_FRAMES_DIRECTORY, TOTAL_MAS_FRAMES } from '../utils/frameSequence';
import { useScrollSequence } from '../utils/scrollSequence';

interface HeroProps {
  onOpenContact: () => void;
}

const HERO_POSTER_SRC = '/images/hero-poster-start.jpg';

export default function Hero({ onOpenContact }: HeroProps) {
  const { trackRef, canvasRef, progress, frameIndex } = useScrollSequence({
    totalFrames: TOTAL_MAS_FRAMES,
    directory: MAS_FRAMES_DIRECTORY,
    fit: 'cover',
  });

  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const monoProgress = isReducedMotion ? 1 : progress;

  return (
    <div
      ref={trackRef}
      id="hero"
      className={`relative w-full bg-[#0F100F] select-none ${
        isReducedMotion ? 'h-[100svh]' : 'h-[230vh]'
      }`}
      aria-label="Hero cinématique AUREN"
    >
      {/* Sticky Fullscreen Viewport pinned across the scroll duration */}
      <div className="sticky top-0 w-full h-[100svh] overflow-hidden flex flex-col justify-between">

        {/* Poster underlay — stays visible until the first frame is decoded */}
        <img
          src={HERO_POSTER_SRC}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* Scroll-scrubbed chronophotographic sequence */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block pointer-events-none"
          aria-hidden="true"
        />

        {/* Cinematic Architectural Contrast Gradients */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#0F100F] via-black/30 to-black/45 pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(15,16,15,0.65)_100%)] pointer-events-none"
          aria-hidden="true"
        />

        {/* Architectural Subtle Grid Overlay */}
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#EAE6DD05_1px,transparent_1px),linear-gradient(to_bottom,#EAE6DD05_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-30 pointer-events-none"
          aria-hidden="true"
        />

        {/* Top Floating Brand Wordmark */}
        <div className="relative z-20 max-w-7xl mx-auto w-full px-6 md:px-12 pt-8 sm:pt-10 [@media(max-height:560px)]:pt-4 flex items-center justify-between gap-4">
          <span className="font-serif text-2xl sm:text-3xl tracking-[0.3em] text-[#EAE6DD] font-light">
            AUREN
          </span>
          <div className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.25em] text-[#B49B7E] bg-[#121312]/60 backdrop-blur-md px-3 py-1.5 border border-[#EAE6DD]/15 rounded-xs whitespace-nowrap">
            Haute Architecture
          </div>
        </div>

        {/* Central Content — Monumental Typography fading smoothly as scroll progresses */}
        <div
          className="relative z-20 max-w-7xl mx-auto w-full px-6 md:px-12 my-auto flex flex-col items-start justify-center transition-transform duration-100 ease-out"
          style={{
            opacity: isReducedMotion ? 1 : Math.max(0, 1 - progress * 2.2),
            transform: isReducedMotion ? 'none' : `translateY(-${progress * 50}px)`,
            pointerEvents: progress > 0.4 ? 'none' : 'auto',
          }}
        >
          <div className="max-w-2xl space-y-5 [@media(max-height:560px)]:space-y-2">
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl [@media(max-height:560px)]:text-3xl text-[#EAE6DD] font-light tracking-tight leading-[1.02] drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]">
              De la vision <br />
              <span className="italic font-normal text-[#C8BCAB]">à la réalité.</span>
            </h1>

            <p className="text-sm sm:text-base [@media(max-height:560px)]:text-xs text-[#EAE6DD]/90 font-light tracking-wide max-w-md drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
              L’art de magnifier l’existant. Rénovation d’exception et extensions contemporaines d’avant-garde.
            </p>

            {/* Minimalist Commercial Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={onOpenContact}
                className="px-6 sm:px-8 py-3.5 [@media(max-height:560px)]:py-2.5 bg-[#EAE6DD] text-[#0F100F] font-semibold text-xs uppercase tracking-[0.2em] rounded-xs hover:bg-[#B49B7E] transition-all flex items-center gap-2 cursor-pointer shadow-2xl"
              >
                <span>Étude de projet</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <a
                href="#expertise"
                className="px-5 sm:px-7 py-3.5 [@media(max-height:560px)]:py-2.5 bg-[#121312]/60 hover:bg-[#121312]/90 backdrop-blur-md border border-[#EAE6DD]/20 hover:border-[#EAE6DD]/60 text-[#EAE6DD] font-medium text-xs uppercase tracking-[0.2em] rounded-xs transition-all text-center"
              >
                Découvrir
              </a>
            </div>
          </div>
        </div>

        {/* Discreet Commercial Bottom Progress Bar & Scroll Cue */}
        <div className="relative z-20 w-full bg-gradient-to-t from-black/95 via-black/60 to-transparent pt-8 pb-5 [@media(max-height:560px)]:pt-3 [@media(max-height:560px)]:pb-3 px-6 md:px-12">
          <div className="max-w-7xl mx-auto space-y-3.5">

            {/* Hairline Progress Indicator */}
            <div className="w-full h-[2px] bg-white/15 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#92795E] via-[#B49B7E] to-[#EAE6DD] transition-all duration-75"
                style={{ width: `${Math.round(monoProgress * 100)}%` }}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-[11px] font-mono tracking-widest text-[#EAE6DD]/70">
              <span className="uppercase text-[10px] text-[#B49B7E]">
                {progress < 0.45 ? 'Mas Cévenol — État Initial' : 'Extension Contemporaine — Réalisation'}
              </span>

              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase text-[#B49B7E] tabular-nums">
                  SÉQUENCE EN COURS
                </span>
                <span className="hidden sm:flex items-center gap-2 text-[10px] uppercase text-[#EAE6DD]/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B49B7E] animate-pulse" />
                  <span>Défiler pour contempler la métamorphose</span>
                </span>
              </div>
            </div>
            {/* Barre de progression percentuelle masquée pour le client */}
            <div className="hidden">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#B49B7E] tabular-nums">
                {Math.round(monoProgress * 100)} %
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

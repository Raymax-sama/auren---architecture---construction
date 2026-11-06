import { useState, useRef, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Eye, ShieldCheck, Sparkles, Layers } from 'lucide-react';
import { calculateSliderPercentage } from '../utils/slider';
import { TOTAL_HERO_FRAMES, getFrameUrl, drawImageContain } from '../utils/frameSequence';

interface ComparisonItem {
  id: string;
  tabLabel: string;
  title: string;
  subtitle: string;
  discipline: string;
  beforeImg: string;
  afterImg: string;
  beforeCaption: string;
  afterCaption: string;
  metrics: { label: string; value: string }[];
}

const COMPARISONS: ComparisonItem[] = [
  {
    id: 'bastide',
    tabLabel: '01 / Mas Provençal & Pavillon Verre',
    title: 'Mas Cévenol — Héritage Minéral vers Pavillon Contemporain',
    subtitle: 'Restauration lourde de la maçonnerie séculaire et création d’un volume vitré suspendu',
    discipline: 'Rénovation & Extension',
    beforeImg: '/images/transformations/bastide-before.jpg',
    afterImg: '/images/transformations/bastide-after.jpg',
    beforeCaption: 'Mas en pierres calcaires de pays, toiture d’époque et terrain naturel non aménagé',
    afterCaption: 'Extension contemporaine acier & verre toute hauteur, bassin miroir et dallage travertin',
    metrics: [
      { label: 'Surface totale', value: '340 m² habitables' },
      { label: 'Portée verrière', value: '12 m sans appui' },
      { label: 'Bassin miroir', value: '16 x 4 m pierre calcaire' },
      { label: 'Performance', value: 'Isolation thermique biosourcée' },
    ],
  },
  {
    id: 'villa',
    tabLabel: '02 / Villa Horizon — Falaise Maritime',
    title: 'Résidence Horizon — Gros Œuvre vers Villa Crépusculaire',
    subtitle: 'Métamorphose intégrale de la structure banchée aux finitions de prestige',
    discipline: 'Construction Neuve',
    beforeImg: '/images/transformations/villa-before.jpg',
    afterImg: '/images/transformations/villa-after.jpg',
    beforeCaption: 'Gros œuvre en béton banché brut, étais sous porte-à-faux et cuve piscine brute',
    afterCaption: 'Villa contemporaine livrée, baies coulissantes affleurantes, eau turquoise et terrasse paysagère',
    metrics: [
      { label: 'Surface habitable', value: '480 m²' },
      { label: 'Porte-à-faux', value: '6,2 m suspendu' },
      { label: 'Bassin de nage', value: '18 x 4 m miroir' },
      { label: 'Orientation', value: 'Plein Sud / Baie 180°' },
    ],
  },
  {
    id: 'interior',
    tabLabel: '03 / Atrium & Salon Monumental',
    title: 'Salon Monumental — Trémie Brute vers Écrin Chêne & Travertin',
    subtitle: 'Du béton cellulaire nu aux calepinages millimétrés d’ébénisterie d’art',
    discipline: 'Architecture Intérieure',
    beforeImg: '/images/transformations/interior-before.jpg',
    afterImg: '/images/transformations/interior-after.jpg',
    beforeCaption: 'Maçonnerie brute, trémie d’escalier nue et gaines techniques en attente',
    afterCaption: 'Habillage chêne naturel sur-mesure, cheminée linéaire et baie panoramique 6m',
    metrics: [
      { label: 'Hauteur sous plafond', value: '6,4 m sous mezzanine' },
      { label: 'Ébénisterie', value: 'Chêne blanc de France fil droit' },
      { label: 'Cheminée', value: 'Foyer suspendu 2,8 m bioéthanol' },
      { label: 'Sol', value: 'Travertin adouci 120 x 120 cm' },
    ],
  },
];

const VILLA_PHASES = [
  {
    num: '01',
    title: 'Fouilles & Bassin Brut',
    frame: 1,
    desc: 'Terrassement au brise-roche dans le calcaire massif et coulage des radiers hydrofuges.',
  },
  {
    num: '02',
    title: 'Gros Œuvre & Armatures',
    frame: 28,
    desc: 'Béton banché C35/45, ferraillage parasismique Eurocode 8 et portées suspendues de 15m.',
  },
  {
    num: '03',
    title: 'Menuiseries Minimalistes',
    frame: 55,
    desc: 'Pose des baies aluminium affleurantes 6m, étanchéités toiture inversée et isolation biosourcée.',
  },
  {
    num: '04',
    title: 'Livraison Crépusculaire',
    frame: 83,
    desc: 'Mise en eau du bassin miroir, scénographie lumineuse nocturne et finitions d’exception.',
  },
];

export default function ComparisonSlider() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll-Driven Villa Drone Sequence State
  const villaTrackRef = useRef<HTMLDivElement>(null);
  const [villaScrollProgress, setVillaScrollProgress] = useState<number>(0);
  const [villaFrameIdx, setVillaFrameIdx] = useState<number>(0);
  const villaCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const villaImagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_HERO_FRAMES).fill(null));

  const current = COMPARISONS[activeTab];

  // Preload frames for the Villa chronophotographic module
  useEffect(() => {
    let cancelled = false;
    const images: HTMLImageElement[] = new Array(TOTAL_HERO_FRAMES);

    const loadVillaFrame = (idx: number) => {
      const img = new Image();
      img.src = getFrameUrl(idx);
      img.onload = () => {
        if (cancelled) return;
        images[idx - 1] = img;
        villaImagesRef.current = images;
        if (idx === 1) renderVillaFrame(0);
      };
    };

    [1, 28, 55, 83].forEach(loadVillaFrame);
    for (let i = 1; i <= TOTAL_HERO_FRAMES; i++) {
      loadVillaFrame(i);
    }

    return () => {
      cancelled = true;
    };
  }, []);

  const renderVillaFrame = useCallback((frameIdx: number) => {
    const clamped = Math.min(Math.max(frameIdx, 0), TOTAL_HERO_FRAMES - 1);
    let img = villaImagesRef.current[clamped];

    if (!img || !img.complete) {
      for (let offset = 1; offset < TOTAL_HERO_FRAMES; offset++) {
        const prev = villaImagesRef.current[clamped - offset];
        if (prev && prev.complete) {
          img = prev;
          break;
        }
        const next = villaImagesRef.current[clamped + offset];
        if (next && next.complete) {
          img = next;
          break;
        }
      }
    }

    if (!img || !img.complete) return;

    const canvas = villaCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        drawImageContain(ctx, img, canvas.width, canvas.height);
      }
    }
  }, []);

  // Fluid window scroll listener for villa drone sequence
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (villaTrackRef.current) {
            const rect = villaTrackRef.current.getBoundingClientRect();
            const total = rect.height - window.innerHeight;
            if (total > 0) {
              const current = -rect.top;
              const p = Math.min(Math.max(current / total, 0), 1);
              setVillaScrollProgress(p);

              const frameIdx = Math.min(
                Math.floor(p * TOTAL_HERO_FRAMES),
                TOTAL_HERO_FRAMES - 1
              );
              setVillaFrameIdx(frameIdx);
              renderVillaFrame(frameIdx);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [renderVillaFrame]);

  const activePhaseIdx = Math.min(
    Math.floor(villaScrollProgress * 4),
    3
  );

  const jumpToPhase = (phaseIdx: number) => {
    if (!villaTrackRef.current) return;
    const targetProgress = (phaseIdx + 0.1) / 4;
    const rect = villaTrackRef.current.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    const targetScrollY = window.scrollY + rect.top + targetProgress * total;
    window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
  };

  const handleUpdate = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = calculateSliderPercentage(clientX, rect);
    setSliderPos(pct);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    handleUpdate(e.clientX);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      handleUpdate(e.clientX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      } catch {}
    }
  };

  const selectTab = (idx: number) => {
    setActiveTab(idx);
    setSliderPos(50);
  };

  return (
    <section
      id="transformations"
      className="relative z-20 bg-[#151615] text-[#EAE6DD] py-24 sm:py-32 md:py-40 px-6 md:px-12 border-t border-[#EAE6DD]/10 scroll-mt-24 select-none"
      aria-label="Avant et après, nos transformations"
    >
      <div className="max-w-7xl mx-auto space-y-16 sm:space-y-20">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-[#EAE6DD]/15">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs uppercase tracking-[0.3em] text-[#B49B7E] font-semibold block">
              03 / Transformations Remarquables
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#EAE6DD] font-light tracking-tight leading-[1.1]">
              Avant, après. <br />
              <span className="italic font-normal text-[#C8BCAB]">La métamorphose parle d&apos;elle-même.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm md:text-base text-[#BDB3A3] leading-relaxed font-light">
            Chaque prise de vue conserve une perspective millimétrée strictement identique entre le chantier brut et la livraison achevée.
            Glissez le curseur pour apprécier l&apos;exigence du détail.
          </p>
        </div>

        {/* Tab Selection Bar with Clean Badges */}
        <div className="flex flex-wrap items-center gap-3 pb-6 border-b border-[#EAE6DD]/10">
          {COMPARISONS.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => selectTab(idx)}
              className={`px-4 sm:px-5 py-3 text-xs uppercase tracking-[0.18em] transition-all rounded-xs focus:outline-none focus:ring-1 focus:ring-[#92795E] flex items-center gap-2 cursor-pointer ${
                activeTab === idx
                  ? 'bg-[#EAE6DD] text-[#151615] font-semibold shadow-md'
                  : 'text-[#BDB3A3] hover:text-[#EAE6DD] bg-[#1E201E]/80 border border-[#EAE6DD]/15 hover:border-[#EAE6DD]/30'
              }`}
            >
              <span>{item.tabLabel}</span>
            </button>
          ))}
        </div>

        {/* Interactive 50/50 Before/After Comparator Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Visual Comparator (Takes 8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div
              ref={containerRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="relative w-full aspect-video bg-black border border-[#EAE6DD]/20 rounded-xs overflow-hidden cursor-ew-resize shadow-2xl select-none touch-none"
              role="slider"
              aria-label={`Comparateur interactif pour ${current.title}`}
              aria-valuenow={sliderPos}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              {/* AFTER Image (Full background layer) */}
              <img
                src={current.afterImg}
                alt={current.afterCaption}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />

              {/* BEFORE Image (Clipped overlay layer) */}
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
              >
                <img
                  src={current.beforeImg}
                  alt={current.beforeCaption}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              {/* Central Divider Handle Line */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-[#EAE6DD] pointer-events-none shadow-[0_0_12px_rgba(0,0,0,0.8)]"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#151615] border-2 border-[#EAE6DD] text-[#EAE6DD] flex items-center justify-center shadow-2xl backdrop-blur-md">
                  <div className="flex items-center gap-0.5 text-[#B49B7E]">
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Architectural Label Badges */}
              <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#EAE6DD] bg-[#121312]/85 px-3 py-1 backdrop-blur-md border border-[#EAE6DD]/15 rounded-xs shadow">
                  État Initial • Chantier
                </span>
              </div>

              <div className="absolute top-4 right-4 z-10 pointer-events-none">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#B49B7E] bg-[#121312]/85 px-3 py-1 backdrop-blur-md border border-[#B49B7E]/30 rounded-xs shadow font-semibold">
                  Livraison • Achevé
                </span>
              </div>

              {/* Current position watermark */}
              <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
                <span className="text-[9px] font-mono text-[#EAE6DD]/70 bg-black/60 px-2 py-0.5 rounded-xs backdrop-blur-xs">
                  {sliderPos}% dévoilé
                </span>
              </div>
            </div>

            {/* Quick-Jump Helper Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-[#BDB3A3]">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setSliderPos(100)}
                  className="px-3 py-1.5 bg-[#1E201E] hover:bg-[#252825] border border-[#EAE6DD]/15 rounded-xs transition-colors cursor-pointer text-[#EAE6DD]"
                >
                  Chantier (Avant)
                </button>
                <button
                  onClick={() => setSliderPos(50)}
                  className="px-3 py-1.5 bg-[#1E201E] hover:bg-[#252825] border border-[#EAE6DD]/15 rounded-xs transition-colors cursor-pointer text-[#EAE6DD]"
                >
                  Comparatif 50 / 50
                </button>
                <button
                  onClick={() => setSliderPos(0)}
                  className="px-3 py-1.5 bg-[#1E201E] hover:bg-[#252825] border border-[#EAE6DD]/15 rounded-xs transition-colors cursor-pointer text-[#EAE6DD]"
                >
                  Livraison (Après)
                </button>
              </div>

              <span className="hidden sm:inline-block text-[11px] text-[#B49B7E]">
                Glissez au doigt ou à la souris
              </span>
            </div>
          </div>

          {/* Dossier Card (Takes 4 cols) */}
          <div className="lg:col-span-4 bg-[#141514] border border-[#EAE6DD]/15 rounded-xs p-6 space-y-6 shadow-2xl">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#B49B7E] block mb-1">
                Dossier d’Ouvrage • {current.discipline}
              </span>
              <h3 className="font-serif text-2xl text-[#EAE6DD] font-normal leading-snug">
                {current.title}
              </h3>
              <p className="text-xs text-[#BDB3A3] mt-2 font-light leading-relaxed">
                {current.subtitle}
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="space-y-3 pt-4 border-t border-[#EAE6DD]/10">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#B49B7E] block">
                Spécifications constructives
              </span>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                {current.metrics.map((m, i) => (
                  <div key={i} className="p-2.5 bg-[#181A18] border border-[#EAE6DD]/10 rounded-xs">
                    <span className="text-[9px] uppercase text-[#BDB3A3] block">{m.label}</span>
                    <span className="text-[#EAE6DD] font-medium">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Captions Detail */}
            <div className="space-y-3 pt-4 border-t border-[#EAE6DD]/10 text-xs">
              <div className="p-3 bg-[#181A18] border-l-2 border-[#92795E] rounded-r-xs">
                <span className="text-[10px] font-mono uppercase text-[#B49B7E] block font-semibold mb-0.5">
                  État Initial (Gros Œuvre)
                </span>
                <p className="text-[#BDB3A3] font-light leading-relaxed">{current.beforeCaption}</p>
              </div>

              <div className="p-3 bg-[#181A18] border-l-2 border-[#EAE6DD] rounded-r-xs">
                <span className="text-[10px] font-mono uppercase text-[#EAE6DD] block font-semibold mb-0.5">
                  Ouvrage Réalisé (Finitions)
                </span>
                <p className="text-[#BDB3A3] font-light leading-relaxed">{current.afterCaption}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* SCROLL-DRIVEN ARCHITECTURAL TIME-LAPSE: Résidence Horizon (83 frames) */}
        {/* Synchronized directly to page scroll — zero video player or sliders */}
        {/* ==================================================================== */}
        <div ref={villaTrackRef} className="relative pt-16 border-t border-[#EAE6DD]/15 h-[230vh]">
          
          {/* Sticky Container pinned during scroll — internally scrollable so no
              content is ever clipped on short viewports (mobile / laptop) */}
          <div className="sticky top-16 sm:top-20 w-full max-h-[calc(100svh-4.5rem)] sm:max-h-[calc(100svh-6rem)] bg-[#121312] border border-[#EAE6DD]/15 p-4 sm:p-8 rounded-xs shadow-2xl overflow-y-auto overscroll-contain space-y-5 sm:space-y-6">
            
            {/* Header info */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#EAE6DD]/10">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#B49B7E] font-semibold block mb-1">
                  Relevé Drone Continu • Chronophotographie 4K
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#EAE6DD] font-light">
                  Métamorphose Pas à Pas : Résidence Horizon
                </h3>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono text-[#BDB3A3]">
                <span className="text-[10px] uppercase text-[#B49B7E]">
                  Étape {String(villaFrameIdx + 1).padStart(2, '0')} / {TOTAL_HERO_FRAMES}
                </span>
                <span className="text-[#EAE6DD]/40">•</span>
                <span className="text-[#EAE6DD]">{Math.round(villaScrollProgress * 100)}% achevé</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
              {/* Visualizer Monolith (5 cols) */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative aspect-[9/16] w-full max-w-[200px] sm:max-w-[260px] lg:max-w-[320px] bg-black border border-[#EAE6DD]/20 rounded-xs shadow-2xl overflow-hidden group">
                  <canvas
                    ref={villaCanvasRef}
                    width={720}
                    height={1278}
                    className="w-full h-full object-contain"
                  />

                  {/* Overlays */}
                  <div className="absolute top-3 left-3 bg-[#121312]/80 backdrop-blur-md px-3 py-1 border border-[#EAE6DD]/15 rounded-xs text-[10px] font-mono text-[#B49B7E]">
                    PHASE 0{activePhaseIdx + 1} • {VILLA_PHASES[activePhaseIdx].title}
                  </div>

                  <div className="absolute bottom-3 inset-x-3 bg-[#121312]/90 backdrop-blur-md p-2.5 border border-[#EAE6DD]/15 rounded-xs space-y-1.5">
                    <div className="flex justify-between text-[10px] font-mono text-[#EAE6DD]">
                      <span>Progression du chantier</span>
                      <span className="text-[#B49B7E] font-semibold">{Math.round(villaScrollProgress * 100)}%</span>
                    </div>
                    <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#92795E] to-[#B49B7E] transition-all duration-75"
                        style={{ width: `${Math.round(villaScrollProgress * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Phase Storytelling & Telemetry (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-2">
                  <div className="inline-block text-[10px] font-mono uppercase tracking-widest text-[#B49B7E] bg-[#181A18] px-2.5 py-1 rounded-xs border border-[#92795E]/30">
                    Phase Active : 0{activePhaseIdx + 1} / 04
                  </div>
                  <h4 className="font-serif text-2xl text-[#EAE6DD] font-normal">
                    {VILLA_PHASES[activePhaseIdx].title}
                  </h4>
                  <p className="text-sm text-[#BDB3A3] font-light leading-relaxed">
                    {VILLA_PHASES[activePhaseIdx].desc}
                  </p>
                </div>

                {/* 4 Architectural Milestone Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {VILLA_PHASES.map((p, idx) => {
                    const isCurrent = activePhaseIdx === idx;
                    return (
                      <button
                        key={p.num}
                        onClick={() => jumpToPhase(idx)}
                        className={`p-3 text-left border rounded-xs transition-all duration-300 cursor-pointer ${
                          isCurrent
                            ? 'bg-[#EAE6DD] text-[#151615] border-[#EAE6DD] font-semibold shadow-lg'
                            : 'bg-[#181A18] border-[#EAE6DD]/15 text-[#BDB3A3] hover:text-[#EAE6DD] hover:border-[#EAE6DD]/30'
                        }`}
                      >
                        <span className={`text-[10px] font-mono block ${isCurrent ? 'text-[#6F5B41]' : 'opacity-60'}`}>
                          PHASE {p.num}
                        </span>
                        <span className="text-xs block leading-tight mt-1">
                          {p.title}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Technical Specifications */}
                <div className="grid grid-cols-3 gap-3 pt-2 text-[11px] font-mono">
                  <div className="p-3 bg-[#181A18] border border-[#EAE6DD]/10 rounded-xs">
                    <span className="text-[9px] uppercase text-[#B49B7E] block">Tolérance laser</span>
                    <span className="text-[#EAE6DD]">&lt; 1,8 mm planéité</span>
                  </div>
                  <div className="p-3 bg-[#181A18] border border-[#EAE6DD]/10 rounded-xs">
                    <span className="text-[9px] uppercase text-[#B49B7E] block">Béton matricé</span>
                    <span className="text-[#EAE6DD]">C35/45 hydrofuge</span>
                  </div>
                  <div className="p-3 bg-[#181A18] border border-[#EAE6DD]/10 rounded-xs">
                    <span className="text-[9px] uppercase text-[#B49B7E] block">Superficie</span>
                    <span className="text-[#EAE6DD]">480 m² + terrasses</span>
                  </div>
                </div>

                {/* Commercial Scroll Cue */}
                <div className="flex items-center gap-2 pt-2 text-[11px] font-mono text-[#B49B7E]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B49B7E] animate-pulse" />
                  <span>Faites défiler la page pour animer l&apos;élévation de la structure</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

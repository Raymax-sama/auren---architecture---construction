import { useState } from 'react';
import { Film, Maximize2, Compass, Cpu, CheckCircle2, Ruler } from 'lucide-react';
import { CHANTIER_FRAMES_DIRECTORY, TOTAL_CHANTIER_FRAMES } from '../utils/frameSequence';
import { useScrollSequence } from '../utils/scrollSequence';

interface StepData {
  number: string;
  title: string;
  tagline: string;
  duration: string;
  description: string;
  milestones: string[];
  deliverables: string;
  cadTitle: string;
  cadSubtitle: string;
  telemetry: { label: string; value: string; badge?: string }[];
  defaultMode: 'cad' | 'video';
  activeLayer: 'structure' | 'mep' | 'elevation' | 'wireframe';
}

const STEPS: StepData[] = [
  {
    number: '01',
    title: 'Étude du projet',
    tagline: 'Diagnostic de site, faisabilité orographique & cadrage budgétaire',
    duration: '3 à 6 semaines',
    description:
      'Chaque terrain possède une géologie, une exposition et un horizon qui lui sont propres. Nous débutons par un relevé géomètre millimétré par drone, des sondages géotechniques de sol (G2) et une analyse rigoureuse des servitudes d’urbanisme et du PLU.',
    milestones: [
      'Relevé topographique par drone & géomètre expert (MNT 3D)',
      'Étude géotechnique de sol G2 AVP avec sondages carottés',
      'Analyse des règles de prospect, PLU et servitudes de vue',
      'Chiffrage prédictif tous corps d’état par ratios réels',
    ],
    deliverables: 'Dossier de faisabilité, note structurelle préliminaire, calendrier directeur prévisionnel.',
    cadTitle: 'DIAGNOSTIC DE SITE & RELEVÉ OROGRAPHIQUE',
    cadSubtitle: 'Courbes de niveau terrain • Bornes NGF +142.50m • Sondes G2 carottées',
    telemetry: [
      { label: 'Pente moyenne', value: '18,5 % orographique' },
      { label: 'Portance géotechnique', value: '0,45 MPa (Roche calcaire)', badge: 'G2 AVP' },
      { label: 'Ensoleillement utile', value: '2 840 h / an (Plein Sud)' },
      { label: 'Emprise constructible', value: '385 m² SDP autorisée' },
    ],
    defaultMode: 'cad',
    activeLayer: 'elevation',
  },
  {
    number: '02',
    title: 'Conception et préparation',
    tagline: 'Plans d’exécution, modélisation BIM 3D & permis de construire',
    duration: '6 à 10 semaines',
    description:
      'L’ouvrage est entièrement modélisé dans notre studio numérique. Les plans d’exécution au 1:50 intègrent les calculs de béton armé, les descentes de charges des portées libres sans poteau et les calepinages des réseaux invisibles.',
    milestones: [
      'Modélisation complète BIM LOD 350 avec détection des conflits',
      'Notes de calculs parasismiques Eurocode 8 & descentes de charges',
      'Plans de calepinage pierre calcaire, menuiseries et métallerie',
      'Dossier de consultation des entreprises (DCE) ultra-détaillé',
    ],
    deliverables: 'Plans d’exécution au 1:50, maquette numérique IFC, carnet de détails constructifs.',
    cadTitle: 'MAQUETTE NUMÉRIQUE BIM LOD 350 & COUPE STRUCTURE',
    cadSubtitle: 'Portée libre 15,0 m • Dalle alvéolaire 28 cm • Axes A-B-C-D',
    telemetry: [
      { label: 'Flèche admissible', value: 'L/620 (< 2,4 mm)' },
      { label: 'Coefficient thermique', value: 'U_paroi 0,11 W/m²K', badge: 'RE2020' },
      { label: 'Indice acoustique', value: 'Rw + Ctr = 56 dB' },
      { label: 'Conflits BIM résolus', value: '42 / 42 détectés (0 résiduel)' },
    ],
    defaultMode: 'cad',
    activeLayer: 'structure',
  },
  {
    number: '03',
    title: 'Réalisation et suivi',
    tagline: 'Pilotage de chantier, traçabilité & contrôle de planéité laser',
    duration: '9 à 14 mois',
    description:
      'La matière prend forme. Un directeur de travaux dédié supervise quotidiennement les équipes d’artisans et d’ingénieurs. Les coulages de béton matricé, la pose des baies minimalistes et les étanchéités font l’objet de contrôles systématiques documentés.',
    milestones: [
      'Direction de chantier quotidienne et coordination continue des 18 corps d’état',
      'Rapports d’étape hebdomadaires avec photographies et relevés 4K',
      'Contrôles altimétriques laser des dalles et des réservations de fluides',
      'Essais d’étanchéité à l’eau et à l’air avant doublage des parois',
    ],
    deliverables: 'Procès-verbaux de contrôle structure, rapports d’avancement hebdomadaires.',
    cadTitle: 'SUPERPOSITION BIM VS RÉEL & CONTRÔLE LASER',
    cadSubtitle: 'Tolérance altimétrique < 1,8 mm • Béton C35/45 hydrofuge coulé',
    telemetry: [
      { label: 'Tolérance laser', value: '< 1,8 mm planéité', badge: 'Laser 3D' },
      { label: 'Résistance béton', value: 'C35/45 à 28 jours (41 MPa)' },
      { label: 'Coordination TCE', value: '18 corps d’état synchronisés' },
      { label: 'Suivi documentaire', value: 'Vidéo 16:9 & PV hebdomadaires' },
    ],
    defaultMode: 'cad',
    activeLayer: 'wireframe',
  },
  {
    number: '04',
    title: 'Livraison',
    tagline: 'Réception des ouvrages sans réserve & mise en service',
    duration: '2 à 3 semaines',
    description:
      'L’achèvement d’un chef-d’œuvre exige une minutie sans compromis. Nous procédons aux opérations préalables à la réception (OPR), calibrons l’éclairage scénographique, mesurons la perméabilité à l’air et remettons le carnet complet de l’ouvrage.',
    milestones: [
      'Audit de pré-réception pièce par pièce avec fiches OPR détaillées',
      'Équilibrage aéraulique double-flux, acoustique et domotique KNX',
      'Nettoyage fin de chantier de standing hôtelier',
      'Remise du dossier des ouvrages exécutés (DOE) numérique complet',
    ],
    deliverables: 'Procès-verbal de réception sans réserve, garanties décennales, carnet d’entretien.',
    cadTitle: 'DOSSIER DES OUVRAGES EXÉCUTÉS & AUDIT THERMIQUE',
    cadSubtitle: 'Perméabilité à l’air q4Pa-surf 0,26 • Réception sans réserve validée',
    telemetry: [
      { label: 'Perméabilité à l’air', value: '0,26 m³/(h.m²)', badge: 'Passif' },
      { label: 'Acoustique CVC', value: '< 22 dB (Inaudible)' },
      { label: 'Réserves levées', value: '100 % (Zéro réserve)' },
      { label: 'Garanties légales', value: 'Décennale & Biennale activées' },
    ],
    defaultMode: 'cad',
    activeLayer: 'mep',
  },
];

interface MethodologyProps {
  onOpenVideoModal?: () => void;
}

export default function Methodology({ onOpenVideoModal }: MethodologyProps) {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'video' | 'cad'>('cad');
  const [selectedLayer, setSelectedLayer] = useState<'structure' | 'mep' | 'elevation' | 'wireframe'>('elevation');
  
  // "Chantier Réel": 100-frame sequence scrubbed by the page scroll — the same
  // engine used by the Résidence Horizon module.
  const chantier = useScrollSequence({
    totalFrames: TOTAL_CHANTIER_FRAMES,
    directory: CHANTIER_FRAMES_DIRECTORY,
    fit: 'contain',
    // The 100 frames are only downloaded once the visitor opens Chantier Réel.
    enabled: viewMode === 'video',
  });

  const current = STEPS[activeStep];

  const handleStepClick = (idx: number) => {
    setActiveStep(idx);
    setSelectedLayer(STEPS[idx].activeLayer);
    setViewMode(STEPS[idx].defaultMode);
  };

  return (
    <section
      id="methodologie"
      className="relative z-20 bg-[#EAE6DD] text-[#151615] py-24 sm:py-32 md:py-40 px-6 md:px-12 border-t border-[#BDB3A3]/40 scroll-mt-24 select-none"
      aria-label="Notre méthodologie"
    >
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 border-b border-[#151615]/15">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs uppercase tracking-[0.3em] text-[#6F5B41] font-semibold block">
              04 / Rigueur Opérationnelle
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#151615] font-light tracking-tight leading-[1.1]">
              Un projet maîtrisé <br />
              <span className="italic font-normal">à chaque étape.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm md:text-base text-[#151615]/75 leading-relaxed font-light">
            De la première sonde géotechnique à la remise des clefs, nous appliquons un protocole
            d’ingénierie prédictif qui garantit le respect absolu des délais et de l’enveloppe financière.
          </p>
        </div>

        {/* Step Navigation Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {STEPS.map((step, idx) => {
            const isCurrent = activeStep === idx;
            return (
              <button
                key={step.number}
                onClick={() => handleStepClick(idx)}
                className={`text-left p-4 sm:p-5 transition-all duration-300 rounded-xs border flex flex-col justify-between min-h-[110px] sm:min-h-[120px] focus:outline-none focus:ring-1 focus:ring-[#92795E] cursor-pointer ${
                  isCurrent
                    ? 'bg-[#151615] text-[#EAE6DD] border-t-4 border-t-[#92795E] border-x-[#151615] border-b-[#151615] shadow-xl'
                    : 'bg-[#DFD9CE]/70 hover:bg-[#DFD9CE] text-[#151615] border-[#151615]/15'
                }`}
              >
                <div className="flex justify-between items-baseline w-full">
                  <span
                    className={`font-serif text-xl sm:text-2xl font-light ${
                      isCurrent ? 'text-[#B49B7E]' : 'text-[#6F5B41]'
                    }`}
                  >
                    {step.number}
                  </span>
                  <span
                    className={`text-[10px] uppercase font-mono tracking-widest ${
                      isCurrent ? 'text-[#B49B7E]' : 'text-[#151615]/70'
                    }`}
                  >
                    {step.duration}
                  </span>
                </div>
                <div className="mt-2">
                  <h3 className="font-serif text-base sm:text-lg font-normal leading-snug">
                    {step.title}
                  </h3>
                  <span
                    className={`text-xs block mt-0.5 line-clamp-1 ${
                      isCurrent ? 'text-[#BDB3A3]' : 'text-[#151615]/70'
                    }`}
                  >
                    {step.tagline.split(',')[0]}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Deep-Dive Grid: Visual Studio (7 cols) + Synchronized Content Card (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Engineering & Video Visualizer Studio (Takes 7 cols) */}
          <div ref={chantier.trackRef} className={`lg:col-span-7 relative ${viewMode === 'video' ? 'h-[180vh]' : ''}`}>
          <div
            className={`bg-[#121312] text-[#EAE6DD] p-5 sm:p-7 rounded-xs border border-[#151615] shadow-2xl flex flex-col overflow-y-auto ${
              viewMode === 'video'
                ? 'sticky top-16 sm:top-20 max-h-[calc(100svh-5rem)]'
                : 'relative overflow-hidden'
            }`}
          >
            
            {/* Visualizer Top Bar with View Mode Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#EAE6DD]/15">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('cad')}
                  className={`px-3.5 py-1.5 text-[11px] font-mono uppercase tracking-wider rounded-xs transition-colors cursor-pointer ${
                    viewMode === 'cad'
                      ? 'bg-[#EAE6DD] text-[#151615] font-bold shadow'
                      : 'bg-[#252825] text-[#BDB3A3] hover:text-[#EAE6DD]'
                  }`}
                >
                  Plans CAO / BIM 3D
                </button>

                <button
                  onClick={() => setViewMode('video')}
                  className={`px-3.5 py-1.5 text-[11px] font-mono uppercase tracking-wider rounded-xs transition-colors flex items-center gap-2 cursor-pointer ${
                    viewMode === 'video'
                      ? 'bg-[#EAE6DD] text-[#151615] font-bold shadow'
                      : 'bg-[#252825] text-[#BDB3A3] hover:text-[#EAE6DD]'
                  }`}
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>Chantier Réel 16:9</span>
                </button>
              </div>

              {/* Dynamic Layer Switchers in CAD Mode */}
              {viewMode === 'cad' ? (
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase">
                  <button
                    onClick={() => setSelectedLayer('elevation')}
                    className={`px-2 py-1 rounded-xs transition-colors cursor-pointer ${
                      selectedLayer === 'elevation'
                        ? 'bg-[#9E8467] text-[#151615] font-bold'
                        : 'bg-[#252825] text-[#BDB3A3] hover:text-[#EAE6DD]'
                    }`}
                  >
                    Altimétrie
                  </button>
                  <button
                    onClick={() => setSelectedLayer('structure')}
                    className={`px-2 py-1 rounded-xs transition-colors cursor-pointer ${
                      selectedLayer === 'structure'
                        ? 'bg-[#9E8467] text-[#151615] font-bold'
                        : 'bg-[#252825] text-[#BDB3A3] hover:text-[#EAE6DD]'
                    }`}
                  >
                    Structure
                  </button>
                  <button
                    onClick={() => setSelectedLayer('wireframe')}
                    className={`px-2 py-1 rounded-xs transition-colors cursor-pointer ${
                      selectedLayer === 'wireframe'
                        ? 'bg-[#9E8467] text-[#151615] font-bold'
                        : 'bg-[#252825] text-[#BDB3A3] hover:text-[#EAE6DD]'
                    }`}
                  >
                    Filaire 3D
                  </button>
                  <button
                    onClick={() => setSelectedLayer('mep')}
                    className={`px-2 py-1 rounded-xs transition-colors cursor-pointer ${
                      selectedLayer === 'mep'
                        ? 'bg-[#9E8467] text-[#151615] font-bold'
                        : 'bg-[#252825] text-[#BDB3A3] hover:text-[#EAE6DD]'
                    }`}
                  >
                    Fluides
                  </button>
                </div>
              ) : (
                /* Chantier Réel actions — the sequence follows the scroll, so there is
                   no player to control: only the fullscreen documentary remains. */
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-1 bg-[#252825] rounded-xs text-[10px] font-mono uppercase tracking-wider text-[#B49B7E]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B49B7E] animate-pulse" />
                    Séquence pilotée au scroll
                  </span>
                  {onOpenVideoModal && (
                    <button
                      onClick={onOpenVideoModal}
                      className="p-1.5 text-[#EAE6DD] hover:text-[#B49B7E] transition-colors bg-[#252825] rounded-xs cursor-pointer"
                      title="Plein écran 4K"
                      aria-label="Plein écran 4K"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Display Area: Synchronized Dynamic CAD Blueprint or Safe 16:9 Video */}
            {viewMode === 'video' ? (
              <div className="relative w-full aspect-video max-h-[58svh] my-4 bg-black border border-[#EAE6DD]/15 rounded-xs overflow-hidden group">
                <canvas
                  ref={chantier.canvasRef}
                  className="absolute inset-0 w-full h-full block"
                  role="img"
                  aria-label="Séquence chantier pilotée par le défilement de la page"
                />

                {chantier.loadedFrames === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#0E0F0E]">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#B49B7E] animate-pulse">
                      Chargement de la séquence…
                    </span>
                  </div>
                )}

                
                {/* On-video badges */}
                <div className="absolute top-3 left-3 bg-[#121312]/80 backdrop-blur-md px-3 py-1 border border-[#EAE6DD]/15 rounded-xs text-[10px] font-mono text-[#B49B7E]">
                  LEVAGE STRUCTUREL & CONTRÔLE BIM EN TEMPS RÉEL
                </div>

                <div className="absolute bottom-3 right-3 bg-[#121312]/80 backdrop-blur-md px-3 py-1 border border-[#EAE6DD]/15 rounded-xs text-[9px] font-mono text-[#EAE6DD]/80">
                  DIRECTION TECHNIQUE AUREN
                </div>

                {/* Scrub progress hairline */}
                <div className="absolute bottom-0 inset-x-0 h-[2px] bg-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-[#92795E] to-[#EAE6DD]"
                    style={{ width: `${Math.round(chantier.progress * 100)}%` }}
                  />
                </div>
              </div>
            ) : (
              /* DYNAMIC CAD / BIM BLUEPRINT RENDERING (Changes dynamically based on activeStep and selectedLayer) */
              <div className="relative w-full aspect-[16/10] my-4 bg-[#0E0F0E] border border-[#EAE6DD]/10 rounded-xs flex items-center justify-center p-4 overflow-hidden">
                {/* Blueprint Background Grid */}
                <svg className="absolute inset-0 w-full h-full opacity-25 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid-methodology" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#EAE6DD" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid-methodology)" />
                </svg>

                {/* Dynamic SVG Schematic Blueprint */}
                <svg
                  viewBox="0 0 600 360"
                  className="w-full h-full max-h-[320px] select-none text-[#EAE6DD]"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Grid Reference Axes */}
                  <line x1="60" y1="20" x2="60" y2="340" stroke="#92795E" strokeWidth="0.8" strokeDasharray="3 3" />
                  <line x1="220" y1="20" x2="220" y2="340" stroke="#92795E" strokeWidth="0.8" strokeDasharray="3 3" />
                  <line x1="380" y1="20" x2="380" y2="340" stroke="#92795E" strokeWidth="0.8" strokeDasharray="3 3" />
                  <line x1="540" y1="20" x2="540" y2="340" stroke="#92795E" strokeWidth="0.8" strokeDasharray="3 3" />

                  <text x="60" y="15" fill="#92795E" fontSize="9" fontFamily="monospace" textAnchor="middle">AXE A</text>
                  <text x="220" y="15" fill="#92795E" fontSize="9" fontFamily="monospace" textAnchor="middle">AXE B</text>
                  <text x="380" y="15" fill="#92795E" fontSize="9" fontFamily="monospace" textAnchor="middle">AXE C</text>
                  <text x="540" y="15" fill="#92795E" fontSize="9" fontFamily="monospace" textAnchor="middle">AXE D</text>

                  {/* ============================================================== */}
                  {/* STEP 01 DYNAMIC OVERLAY: Topographie, Sondes G2, Pente & PLU */}
                  {/* ============================================================== */}
                  {activeStep === 0 && (
                    <g>
                      {/* Natural Terrain Slope */}
                      <path d="M 30 220 Q 180 230 260 270 T 570 310" fill="none" stroke="#6F5B41" strokeWidth="2.5" />
                      <text x="70" y="210" fill="#B49B7E" fontSize="9" fontFamily="monospace">TERRAIN NATUREL (PENTE 18.5%)</text>
                      
                      {/* Topographic Contour Lines */}
                      <path d="M 30 240 Q 180 250 260 290 T 570 330" fill="none" stroke="#6F5B41" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.6" />
                      <path d="M 30 260 Q 180 270 260 310 T 570 350" fill="none" stroke="#6F5B41" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.4" />
                      
                      {/* Geotechnical Borehole Markers */}
                      <g>
                        <line x1="140" y1="225" x2="140" y2="330" stroke="#EAE6DD" strokeWidth="1.5" strokeDasharray="2 2" />
                        <circle cx="140" cy="225" r="4" fill="#B49B7E" />
                        <text x="145" y="320" fill="#EAE6DD" fontSize="8" fontFamily="monospace">SONDE G2 #1 (-6.5m)</text>

                        <line x1="420" y1="285" x2="420" y2="345" stroke="#EAE6DD" strokeWidth="1.5" strokeDasharray="2 2" />
                        <circle cx="420" cy="285" r="4" fill="#B49B7E" />
                        <text x="425" y="340" fill="#EAE6DD" fontSize="8" fontFamily="monospace">SONDE G2 #2 (-8.0m)</text>
                      </g>

                      {/* Boundary / Prospect Limit */}
                      <line x1="40" y1="50" x2="40" y2="340" stroke="#E74C3C" strokeWidth="1" strokeDasharray="5 3" />
                      <text x="45" y="70" fill="#E74C3C" fontSize="8" fontFamily="monospace">LIMITE SÉPARATIVE PLU (5.00m)</text>

                      {/* Solar Path Arc */}
                      <path d="M 80 120 Q 300 40 520 120" fill="none" stroke="#F1C40F" strokeWidth="1.2" strokeDasharray="6 3" />
                      <circle cx="300" cy="40" r="5" fill="#F1C40F" />
                      <text x="300" y="30" fill="#F1C40F" fontSize="8" fontFamily="monospace" textAnchor="middle">ZÉMITH SOLAIRE SUD +15°</text>
                    </g>
                  )}

                  {/* ============================================================== */}
                  {/* STEP 02 DYNAMIC OVERLAY: Maquette BIM, Portée 15m, Ferraillage */}
                  {/* ============================================================== */}
                  {activeStep === 1 && (
                    <g>
                      {/* Structural Ground & Foundation Footing */}
                      <rect x="50" y="270" width="340" height="30" fill="#181A18" stroke="#EAE6DD" strokeWidth="1" />
                      <text x="220" y="290" fill="#B49B7E" fontSize="8" fontFamily="monospace" textAnchor="middle">
                        RADIER BÉTON ARMÉ PARASISMIQUE ÉP. 35cm
                      </text>

                      {/* Monumental Cantilever Beam 15m Span */}
                      <rect x="50" y="140" width="460" height="14" fill="#92795E" stroke="#EAE6DD" strokeWidth="1.5" />
                      <line x1="50" y1="125" x2="510" y2="125" stroke="#B49B7E" strokeWidth="0.8" markerEnd="url(#arrow)" />
                      <text x="280" y="120" fill="#B49B7E" fontSize="9" fontFamily="monospace" textAnchor="middle">
                        PORTÉE LIBRE SUSPENDUE 15.00 m (SANS POTEAU)
                      </text>

                      {/* Upper Architectural Box */}
                      <rect x="180" y="55" width="330" height="85" fill="rgba(146, 121, 94, 0.15)" stroke="#EAE6DD" strokeWidth="1.2" />
                      <text x="345" y="100" fill="#EAE6DD" fontSize="9" fontFamily="monospace" textAnchor="middle">
                        SUITE MAÎTRE SUSPENDUE (LOD 350)
                      </text>

                      {/* Floor to ceiling openings */}
                      <rect x="70" y="154" width="130" height="116" fill="rgba(234, 230, 221, 0.04)" stroke="#92795E" strokeWidth="1" strokeDasharray="4 2" />
                      <text x="135" y="215" fill="#BDB3A3" fontSize="8" fontFamily="monospace" textAnchor="middle">BAIE TOUTE HAUTEUR 3.20m</text>
                    </g>
                  )}

                  {/* ============================================================== */}
                  {/* STEP 03 DYNAMIC OVERLAY: Contrôle Laser & Avancement Chantier */}
                  {/* ============================================================== */}
                  {activeStep === 2 && (
                    <g>
                      {/* Structure under execution */}
                      <rect x="50" y="260" width="340" height="30" fill="#252825" stroke="#2ECC71" strokeWidth="1.5" />
                      <rect x="70" y="150" width="14" height="110" fill="#2ECC71" />
                      <rect x="220" y="150" width="14" height="110" fill="#2ECC71" />
                      <rect x="370" y="150" width="14" height="110" fill="#F39C12" />

                      {/* Pool Basin Casting */}
                      <rect x="380" y="265" width="170" height="45" fill="rgba(46, 204, 113, 0.2)" stroke="#2ECC71" strokeWidth="1.5" />
                      <text x="465" y="292" fill="#2ECC71" fontSize="8" fontFamily="monospace" textAnchor="middle">
                        CUVE COULÉE (HYDROFUGE VALIDÉ)
                      </text>

                      {/* Laser Alignment Beam */}
                      <line x1="40" y1="148" x2="550" y2="148" stroke="#E74C3C" strokeWidth="1.2" strokeDasharray="5 2" />
                      <circle cx="280" cy="148" r="3" fill="#E74C3C" />
                      <text x="280" y="140" fill="#E74C3C" fontSize="8" fontFamily="monospace" textAnchor="middle">
                        NIVEAU LASER MILLIMÉTRIQUE (ÉCART: +0.8mm)
                      </text>

                      {/* Status Legend */}
                      <rect x="60" y="45" width="180" height="50" fill="#151615" stroke="#EAE6DD" strokeWidth="0.8" />
                      <circle cx="75" cy="60" r="3" fill="#2ECC71" />
                      <text x="85" y="63" fill="#EAE6DD" fontSize="8" fontFamily="monospace">Coulage achevé (100%)</text>
                      <circle cx="75" cy="78" r="3" fill="#F39C12" />
                      <text x="85" y="81" fill="#EAE6DD" fontSize="8" fontFamily="monospace">En cours de décoffrage</text>
                    </g>
                  )}

                  {/* ============================================================== */}
                  {/* STEP 04 DYNAMIC OVERLAY: DOE, Réception, Domotique & RE2020 */}
                  {/* ============================================================== */}
                  {activeStep === 3 && (
                    <g>
                      {/* Completed Residence Silhouette */}
                      <rect x="50" y="250" width="340" height="40" fill="#181A18" stroke="#EAE6DD" strokeWidth="1.2" />
                      <rect x="50" y="140" width="460" height="12" fill="#92795E" stroke="#EAE6DD" strokeWidth="1.2" />
                      <rect x="180" y="55" width="330" height="85" fill="#181A18" stroke="#EAE6DD" strokeWidth="1.2" />

                      {/* Air permeability & Envelope Insulation Vector */}
                      <rect x="45" y="50" width="470" height="245" fill="none" stroke="#3498DB" strokeWidth="1.2" strokeDasharray="4 4" />
                      <text x="280" y="40" fill="#3498DB" fontSize="8" fontFamily="monospace" textAnchor="middle">
                        ENVELOPPE ÉTANCHE RE2020 (TEST BLOWER-DOOR 0.26)
                      </text>

                      {/* Home Automation & MEP Sensor Nodes */}
                      <circle cx="120" cy="180" r="4" fill="#EAE6DD" stroke="#92795E" strokeWidth="1" />
                      <circle cx="260" cy="180" r="4" fill="#EAE6DD" stroke="#92795E" strokeWidth="1" />
                      <circle cx="340" cy="90" r="4" fill="#EAE6DD" stroke="#92795E" strokeWidth="1" />
                      <path d="M 120 180 L 260 180 L 340 90" fill="none" stroke="#92795E" strokeWidth="1" strokeDasharray="3 3" />
                      <text x="260" y="170" fill="#B49B7E" fontSize="8" fontFamily="monospace" textAnchor="middle">BUS KNX DOMOTIQUE</text>

                      {/* Acceptance Seal */}
                      <rect x="360" y="210" width="180" height="35" fill="#151615" stroke="#2ECC71" strokeWidth="1.5" />
                      <text x="450" y="225" fill="#2ECC71" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                        RÉCEPTION CONFORME
                      </text>
                      <text x="450" y="237" fill="#EAE6DD" fontSize="7" fontFamily="monospace" textAnchor="middle">
                        ZÉRO RÉSERVE • GARANTIE DÉCENNALE
                      </text>
                    </g>
                  )}

                  {/* Active Layer Highlight Overlay */}
                  {selectedLayer === 'mep' && (
                    <g>
                      <path d="M 90 270 L 90 145 L 320 145 L 320 60" fill="none" stroke="#3498DB" strokeWidth="2" strokeDasharray="4 2" />
                      <text x="330" y="70" fill="#3498DB" fontSize="8" fontFamily="monospace">RÉSEAU VMC DOUBLE-FLUX</text>
                    </g>
                  )}

                  {/* Dynamic Dimensioning Marker */}
                  <g stroke="#92795E" strokeWidth="0.8">
                    <line x1="50" y1="330" x2="390" y2="330" />
                    <line x1="50" y1="325" x2="50" y2="335" />
                    <line x1="390" y1="325" x2="390" y2="335" />
                    <text x="220" y="342" fill="#92795E" fontSize="8" fontFamily="monospace" textAnchor="middle">
                      LONGUEUR PRINCIPALE 24.50 m
                    </text>
                  </g>
                </svg>
              </div>
            )}

            {/* Dynamic Telemetry Status Bar below Visualizer */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-3 border-t border-[#EAE6DD]/15 text-[11px] font-mono text-[#BDB3A3]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#B49B7E]" />
                <span className="text-[#EAE6DD] font-semibold">
                  {viewMode === 'video'
                    ? 'CHANTIER RÉEL — SÉQUENCE PILOTÉE AU SCROLL'
                    : current.cadTitle}
                </span>
              </div>
              <span className="text-[#B49B7E] text-[10px] tabular-nums">
                {viewMode === 'video'
                  ? 'Séquence en cours'
                  : current.cadSubtitle}
              </span>
            </div>
          </div>
          </div>

          {/* Dynamic Synchronized Content Dossier Card (Takes 5 cols) */}
          <div
            className={`lg:col-span-5 bg-[#DFD9CE] border border-[#151615]/15 p-6 sm:p-7 rounded-xs space-y-6 shadow-xl ${
              viewMode === 'video' ? 'lg:sticky lg:top-24' : ''
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-[#6F5B41] mb-1">
                <span>Étape {current.number} / 04</span>
                <span className="font-bold text-[#151615]">{current.duration}</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#151615] font-light leading-snug">
                {current.title}
              </h3>
              <p className="text-xs text-[#151615]/75 mt-1 font-mono">
                {current.tagline}
              </p>
            </div>

            <p className="text-sm text-[#151615]/85 leading-relaxed font-light">
              {current.description}
            </p>

            {/* Dynamic Engineering Telemetry Cards */}
            <div className="space-y-2 pt-4 border-t border-[#151615]/15">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#6F5B41] block font-semibold">
                Données d’ingénierie & Métriques clés
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {current.telemetry.map((t, idx) => (
                  <div key={idx} className="p-2.5 bg-[#EAE6DD] border border-[#151615]/10 rounded-xs flex flex-col justify-between">
                    <span className="text-[9px] uppercase text-[#6F5B41] block">{t.label}</span>
                    <span className="text-[#151615] font-medium mt-0.5">{t.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Validation Milestones */}
            <div className="space-y-3 pt-4 border-t border-[#151615]/15">
              <span className="text-xs font-mono uppercase tracking-wider text-[#6F5B41] block font-semibold">
                Jalons de validation
              </span>
              <ul className="space-y-2 text-xs text-[#151615]/85">
                {current.milestones.map((milestone, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#6F5B41] shrink-0 mt-0.5" />
                    <span className="leading-tight">{milestone}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Deliverable Box */}
            <div className="pt-4 border-t border-[#151615]/15 text-xs">
              <span className="font-mono text-[#6F5B41] uppercase tracking-wider block font-semibold text-[10px]">
                Livrable clé
              </span>
              <p className="text-[#151615] mt-1 font-light leading-relaxed">
                {current.deliverables}
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

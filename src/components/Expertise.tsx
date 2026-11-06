import { useState } from 'react';
import { ArrowUpRight, Check, Compass, Ruler, ShieldCheck } from 'lucide-react';

interface ExpertiseProps {
  onSelectService: (serviceName: string) => void;
}

export default function Expertise({ onSelectService }: ExpertiseProps) {
  const [activeTab, setActiveTab] = useState<number>(0);

  const services = [
    {
      num: '01',
      title: 'Construction neuve',
      tagline: 'Villas d’architecte & résidences contemporaines d’exception',
      description:
        'Conception intégrale et réalisation d’ouvrages contemporains audacieux. Nous maîtrisons les structures complexes, les grandes portées en béton matricé sans poteau intermédiaire, les baies monumentales toute hauteur et les exigences bioclimatiques les plus strictes.',
      materials: ['Béton matricé brut', 'Menuiseries aluminium affleurantes', 'Triple vitrage thermique', 'Terrasses suspendues'],
      specs: [
        { label: 'Portée maximale libre', value: 'Jusqu’à 15 mètres sans appui' },
        { label: 'Tolérance structurelle', value: 'Laser millimétrique (< 2 mm)' },
        { label: 'Coordination', value: 'Bureau d’études structure & sol G2 intégrés' },
        { label: 'Performance', value: 'Standard passif & bioclimatique RE2020' },
      ],
      deliverables: 'Plans d’exécution au 1:50, modélisation numérique BIM 3D, pilotage tous corps d’état.',
    },
    {
      num: '02',
      title: 'Rénovation complète',
      tagline: 'Réhabilitation lourde, métamorphose spatiale & consolidation patrimoniale',
      description:
        'Repenser l’existant sans en dénaturer l’âme. Nous intervenons sur des propriétés de caractère, bastides ou structures vieillissantes pour les métamorphoser en havres de confort contemporain grâce à des reprises en sous-œuvre précises et une isolation invisible.',
      materials: ['Pierre calcaire appareillée', 'Renforts IPN invisibles', 'Isolation thermique continue', 'Charpentes chevillées'],
      specs: [
        { label: 'Diagnostic initial', value: 'Auscultation des fondations & charpentes' },
        { label: 'Ouverture de porteurs', value: 'Poutres treillis & vérinage haute pression' },
        { label: 'Amélioration thermique', value: 'Gain énergétique certifié classe A/B' },
        { label: 'Garantie décennale', value: 'Couverture intégrale réhabilitation lourde' },
      ],
      deliverables: 'Curage maîtrisé, renforts structurels certifiés, valorisation foncière pérenne.',
    },
    {
      num: '03',
      title: 'Aménagement intérieur',
      tagline: 'Architecture d’intérieur, matières nobles & scénographie lumineuse',
      description:
        'L’art de composer avec la matière, les ombres et les perspectives. Nous concevons chaque détail sur mesure : agencements ébénisterie en essences rares, calepinage au millimètre de pierres naturelles et intégration d’éclairages subtils et invisibles.',
      materials: ['Noyer américain huilé', 'Travertin de Tivoli adouci', 'Laiton brossé', 'Staff acoustique micro-perforé'],
      specs: [
        { label: 'Calepinage matières', value: 'Plans de pose au millimètre' },
        { label: 'Ébénisterie sur mesure', value: 'Menuiseries d’artisanat d’art français' },
        { label: 'Éclairage architectural', value: 'Température circadienne (2700K - 3000K)' },
        { label: 'Confort acoustique', value: 'Traitement feutré invisible' },
      ],
      deliverables: 'Prototypes matières en atelier, échantillonnage in situ, pose d’artisanat d’art.',
    },
  ];

  const current = services[activeTab];

  return (
    <section
      id="expertise"
      className="relative z-20 bg-[#EAE6DD] text-[#151615] py-20 sm:py-28 md:py-36 px-6 md:px-12 border-t border-[#BDB3A3]/40 scroll-mt-24"
      aria-label="Nos expertises"
    >
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 border-b border-[#151615]/15">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs uppercase tracking-[0.3em] text-bronze-ink font-semibold block">
              02 / Savoir-Faire Constructif
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#151615] font-light tracking-tight leading-[1.1]">
              Une exigence technique <br />
              <span className="italic font-normal">au service de l’espace.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm md:text-base text-[#151615]/75 leading-relaxed font-light">
            De la structure porteuse aux plus subtils calepinages intérieurs, notre studio conjugue
            rigueur d’ingénierie et sensibilité d’artisanat d’art.
          </p>
        </div>

        {/* Architectural Service Selector Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border-b border-[#151615]/15 pb-6">
          {services.map((service, idx) => {
            const isSelected = activeTab === idx;
            return (
              <button
                key={service.num}
                onClick={() => setActiveTab(idx)}
                className={`text-left p-5 sm:p-6 transition-all duration-300 rounded-xs border flex flex-col justify-between h-32 focus:outline-none focus:ring-1 focus:ring-[#92795E] ${
                  isSelected
                    ? 'bg-[#151615] text-[#EAE6DD] border-[#151615] shadow-xl'
                    : 'bg-[#DFD9CE]/60 hover:bg-[#DFD9CE] text-[#151615] border-[#151615]/10'
                }`}
              >
                <div className="flex justify-between items-baseline w-full">
                  <span
                    className={`font-serif text-xl sm:text-2xl font-light ${
                      isSelected ? 'text-bronze-glow' : 'text-bronze-ink'
                    }`}
                  >
                    {service.num}
                  </span>
                  <span
                    className={`text-[10px] uppercase font-mono tracking-widest ${
                      isSelected ? 'text-bronze-glow' : 'text-[#151615]/70'
                    }`}
                  >
                    DISCIPLINE
                  </span>
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-normal leading-snug">
                    {service.title}
                  </h3>
                  <span
                    className={`text-xs block mt-0.5 line-clamp-1 ${
                      isSelected ? 'text-[#BDB3A3]' : 'text-[#151615]/70'
                    }`}
                  >
                    {service.tagline.split('&')[0]}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Discipline Deep-Dive Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start pt-2">
          
          {/* Left Column: Architectural Narrative & Craftsmanship (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-bronze-ink font-semibold">
                <span>Discipline {current.num}</span>
                <span>•</span>
                <span>Haute Exécution</span>
              </div>
              <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#151615] leading-tight">
                {current.title}
              </h3>
              <p className="text-sm sm:text-base text-bronze-ink font-medium italic">
                {current.tagline}
              </p>
            </div>

            <p className="text-base sm:text-lg text-[#151615]/85 font-light leading-relaxed">
              {current.description}
            </p>

            {/* Material & Architectural Tokens */}
            <div className="pt-2 space-y-3">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#151615] font-semibold block">
                Matières & Signatures constructives
              </span>
              <div className="flex flex-wrap gap-2">
                {current.materials.map((mat, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-[#151615]/10 border border-[#151615]/15 text-xs text-[#151615] rounded-xs font-mono"
                  >
                    {mat}
                  </span>
                ))}
              </div>
            </div>

            {/* Call To Action */}
            <div className="pt-4">
              <button
                onClick={() => onSelectService(current.title)}
                className="inline-flex items-center gap-3 px-6 sm:px-8 py-3.5 bg-[#151615] text-[#EAE6DD] text-xs uppercase tracking-[0.2em] font-medium hover:bg-bronze-ink transition-all duration-300 shadow-md focus:outline-none focus:ring-1 focus:ring-[#92795E] rounded-xs"
              >
                <span>Initier une étude {current.title.toLowerCase()}</span>
                <ArrowUpRight className="w-4 h-4 text-bronze-glow" />
              </button>
            </div>
          </div>

          {/* Right Column: Architectural Dossier Specifications Card (5 cols) */}
          <div className="lg:col-span-5 bg-[#151615] text-[#EAE6DD] p-7 sm:p-9 rounded-xs shadow-xl space-y-6 border border-[#151615]">
            <div className="border-b border-[#EAE6DD]/15 pb-4 flex justify-between items-baseline">
              <span className="text-[10px] uppercase tracking-[0.25em] text-bronze-glow font-mono">
                Cahier des charges technique
              </span>
              <span className="text-[10px] text-[#BDB3A3]/75 font-mono">LOD 350</span>
            </div>

            <div className="space-y-4">
              {current.specs.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-1 border-b border-[#EAE6DD]/10 pb-3">
                  <span className="text-[11px] text-[#BDB3A3] font-light">{item.label}</span>
                  <span className="text-xs sm:text-sm font-mono text-[#EAE6DD] font-medium">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <span className="text-[10px] uppercase tracking-wider text-bronze-glow font-mono block mb-1">
                Livrable d’exécution
              </span>
              <p className="text-xs text-[#BDB3A3] font-light leading-relaxed">
                {current.deliverables}
              </p>
            </div>
          </div>

        </div>

        {/* Technical Rigor Highlights (Minimalist 3 Pillars) */}
        <div className="pt-12 border-t border-[#151615]/15 grid grid-cols-1 sm:grid-cols-3 gap-8 text-[#151615]">
          <div className="flex items-start gap-4">
            <Compass className="w-5 h-5 text-bronze-ink shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-serif text-lg font-normal">Études orographiques</h4>
              <p className="text-xs text-[#151615]/70 leading-relaxed font-light">
                Chaque terrain impose ses contraintes de pente et sa course solaire. Nos ouvrages s’y intègrent sans rupture.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Ruler className="w-5 h-5 text-bronze-ink shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-serif text-lg font-normal">Tolérance millimétrique</h4>
              <p className="text-xs text-[#151615]/70 leading-relaxed font-light">
                Contrôle laser systématique des niveaux pour une planéité absolue et des coulages sans défaut.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <ShieldCheck className="w-5 h-5 text-bronze-ink shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-serif text-lg font-normal">Interlocuteur unique</h4>
              <p className="text-xs text-[#151615]/70 leading-relaxed font-light">
                Un directeur de projet dédié coordonne l’ensemble des corps d’état du premier sondage à la livraison.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

/**
 * Séquence d'ouverture de l'atelier — le premier geste du site.
 *
 * Voile plein écran : le wordmark se compose lettre par lettre, une règle de
 * bronze se trace sous le compteur, puis tout le voile se lève sur le hero.
 * La progression vient du parent (App) : ce composant ne simule aucun
 * chargement, il rend seulement l'attente habitée.
 */

interface LoadingScreenProps {
  /** Progression réelle du chargement, de 0 à 100. */
  progress: number;
  /** Passe à true quand le contenu est prêt : déclenche le lever de rideau. */
  exiting: boolean;
}

const WORDMARK = ['A', 'U', 'R', 'E', 'N'];

const LoadingScreen = ({ progress, exiting }: LoadingScreenProps) => {
  const clamped = Math.min(100, Math.max(0, Math.round(progress)));
  const padded = String(clamped).padStart(3, '0');

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Ouverture de l'atelier AUREN"
      className={`fixed inset-0 z-[9999] overflow-hidden bg-[#0F100F] transition-transform duration-[1150ms] motion-reduce:translate-y-0 motion-reduce:duration-300 ${
        exiting ? '-translate-y-full motion-reduce:opacity-0' : 'translate-y-0'
      }`}
      style={{ transitionTimingFunction: 'cubic-bezier(0.76, 0, 0.24, 1)' }}
    >
      {/* Architectural grid — identical to the hero's, so the curtain and the
          page read as one single room rather than two screens. */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#EAE6DD05_1px,transparent_1px),linear-gradient(to_bottom,#EAE6DD05_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-40"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(15,16,15,0.92)_100%)]"
        aria-hidden="true"
      />
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.22]" aria-hidden="true" />

      {/* Warm bronze halo, breathing behind the wordmark. */}
      <div
        className="boot-glow pointer-events-none absolute left-1/2 top-1/2 h-[min(90vw,40rem)] w-[min(90vw,40rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(146,121,94,0.18)_0%,transparent_68%)] blur-2xl"
        aria-hidden="true"
      />

      <div className="relative flex h-full w-full flex-col justify-between px-6 py-8 sm:px-10 sm:py-10">
        {/* Top register — atelier identity, set like a letterpress masthead. */}
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-[#9E8467]">
            Studio d’architecture
          </span>
          <span className="hidden text-[9px] font-mono uppercase tracking-[0.4em] text-[#EAE6DD]/35 sm:block">
            France &amp; International
          </span>
        </div>

        {/* Centre — the wordmark composes itself, then hands over to the page. */}
        <div
          className={`flex flex-col items-center gap-6 transition-all duration-500 ease-out ${
            exiting ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100'
          }`}
        >
          <h1 className="flex select-none font-serif text-[clamp(2.6rem,11vw,5.5rem)] font-light leading-none tracking-[0.34em] text-[#EAE6DD]">
            {WORDMARK.map((letter, index) => (
              <span
                key={`${letter}-${index}`}
                className="boot-letter pl-[0.34em] first:pl-0"
                style={{ animationDelay: `${140 + index * 90}ms` }}
              >
                {letter}
              </span>
            ))}
          </h1>

          {/* Hairline that draws itself, framed by the counter. */}
          <div className="boot-rule flex w-[min(78vw,17rem)] items-center gap-4">
            <span className="font-mono text-[10px] tabular-nums tracking-[0.2em] text-[#9E8467]">
              {padded}
            </span>
            <div className="relative h-px flex-1 overflow-hidden bg-[#EAE6DD]/12">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#92795E] to-[#B49B7E]"
                style={{
                  width: `${clamped}%`,
                  transition: 'width 380ms cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              />
            </div>
            <span className="font-mono text-[10px] tabular-nums tracking-[0.2em] text-[#EAE6DD]/25">
              100
            </span>
          </div>
        </div>

        {/* Bottom register — the caption changes once the dossier is composed. */}
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-[#EAE6DD]/40">
            {clamped < 100 ? 'Composition du dossier' : 'Ouverture'}
          </span>
          <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-[#EAE6DD]/25">
            Villas d’exception
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;

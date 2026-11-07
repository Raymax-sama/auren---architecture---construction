import { ArrowUp, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0F100F] text-[#EAE6DD] pt-24 pb-16 px-6 md:px-12 border-t border-[#EAE6DD]/10 select-none">
      <div className="max-w-7xl mx-auto space-y-20">

        {/* Top Tier: Brand Editorial Statement */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start justify-between pb-16 border-b border-[#EAE6DD]/8">
          <div className="md:col-span-6 space-y-6">
            <div className="flex items-center gap-2.5">
              <span className="font-serif text-3xl md:text-4xl tracking-[0.2em] text-[#EAE6DD] uppercase font-light block">
                AUREN
              </span>
              <span className="w-1 h-5 bg-[#92795E] rounded-full" />
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#92795E] font-semibold">
              Architecture, Construction & Rénovation
            </p>
            <p className="text-sm text-[#BDB3A3]/85 leading-relaxed font-light max-w-xl">
              Conception d’espaces contemporains et réhabilitation d’exception. Une alliance de
              technicité constructive et de pureté architecturale.
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="https://www.instagram.com/auren.architecture/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-[#EAE6DD]/20 flex items-center justify-center text-[#EAE6DD]/70 hover:text-[#92795E] hover:border-[#92795E] transition-colors text-xs"
                aria-label="Instagram — AUREN (nouvel onglet)"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/company/auren-architecture/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-[#EAE6DD]/20 flex items-center justify-center text-[#EAE6DD]/70 hover:text-[#92795E] hover:border-[#92795E] transition-colors text-xs"
                aria-label="LinkedIn — AUREN (nouvel onglet)"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="md:col-span-3 space-y-4">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#EAE6DD] font-medium block">
              Navigation
            </span>
            <ul className="space-y-2 text-sm text-[#BDB3A3]/90 font-light">
              <li>
                <a href="#hero" className="hover:text-[#EAE6DD] transition-colors">
                  01 · Séquence cinématique
                </a>
              </li>
              <li>
                <a href="#expertise" className="hover:text-[#EAE6DD] transition-colors">
                  02 · Savoir-faire & Services
                </a>
              </li>
              <li>
                <a href="#transformations" className="hover:text-[#EAE6DD] transition-colors">
                  03 · Avant / Après interactif
                </a>
              </li>
              <li>
                <a href="#methodologie" className="hover:text-[#EAE6DD] transition-colors">
                  04 · Méthodologie d’ingénierie
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#EAE6DD] transition-colors">
                  05 · Dossier d’échange
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 flex flex-col items-start md:items-end justify-between h-full space-y-6">
            <button
              onClick={scrollToTop}
              className="group flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-[#BDB3A3] hover:text-[#EAE6DD] transition-colors p-2 -mr-2"
              aria-label="Retourner en haut de page"
            >
              <span>Haut de page</span>
              <div className="w-9 h-9 rounded-full border border-[#EAE6DD]/20 group-hover:border-[#92795E] flex items-center justify-center transition-colors">
                <ArrowUp className="w-4 h-4 text-bronze-glow" />
              </div>
            </button>

            <div className="flex flex-col items-start md:items-end gap-2">
              <p className="text-left md:text-right font-mono text-xs text-[#BDB3A3]/80 leading-none">
                STUDIO DE DÉMONSTRATION<br />
                ARCHITECTURE & CONSTRUCTION
              </p>
            </div>
          </div>
        </div>

        {/* Legal & Demonstration Notice */}
        <div className="p-8 bg-[#151615] border border-[#EAE6DD]/8 rounded-xs text-[11px] text-[#BDB3A3]/70 leading-relaxed space-y-3">
          <p className="font-medium text-[#EAE6DD]">
            Mention de démonstration & déontologie
          </p>
          <p>
            AUREN est une marque de démonstration architecturale et technique conçue pour illustrer
            l’art de bâtir et de rénover avec rigueur. Les documents, vidéos et photographies de
            chantiers sont présentés à des fins exclusives de démonstration de direction artistique et
            de scénographie digitale, et ne constituent pas des références contractuelles d’une
            société immatriculée.
          </p>
        </div>

        {/* Bottom Tier: Copyright & Colophon */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#EAE6DD]/8 text-[10px] text-[#BDB3A3]/60 font-mono tracking-wider uppercase">
          <p>© {new Date().getFullYear()} AUREN — Tous droits réservés.</p>
          <p>
            CONÇU EN CORMORANT GARAMOND & MANROPE · ÉTUDE ARCHITECTURALE & DIRECTION DE TRAVAUX
          </p>
        </div>

      </div>
    </footer>
  );
}

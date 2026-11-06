/**
 * Écran de chargement plein écran affiché au premier rendu de l'app.
 * Masqué dès que le layout principal est prêt (useEffect final d'App).
 * Garde une marge de sécurité le temps que les images/frames se préchargent.
 */

import { useEffect, useState } from 'react';

const LoadingScreen = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // On attends un micro-tick puis on considère le layout chargé.
    // Cela laisse le temps aux images/frames de commencer leur préchargement.
    const timer = setTimeout(() => setReady(true), 120);
    return () => clearTimeout(timer);
  }, []);

  if (ready) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0F100F]"
    >
      <div className="flex flex-col items-center gap-6 pt-20">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#B49B7E] to-[#EAE6DD] flex items-center justify-center relative overflow-hidden">
          <span className="absolute inset-0 opacity-20"></span>
          <span className="text-2xl font-serif font-light text-[#0F100F]">AUREN</span>
        </div>

        <div className="w-16 h-16 rounded-full border-4 border-[#92795E] flex items-center justify-center">
          <span className="w-8 h-8 rounded-full bg-[#92795E] animate-spin"></span>
        </div>

        <p className="text-[#EAE6DD]/80 text-sm uppercase tracking-wider">Chargement de l'architecture...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
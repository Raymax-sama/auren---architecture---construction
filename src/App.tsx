/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Header from './components/Header';
import Hero from './components/Hero';
import Expertise from './components/Expertise';
import ComparisonSlider from './components/ComparisonSlider';
import Methodology from './components/Methodology';
import Contact from './components/Contact';
import Footer from './components/Footer';
import VideoModal from './components/VideoModal';

export default function App() {
  const [selectedService, setSelectedService] = useState<string>('Construction neuve');
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
  const [appReady, setAppReady] = useState<boolean>(false);// Track active section for precise navigation menu highlights
  useEffect(() => {
    const sectionIds = ['hero', 'expertise', 'transformations', 'methodologie', 'contact'];

    const handleScroll = () => {
      const scrollPos = window.scrollY + 180; // Offset for header height

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            setActiveSection(id);
            return;
          }
        }
      }
      setActiveSection('hero');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dès que le premier render est terminé, on considère l'app "prête".
  // Cela permet d'afficher l'écran de chargement le temps que les images/frames se préchargent.
  useEffect(() => {
    let isMounted = true;
    let imgComplete = false;

    // Vérifier si l'image Hero est déjà préchargée
    const img = new Image();
    img.src = 'https://auren-architecture.netlify.app/images/hero-poster-completed.jpg';
    img.onload = () => { imgComplete = true; };

    const checkReady = async () => {
      // Respecter prefers-reduced-motion : accélérer si demandé
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const timeoutMs = prefersReduced ? 2000 : 5000;
      const deadline = Date.now() + timeoutMs;

      while (Date.now() < deadline) {
        if (!isMounted) return;
        const fontsReady = document.fonts ? await document.fonts.ready : true;
        if (fontsReady && imgComplete) {
          setAppReady(true);
          return;
        }
        await new Promise(r => setTimeout(r, 100));
      }
      if (isMounted) setAppReady(true);
    };

    checkReady();

    return () => { isMounted = false; };
  }, []);

  const scrollToContact = (service?: string) => {
    if (service) {
      setSelectedService(service);
    }
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Si l'app n'est pas encore « prête », on n'affiche que l'écran de chargement.
  if (!appReady) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-[#0F100F] text-[#EAE6DD] flex flex-col font-sans selection:bg-[#92795E] selection:text-[#0F100F]">
      {/* Editorial Header (Clean 3-zone, no redundant buttons) */}
      <Header
        activeSection={activeSection}
        onOpenContact={() => scrollToContact()}
      />

      {/* Main Narrative Structure */}
      <main className="flex-1 w-full">
        {/* Section 01 — Cinematic Hero with Uncropped High-DPI 9:16 Canvas & Scroll Scrub */}
        <Hero onOpenContact={() => scrollToContact()} />

        {/* Section 02 — Expertise */}
        <Expertise onSelectService={(s) => scrollToContact(s)} />

        {/* Section 03 — Transformations (Before/After Slider) */}
        <ComparisonSlider />

        {/* Section 04 — Methodology with 16:9 Construction Video & CAD Studio */}
        <Methodology onOpenVideoModal={() => setIsVideoModalOpen(true)} />

        {/* Section 05 — Contact & Architectural Inquiry */}
        <Contact initialService={selectedService} />
      </main>

      {/* Editorial Colophon & Footer */}
      <Footer />

      {/* Fullscreen 16:9 Architectural Documentary Modal (triggered from Methodology) */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoSrc="/videos/videoArchi.mp4"
        title="Immersion Chantier 16:9 — Levage & Coordination BIM In Situ"
      />
    </div>
  );
}

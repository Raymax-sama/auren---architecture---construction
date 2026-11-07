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
  // Boot sequence: the curtain sits on top of an already-mounted page, so it
  // lifts onto laid-out content instead of a blank screen.
  const [appReady, setAppReady] = useState<boolean>(false);
  const [bootProgress, setBootProgress] = useState<number>(0);
  const [loaderVisible, setLoaderVisible] = useState<boolean>(true);

  // Track active section for precise navigation menu highlights
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

  // Boot sequence — the curtain reports genuine progress: the web fonts plus the
  // poster the hero actually displays. A minimum on-screen time keeps the reveal
  // from flashing, and a hard deadline guarantees we never trap a visitor behind
  // a slow asset.
  useEffect(() => {
    let isMounted = true;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const minMs = prefersReduced ? 450 : 1800;
    const maxMs = prefersReduced ? 1600 : 4500;
    const curtainMs = prefersReduced ? 300 : 1150;
    const startedAt = performance.now();

    // Entering the atelier always starts at the top of the narrative, even after
    // a reload from the middle of the page — the curtain must lift onto the hero.
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    let assetsReady = false;
    const fontsReady: Promise<unknown> = document.fonts ? document.fonts.ready : Promise.resolve();

    const poster = new Image();
    const posterReady = new Promise<void>((resolve) => {
      poster.onload = () => resolve();
      poster.onerror = () => resolve();
      poster.src = '/images/hero-poster-start.jpg';
    });

    Promise.all([fontsReady, posterReady]).then(() => {
      assetsReady = true;
    });

    const release = () => {
      window.clearInterval(timer);
      setBootProgress(100);
      setAppReady(true);
      window.setTimeout(() => {
        if (isMounted) setLoaderVisible(false);
      }, curtainMs);
    };

    const timer = window.setInterval(() => {
      if (!isMounted) return;
      const elapsed = performance.now() - startedAt;

      if ((assetsReady && elapsed >= minMs) || elapsed >= maxMs) {
        release();
        return;
      }

      // The counter must keep moving, otherwise a fast boot looks frozen: it
      // creeps toward 92% and only snaps to 100% when the release fires.
      const creep = Math.min(92, (elapsed / minMs) * 88);
      setBootProgress((prev) => Math.max(prev, Math.round(creep)));
    }, 50);

    return () => {
      isMounted = false;
      window.clearInterval(timer);
    };
  }, []);

  // Hold the page still behind the curtain, then hand scrolling back.
  useEffect(() => {
    if (appReady) {
      document.body.style.overflow = '';
      return;
    }
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [appReady]);

  const scrollToContact = (service?: string) => {
    if (service) {
      setSelectedService(service);
    }
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {loaderVisible && <LoadingScreen progress={bootProgress} exiting={appReady} />}

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
    </>
  );
}

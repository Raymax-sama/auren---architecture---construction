/**
 * Scroll-driven image sequence controller.
 *
 * Paints preloaded frames on a canvas, synchronised with the page scroll — the
 * same technique used by the Résidence Horizon module, extracted so the hero and
 * the "Chantier Réel" module share one battle-tested implementation.
 *
 * Frames are decoded ahead of time (no video seeking), which keeps the scrub
 * perfectly fluid on Vercel/Netlify and on mobile.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { drawImageContain, drawImageCover } from './frameSequence';

export type SequenceFit = 'cover' | 'contain';

export interface ScrollSequenceOptions {
  /** Number of frames in the sequence. */
  totalFrames: number;
  /** Public directory holding frame_001.webp … frame_NNN.webp (trailing slash). */
  directory: string;
  /** How each frame fills the canvas. */
  fit?: SequenceFit;
  /**
   * When false, no frame is downloaded and the scroll listener stays idle.
   * Used for modules that are only revealed on demand.
   */
  enabled?: boolean;
}

export interface ScrollSequenceState {
  /** Attach to the tall wrapper that defines the scroll length. */
  trackRef: React.RefObject<HTMLDivElement | null>;
  /** Attach to the canvas that displays the frames. */
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  /** 0 → 1 progress inside the track. */
  progress: number;
  /** Zero-based index of the currently painted frame. */
  frameIndex: number;
  /** How many frames have been decoded so far. */
  loadedFrames: number;
}

function buildFrameUrl(directory: string, index: number): string {
  return `${directory}frame_${String(index).padStart(3, '0')}.webp`;
}

export function useScrollSequence({
  totalFrames,
  directory,
  fit = 'cover',
  enabled = true,
}: ScrollSequenceOptions): ScrollSequenceState {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(totalFrames).fill(null));
  const frameRef = useRef<number>(0);

  const [progress, setProgress] = useState<number>(0);
  const [frameIndex, setFrameIndex] = useState<number>(0);
  const [loadedFrames, setLoadedFrames] = useState<number>(0);

  const paint = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas || canvas.width === 0 || canvas.height === 0) return;

      const clamped = Math.min(Math.max(index, 0), totalFrames - 1);
      const usable = (candidate: HTMLImageElement | null): candidate is HTMLImageElement =>
        !!candidate && candidate.complete && candidate.naturalWidth > 0;

      let img: HTMLImageElement | null = imagesRef.current[clamped];
      if (!usable(img)) {
        img = null;
        // Fall back to the nearest decoded frame so the scrub never flashes empty
        for (let offset = 1; offset < totalFrames; offset++) {
          const previous = imagesRef.current[clamped - offset];
          if (usable(previous)) {
            img = previous;
            break;
          }
          const next = imagesRef.current[clamped + offset];
          if (usable(next)) {
            img = next;
            break;
          }
        }
      }
      if (!img) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      if (fit === 'cover') {
        drawImageCover(ctx, img, canvas.width, canvas.height);
      } else {
        drawImageContain(ctx, img, canvas.width, canvas.height);
      }
    },
    [fit, totalFrames]
  );

  /** Match the canvas backing store to its displayed size (capped DPR). */
  const resizeCanvas = useCallback((): boolean => {
    const canvas = canvasRef.current;
    if (!canvas) return false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.round(canvas.clientWidth * dpr);
    const height = Math.round(canvas.clientHeight * dpr);
    if (width <= 0 || height <= 0) return false;
    if (canvas.width === width && canvas.height === height) return false;
    canvas.width = width;
    canvas.height = height;
    return true;
  }, []);

  // Progressive preload: opening/closing frames first, then the full sequence.
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    const images: (HTMLImageElement | null)[] = new Array(totalFrames).fill(null);
    imagesRef.current = images;

    const load = (index: number) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        if (cancelled) return;
        images[index - 1] = img;
        setLoadedFrames((count) => count + 1);
        if (index - 1 === frameRef.current) paint(frameRef.current);
      };
      img.onerror = () => {
        if (!cancelled) setLoadedFrames((count) => count + 1);
      };
      img.src = buildFrameUrl(directory, index);
    };

    const priority = new Set<number>([1, totalFrames]);
    for (let i = 2; i <= Math.min(12, totalFrames); i++) priority.add(i);
    priority.forEach(load);
    for (let i = 1; i <= totalFrames; i++) {
      if (!priority.has(i)) load(i);
    }

    return () => {
      cancelled = true;
    };
  }, [directory, enabled, totalFrames, paint]);

  // Scroll → frame synchronisation.
  // Browsers already coalesce scroll events to the display refresh rate, so the
  // frame is painted synchronously: no dependency on requestAnimationFrame, which
  // stays suspended in throttled / background tabs and low-power modes.
  useEffect(() => {
    if (!enabled) return;

    const update = () => {
      const track = trackRef.current;
      if (!track) return;
      resizeCanvas();

      const rect = track.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;

      if (scrollable <= 0) {
        frameRef.current = 0;
        paint(0);
        return;
      }

      const nextProgress = Math.min(Math.max(-rect.top / scrollable, 0), 1);
      const index = Math.min(Math.floor(nextProgress * totalFrames), totalFrames - 1);
      frameRef.current = index;
      paint(index);
      setProgress((previous) => (Math.abs(previous - nextProgress) > 0.002 ? nextProgress : previous));
      setFrameIndex((previous) => (previous === index ? previous : index));
    };

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [enabled, paint, resizeCanvas, totalFrames]);

  // Repaint when the canvas box itself changes size (layout switch, rotation…).
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => {
      if (resizeCanvas()) paint(frameRef.current);
    });
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [paint, resizeCanvas]);

  return { trackRef, canvasRef, progress, frameIndex, loadedFrames };
}

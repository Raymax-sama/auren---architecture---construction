import { useEffect, useRef, useState } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';
import { safePlayVideo, safePauseVideo } from '../utils/safeVideo';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc?: string;
  title?: string;
}

export default function VideoModal({
  isOpen,
  onClose,
  videoSrc = '/videos/videoArchi.mp4',
  title = 'Documentaire Chantier — Direction de Travaux & Gros Œuvre',
}: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(10);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'm') {
        e.preventDefault();
        toggleMute();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.currentTime = 0;
      void safePlayVideo(videoRef.current).then((started) => {
        setIsPlaying(started);
      });
    } else if (!isOpen && videoRef.current) {
      void safePauseVideo(videoRef.current);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      void safePlayVideo(v).then((started) => {
        if (started) setIsPlaying(true);
      });
    } else {
      void safePauseVideo(v).then(() => {
        setIsPlaying(false);
      });
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      void el.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => undefined);
    } else {
      void document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => undefined);
    }
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    setCurrentTime(v.currentTime);
    if (v.duration && !isNaN(v.duration)) {
      setDuration(v.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const target = parseFloat(e.target.value);
    v.currentTime = target;
    setCurrentTime(target);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#090A09]/95 backdrop-blur-2xl p-3 sm:p-6 md:p-10 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        ref={containerRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl my-auto max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-3rem)] bg-[#141514] border border-[#EAE6DD]/20 rounded-xs shadow-[0_25px_70px_rgba(0,0,0,0.85)] overflow-y-auto overscroll-contain flex flex-col"
      >
        {/* Top Header Bar (sticky so the close button stays reachable while scrolling) */}
        <div className="sticky top-0 z-20 flex items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-[#181A18] border-b border-[#EAE6DD]/10">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#92795E]" />
            <h2 className="text-[11px] sm:text-sm font-medium tracking-wide uppercase text-[#EAE6DD] leading-snug">
              {title}
            </h2>
            <span className="hidden sm:inline-block text-[10px] font-mono text-[#B49B7E] uppercase px-2 py-0.5 border border-[#92795E]/40 rounded-xs">
              Format 16:9 4K
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#EAE6DD]/80 hover:text-[#EAE6DD] hover:bg-[#252825] rounded-xs transition-colors cursor-pointer"
            aria-label="Fermer le lecteur"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video 16:9 Viewport */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden group">
          <video
            ref={videoRef}
            playsInline
            loop
            preload="auto"
            onTimeUpdate={handleTimeUpdate}
            onClick={togglePlay}
            onError={(e) => {
              console.warn('VideoModal video error handled safely', e);
            }}
            className="w-full h-full object-cover cursor-pointer"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>

          {/* Center Play/Pause indicator on click */}
          {!isPlaying && (
            <button
              onClick={togglePlay}
              className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-[#151615]/80 border-2 border-[#92795E] text-[#EAE6DD] flex items-center justify-center backdrop-blur-md shadow-2xl hover:scale-105 transition-all cursor-pointer"
              aria-label="Lancer la vidéo"
            >
              <Play className="w-8 h-8 translate-x-0.5 text-[#EAE6DD]" />
            </button>
          )}

          {/* Architectural Overlay Information */}
          <div className="absolute top-4 left-4 z-10 pointer-events-none hidden sm:flex flex-col gap-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#B49B7E] bg-[#121312]/80 px-2.5 py-1 backdrop-blur-md border border-[#EAE6DD]/15 rounded-xs">
              DIRECTION TECHNIQUE & CONTRÔLE BIM
            </span>
            <span className="text-[9px] font-mono text-[#EAE6DD]/70 bg-[#121312]/60 px-2 py-0.5 backdrop-blur-sm rounded-xs">
              Levage structurel • Portées libres 15m
            </span>
          </div>
        </div>

        {/* Custom Luxury Controls Bar */}
        <div className="p-4 sm:p-5 bg-[#181A18] border-t border-[#EAE6DD]/10 flex flex-col gap-3">
          {/* Timeline slider */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-[#BDB3A3] tabular-nums">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 10}
              step={0.05}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1 bg-[#EAE6DD]/20 accent-[#92795E] rounded-full cursor-pointer"
              aria-label="Progression de la vidéo"
            />
            <span className="text-[11px] font-mono text-[#BDB3A3] tabular-nums">
              {formatTime(duration)}
            </span>
          </div>

          {/* Actions & telemetry */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="p-2 text-[#EAE6DD] hover:text-[#B49B7E] transition-colors cursor-pointer"
                aria-label={isPlaying ? 'Pause' : 'Lecture'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={toggleMute}
                className="p-2 text-[#EAE6DD] hover:text-[#B49B7E] transition-colors cursor-pointer"
                aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <span className="hidden md:inline-block text-[11px] font-mono text-[#BDB3A3]/75">
                Vidéo captée sur chantier réel AUREN
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleFullscreen}
                className="p-2 text-[#EAE6DD] hover:text-[#B49B7E] transition-colors cursor-pointer"
                aria-label={isFullscreen ? 'Quitter plein écran' : 'Plein écran'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

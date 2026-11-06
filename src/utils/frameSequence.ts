/**
 * Frame Sequence Preloader & Painter for Smooth 60fps Canvas Scrubbing.
 * Eliminates video decoding jitter and network seek stalls on Vercel/Netlify.
 */

export const TOTAL_HERO_FRAMES = 83;
export const TOTAL_BASTIDE_FRAMES = 60;

export function getFrameUrl(index: number): string {
  const padded = String(index).padStart(3, '0');
  return `/frames/optimized/frame_${padded}.webp`;
}

export function getFallbackFrameUrl(index: number): string {
  const padded = String(index).padStart(3, '0');
  return `/frames/hero/frame_${padded}.jpg`;
}

export function getBastideFrameUrl(index: number): string {
  const padded = String(index).padStart(3, '0');
  return `/frames/bastide/frame_${padded}.webp`;
}

/**
 * Hero "Mas Cévenol" scroll sequence, generated from /videos/hero-bastide.mp4
 * (1280×720, 10 fps → one frame every 100 ms of footage).
 */
export const TOTAL_MAS_FRAMES = 100;
export const MAS_FRAMES_DIRECTORY = '/frames/mas-cevenol/';

/**
 * "Chantier Réel" scroll sequence, generated from /videos/videoArchi.mp4.
 */
export const TOTAL_CHANTIER_FRAMES = 100;
export const CHANTIER_FRAMES_DIRECTORY = '/frames/chantier/';

/**
 * Preload initial critical frames first (first 10 and last frame), then the rest progressively.
 */
export function preloadCriticalFrames(
  onProgress?: (loadedCount: number, total: number) => void
): Promise<HTMLImageElement[]> {
  const images: HTMLImageElement[] = new Array(TOTAL_HERO_FRAMES);
  let loadedCount = 0;

  return new Promise((resolve) => {
    // 1. First priority: Frame 1 and Frame 83 (the start and end states)
    const priorityIndices = [1, TOTAL_HERO_FRAMES];
    for (let i = 2; i <= 15; i++) priorityIndices.push(i);

    const loadImage = (idx: number): Promise<void> => {
      return new Promise((res) => {
        const img = new Image();
        img.src = getFrameUrl(idx);
        img.onload = () => {
          images[idx - 1] = img;
          loadedCount++;
          onProgress?.(loadedCount, TOTAL_HERO_FRAMES);
          res();
        };
        img.onerror = () => {
          // Fallback to jpg if webp fails
          const fallback = new Image();
          fallback.src = getFallbackFrameUrl(idx);
          fallback.onload = () => {
            images[idx - 1] = fallback;
            loadedCount++;
            onProgress?.(loadedCount, TOTAL_HERO_FRAMES);
            res();
          };
          fallback.onerror = () => {
            loadedCount++;
            res();
          };
        };
      });
    };

    // Load priority frames first
    Promise.all(priorityIndices.map(loadImage)).then(() => {
      resolve(images);

      // Progressively load remaining frames in background
      for (let i = 1; i <= TOTAL_HERO_FRAMES; i++) {
        if (!priorityIndices.includes(i)) {
          loadImage(i);
        }
      }
    });
  });
}

/**
 * Paint frame to canvas with object-fit: cover math
 */
export function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number
) {
  if (!img || !img.width || !img.height) return;

  const imgRatio = img.width / img.height;
  const canvasRatio = canvasWidth / canvasHeight;

  let renderWidth = canvasWidth;
  let renderHeight = canvasHeight;
  let x = 0;
  let y = 0;

  if (canvasRatio > imgRatio) {
    // Canvas is wider than image
    renderHeight = canvasWidth / imgRatio;
    y = (canvasHeight - renderHeight) / 2;
  } else {
    // Canvas is taller than image
    renderWidth = canvasHeight * imgRatio;
    x = (canvasWidth - renderWidth) / 2;
  }

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.drawImage(img, x, y, renderWidth, renderHeight);
}

/**
 * Paint frame to canvas with object-fit: contain math (preserves entire frame, zero cropping)
 */
export function drawImageContain(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number
) {
  if (!img || !img.width || !img.height) return;

  const imgRatio = img.width / img.height;
  const canvasRatio = canvasWidth / canvasHeight;

  let renderWidth = canvasWidth;
  let renderHeight = canvasHeight;
  let x = 0;
  let y = 0;

  if (canvasRatio > imgRatio) {
    renderWidth = canvasHeight * imgRatio;
    x = (canvasWidth - renderWidth) / 2;
  } else {
    renderHeight = canvasWidth / imgRatio;
    y = (canvasHeight - renderHeight) / 2;
  }

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.drawImage(img, x, y, renderWidth, renderHeight);
}

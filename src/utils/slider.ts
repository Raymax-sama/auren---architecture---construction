/**
 * Slider calculation utilities for before-after comparison components.
 */

export function clampPercentage(val: number, min: number = 0, max: number = 100): number {
  if (isNaN(val)) return 50;
  return Math.min(Math.max(val, min), max);
}

export function calculateSliderPercentage(
  clientX: number,
  containerRect: { left: number; width: number }
): number {
  if (!containerRect || containerRect.width <= 0) return 50;
  const relativeX = clientX - containerRect.left;
  const rawPercentage = (relativeX / containerRect.width) * 100;
  return clampPercentage(Math.round(rawPercentage * 10) / 10, 0, 100);
}

export function getActiveStepFromProgress(progress: number, totalSteps: number): number {
  if (totalSteps <= 0) return 0;
  const clamped = Math.min(Math.max(progress, 0), 0.999);
  return Math.floor(clamped * totalSteps);
}

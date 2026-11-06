/**
 * Safe HTML5 Video Play/Pause Controller.
 * Solves the browser error: "The play() request was interrupted by a call to pause()."
 * (https://goo.gl/LdLk22)
 *
 * Browsers return a Promise from HTMLMediaElement.play(). Calling .pause()
 * before that promise resolves causes an unhandled AbortError rejection.
 */

// WeakMap to store active play promises per video element
const pendingPlayPromises = new WeakMap<HTMLVideoElement, Promise<void>>();

/**
 * Initiates video playback safely and catches harmless AbortErrors.
 */
export async function safePlayVideo(video: HTMLVideoElement | null): Promise<boolean> {
  if (!video) return false;

  try {
    const promise = video.play();
    if (promise !== undefined) {
      pendingPlayPromises.set(video, promise);
      await promise;
      pendingPlayPromises.delete(video);
      return true;
    }
    return true;
  } catch (error: unknown) {
    pendingPlayPromises.delete(video);
    // Ignore AbortError caused by rapid pause / user navigation
    if (error instanceof Error && error.name === 'AbortError') {
      return false;
    }
    // Ignore NotAllowedError (autoplay policy restrictions)
    if (error instanceof Error && error.name === 'NotAllowedError') {
      return false;
    }
    return false;
  }
}

/**
 * Pauses video only after any in-flight play() promise has settled.
 */
export async function safePauseVideo(video: HTMLVideoElement | null): Promise<void> {
  if (!video) return;

  const inFlightPromise = pendingPlayPromises.get(video);
  if (inFlightPromise) {
    try {
      await inFlightPromise;
    } catch {
      // In-flight play already failed or was aborted, safe to proceed
    } finally {
      pendingPlayPromises.delete(video);
    }
  }

  try {
    video.pause();
  } catch {
    // Ignore any pause failure on detached elements
  }
}

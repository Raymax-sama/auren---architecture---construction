import test from 'node:test';
import assert from 'node:assert/strict';
import { safePlayVideo, safePauseVideo } from './safeVideo';

test('safePlayVideo handles null video gracefully', async () => {
  const result = await safePlayVideo(null);
  assert.equal(result, false);
});

test('safePauseVideo handles null video gracefully', async () => {
  await safePauseVideo(null);
  assert.ok(true);
});

test('safePlayVideo suppresses AbortError and returns false', async () => {
  const mockVideo = {
    play: () => {
      const err = new Error('The play() request was interrupted by a call to pause().');
      err.name = 'AbortError';
      return Promise.reject(err);
    },
    pause: () => {},
  } as unknown as HTMLVideoElement;

  const result = await safePlayVideo(mockVideo);
  assert.equal(result, false);
});

test('safePlayVideo handles successful play', async () => {
  let played = false;
  const mockVideo = {
    play: () => {
      played = true;
      return Promise.resolve();
    },
    pause: () => {},
  } as unknown as HTMLVideoElement;

  const result = await safePlayVideo(mockVideo);
  assert.equal(result, true);
  assert.equal(played, true);
});

test('safePauseVideo calls pause after in-flight play resolves', async () => {
  let paused = false;
  let playResolve: () => void = () => {};
  const mockVideo = {
    play: () =>
      new Promise<void>((resolve) => {
        playResolve = resolve;
      }),
    pause: () => {
      paused = true;
    },
  } as unknown as HTMLVideoElement;

  const playPromise = safePlayVideo(mockVideo);
  const pausePromise = safePauseVideo(mockVideo);

  // Still not paused until play settles
  playResolve();
  await playPromise;
  await pausePromise;

  assert.equal(paused, true);
});

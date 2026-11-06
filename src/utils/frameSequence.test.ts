import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getFrameUrl,
  getFallbackFrameUrl,
  getBastideFrameUrl,
  TOTAL_HERO_FRAMES,
  TOTAL_BASTIDE_FRAMES,
} from './frameSequence';

test('getFrameUrl generates correctly zero-padded frame paths', () => {
  assert.equal(getFrameUrl(1), '/frames/optimized/frame_001.webp');
  assert.equal(getFrameUrl(42), '/frames/optimized/frame_042.webp');
  assert.equal(getFrameUrl(83), '/frames/optimized/frame_083.webp');
});

test('getFallbackFrameUrl generates correctly zero-padded jpeg paths', () => {
  assert.equal(getFallbackFrameUrl(1), '/frames/hero/frame_001.jpg');
  assert.equal(getFallbackFrameUrl(83), '/frames/hero/frame_083.jpg');
});

test('getBastideFrameUrl generates correctly zero-padded bastide frame paths', () => {
  assert.equal(getBastideFrameUrl(1), '/frames/bastide/frame_001.webp');
  assert.equal(getBastideFrameUrl(30), '/frames/bastide/frame_030.webp');
  assert.equal(getBastideFrameUrl(60), '/frames/bastide/frame_060.webp');
});

test('TOTAL_HERO_FRAMES and TOTAL_BASTIDE_FRAMES are valid', () => {
  assert.equal(TOTAL_HERO_FRAMES, 83);
  assert.equal(TOTAL_BASTIDE_FRAMES, 60);
});


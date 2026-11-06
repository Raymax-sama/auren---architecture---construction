import test from 'node:test';
import assert from 'node:assert/strict';
import { clampPercentage, calculateSliderPercentage, getActiveStepFromProgress } from './slider';

test('clampPercentage clamps values between min and max', () => {
  assert.equal(clampPercentage(45), 45);
  assert.equal(clampPercentage(-10), 0);
  assert.equal(clampPercentage(110), 100);
  assert.equal(clampPercentage(NaN), 50);
});

test('calculateSliderPercentage computes percentage based on bounding box', () => {
  const rect = { left: 100, width: 800 };
  assert.equal(calculateSliderPercentage(100, rect), 0);
  assert.equal(calculateSliderPercentage(500, rect), 50);
  assert.equal(calculateSliderPercentage(900, rect), 100);
  assert.equal(calculateSliderPercentage(50, rect), 0);
  assert.equal(calculateSliderPercentage(1000, rect), 100);
});

test('getActiveStepFromProgress maps 0..1 to step index', () => {
  assert.equal(getActiveStepFromProgress(0, 4), 0);
  assert.equal(getActiveStepFromProgress(0.24, 4), 0);
  assert.equal(getActiveStepFromProgress(0.26, 4), 1);
  assert.equal(getActiveStepFromProgress(0.51, 4), 2);
  assert.equal(getActiveStepFromProgress(0.76, 4), 3);
  assert.equal(getActiveStepFromProgress(1.0, 4), 3);
});

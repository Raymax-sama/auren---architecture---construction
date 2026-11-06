import test from 'node:test';
import assert from 'node:assert/strict';
import { validateEmail, validatePhone, validateContactForm, formatCurrency } from './validation';

test('validateEmail correctly validates email formats', () => {
  assert.equal(validateEmail('contact@auren.archi'), true);
  assert.equal(validateEmail('client.premium@domain.co'), true);
  assert.equal(validateEmail('invalid-email'), false);
  assert.equal(validateEmail('@domain.com'), false);
  assert.equal(validateEmail(''), false);
});

test('validatePhone correctly validates optional phone numbers', () => {
  assert.equal(validatePhone(''), true); // optional
  assert.equal(validatePhone('+33 6 12 34 56 78'), true);
  assert.equal(validatePhone('0145203040'), true);
  assert.equal(validatePhone('abc'), false);
  assert.equal(validatePhone('123'), false); // too short
});

test('validateContactForm checks required fields', () => {
  const invalid = validateContactForm({
    fullName: '',
    email: 'bad',
    projectType: '',
    description: 'too short',
  });
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.fullName);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.projectType);
  assert.ok(invalid.errors.description);

  const valid = validateContactForm({
    fullName: 'Éléonore de Vigny',
    email: 'eleonore@vigny.fr',
    phone: '+33 6 88 99 00 11',
    projectType: 'Construction neuve',
    description: 'Projet de construction d’une villa contemporaine de 450m² avec piscine à débordement.',
  });
  assert.equal(valid.isValid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});

test('formatCurrency formats amounts in euros', () => {
  const formatted = formatCurrency(250000);
  assert.ok(formatted.includes('250'));
  assert.ok(formatted.includes('€'));
});

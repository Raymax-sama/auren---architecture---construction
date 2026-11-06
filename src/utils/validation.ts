/**
 * Pure helper functions for form validation, formatting and project estimation.
 */

export interface ContactFormData {
  fullName: string;
  email: string;
  phone?: string;
  projectType: string;
  location?: string;
  estimatedBudget?: string;
  description: string;
}

export interface ValidationErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  projectType?: string;
  description?: string;
}

export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

export function validatePhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return true; // Phone is optional
  const cleaned = phone.replace(/[\s.-]/g, '');
  // Accepts international format e.g. +33612345678 or 0612345678
  return /^(\+?[0-9]{8,15})$/.test(cleaned);
}

export function validateContactForm(data: ContactFormData): { isValid: boolean; errors: ValidationErrors } {
  const errors: ValidationErrors = {};

  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.fullName = 'Veuillez renseigner votre nom complet (au moins 2 caractères).';
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.email = 'Veuillez saisir une adresse email valide.';
  }

  if (data.phone && data.phone.trim().length > 0 && !validatePhone(data.phone)) {
    errors.phone = 'Le format du numéro de téléphone n’est pas valide.';
  }

  if (!data.projectType || data.projectType.trim() === '') {
    errors.projectType = 'Veuillez sélectionner un type de projet.';
  }

  if (!data.description || data.description.trim().length < 15) {
    errors.description = 'Veuillez décrire brièvement votre projet (au moins 15 caractères).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount);
}

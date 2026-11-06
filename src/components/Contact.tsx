import { useState, useId } from 'react';
import { ArrowUpRight, CheckCircle, Mail, MapPin, Phone, Shield } from 'lucide-react';
import { validateContactForm, ContactFormData, ValidationErrors } from '../utils/validation';

interface ContactProps {
  initialService?: string;
}

export default function Contact({ initialService }: ContactProps) {
  const formId = useId();
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    email: '',
    phone: '',
    projectType: initialService || 'Construction neuve',
    location: '',
    estimatedBudget: '500k€ - 1M€',
    description: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submissionRef, setSubmissionRef] = useState<string>('');

  const projectTypes = [
    'Construction neuve',
    'Rénovation complète',
    'Aménagement intérieur',
    'Étude préliminaire & faisabilité',
  ];

  const budgetRanges = [
    '250k€ - 500k€',
    '500k€ - 1M€',
    '1M€ - 2M€',
    '> 2M€',
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateContactForm(formData);

    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }

    // Generate demonstration reference code
    const refCode = `ARN-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmissionRef(refCode);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      projectType: 'Construction neuve',
      location: '',
      estimatedBudget: '500k€ - 1M€',
      description: '',
    });
    setErrors({});
  };

  return (
    <section
      id="contact"
      className="relative z-20 bg-[#151615] text-[#EAE6DD] py-20 sm:py-28 md:py-36 px-6 md:px-12 border-t border-[#EAE6DD]/15 scroll-mt-24"
      aria-label="Contacter le studio"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-16 md:pb-20 border-b border-[#EAE6DD]/15">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] text-bronze-glow font-medium">
              05 / Échange Préliminaire
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#EAE6DD] font-light tracking-tight leading-tight">
              Votre projet <br />
              <span className="italic font-normal text-[#BDB3A3]">commence ici.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm md:text-base text-[#BDB3A3] leading-relaxed font-light">
            Présentez-nous l’ambition de votre futur lieu de vie ou de villégiature. Notre direction
            technique étudie chaque dossier avec discrétion et rigueur.
          </p>
        </div>

        {/* Content Layout */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Architectural Atelier Context (4 cols) */}
          <div className="lg:col-span-4 space-y-10">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-[0.2em] text-bronze-glow font-medium block">
                Engagement & Confidentialité
              </span>
              <p className="text-sm text-[#BDB3A3] font-light leading-relaxed">
                Chaque projet est traité sous engagement de confidentialité stricte. Nous n’acceptons
                qu’un nombre limité d’opérations simultanées afin de garantir une disponibilité absolue
                de nos équipes de direction.
              </p>
            </div>

            <div className="space-y-6 pt-4 border-t border-[#EAE6DD]/10">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-bronze-glow shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-[#EAE6DD] font-medium">
                    Atelier & Direction Technique
                  </h3>
                  <p className="text-xs text-[#BDB3A3] mt-1 font-light leading-relaxed">
                    Rayonnement Provence, Côte d’Azur, Paris & Suisse
                    <br />
                    <span className="text-[10px] text-[#BDB3A3]/75 italic">
                      (Démonstration de studio architectural)
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-bronze-glow shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-[#EAE6DD] font-medium">
                    Courriel Direct
                  </h3>
                  <p className="text-xs text-[#BDB3A3] mt-1 font-mono">
                    contact@auren-architecture.demo
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Shield className="w-5 h-5 text-bronze-glow shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-[#EAE6DD] font-medium">
                    Délai de Réponse
                  </h3>
                  <p className="text-xs text-[#BDB3A3] mt-1 font-light">
                    Prise de contact sous 48 heures ouvrées
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form with Underlined Architectural Aesthetic (8 cols) */}
          <div className="lg:col-span-8 bg-[#1F211F]/50 p-8 md:p-12 border border-[#EAE6DD]/10 rounded-xs shadow-xl">
            {submitted ? (
              <div className="py-8 space-y-6 text-center animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-[#92795E]/20 text-bronze-glow mx-auto flex items-center justify-center">
                  <CheckCircle className="w-8 h-8" />
                </div>
                
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.25em] text-bronze-glow font-mono">
                    Dossier Enregistré • Réf. {submissionRef}
                  </span>
                  <h3 className="font-serif text-3xl md:text-4xl text-[#EAE6DD] font-light">
                    Merci, {formData.fullName}.
                  </h3>
                  <p className="text-sm text-[#BDB3A3] max-w-lg mx-auto font-light leading-relaxed">
                    Votre demande d’étude pour votre projet de{' '}
                    <strong className="text-[#EAE6DD] font-medium">{formData.projectType}</strong> a bien
                    été prise en compte par notre direction de projet.
                  </p>
                </div>

                <div className="max-w-md mx-auto p-4 bg-[#151615] border border-[#EAE6DD]/15 text-left text-xs font-mono space-y-2 text-[#BDB3A3]">
                  <div className="flex justify-between">
                    <span>Contact :</span>
                    <span className="text-[#EAE6DD]">{formData.email}</span>
                  </div>
                  {formData.phone && (
                    <div className="flex justify-between">
                      <span>Téléphone :</span>
                      <span className="text-[#EAE6DD]">{formData.phone}</span>
                    </div>
                  )}
                  {formData.location && (
                    <div className="flex justify-between">
                      <span>Localisation :</span>
                      <span className="text-[#EAE6DD]">{formData.location}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Budget indicatif :</span>
                    <span className="text-[#EAE6DD]">{formData.estimatedBudget}</span>
                  </div>
                  <div className="pt-2 border-t border-[#EAE6DD]/10 text-[10px] text-bronze-glow">
                    État de démonstration : aucun message réel n&apos;a été transmis à un tiers.
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 text-xs uppercase tracking-[0.2em] font-medium text-[#151615] bg-[#EAE6DD] hover:bg-bronze-ink hover:text-[#EAE6DD] transition-all"
                  >
                    Soumettre une nouvelle étude
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-8">
                
                {/* Project Type Selector */}
                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-[0.2em] text-[#BDB3A3] font-medium block">
                    Type de réalisation envisagée *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {projectTypes.map((type) => {
                      const isSelected = formData.projectType === type;
                      return (
                        <button
                          type="button"
                          key={type}
                          onClick={() => setFormData((prev) => ({ ...prev, projectType: type }))}
                          className={`p-3.5 text-left text-xs uppercase tracking-wider transition-all border rounded-xs flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#EAE6DD] text-[#151615] border-[#EAE6DD] font-semibold shadow-md'
                              : 'bg-[#151615]/70 text-[#BDB3A3] border-[#EAE6DD]/15 hover:border-[#EAE6DD]/40 hover:text-[#EAE6DD]'
                          }`}
                        >
                          <span>{type}</span>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-[#92795E] shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {errors.projectType && (
                    <p className="text-xs text-rose-400 font-mono mt-1">{errors.projectType}</p>
                  )}
                </div>

                {/* Name & Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label
                      htmlFor={`${formId}-fullName`}
                      className="text-xs uppercase tracking-[0.2em] text-[#BDB3A3] font-medium block"
                    >
                      Nom & Prénom *
                    </label>
                    <input
                      id={`${formId}-fullName`}
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Ex : Éléonore de Vigny"
                      className="w-full bg-transparent border-b border-[#EAE6DD]/25 focus:border-[#92795E] py-2.5 text-sm text-[#EAE6DD] placeholder-[#BDB3A3]/40 focus:outline-none transition-colors"
                      required
                    />
                    {errors.fullName && (
                      <p className="text-xs text-rose-400 font-mono mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor={`${formId}-email`}
                      className="text-xs uppercase tracking-[0.2em] text-[#BDB3A3] font-medium block"
                    >
                      Adresse email *
                    </label>
                    <input
                      id={`${formId}-email`}
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="contact@exemple.com"
                      className="w-full bg-transparent border-b border-[#EAE6DD]/25 focus:border-[#92795E] py-2.5 text-sm text-[#EAE6DD] placeholder-[#BDB3A3]/40 focus:outline-none transition-colors"
                      required
                    />
                    {errors.email && (
                      <p className="text-xs text-rose-400 font-mono mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Phone & Location Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label
                      htmlFor={`${formId}-phone`}
                      className="text-xs uppercase tracking-[0.2em] text-[#BDB3A3] font-medium block"
                    >
                      Téléphone <span className="text-[10px] text-[#BDB3A3]/75">(Optionnel)</span>
                    </label>
                    <input
                      id={`${formId}-phone`}
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+33 6 00 00 00 00"
                      className="w-full bg-transparent border-b border-[#EAE6DD]/25 focus:border-[#92795E] py-2.5 text-sm text-[#EAE6DD] placeholder-[#BDB3A3]/40 focus:outline-none transition-colors"
                    />
                    {errors.phone && (
                      <p className="text-xs text-rose-400 font-mono mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor={`${formId}-location`}
                      className="text-xs uppercase tracking-[0.2em] text-[#BDB3A3] font-medium block"
                    >
                      Localisation du terrain ou de la propriété
                    </label>
                    <input
                      id={`${formId}-location`}
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Ex : Cap d’Antibes, Luberon, Genève..."
                      className="w-full bg-transparent border-b border-[#EAE6DD]/25 focus:border-[#92795E] py-2.5 text-sm text-[#EAE6DD] placeholder-[#BDB3A3]/40 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Budget Selection */}
                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-[0.2em] text-[#BDB3A3] font-medium block">
                    Enveloppe budgétaire estimée travaux
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {budgetRanges.map((b) => {
                      const isSelected = formData.estimatedBudget === b;
                      return (
                        <button
                          type="button"
                          key={b}
                          onClick={() => setFormData((prev) => ({ ...prev, estimatedBudget: b }))}
                          className={`p-2.5 text-center text-xs font-mono transition-all border rounded-xs ${
                            isSelected
                              ? 'bg-[#9E8467] text-[#151615] border-[#9E8467] font-bold shadow-sm'
                              : 'bg-[#151615]/70 text-[#BDB3A3] border-[#EAE6DD]/15 hover:border-[#EAE6DD]/40 hover:text-[#EAE6DD]'
                          }`}
                        >
                          {b}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Project Description */}
                <div className="space-y-2">
                  <label
                    htmlFor={`${formId}-description`}
                    className="text-xs uppercase tracking-[0.2em] text-[#BDB3A3] font-medium block"
                  >
                    Description & Ambitions du projet *
                  </label>
                  <textarea
                    id={`${formId}-description`}
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Précisez vos souhaits (superficie approximative, topographie, particularités architecturales, échéance souhaitée)..."
                    className="w-full bg-transparent border-b border-[#EAE6DD]/25 focus:border-[#92795E] py-2.5 text-sm text-[#EAE6DD] placeholder-[#BDB3A3]/40 focus:outline-none transition-colors resize-none"
                    required
                  />
                  {errors.description && (
                    <p className="text-xs text-rose-400 font-mono mt-1">{errors.description}</p>
                  )}
                </div>

                {/* Submit Action */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <p className="text-[11px] text-[#BDB3A3]/75 font-light">
                    * Champs requis pour l&apos;établissement du diagnostic préliminaire.
                  </p>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-4 bg-[#EAE6DD] text-[#151615] text-xs uppercase tracking-[0.25em] font-medium hover:bg-bronze-ink hover:text-[#EAE6DD] transition-all duration-300 shadow-md inline-flex items-center justify-center gap-3 focus:outline-none focus:ring-2 focus:ring-[#92795E]"
                  >
                    <span>Transmettre le dossier</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>

              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}

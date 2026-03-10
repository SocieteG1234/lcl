import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

const LCL_BLUE   = '#1a237e';
const LCL_YELLOW = '#f5c518';

const slides = [
  {
    title: 'Mieux que la petite souris, 50€ offerts !',
    subtitle: "Offre réservée aux enfants de 0 à 9 ans pour l'ouverture de leur premier compte et premier livret avec versements réguliers.",
    cta: "Découvrir l'offre",

    action: 'inscription',
  },
];

const needItems = [
  { label: 'Ouvrir un compte en ligne',   image: '/images/besoin-compte.png', action: 'inscription' },
  { label: 'Simuler un prêt immobilier',  image: '/images/besoin-immo.png',   action: 'login'       },
  { label: 'Tutos vidéos',                image: '/images/besoin-video.png',  action: 'login'       },
  { label: 'Questions fréquentes',        image: '/images/besoin-faq.png',    action: 'login'       },
];

export default function HeroSection({ onNavigateToLogin, onNavigateToInscription }) {
  const [current, setCurrent] = useState(0);

  const handleCta = (action) => {
    if (action === 'inscription') onNavigateToInscription?.();
    else onNavigateToLogin?.();
  };

  return (
    <div>
      {/* ── Carrousel hero ── */}
      <section style={{ background: LCL_BLUE }} className="relative overflow-hidden">
        {/* Image de fond */}
        {slides[current].image && (
          <img
            src={slides[current].image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
          />
        )}

        <div className="relative z-10 max-w-lg mx-auto px-6 pt-10 pb-12">
          {/* Badge en haut à droite */}
          <div className="flex justify-end mb-4">
            <img
              src="/images/A1.jpeg"
              alt="Élu Service Client 2026"
              className="h-20 w-auto object-contain"
            />
          </div>

          {/* Titre aligné à gauche */}
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
            {slides[current].title}
          </h1>

          {/* Sous-titre aligné à gauche */}
          <p className="text-white/80 text-base leading-relaxed mb-8">
            {slides[current].subtitle}
          </p>

          {/* Bouton CTA */}
          <button
            onClick={() => handleCta(slides[current].action)}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base transition hover:opacity-90 shadow-lg"
            style={{ background: LCL_YELLOW, color: LCL_BLUE }}
          >
            {slides[current].cta}
            <ChevronRight size={20} />
          </button>

          {/* Dots pagination */}
          <div className="flex items-center justify-center gap-2 mt-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="transition-all duration-300 rounded-full border-2"
                style={{
                  width:       i === current ? '28px' : '12px',
                  height:      '12px',
                  background:  i === current ? LCL_YELLOW : 'transparent',
                  borderColor: i === current ? LCL_YELLOW : 'rgba(255,255,255,0.6)',
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Parlons de vos besoins ── */}
      <section className="bg-white py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-xl mx-auto">
          <h2
            className="text-2xl sm:text-3xl font-bold text-center mb-10"
            style={{ color: LCL_BLUE }}
          >
            Parlons de vos besoins
          </h2>

          <div className="space-y-8">
            {needItems.map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-3 cursor-pointer group"
                onClick={() => handleCta(item.action)}
              >
                <img
                  src={item.image}
                  alt={item.label}
                  className="w-28 h-28 rounded-full object-cover shadow-md transition group-hover:scale-105"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div
                  className="w-28 h-28 rounded-full items-center justify-center shadow-md"
                  style={{ display: 'none', background: '#3949ab' }}
                >
                  <span className="text-white text-3xl font-bold">{item.label[0]}</span>
                </div>
                <span
                  className="text-base font-medium hover:underline"
                  style={{ color: '#3949ab' }}
                >
                  {item.label} &gt;
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
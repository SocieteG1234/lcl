import React from 'react';
import { ChevronRight } from 'lucide-react';

const LCL_BLUE = '#1a237e';
const LCL_YELLOW = '#f5c518';

const newsItems = [
  {
    image: '/images/A2.jpeg',
    title: 'LCL, banque la mieux notée sur Google en 2025',
    date: '15/01/2025',
    readTime: '2 min',
    excerpt: "Pour la 4ème année consécutive, LCL se classe comme la banque la mieux notée en France sur Google avec une note exceptionnelle...",
  },

];

const lifeEvents = [
  'Acquérir un bien immobilier',
  'Je suis étudiant',
  'Je suis jeune actif',
  'Je suis parent',
  'Je me sépare',
  'Je prépare ma retraite',
  "J'ai un coup dur",
  'Je maîtrise mon budget',
  "Je pars à l'étranger",
  "J'ai perdu un proche",
  'Je prépare ma transmission',
];

const conseils = [
  {
    image: '/images/A4.jpeg',
    title: 'Parcoursup 2026 : les différentes étapes et dates clés à retenir',
    date: '19/01/2026',
    readTime: '1 min',
  },
  {
    image: '/images/A5.jpeg',
    title: 'Comment êtes-vous assuré sur vos skis ?',
    date: '10/12/2025',
    readTime: '3 min',
  },
  {
    image: '/images/A6.jpeg',
    title: "Le smishing : ne tombez pas dans le piège de la fraude par SMS !",
    date: '19/11/2025',
    readTime: '2 min',
  },
];

export default function NewsAndLifeSection({ onNavigateToLogin, onNavigateToInscription }) {
  return (
    <div>
      {/* ── A LA UNE ── */}
      <section className="bg-white py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-xs font-bold tracking-widest text-gray-500 uppercase whitespace-nowrap">
              A LA UNE
            </span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          <div className="space-y-6">
            {newsItems.map((item, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
                onClick={onNavigateToLogin}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 sm:h-56 object-cover"
                  onError={(e) => { e.target.style.background = '#e8eaf6'; e.target.src = ''; }}
                />
                <div className="p-5">
                  <h3
                    className="font-bold text-base sm:text-lg mb-2 leading-tight"
                    style={{ color: LCL_BLUE, borderLeft: `3px solid ${LCL_YELLOW}`, paddingLeft: '10px' }}
                  >
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span>📅 {item.date}</span>
                    <span>•</span>
                    <span>👁 {item.readTime}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">{item.excerpt}</p>
                  <span className="text-sm font-medium hover:underline" style={{ color: '#3949ab' }}>
                    En savoir plus
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LCL VOUS ACCOMPAGNE ── */}
      <section style={{ background: LCL_BLUE }} className="py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8 leading-tight">
            LCL vous accompagne dans vos moments de vie
          </h2>
          <div className="space-y-3">
            {lifeEvents.map((event, i) => (
              <button
                key={i}
                onClick={onNavigateToLogin}
                className="w-full flex items-center justify-between px-5 py-4 rounded-xl bg-white/10 hover:bg-white/20 transition text-white text-sm sm:text-base font-medium"
              >
                <span>{event}</span>
                <ChevronRight size={18} style={{ color: LCL_YELLOW }} />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── LUTTE CONTRE LA FRAUDE ── */}
      <section className="bg-white py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-xs font-bold tracking-widest text-gray-500 uppercase text-center whitespace-nowrap">
              LUTTE CONTRE LA FRAUDE BANCAIRE
            </span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
          <div
            className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
            onClick={onNavigateToLogin}
          >
            <img
              src="/images/A3.jpeg"
              alt="Fraude bancaire"
              className="w-full h-48 object-cover"
              onError={(e) => { e.target.style.background = '#e8eaf6'; e.target.src = ''; }}
            />
            <div className="p-5">
              <h3 className="font-bold text-base sm:text-lg mb-2 leading-tight" style={{ color: LCL_BLUE }}>
                Ensemble, protégeons nous face aux fraudes bancaires
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                Les techniques de fraude évoluent avec le temps. C'est en restant vigilants ensemble que nous pourrons nous protéger...
              </p>
              <span className="text-sm font-medium hover:underline" style={{ color: '#3949ab' }}>
                En savoir plus
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── NOS CONSEILS ── */}
      <section className="bg-gray-50 py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-xs font-bold tracking-widest text-gray-500 uppercase">NOS CONSEILS</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
          <div className="space-y-6">
            {conseils.map((item, i) => (
              <div key={i} className="cursor-pointer group" onClick={onNavigateToLogin}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 rounded-xl object-cover mb-3"
                  onError={(e) => { e.target.style.background = '#e0e0e0'; e.target.src = ''; }}
                />
                <h3
                  className="font-bold text-sm sm:text-base leading-tight group-hover:underline"
                  style={{ color: LCL_BLUE, borderLeft: `3px solid ${LCL_YELLOW}`, paddingLeft: '10px' }}
                >
                  {item.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1 pl-3">
                  <span>📅 {item.date}</span>
                  <span>•</span>
                  <span>👁 {item.readTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHARTE J'AIME MON CLIENT ── */}
      <section className="bg-white py-10 px-4 sm:px-6" style={{ borderTop: '1px solid #e0e0e0' }}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-5 mb-5">
            <img
              src="/images/jaime-mon-client.png"
              alt="J'aime mon client"
              className="w-24 h-24 rounded-full object-cover flex-shrink-0 shadow"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <img
              src="/images/jaime-mon-client-photo.jpeg"
              alt="Conseiller LCL"
              className="w-24 h-20 rounded-lg object-cover flex-shrink-0"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">NOTRE CHARTE</p>
          <h3 className="text-xl sm:text-2xl font-bold mb-3" style={{ color: LCL_BLUE }}>
            "J'aime mon client"
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-5">
            85% de nos clients se disent satisfaits, et ce n'est qu'un début !
          </p>
          <button
            onClick={onNavigateToLogin}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition hover:opacity-90 text-white"
            style={{ background: '#3949ab' }}
          >
            Découvrir notre charte
            <ChevronRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}
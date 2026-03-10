import React, { useState } from 'react';
import { MessageCircle, Lock } from 'lucide-react';

const LCL_BLUE = '#1a237e';
const LCL_YELLOW = '#f5c518';

export default function Header({ onNavigateToLogin, onNavigateToInscription }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);

  return (
    <header style={{ background: LCL_BLUE }} className="sticky top-0 z-50 shadow-lg">
      {/* Bandeau promo */}
      {bannerVisible && (
        <div style={{ background: '#3949ab' }} className="px-4 py-2 flex items-center justify-between">
          <p className="text-white text-xs sm:text-sm flex-1 text-center">
            <span
              className="underline cursor-pointer hover:text-yellow-300 transition"
              onClick={onNavigateToInscription}
            >
              Rejoignez la Banque la mieux notée sur Google et Élue Service Client de l'Année 2026 et recevez jusqu'à 260€ d'avantages !
            </span>
          </p>
          <button
            onClick={() => setBannerVisible(false)}
            className="text-white/70 hover:text-white ml-3 text-lg leading-none"
          >
            ✕
          </button>
        </div>
      )}

      {/* Barre principale */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 flex items-center justify-between gap-3">
        {/* Hamburger mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden p-2 hover:bg-white/10 rounded transition"
          aria-label="Menu"
        >
          <div className="space-y-1.5">
            <div className="w-6 h-0.5 bg-white"></div>
            <div className="w-6 h-0.5 bg-white"></div>
            <div className="w-6 h-0.5 bg-white"></div>
          </div>
        </button>

        {/* Logo LCL — image */}
        <div className="cursor-pointer mx-auto lg:mx-0" onClick={() => onNavigateToLogin?.()}>
          <img
            src="/images/L1.jpeg"
            alt="LCL"
            className="h-10 sm:h-12 w-auto object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          {/* Fallback texte si image manquante */}
          <div
            style={{
              display: 'none',
              background: LCL_BLUE,
              border: `2px solid ${LCL_YELLOW}`,
              padding: '4px 10px',
              borderRadius: '4px',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <span style={{ color: LCL_YELLOW, fontWeight: '900', fontSize: '20px', letterSpacing: '2px' }}>LCL</span>
            <span style={{ color: 'white', fontSize: '7px' }}>Pour aller de l'avant</span>
          </div>
        </div>

        {/* Nav desktop */}
        <nav className="hidden lg:flex items-center gap-6 flex-1 justify-center text-white text-sm font-medium">
          {['Particuliers', 'Professionnels', 'Entreprises', 'Banque privée'].map((item) => (
            <button
              key={item}
              onClick={onNavigateToLogin}
              className="hover:text-yellow-300 transition whitespace-nowrap"
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Icônes droite */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={onNavigateToLogin}
            className="p-2 hover:bg-white/10 rounded transition relative"
            title="Chat"
          >
            <MessageCircle className="text-white" size={22} />
            <span
              className="absolute top-1 right-1 w-2 h-2 rounded-full"
              style={{ background: LCL_YELLOW }}
            ></span>
          </button>
          <button
            onClick={onNavigateToLogin}
            className="p-2 hover:bg-white/10 rounded transition"
            title="Espace client"
          >
            <Lock className="text-white" size={22} />
          </button>
          <button
            onClick={onNavigateToInscription}
            className="hidden sm:block px-4 py-2 text-sm font-bold rounded-full transition ml-2 hover:opacity-90"
            style={{ background: LCL_YELLOW, color: LCL_BLUE }}
          >
            Ouvrir un compte
          </button>
        </div>
      </div>

      {/* Menu mobile déroulant */}
      {menuOpen && (
        <div style={{ background: LCL_BLUE }} className="lg:hidden border-t border-white/20">
          <nav className="px-4 py-4 space-y-1">
            {['Particuliers', 'Professionnels', 'Entreprises', 'Banque privée'].map((item) => (
              <button
                key={item}
                onClick={() => { setMenuOpen(false); onNavigateToLogin?.(); }}
                className="block w-full text-left px-4 py-3 text-white hover:bg-white/10 rounded-lg transition text-sm font-semibold"
              >
                {item}
              </button>
            ))}
            <div className="border-t border-white/20 pt-3 mt-3 space-y-1">
              {['Gérer ses comptes', 'Emprunter', 'Épargner', 'Investir', 'Assurer', 'Nous contacter'].map((item) => (
                <button
                  key={item}
                  onClick={() => { setMenuOpen(false); onNavigateToLogin?.(); }}
                  className="block w-full text-left px-4 py-2.5 text-white/80 hover:bg-white/10 rounded-lg transition text-sm"
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="pt-4">
              <button
                onClick={() => { setMenuOpen(false); onNavigateToInscription?.(); }}
                className="w-full py-3 rounded-full font-bold text-sm transition hover:opacity-90"
                style={{ background: LCL_YELLOW, color: LCL_BLUE }}
              >
                Ouvrir un compte en ligne
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
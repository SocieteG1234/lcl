import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const LCL_BLUE   = '#1a237e';
const LCL_YELLOW = '#f5c518';

// ── Icônes SVG réseaux sociaux ───────────────────────────────────
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="white" width="22" height="22">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" width="22" height="22">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none"/>
  </svg>
);
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="white" width="22" height="22">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);
const MessengerIcon = () => (
  <svg viewBox="0 0 24 24" fill="white" width="22" height="22">
    <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.914 1.35 5.52 3.47 7.24V22l3.168-1.742A10.4 10.4 0 0 0 12 20.486c5.523 0 10-4.144 10-9.243S17.523 2 12 2zm1.05 12.46l-2.55-2.72-4.979 2.72 5.479-5.82 2.613 2.72 4.916-2.72-5.48 5.82z"/>
  </svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="white" width="22" height="22">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="white" width="22" height="22">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
);
const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="white" width="22" height="22">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill={LCL_BLUE}/>
  </svg>
);

const socialNetworks = [
  { label: 'Facebook',  Icon: FacebookIcon  },
  { label: 'Instagram', Icon: InstagramIcon  },
  { label: 'LinkedIn',  Icon: LinkedInIcon   },
  { label: 'Messenger', Icon: MessengerIcon  },
  { label: 'X',         Icon: XIcon          },
  { label: 'WhatsApp',  Icon: WhatsAppIcon   },
  { label: 'YouTube',   Icon: YouTubeIcon    },
];

// ────────────────────────────────────────────────────────────────

export function AppSection({ onNavigateToLogin }) {
  return (
    <section className="bg-gray-50 py-10 sm:py-14 px-4 sm:px-6">
      <div className="max-w-xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 leading-tight" style={{ color: LCL_BLUE }}>
          Tout gérer en 1 clic avec l'appli LCL Mes Comptes
        </h2>

        <ul className="space-y-3 mb-8">
          {[
            'Consulter la synthèse de vos comptes',
            'Effectuer vos virements',
            'Piloter votre carte bancaire',
            'Contacter votre conseiller',
            'Valider vos opérations et vos achats en ligne',
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-gray-700 text-sm sm:text-base">
              <Check size={18} style={{ color: LCL_BLUE }} strokeWidth={3} />
              {item}
            </li>
          ))}
        </ul>

        {/* Logo app LCL */}
        <div className="flex justify-center mb-8">
          <img
            src="/images/L2.jpeg"
            alt="LCL Mes Comptes"
            className="w-24 h-24 rounded-2xl object-contain shadow-lg"
            onError={(e) => {
              e.target.style.display = 'none';
              // Fallback : carré bleu avec LCL
              const div = document.createElement('div');
              div.style.cssText = `width:96px;height:96px;background:${LCL_BLUE};border-radius:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.15)`;
              div.innerHTML = `<span style="color:${LCL_YELLOW};font-weight:900;font-size:22px;letter-spacing:2px">LCL</span><span style="color:white;font-size:8px;margin-top:2px">Mes Comptes</span>`;
              e.target.parentNode.appendChild(div);
            }}
          />
        </div>

        {/* Store buttons */}
        <div className="space-y-3 max-w-xs mx-auto">
          <button
            onClick={onNavigateToLogin}
            className="w-full overflow-hidden rounded-xl hover:opacity-90 transition"
            style={{ background: '#000' }}
          >
            <img
              src="/images/A7.jpeg"
              alt="Télécharger sur l'App Store"
              className="w-full h-12 object-contain px-4 py-2"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = `
                  <div style="display:flex;align-items:center;justify-content:center;gap:10px;padding:10px 20px">
                    <svg viewBox="0 0 24 24" fill="white" width="24" height="24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                    <div style="text-align:left"><div style="color:white;font-size:10px">Télécharger dans</div><div style="color:white;font-size:14px;font-weight:600">l'App Store</div></div>
                  </div>`;
              }}
            />
          </button>
          <button
            onClick={onNavigateToLogin}
            className="w-full overflow-hidden rounded-xl hover:opacity-90 transition"
            style={{ background: '#000' }}
          >
            <img
              src="/images/A8.jpeg"
              alt="Disponible sur Google Play"
              className="w-full h-12 object-contain px-4 py-2"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = `
                  <div style="display:flex;align-items:center;justify-content:center;gap:10px;padding:10px 20px">
                    <svg viewBox="0 0 24 24" width="24" height="24"><path fill="#EA4335" d="m1.22 0 11.42 11.43L1.22 22.85A2 2 0 0 1 0 21V1A2 2 0 0 1 1.22 0z"/><path fill="#FBBC04" d="M20.4 10.01 17.2 8.23 13.43 12l3.77 3.77 3.2-1.78a2 2 0 0 0 0-3.98z"/><path fill="#4285F4" d="m12.64 12-11.42 11.43a2 2 0 0 0 2.43-.28l13.57-7.38z"/><path fill="#34A853" d="M1.22 0a2 2 0 0 0-1.2 1.8v.42l13.41 9.78z"/></svg>
                    <div style="text-align:left"><div style="color:white;font-size:10px">DISPONIBLE SUR</div><div style="color:white;font-size:14px;font-weight:600">Google Play</div></div>
                  </div>`;
              }}
            />
          </button>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────

const footerSections = [
  { title: 'Découvrir LCL',       items: ["Qui sommes-nous ?", "Nos engagements", "Actualités", "Recrutement"] },
  { title: 'Ma banque',           items: ["Particuliers", "Professionnels", "Entreprises", "Banque privée"] },
  { title: "Plus d'infos",        items: ["Centre d'aide", "Trouver une agence", "Tarifs", "Guides et réglementations"] },
  { title: 'Aide et accessibilité', items: ["Accessibilité", "Plan du site", "Assistance technique"] },
];

export function Footer({ onNavigateToLogin }) {
  const [openSection, setOpenSection] = useState(null);

  return (
    <footer style={{ background: '#1a1a2e' }} className="text-white">
      {/* Note légale */}
      <div style={{ background: LCL_BLUE }} className="px-4 py-4 text-center">
        <p className="text-xs text-white/70 max-w-3xl mx-auto">
          *Catégorie Banque de réseau pour les particuliers – Étude Ipsos bva – Viséo CI – Plus d'infos sur escda.fr
        </p>
      </div>

      {/* Réseaux sociaux */}
      <div className="px-4 py-6 border-b border-white/10">
        <div className="max-w-sm mx-auto grid grid-cols-4 gap-3">
          {socialNetworks.map(({ label, Icon }) => (
            <button
              key={label}
              onClick={onNavigateToLogin}
              className="flex items-center justify-center p-3 rounded-lg hover:bg-white/20 transition"
              style={{ background: 'rgba(255,255,255,0.08)' }}
              title={label}
            >
              <Icon />
            </button>
          ))}
        </div>
      </div>

      {/* Accordéon sections */}
      <div className="divide-y divide-white/10">
        {footerSections.map((section, i) => (
          <div key={i}>
            <button
              onClick={() => setOpenSection(openSection === i ? null : i)}
              className="w-full flex items-center justify-between px-4 py-4 text-white hover:bg-white/5 transition"
            >
              <span className="font-medium text-sm">{section.title}</span>
              <ChevronDown
                size={18}
                className={`transition-transform ${openSection === i ? 'rotate-180' : ''}`}
              />
            </button>
            {openSection === i && (
              <div className="px-4 pb-4 space-y-2">
                {section.items.map((item, j) => (
                  <button
                    key={j}
                    onClick={onNavigateToLogin}
                    className="block w-full text-left text-sm text-white/60 hover:text-white py-1 transition"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Liens légaux */}
      <div className="px-4 py-6 border-t border-white/10">
        <div className="space-y-2 max-w-2xl mx-auto">
          {[
            'Informations légales',
            'Politique de protection des données',
            'Politique des cookies',
            'Dispositions Générales de Banque',
            'Conditions Générales',
            'Tarifs',
            'Sécurité',
            'API DSP2',
          ].map((item, i) => (
            <button
              key={i}
              onClick={onNavigateToLogin}
              className="block w-full text-left text-xs text-white/60 hover:text-white py-0.5 transition"
            >
              {item}
            </button>
          ))}
        </div>
        <p className="text-center text-xs text-white/40 mt-6">
          © LCL – Le Crédit Lyonnais {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
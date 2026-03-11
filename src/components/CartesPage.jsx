import React, { useState } from 'react';
import { ChevronLeft, User, Shield, Wifi, Apple } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BottomNavigation from './Bottomnavigation';

const LCL_BLUE   = '#1a237e';
const LCL_YELLOW = '#f5c518';

const Toggle = ({ enabled, onChange }) => (
  <button
    onClick={() => onChange(!enabled)}
    className="relative inline-flex items-center w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
    style={{ backgroundColor: enabled ? LCL_BLUE : '#D1D5DB' }}
  >
    <span
      className="inline-block w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 flex items-center justify-center"
      style={{ transform: enabled ? 'translateX(26px)' : 'translateX(2px)' }}
    >
      {enabled && (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 5l2.5 2.5L8 3" stroke={LCL_BLUE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </span>
  </button>
);

const CardVisual = ({ gradient, labelColor, type, textColor, user, cardNum, accountIndex }) => (
  <div
    className="relative rounded-2xl shadow-xl overflow-hidden p-3"
    style={{ background: gradient, aspectRatio: '1.586', width: '100%', color: textColor }}
  >
    <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 55%)' }} />
    <div className="absolute right-4 top-1/2 font-black tracking-widest select-none text-xs" style={{ writingMode: 'vertical-rl', color: labelColor, transform: 'translateY(-50%) rotate(180deg)', letterSpacing: '0.3em', opacity: 0.5 }}>{type}</div>
    <div className="relative z-10 h-full flex flex-col justify-between">
      <div>
        <img src="/images/P1.jpeg" alt="Puce" className="h-7 w-auto object-contain mb-1" />
        <p className="text-xs font-bold">Mes dépenses</p>
        <p className="text-[11px] opacity-70">sur 30 jours</p>
      </div>
      <p className="text-lg font-black tracking-tight">
        {user?.accounts?.[accountIndex]?.balance
          ? `${Number(user.accounts[accountIndex].balance).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`
          : '0,00 €'}
      </p>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold">{user?.name || 'Titulaire'}</p>
          <p className="text-[11px] opacity-70 mt-0.5">{cardNum} &nbsp; 05/2018</p>
        </div>
        <div className="flex items-center gap-1">
          <img src="/images/CB1.jpeg" alt="CB"   className="h-4 w-auto object-contain" />
          <img src="/images/V1.jpeg"  alt="VISA" className="h-4 w-auto object-contain" />
        </div>
      </div>
    </div>
  </div>
);

const CartePage = () => {
  const navigate              = useNavigate();
  const { user }              = useAuth();
  const [activeCard, setCard] = useState(0);
  const [activeTab, setTab]   = useState('parametres');
  const [locked, setLocked]   = useState(false);
  const [nfc, setNfc]         = useState(true);
  const [online, setOnline]   = useState(true);
  const [abroad, setAbroad]   = useState(false);

  const CARDS_DEF = [
    { id: 'premier',  label: 'Carte Premier',  gradient: 'linear-gradient(135deg, #d4b84a 0%, #e8d06a 30%, #c9a227 60%, #b8941f 100%)', labelColor: '#1a237e', textColor: '#1a237e', type: 'PREMIER', cardNum: 'XX1289' },
    { id: 'standard', label: 'Carte Standard', gradient: 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #1565c0 100%)',               labelColor: '#ffffff', textColor: '#ffffff', type: 'VISA',    cardNum: 'XX1289' },
    { id: 'black',    label: 'Carte Black',    gradient: 'linear-gradient(135deg, #212121 0%, #424242 50%, #1a1a1a 100%)',               labelColor: '#ffffff', textColor: '#ffffff', type: 'PREMIER', cardNum: 'XX1289' },
  ];

  return (
    <div className="min-h-screen font-sans pb-24 pt-0" style={{ backgroundColor: '#0d1b6e' }}>

      {/* Zone bleue header + carousel */}
      <div style={{ backgroundColor: LCL_BLUE }} className="pb-8 rounded-b-3xl pt-16">

        {/* Header — fixé */}
        <div className="flex items-center justify-between px-4 sm:px-8 py-4 fixed top-0 left-0 right-0 z-50"
          style={{ backgroundColor: LCL_BLUE }}>
          <button onClick={() => navigate('/dashboard')}><ChevronLeft className="w-6 h-6 text-white" /></button>
          <h1 className="text-white font-bold text-base tracking-wide uppercase">Mes Cartes</h1>
          <button onClick={() => navigate('/compte')}><User className="w-6 h-6 text-white" /></button>
        </div>

        {/* Carousel mobile / grille tablette */}
        <div className="max-w-3xl mx-auto w-full pt-2 pb-2">

          {/* Mobile : carousel */}
          <div className="sm:hidden">
            <div className="flex gap-4 overflow-x-auto px-6 pb-2 snap-x snap-mandatory">
              {CARDS_DEF.map((c, i) => (
                <button key={c.id} onClick={() => setCard(i)}
                  className="snap-center flex-shrink-0 transition-all duration-300"
                  style={{ width: '80vw', maxWidth: 320, transform: activeCard === i ? 'scale(1.04)' : 'scale(0.93)', opacity: activeCard === i ? 1 : 0.6 }}>
                  <CardVisual gradient={c.gradient} labelColor={c.labelColor} type={c.type} textColor={c.textColor} cardNum={c.cardNum} user={user} accountIndex={i} />
                  <p className="text-center text-xs font-semibold mt-2 text-white opacity-80">{c.label}</p>
                </button>
              ))}
            </div>
            <div className="flex justify-center gap-2 mt-3">
              {CARDS_DEF.map((_, i) => (
                <div key={i} className="rounded-full transition-all duration-300"
                  style={{ width: activeCard === i ? 16 : 6, height: 6, backgroundColor: activeCard === i ? '#ffffff' : 'rgba(255,255,255,0.3)' }} />
              ))}
            </div>
          </div>

          {/* Tablette / Desktop : 3 cartes côte à côte */}
          <div className="hidden sm:grid sm:grid-cols-3 gap-5 px-8">
            {CARDS_DEF.map((c, i) => (
              <button key={c.id} onClick={() => setCard(i)}
                className="transition-all duration-300"
                style={{ transform: activeCard === i ? 'scale(1.05)' : 'scale(0.95)', opacity: activeCard === i ? 1 : 0.65 }}>
                <CardVisual gradient={c.gradient} labelColor={c.labelColor} type={c.type} textColor={c.textColor} cardNum={c.cardNum} user={user} accountIndex={i} />
                <p className="text-center text-xs font-semibold mt-2 text-white opacity-80">{c.label}</p>
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Contenu — centré sur grands écrans, 2 colonnes sur tablette */}
      <div className="max-w-3xl mx-auto w-full px-4 sm:px-8 mt-4">
        <div className="sm:grid sm:grid-cols-2 sm:gap-5 space-y-4 sm:space-y-0">

          {/* Colonne gauche : bouton SOS */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 pt-5 pb-4">
              <button className="w-full py-3 rounded-full font-bold text-sm text-white shadow-md active:scale-95 transition-transform"
                style={{ backgroundColor: LCL_BLUE }}>
                SOS Carte
              </button>
            </div>

            <div className="flex border-b border-gray-200 px-6">
              {['parametres', 'options'].map((tab) => (
                <button key={tab} onClick={() => setTab(tab)}
                  className="flex-1 pb-2 text-sm font-semibold transition-colors"
                  style={{ color: activeTab === tab ? LCL_BLUE : '#9CA3AF', borderBottom: activeTab === tab ? `2px solid ${LCL_BLUE}` : '2px solid transparent' }}>
                  {tab === 'parametres' ? 'Paramètres' : 'Options'}
                </button>
              ))}
            </div>

            <div className="px-6 py-4 space-y-3">
              {activeTab === 'parametres' ? (
                <>
                  <button className="w-full border border-gray-300 rounded-xl py-3 px-4 flex items-center justify-center gap-2 font-semibold text-sm">
                    <Apple className="w-4 h-4" />Configurer Apple Pay
                  </button>
                  <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: LCL_BLUE }}>
                        <Shield className="w-5 h-5" style={{ color: LCL_BLUE }} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Verrouillage de la carte</p>
                        <p className="text-xs text-gray-500">{locked ? 'Carte verrouillée' : 'Carte déverrouillée'}</p>
                      </div>
                    </div>
                    <Toggle enabled={locked} onChange={setLocked} />
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: LCL_BLUE }}>
                        <Wifi className="w-5 h-5" style={{ color: LCL_BLUE }} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Paiement sans contact</p>
                        <p className="text-xs text-gray-500">{nfc ? 'Activé' : 'Désactivé'}</p>
                      </div>
                    </div>
                    <Toggle enabled={nfc} onChange={setNfc} />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Paiement en ligne</p>
                      <p className="text-xs text-gray-500">{online ? 'Activé' : 'Désactivé'}</p>
                    </div>
                    <Toggle enabled={online} onChange={setOnline} />
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Paiement à l'étranger</p>
                      <p className="text-xs text-gray-500">{abroad ? 'Activé' : 'Désactivé'}</p>
                    </div>
                    <Toggle enabled={abroad} onChange={setAbroad} />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Colonne droite : texte (visible tablette+) */}
          <div className="hidden sm:flex flex-col items-center justify-center text-center px-4">
            <p className="text-2xl font-bold text-white">Gérez vos cartes</p>
            <p className="text-2xl font-bold text-white opacity-70 mt-1">en toute autonomie</p>
          </div>

        </div>

        {/* Texte bas — mobile seulement */}
        <div className="sm:hidden text-center mt-6 mb-4">
          <p className="text-xl font-bold text-white">Gérez vos cartes</p>
          <p className="text-xl font-bold text-white">en toute autonomie</p>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default CartePage;
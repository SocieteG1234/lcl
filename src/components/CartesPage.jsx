import React, { useState } from 'react';
import {
  ArrowLeft, CreditCard, Lock, Unlock, Eye, EyeOff,
  Settings, Plus, AlertCircle, Check, Globe, Key,
  Wallet, Clock, ArrowLeftRight, FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LCL_BLUE   = '#1a237e';
const LCL_YELLOW = '#f5c518';

export default function CartesPage() {
  const navigate        = useNavigate();
  const { user }        = useAuth();

  const [showCardNumber, setShowCardNumber]     = useState(false);
  const [currentPage, setCurrentPage]           = useState('cartes');
  const [cardStatus, setCardStatus]             = useState('active');
  const [plafondRetrait, setPlafondRetrait]     = useState(user?.cards?.[0]?.dailyWithdrawalLimit || 0);
  const [plafondPaiement, setPlafondPaiement]   = useState(user?.cards?.[0]?.weeklyPaymentLimit || 0);
  const [paiementEtranger, setPaiementEtranger] = useState(user?.cards?.[0]?.internationalPaymentEnabled || false);
  const [orderSuccess, setOrderSuccess]         = useState(false);
  const [activeTab, setActiveTab]               = useState('cartes');

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="text-red-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600 text-lg">Erreur : utilisateur non trouvé</p>
        </div>
      </div>
    );
  }

  // Navigation : sous-pages internes restent en état local, pages globales via React Router
  const goTo = (page) => {
    const routerPages = ['/dashboard', '/historique', '/virement', '/rib'];
    if (routerPages.includes(page)) {
      navigate(page);
    } else {
      setCurrentPage(page.replace('/', ''));
    }
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    const routes = {
      solde:      '/dashboard',
      historique: '/historique',
      virement:   '/virement',
      cartes:     '/cartes',
      rib:        '/rib',
    };
    if (routes[tabId]) navigate(routes[tabId]);
  };

  const generateCardNumber = (userId) => {
    const base     = '4532';
    const userPart = String(userId).padStart(4, '0');
    const rand     = '7892';
    const last     = String(1234 + userId).padStart(4, '0');
    return `${base} ${userPart} ${rand} ${last}`;
  };

  const fullCardNumber = user.cards?.[0]?.cardNumber || generateCardNumber(user.id);
  const card = {
    type:       user.cards?.[0]?.type || 'Carte Bancaire',
    number:     user.cards?.[0]?.maskedNumber || `${fullCardNumber.split(' ')[0]} **** **** ${fullCardNumber.split(' ')[3]}`,
    fullNumber: fullCardNumber,
    expiry:     user.cards?.[0]?.expiryDate || '12/27',
  };

  const menuItems = [
    { id: 'solde',      icon: Wallet,        label: 'Solde'      },
    { id: 'historique', icon: Clock,          label: 'Historique' },
    { id: 'virement',   icon: ArrowLeftRight, label: 'Virement'   },
    { id: 'cartes',     icon: CreditCard,     label: 'Cartes'     },
    { id: 'rib',        icon: FileText,       label: 'RIB'        },
  ];

  /* ── Logo L1 réutilisable ─────────────────────────────────── */
  const LogoLCL = () => (
    <div className="flex items-center gap-2">
      <img
        src="/images/L1.jpeg"
        alt="LCL"
        className="h-8 w-auto object-contain"
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
      <div className="items-center gap-1" style={{ display: 'none' }}>
        <span className="font-bold text-xl" style={{ color: LCL_YELLOW }}>LCL</span>
        <span className="text-white text-sm hidden sm:block">Pour aller de l'avant</span>
      </div>
    </div>
  );

  /* ── Sous-pages ─────────────────────────────────────────────── */

  const renderBloquerPage = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center mb-6">
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
            cardStatus === 'active' ? 'bg-red-100' : 'bg-green-100'
          }`}>
            {cardStatus === 'active'
              ? <Lock className="text-red-600" size={40} />
              : <Unlock className="text-green-600" size={40} />}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {cardStatus === 'active' ? 'Bloquer votre carte' : 'Débloquer votre carte'}
          </h2>
          <p className="text-gray-600">
            {cardStatus === 'active'
              ? 'Votre carte sera immédiatement bloquée et inutilisable'
              : 'Votre carte sera réactivée immédiatement'}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-amber-600" size={24} />
            <div className="text-sm text-gray-700">
              {cardStatus === 'active' ? (
                <>
                  <p className="font-medium mb-2">En bloquant votre carte :</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Tous les paiements seront refusés</li>
                    <li>Les retraits seront impossibles</li>
                    <li>Vous pourrez la débloquer à tout moment</li>
                  </ul>
                </>
              ) : (
                <>
                  <p className="font-medium mb-2">En débloquant votre carte :</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Les paiements seront à nouveau autorisés</li>
                    <li>Les retraits seront possibles</li>
                    <li>Vos plafonds habituels s'appliqueront</li>
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setCardStatus(cardStatus === 'active' ? 'blocked' : 'active');
            setTimeout(() => setCurrentPage('cartes'), 1500);
          }}
          className={`w-full py-4 rounded-xl font-medium transition flex items-center justify-center gap-2 text-white ${
            cardStatus === 'active' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {cardStatus === 'active' ? <Lock size={20} /> : <Unlock size={20} />}
          {cardStatus === 'active' ? 'Bloquer ma carte' : 'Débloquer ma carte'}
        </button>
        <button onClick={() => setCurrentPage('cartes')} className="w-full mt-3 py-3 text-gray-600 hover:text-gray-800 font-medium">
          Annuler
        </button>
      </div>
    </div>
  );

  const renderPlafondsPage = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Gérer les plafonds</h2>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <label className="text-lg font-medium text-gray-700">Plafond de retrait</label>
            <span className="text-2xl font-bold" style={{ color: LCL_BLUE }}>{plafondRetrait}€</span>
          </div>
          <input type="range" min="0" max="1000" step="50" value={plafondRetrait}
            onChange={(e) => setPlafondRetrait(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
          <div className="flex justify-between text-sm text-gray-500 mt-2"><span>0€</span><span>1000€</span></div>
          <p className="text-sm text-gray-600 mt-3">Limite par jour</p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <label className="text-lg font-medium text-gray-700">Plafond de paiement</label>
            <span className="text-2xl font-bold" style={{ color: LCL_BLUE }}>{plafondPaiement}€</span>
          </div>
          <input type="range" min="0" max="5000" step="100" value={plafondPaiement}
            onChange={(e) => setPlafondPaiement(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
          <div className="flex justify-between text-sm text-gray-500 mt-2"><span>0€</span><span>5000€</span></div>
          <p className="text-sm text-gray-600 mt-3">Limite par semaine</p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-blue-600" size={20} />
            <p className="text-sm text-blue-900">Les modifications sont appliquées immédiatement.</p>
          </div>
        </div>

        <button onClick={() => setCurrentPage('cartes')}
          className="w-full text-white py-4 rounded-xl font-medium transition flex items-center justify-center gap-2 hover:opacity-90"
          style={{ background: LCL_BLUE }}>
          <Check size={20} />Enregistrer les modifications
        </button>
      </div>
    </div>
  );

  const renderPaiementEtrangerPage = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-blue-100 mx-auto rounded-full flex items-center justify-center mb-4">
            <Globe className="text-blue-600" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Paiement à l'étranger</h2>
          <p className="text-gray-600">Gérez l'utilisation de votre carte hors zone euro</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Paiements internationaux</h3>
              <p className="text-sm text-gray-600">{paiementEtranger ? 'Activés' : 'Désactivés'}</p>
            </div>
            <button onClick={() => setPaiementEtranger(!paiementEtranger)}
              className="relative inline-flex h-8 w-14 items-center rounded-full transition-colors"
              style={{ background: paiementEtranger ? LCL_BLUE : '#d1d5db' }}>
              <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${paiementEtranger ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-amber-50 rounded-lg p-4">
            <h4 className="font-medium text-amber-900 mb-2">Frais applicables</h4>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• Paiements : 2% du montant (min 2€)</li>
              <li>• Retraits : 3% du montant (min 3€)</li>
              <li>• Taux de change : selon cours interbancaire</li>
            </ul>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Zones couvertes</h4>
            <p className="text-sm text-blue-800">Plus de 200 pays acceptent votre carte LCL.</p>
          </div>
        </div>

        <button onClick={() => setCurrentPage('cartes')}
          className="w-full text-white py-4 rounded-xl font-medium transition hover:opacity-90"
          style={{ background: LCL_BLUE }}>
          Retour à mes cartes
        </button>
      </div>
    </div>
  );

  const renderCodePinPage = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-purple-100 mx-auto rounded-full flex items-center justify-center mb-4">
            <Key className="text-purple-600" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Code PIN</h2>
          <p className="text-gray-600">Gérez le code secret de votre carte</p>
        </div>

        <div className="space-y-4">
          {[
            { icon: Eye,         color: 'bg-blue-100',   iconColor: 'text-blue-600',   title: 'Consulter mon code PIN',  sub: 'Recevez votre code par SMS sécurisé' },
            { icon: Settings,    color: 'bg-indigo-100', iconColor: 'text-indigo-600',  title: 'Modifier mon code PIN',   sub: 'Changez votre code à 4 chiffres' },
            { icon: AlertCircle, color: 'bg-amber-100',  iconColor: 'text-amber-600',   title: 'Code oublié ?',           sub: 'Demandez un nouveau code PIN' },
          ].map(({ icon: Icon, color, iconColor, title, sub }) => (
            <button key={title} className="w-full bg-gray-50 hover:bg-gray-100 p-6 rounded-xl transition text-left">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center`}>
                  <Icon size={24} className={iconColor} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
                  <p className="text-sm text-gray-600">{sub}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="bg-red-50 rounded-lg p-4 mt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-red-600" size={20} />
            <div className="text-sm text-red-900">
              <p className="font-medium mb-1">Sécurité</p>
              <p>Ne partagez jamais votre code PIN. LCL ne vous le demandera jamais par téléphone ou email.</p>
            </div>
          </div>
        </div>

        <button onClick={() => setCurrentPage('cartes')}
          className="w-full mt-6 text-white py-4 rounded-xl font-medium transition hover:opacity-90"
          style={{ background: LCL_BLUE }}>
          Retour à mes cartes
        </button>
      </div>
    </div>
  );

  const renderCommanderCartePage = () => (
    <div className="space-y-6">
      {!orderSuccess ? (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4"
              style={{ background: '#e8eaf6' }}>
              <CreditCard size={40} style={{ color: LCL_BLUE }} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Commander une nouvelle carte</h2>
            <p className="text-gray-600">Choisissez le type de carte que vous souhaitez</p>
          </div>

          <div className="space-y-4 mb-6">
            {[
              { label: 'Carte Standard', sub: 'Carte internationale',                  price: 'Gratuite', bg: LCL_BLUE  },
              { label: 'Carte Gold',     sub: 'Carte prestige avec services exclusifs', price: '15€/an',  bg: '#b8860b' },
            ].map(({ label, sub, price, bg }) => (
              <button key={label}
                className="w-full bg-gray-50 hover:bg-gray-100 p-6 rounded-xl transition text-left border-2 border-transparent hover:border-blue-900">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg flex items-center justify-center" style={{ background: bg }}>
                      <CreditCard className="text-white" size={32} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">{label}</h3>
                      <p className="text-sm text-gray-600">{sub}</p>
                      <p className="text-xs font-medium mt-1" style={{ color: LCL_BLUE }}>{price}</p>
                    </div>
                  </div>
                  <ArrowLeft className="text-gray-400 transform rotate-180" size={20} />
                </div>
              </button>
            ))}
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-blue-600" size={20} />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-2">Informations importantes :</p>
                <ul className="space-y-1">
                  <li>• Délai de livraison : 5-7 jours ouvrés</li>
                  <li>• Livraison à votre adresse postale</li>
                  <li>• Code PIN envoyé séparément par courrier</li>
                  <li>• Activation immédiate dès réception</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={() => { setOrderSuccess(true); setTimeout(() => { setOrderSuccess(false); setCurrentPage('cartes'); }, 3000); }}
            className="w-full text-white py-4 rounded-xl font-medium transition flex items-center justify-center gap-2 hover:opacity-90"
            style={{ background: LCL_BLUE }}>
            <Check size={20} />Confirmer la commande
          </button>
          <button onClick={() => setCurrentPage('cartes')} className="w-full mt-3 py-3 text-gray-600 hover:text-gray-800 font-medium">
            Annuler
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="w-20 h-20 bg-green-100 mx-auto rounded-full flex items-center justify-center mb-4">
            <Check className="text-green-600" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Commande confirmée !</h2>
          <p className="text-gray-600 mb-6">Votre nouvelle carte sera livrée sous 5-7 jours ouvrés.</p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="font-medium text-gray-800">{user.name}</p>
            <p className="text-sm text-gray-600 mt-1">Adresse postale enregistrée</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderCartesPage = () => (
    <>
      <div className="space-y-6 mb-6 max-w-md mx-auto">
        <div className="relative">
          {/* Carte bancaire LCL */}
          <div className="rounded-2xl p-6 text-white shadow-xl relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${LCL_BLUE}, #283593)` }}>
            <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full -ml-16 -mb-16" />

            <div className="relative z-10">
              {/* Logo L1 sur la carte */}
              <div className="flex items-start justify-between mb-10">
                <div>
                  <img
                    src="/images/L1.jpeg"
                    alt="LCL"
                    className="h-10 w-auto object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div style={{ display: 'none' }}>
                    <span className="font-bold text-2xl" style={{ color: LCL_YELLOW }}>LCL</span>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>Pour aller de l'avant</p>
                  </div>
                </div>
                <div className="w-10 h-7 rounded" style={{ background: LCL_YELLOW, opacity: 0.85 }} />
              </div>

              <div className="flex items-center justify-between mb-6">
                <p className="font-mono text-xl tracking-wider flex-1">
                  {showCardNumber ? card.fullNumber : card.number}
                </p>
                <button onClick={() => setShowCardNumber(!showCardNumber)}
                  className="p-2 hover:bg-white/20 rounded-lg transition ml-2">
                  {showCardNumber ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Titulaire</p>
                  <p className="font-medium">{user.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Expire</p>
                  <p className="font-medium">{card.expiry}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions carte */}
          <div className="bg-white rounded-xl shadow-sm p-4 -mt-4 pt-8">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: cardStatus === 'active' ? 'Bloquer' : 'Débloquer', icon: cardStatus === 'active' ? Lock : Unlock, page: 'bloquer-carte'     },
                { label: 'Plafonds',              icon: Settings, page: 'plafonds'          },
                { label: "Paiement à l'étranger", icon: Globe,    page: 'paiement-etranger' },
                { label: 'Code PIN',              icon: Key,      page: 'code-pin'          },
              ].map(({ label, icon: Icon, page }) => (
                <button key={page} onClick={() => setCurrentPage(page)}
                  className="flex flex-col items-center gap-3 p-6 bg-gray-50 hover:bg-gray-100 rounded-xl transition">
                  <Icon size={40} style={{ color: LCL_BLUE }} />
                  <span className="text-base font-medium text-gray-800 text-center">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button onClick={() => setCurrentPage('commander-carte')}
        className="w-full text-white py-4 rounded-xl font-medium transition flex items-center justify-center gap-2 shadow-sm hover:opacity-90"
        style={{ background: LCL_BLUE }}>
        <Plus size={20} />Commander une nouvelle carte
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header LCL */}
      <header className="fixed top-0 left-0 right-0 z-40 shadow-sm">
        <div style={{ background: LCL_BLUE }}>
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => currentPage === 'cartes' ? navigate('/dashboard') : setCurrentPage('cartes')}
              className="flex items-center gap-2 text-white hover:opacity-80 transition">
              <ArrowLeft size={20} /><span>Retour</span>
            </button>

            <LogoLCL />

            <div className="w-20" />
          </div>
          <p className="text-white text-center pb-3 font-semibold text-lg">Mes cartes</p>
        </div>
        <div style={{ background: LCL_YELLOW, height: '4px' }} />
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 mt-24 pb-24">
        {currentPage === 'cartes'            && renderCartesPage()}
        {currentPage === 'bloquer-carte'     && renderBloquerPage()}
        {currentPage === 'plafonds'          && renderPlafondsPage()}
        {currentPage === 'paiement-etranger' && renderPaiementEtrangerPage()}
        {currentPage === 'code-pin'          && renderCodePinPage()}
        {currentPage === 'commander-carte'   && renderCommanderCartePage()}
      </main>

      {/* Navigation inférieure */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
        <div className="max-w-4xl mx-auto px-2">
          <div className="flex items-center justify-around">
            {menuItems.map(item => (
              <button key={item.id} onClick={() => handleTabClick(item.id)}
                className="flex flex-col items-center gap-1 py-3 px-4 transition"
                style={activeTab === item.id ? { color: LCL_BLUE } : { color: '#6b7280' }}>
                <item.icon size={24} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
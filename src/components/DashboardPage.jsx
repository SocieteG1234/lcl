import React, { useState, useEffect } from 'react';
import { Bell, X, User, CreditCard, FileText, HelpCircle, LogOut, Download, Shield, ChevronRight, Eye, EyeOff, FolderOpen, TrendingUp, ArrowUpRight, ArrowDownLeft, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BottomNavigation from './Bottomnavigation';
import BlockedAccountModal from './Blockedaccountmodal';

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

  const balance  = user?.accounts?.[0]?.balance
    ? Number(user.accounts[0].balance).toLocaleString('fr-FR', { minimumFractionDigits: 2 })
    : '0,00';
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  // Dernières transactions (3 max)
  const recentTx = (user?.transactions || []).slice(0, 3);

  const quickActions = [
    { label: 'Historique', icon: FileText,    page: '/historique' },
    { label: 'Virement',   icon: ArrowUpRight, page: '/virement'  },
    { label: 'Mes cartes', icon: CreditCard,  page: '/cartes'     },
    { label: 'Documents',  icon: FolderOpen,  page: '/documents'  },
  ];

  const accountIcons = [Wallet, TrendingUp, TrendingUp];
  const accountColors = [
    { bg: `${LCL_YELLOW}30`, icon: '#b8860b' },
    { bg: `${LCL_BLUE}15`,   icon: LCL_BLUE  },
    { bg: '#e8f5e9',          icon: '#2e7d32' },
  ];

  return (
    <div key={updateKey} className="min-h-screen font-sans" style={{ backgroundColor: '#f0f4f8' }}>

      {/* ══════════════════════════════════════════
          ZONE BLEUE — responsive padding
      ══════════════════════════════════════════ */}
      <div style={{ backgroundColor: LCL_BLUE }} className="pb-12 sm:pb-16 rounded-b-3xl">

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-10 pt-5 pb-4 max-w-4xl mx-auto w-full">
          <img
            src="/images/L1.jpeg"
            alt="LCL"
            className="h-9 sm:h-11 w-auto object-contain"
            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
          />
          <span className="font-black text-xl hidden" style={{ color: LCL_YELLOW }}>LCL</span>

          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/notifications')} className="relative p-1">
              <Bell className="w-6 h-6 text-white" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white text-[10px] flex items-center justify-center font-bold"
                style={{ backgroundColor: '#e53935' }}>2</span>
            </button>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-lg"
              style={{ backgroundColor: LCL_YELLOW, color: LCL_BLUE }}
            >
              {initials}
            </button>
          </div>
        </div>

        {/* Bonjour + solde */}
        <div className="px-4 sm:px-6 lg:px-10 pt-1 max-w-4xl mx-auto w-full">
          <p className="text-white opacity-70 text-sm">Bonjour,</p>
          <p className="text-white font-bold text-lg sm:text-xl">{user?.name}</p>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-white opacity-60 text-xs uppercase tracking-widest">Solde disponible</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-white font-black text-3xl sm:text-4xl leading-none">
                  {showBalance ? `${balance} €` : '••••••'}
                </p>
                <button onClick={() => setShowBalance(!showBalance)} className="opacity-70 hover:opacity-100 transition-opacity">
                  {showBalance
                    ? <EyeOff className="w-5 h-5 text-white" />
                    : <Eye    className="w-5 h-5 text-white" />}
                </button>
              </div>
              <p className="text-white opacity-40 text-xs mt-2">
                N° {user?.accounts?.[0]?.accountNumber || user?.accountNumber || '—'}
              </p>
            </div>

            {/* Badge statut compte — visible sur tablette+ */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ backgroundColor: user?.isBlocked ? 'rgba(239,68,68,0.25)' : 'rgba(74,222,128,0.2)' }}>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: user?.isBlocked ? '#ef4444' : '#4ade80' }} />
              <span className="text-white text-xs font-semibold">
                {user?.isBlocked ? 'Compte bloqué' : 'Compte actif'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal — centré et max-width sur grands écrans */}
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-10">

        {/* ══════════════════════════════════════════
            ACTIONS RAPIDES — flottant sur la zone bleue
        ══════════════════════════════════════════ */}
        <div className="-mt-6 bg-white rounded-2xl shadow-lg p-3 sm:p-4">
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {quickActions.map((a) => (
              <button
                key={a.label}
                onClick={() => navigate(a.page)}
                className="flex flex-col items-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 rounded-xl transition-all active:scale-95 hover:shadow-sm"
                style={{ backgroundColor: `${LCL_BLUE}08` }}
              >
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${LCL_BLUE}18` }}>
                  <a.icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: LCL_BLUE }} />
                </div>
                <span className="text-[10px] sm:text-xs font-semibold text-center leading-tight" style={{ color: LCL_BLUE }}>
                  {a.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════
            LAYOUT 2 COLONNES sur tablette+
        ══════════════════════════════════════════ */}
        <div className="mt-4 sm:grid sm:grid-cols-2 sm:gap-4 lg:gap-5 space-y-4 sm:space-y-0">

          {/* ── MES COMPTES ── */}
          <div>
            <p className="text-sm font-bold mb-3" style={{ color: LCL_BLUE }}>Mes comptes</p>
            <div className="space-y-2.5">
              {user?.accounts?.map((acc, i) => {
                const IconComp = accountIcons[i] || CreditCard;
                const colors   = accountColors[i] || accountColors[1];
                const labels   = ['Compte courant', 'Livret A', 'Plan Épargne'];
                return (
                  <div key={i} className="bg-white rounded-2xl shadow-sm p-3.5 sm:p-4 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate('/historique')}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: colors.bg }}>
                        <IconComp className="w-5 h-5" style={{ color: colors.icon }} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{labels[i] || `Compte ${i + 1}`}</p>
                        <p className="text-xs text-gray-400">{acc.number || `N° ${acc.accountNumber || '—'}`}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black" style={{ color: LCL_BLUE }}>
                        {showBalance
                          ? `${Number(acc.balance || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`
                          : '••••'}
                      </p>
                      <ChevronRight className="w-4 h-4 text-gray-300 ml-auto mt-0.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── DERNIÈRES OPÉRATIONS ── */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold" style={{ color: LCL_BLUE }}>Dernières opérations</p>
              <button onClick={() => navigate('/historique')}
                className="text-xs font-semibold opacity-60 hover:opacity-100 transition-opacity"
                style={{ color: LCL_BLUE }}>
                Tout voir →
              </button>
            </div>
            <div className="space-y-2.5">
              {recentTx.length > 0 ? recentTx.map((tx) => (
                <div key={tx.id} className="bg-white rounded-2xl shadow-sm p-3.5 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: tx.isCredit ? '#e8f5e9' : '#fef2f2' }}>
                      {tx.isCredit
                        ? <ArrowDownLeft className="w-4 h-4 text-green-600" />
                        : <ArrowUpRight  className="w-4 h-4 text-red-500" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate max-w-[130px] sm:max-w-[160px]">
                        {tx.reference}
                      </p>
                      <p className="text-[10px] text-gray-400">{tx.date}</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold flex-shrink-0 ml-2"
                    style={{ color: tx.isCredit ? '#16a34a' : '#dc2626' }}>
                    {tx.isCredit ? '+' : '-'}{Number(tx.amount).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                  </p>
                </div>
              )) : (
                <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
                  <p className="text-xs text-gray-400">Aucune transaction récente</p>
                </div>
              )}

              {/* Bouton voir tout (mobile) */}
              <button onClick={() => navigate('/historique')}
                className="sm:hidden w-full py-3 rounded-2xl text-xs font-semibold border-2 transition active:scale-95"
                style={{ borderColor: `${LCL_BLUE}30`, color: LCL_BLUE, backgroundColor: `${LCL_BLUE}05` }}>
                Voir tout l'historique →
              </button>
            </div>
          </div>

        </div>

        {/* Espace bas pour BottomNavigation */}
        <div className="h-24" />
      </div>

      {/* ══════════════════════════════════════════
          MENU SIDEBAR
      ══════════════════════════════════════════ */}
      {showMenu && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={() => setShowMenu(false)} />
          <div className="fixed top-0 right-0 h-full w-[80%] max-w-xs bg-white shadow-2xl z-50 flex flex-col">
            <div className="p-5 text-white" style={{ backgroundColor: LCL_BLUE }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Menu</h2>
                <button onClick={() => setShowMenu(false)}><X className="w-5 h-5" /></button>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm"
                  style={{ backgroundColor: LCL_YELLOW, color: LCL_BLUE }}>{initials}</div>
                <div>
                  <p className="font-semibold text-sm">{user?.name}</p>
                  <p className="text-xs opacity-60">N° {user?.accountNumber}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {[
                { label: 'Mon profil',      icon: User,       page: '/compte'     },
                { label: 'Mes comptes',     icon: CreditCard, page: '/dashboard'  },
                { label: 'Historique',      icon: FileText,   page: '/historique' },
                { label: 'Mes cartes',      icon: CreditCard, page: '/cartes'     },
                { label: 'Télécharger RIB', icon: Download,   page: '/rib'        },
                { label: 'Mes documents',   icon: FolderOpen, page: '/documents'  },
              ].map((item) => (
                <button key={item.label}
                  onClick={() => { navigate(item.page); setShowMenu(false); }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-xl transition">
                  <item.icon className="w-4 h-4" style={{ color: LCL_BLUE }} />
                  <span className="text-gray-800 font-medium text-sm">{item.label}</span>
                </button>
              ))}
              <div className="border-t border-gray-100 my-2" />
              {[
                { label: 'Changer code PIN', icon: Shield,     page: '/changer-code' },
                { label: 'Aide & Support',   icon: HelpCircle, page: '/aide'         },
              ].map((item) => (
                <button key={item.label}
                  onClick={() => { navigate(item.page); setShowMenu(false); }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-xl transition">
                  <item.icon className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700 font-medium text-sm">{item.label}</span>
                </button>
              ))}
            </div>

            <div className="p-3 border-t border-gray-100">
              <button onClick={() => { setShowMenu(false); handleLogout(); }}
                className="w-full flex items-center gap-3 p-3 bg-red-50 hover:bg-red-100 rounded-xl transition text-red-600">
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
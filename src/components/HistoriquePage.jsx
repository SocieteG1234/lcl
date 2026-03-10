// components/HistoriquePage.jsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Search, ArrowUpRight, ArrowDownRight,
  Download, Wallet, Clock, ArrowLeftRight, CreditCard, FileText
} from 'lucide-react';

const LCL_BLUE   = '#1a237e';
const LCL_YELLOW = '#f5c518';

export default function HistoriquePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm]   = useState('');
  const [activeTab, setActiveTab]     = useState('historique');
  const [filterType, setFilterType]   = useState('all');

  const allTransactions = user?.transactions || [];

  const filteredTransactions = allTransactions.filter(transaction => {
    const matchesSearch =
      transaction.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterType === 'all')      return matchesSearch;
    if (filterType === 'virement') return matchesSearch && transaction.type.toLowerCase().includes('virement');
    if (filterType === 'achat')    return matchesSearch && transaction.type.toLowerCase().includes('achat');
    if (filterType === 'retrait')  return matchesSearch && transaction.type.toLowerCase().includes('retrait');

    return matchesSearch;
  });

  const menuItems = [
    { id: 'solde',      icon: Wallet,        label: 'Solde'      },
    { id: 'historique', icon: Clock,          label: 'Historique' },
    { id: 'virement',   icon: ArrowLeftRight, label: 'Virement'   },
    { id: 'cartes',     icon: CreditCard,     label: 'Cartes'     },
    { id: 'rib',        icon: FileText,       label: 'RIB'        },
  ];

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

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header bleu LCL */}
      <header className="sticky top-0 z-20 shadow-sm">
        <div style={{ background: LCL_BLUE }}>
          <div className="max-w-4xl mx-auto px-4 py-4">

            {/* Ligne retour + logo + télécharger */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-white hover:opacity-80 transition"
              >
                <ArrowLeft size={20} />
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
                <div className="items-center gap-1" style={{ display: 'none' }}>
                  <span className="font-bold text-xl" style={{ color: LCL_YELLOW }}>LCL</span>
                  <span className="text-white text-sm hidden sm:block">Pour aller de l'avant</span>
                </div>
              </div>

              <button className="p-2 hover:opacity-80 rounded-lg transition text-white">
                <Download size={20} />
              </button>
            </div>

            {/* Titre page */}
            <h1 className="text-xl font-bold text-white text-center mb-4">
              Historique des transactions
            </h1>

            {/* Barre de recherche */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Rechercher une transaction..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-0 rounded-lg focus:ring-2 focus:outline-none bg-white text-gray-800"
              />
            </div>
          </div>
        </div>
        {/* Bande jaune signature LCL */}
        <div style={{ background: LCL_YELLOW, height: '4px' }} />
      </header>

      {/* Contenu */}
      <main className="max-w-4xl mx-auto px-4 py-6 pb-24">

        {/* Solde actuel */}
        <div className="rounded-xl p-6 text-white mb-6 shadow-lg" style={{ background: LCL_BLUE }}>
          <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.75)' }}>Solde actuel</p>
          <h2 className="text-3xl font-bold">
            {user?.balance?.toLocaleString('fr-FR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })} €
          </h2>
        </div>

        {/* Filtres */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'all',      label: 'Tout'      },
            { id: 'virement', label: 'Virements' },
            { id: 'achat',    label: 'Achats'    },
            { id: 'retrait',  label: 'Retraits'  },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className="px-4 py-2 rounded-lg font-medium whitespace-nowrap transition border"
              style={
                filterType === f.id
                  ? { background: LCL_BLUE, color: '#fff', borderColor: LCL_BLUE }
                  : { background: '#fff', color: '#374151', borderColor: '#d1d5db' }
              }
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Liste des transactions */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center gap-4 p-4 border-b last:border-b-0 hover:bg-gray-50 transition cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                transaction.isCredit ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {transaction.isCredit
                  ? <ArrowDownRight className="text-green-600" size={24} />
                  : <ArrowUpRight   className="text-red-600"   size={24} />
                }
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-800 truncate">{transaction.type}</h4>
                <p className="text-sm text-gray-500">{transaction.date}</p>
                <p className="text-xs text-gray-400 font-mono">{transaction.reference}</p>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${
                  transaction.isCredit ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.isCredit ? '+' : ''}
                  {transaction.amount.toLocaleString('fr-FR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })} €
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune transaction trouvée</p>
          </div>
        )}
      </main>

      {/* Navigation inférieure */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
        <div className="max-w-4xl mx-auto px-2">
          <div className="flex items-center justify-around">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className="flex flex-col items-center gap-1 py-3 px-4 transition"
                style={activeTab === item.id ? { color: LCL_BLUE } : { color: '#6b7280' }}
              >
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
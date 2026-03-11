import React, { useState } from 'react';
import { ChevronLeft, Bell, BellOff, ChevronRight, TrendingUp, Shield, Gift, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from './Bottomnavigation';

const LCL_BLUE   = '#1a237e';
const LCL_YELLOW = '#f5c518';

const actus = [
  {
    id:        1,
    category:  'Offre',
    title:     'Profitez de 3 mois offerts sur votre assurance auto',
    date:      '12 jan. 2017',
    icon:      Gift,
    color:     LCL_YELLOW,
    iconColor: LCL_BLUE,
    unread:    true,
  },
  {
    id:        2,
    category:  'Sécurité',
    title:     'Nouveau : authentification renforcée disponible',
    date:      '08 jan. 2017',
    icon:      Shield,
    color:     '#e8f5e9',
    iconColor: '#2e7d32',
    unread:    true,
  },
  {
    id:        3,
    category:  'Marché',
    title:     'Les taux immobiliers en légère baisse ce mois-ci',
    date:      '05 jan. 2017',
    icon:      TrendingUp,
    color:     '#e3f2fd',
    iconColor: '#1565c0',
    unread:    false,
  },
  {
    id:        4,
    category:  'Info',
    title:     "Mise à jour des conditions générales d'utilisation",
    date:      '02 jan. 2017',
    icon:      Info,
    color:     '#fce4ec',
    iconColor: '#c62828',
    unread:    false,
  },
];

/* ── Section Alertes — design exact LCL ── */
const AlertesSection = () => {
  const [alerts, setAlerts] = useState([
    { id: 1, label: 'Mon solde est inférieur à', value: '200 €', active: true  },
    { id: 2, label: 'Mon solde est supérieur à', value: '',      active: false },
  ]);

  const activeCount = alerts.filter(a => a.active).length;

  return (
    <div className="min-h-screen font-sans pb-24" style={{ backgroundColor: '#f5f6fa' }}>

      {/* Compte dépôt */}
      <div className="bg-white px-5 pt-5 pb-4">
        <p className="text-lg font-black text-gray-900">Compte dépôt</p>
        <div className="flex items-center gap-3 mt-1">
          <p className="text-sm text-gray-500">0215 4578 9458</p>
          <span
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
            style={{ backgroundColor: `${LCL_BLUE}15`, color: LCL_BLUE }}
          >
            <Bell className="w-3 h-3" />
            {activeCount} activée
          </span>
        </div>
      </div>

      {/* Être alerté quand */}
      <div className="bg-white px-5 pt-4 pb-2 mt-2">
        <p className="text-base font-black" style={{ color: LCL_BLUE }}>Être alerté quand...</p>
        <div className="mt-1 w-8 h-1 rounded-full" style={{ backgroundColor: LCL_YELLOW }} />
      </div>

      {/* Liste alertes */}
      <div className="bg-white mt-2">
        {alerts.map((alert, i) => (
          <div key={alert.id}>
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex-1">
                <p className="text-sm text-gray-800">
                  {alert.label}
                  {alert.value && (
                    <span className="font-black"> {alert.value}</span>
                  )}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  {alert.active ? (
                    <>
                      <Bell className="w-3.5 h-3.5" style={{ color: LCL_BLUE }} />
                      <p className="text-xs font-bold text-gray-800">Par notification et email</p>
                    </>
                  ) : (
                    <>
                      <BellOff className="w-3.5 h-3.5 text-gray-400" />
                      <p className="text-xs text-gray-400">Désactivée</p>
                    </>
                  )}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: LCL_BLUE }} />
            </div>
            {i < alerts.length - 1 && (
              <div className="mx-5 border-b border-gray-100" />
            )}
          </div>
        ))}
      </div>

      <BottomNavigation />
    </div>
  );
};

/* ── Page principale ── */
const ActusPage = () => {
  const navigate      = useNavigate();
  const [tab, setTab] = useState('actus');

  return (
    <div className="min-h-screen font-sans pb-24" style={{ backgroundColor: '#f5f6fa' }}>

      {/* Header bleu */}
      <div
        className="flex items-center justify-between px-4 py-4 sticky top-0 z-40"
        style={{ backgroundColor: LCL_BLUE }}
      >
        <button onClick={() => navigate('/dashboard')}>
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white font-bold text-base tracking-wide uppercase">
          {tab === 'actus' ? 'Mes Actus' : 'Mes Alertes'}
        </h1>
        <div className="w-6" />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white px-4">
        {[{ id: 'actus', label: 'Actualités' }, { id: 'alertes', label: 'Mes alertes' }].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex-1 py-3 text-sm font-semibold transition-colors"
            style={{
              color:        tab === t.id ? LCL_BLUE : '#9CA3AF',
              borderBottom: tab === t.id ? `2px solid ${LCL_BLUE}` : '2px solid transparent',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'actus' ? (
        <>
          <div className="px-4 mt-4 space-y-3">
            {actus.map((actu) => {
              const Icon = actu.icon;
              return (
                <button
                  key={actu.id}
                  className="w-full bg-white rounded-2xl p-4 shadow-sm flex items-start gap-3 text-left active:scale-[0.98] transition-transform"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: actu.color }}
                  >
                    <Icon className="w-5 h-5" style={{ color: actu.iconColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: `${LCL_BLUE}10`, color: LCL_BLUE }}
                      >
                        {actu.category}
                      </span>
                      {actu.unread && (
                        <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-800 leading-snug">{actu.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{actu.date}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0 mt-1" />
                </button>
              );
            })}
          </div>

          <div
            className="text-center mt-8 py-6 px-6 mx-4 rounded-2xl"
            style={{ backgroundColor: LCL_BLUE }}
          >
            <p className="text-xl font-bold text-white">Paramétrez</p>
            <p className="text-xl font-bold text-white">vos alertes</p>
          </div>
        </>
      ) : (
        <AlertesSection />
      )}

      <BottomNavigation />
    </div>
  );
};

export default ActusPage;
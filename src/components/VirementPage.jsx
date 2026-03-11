import React, { useState } from 'react';
import { ArrowLeft, ArrowUpRight, Calendar, Users, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BottomNavigation from './Bottomnavigation';
import VirementRapide from './VirementRapide';
import VirementProgramme from './VirementProgramme';
import AjouterBeneficiaire from './AjouterBeneficiaire';

const LCL_BLUE   = '#1a237e';
const LCL_YELLOW = '#f5c518';

const TABS = [
  { id: 'rapide',       label: 'Rapide',        icon: ArrowUpRight },
  { id: 'programme',    label: 'Programmé',     icon: Calendar     },
  { id: 'beneficiaire', label: 'Bénéficiaires', icon: Users        },
];

export default function VirementPage() {
  const navigate = useNavigate();
  const { user }  = useAuth();
  const [activeTab, setActiveTab] = useState('rapide');

  const mainAccount = user?.accounts?.find(a => a.type === 'LIQUIDITE') || user?.accounts?.[0];
  const solde       = mainAccount
    ? new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2 }).format(mainAccount.balance)
    : '0,00';
  const currency = mainAccount?.currency || '€';

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div>
            <h1 className="text-base font-bold text-gray-900">Virement</h1>
            <p className="text-xs text-gray-500">
              Solde :{' '}
              <span className="font-semibold" style={{ color: LCL_BLUE }}>
                {solde} {currency}
              </span>
            </p>
          </div>
        </div>

        {/* Onglets */}
        <div className="flex border-t border-gray-100">
          {TABS.map(tab => {
            const Icon     = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => !user?.isBlocked && setActiveTab(tab.id)}
                className="flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition relative"
                style={{
                  color:  user?.isBlocked ? '#D1D5DB' : isActive ? LCL_BLUE : '#9CA3AF',
                  cursor: user?.isBlocked ? 'not-allowed' : 'pointer',
                }}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {isActive && !user?.isBlocked && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: LCL_BLUE }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Compte bloqué */}
      {user?.isBlocked ? (
        <div className="px-4 pt-10 flex flex-col items-center text-center gap-5">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center shadow-lg"
            style={{ background: LCL_BLUE }}
          >
            <Lock className="w-12 h-12 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Virements indisponibles</h2>
            <p className="text-gray-500 text-sm max-w-xs">
              Votre compte est actuellement bloqué. Les virements sont suspendus jusqu'au déblocage de votre compte.
            </p>
          </div>
          {user?.blockReason && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 w-full max-w-xs">
              <p className="text-xs text-amber-700 font-medium mb-1">Motif du blocage</p>
              <p className="text-sm text-amber-900">{user.blockReason}</p>
            </div>
          )}
          {user?.unlockFee > 0 && (
            <div className="rounded-2xl p-4 w-full max-w-xs text-white" style={{ background: LCL_BLUE }}>
              <p className="text-xs opacity-70 mb-1">Frais de déblocage</p>
              <p className="text-2xl font-bold">
                {user.unlockFee.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
              </p>
            </div>
          )}
          <button
            onClick={() => navigate('/dashboard')}
            className="px-8 py-3 rounded-full font-semibold text-sm transition hover:opacity-90"
            style={{ background: LCL_YELLOW, color: LCL_BLUE }}
          >
            Retour au tableau de bord
          </button>
        </div>
      ) : (
        <div className="px-4 pt-5">
          {activeTab === 'rapide'       && <VirementRapide      />}
          {activeTab === 'programme'    && <VirementProgramme   />}
          {activeTab === 'beneficiaire' && <AjouterBeneficiaire />}
        </div>
      )}

      <BottomNavigation />
    </div>
  );
}
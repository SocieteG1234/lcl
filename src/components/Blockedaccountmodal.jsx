import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

const LCL_BLUE   = '#1a237e';
const LCL_YELLOW = '#f5c518';

export default function BlockedAccountModal({ user, onClose, onUnlock }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUnlock = async () => {
    setIsProcessing(true);
    try {
      await onUnlock();
      onClose();
    } catch (error) {
      console.error('Erreur lors du déblocage:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user || !user.isBlocked) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      style={{ background: 'rgba(0,0,0,0.5)' }}
    >
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">

        {/* En-tête */}
        <div className="p-5 border-b" style={{ background: LCL_BLUE }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="text-white" size={22} />
              </div>
              <h2 className="text-lg font-bold text-white">Compte bloqué</h2>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white transition">
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6">
          {/* ✅ Corrigé : user.name au lieu de user.firstName + user.lastName */}
          <p className="text-gray-700 mb-4">
            Bonjour <span className="font-semibold">{user.name}</span>,
          </p>
          <p className="text-gray-600 mb-5">
            Votre compte est actuellement bloqué. Des frais de déblocage sont applicables.
          </p>

          {/* Raison du blocage si disponible */}
          {user.blockReason && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
              <p className="text-sm text-amber-800">
                <span className="font-medium">Motif : </span>{user.blockReason}
              </p>
            </div>
          )}

          {/* Frais de déblocage */}
          <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium text-sm">Frais de déblocage :</span>
              <span className="text-2xl font-bold" style={{ color: LCL_BLUE }}>
                {user.unlockFee?.toLocaleString('fr-FR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}€
              </span>
            </div>
          </div>

          {/* Bouton */}
          <button
            onClick={handleUnlock}
            disabled={isProcessing}
            className="w-full py-3 rounded-full font-semibold text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ background: LCL_BLUE }}
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Traitement en cours...
              </>
            ) : (
              'Compris'
            )}
          </button>

          <p className="text-xs text-gray-400 text-center mt-4">
            Une fois débloqué, vous pourrez accéder à toutes les fonctionnalités de votre compte.
          </p>
        </div>
      </div>
    </div>
  );
}
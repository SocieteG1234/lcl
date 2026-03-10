import React from 'react';

const LCL_BLUE = '#1a237e';
const LCL_YELLOW = '#f5c518';

const AccountSummary = ({ user }) => {
  const mainAccount = user?.accounts?.find((acc) => acc.type === 'LIQUIDITE') || user?.accounts?.[0];

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

  return (
    <div className="p-4 sm:p-5 md:p-6 bg-white border-b border-gray-100">
      {/* Pays */}
      <div className="text-gray-400 text-xs mb-1 uppercase tracking-widest font-medium">
        {user?.country || 'FRANCE'}
      </div>

      {/* Nom */}
      <div className="text-gray-700 text-sm sm:text-base font-semibold mb-1 uppercase tracking-wide">
        {user?.lastName} {user?.firstName}
      </div>

      {/* Date du solde */}
      <div className="text-gray-400 text-xs mb-3 uppercase tracking-wider">
        Votre solde du{' '}
        {user?.lastUpdate || new Date().toLocaleDateString('fr-FR')}
      </div>

      {/* Solde principal */}
      <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
        {mainAccount ? formatCurrency(mainAccount.balance) : '0,00'}{' '}
        <span style={{ color: LCL_BLUE }}>{mainAccount?.currency || '€'}</span>
      </div>

      {/* Compte bloqué */}
      {user?.blockedAmount > 0 && (
        <div className="text-xs sm:text-sm text-gray-500">
          COMPTE BLOQUÉ / FRAIS DE DÉBLOCAGE :{' '}
          <span className="font-semibold" style={{ color: LCL_BLUE }}>
            {formatCurrency(user.blockedAmount)} {mainAccount?.currency || '€'}
          </span>
        </div>
      )}
    </div>
  );
};

export default AccountSummary;
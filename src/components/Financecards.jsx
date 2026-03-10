import React from 'react';

const LCL_BLUE = '#1a237e';

const FinanceCards = ({ accounts }) => {
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

  const getBarColor = (color) => {
    const map = {
      blue: LCL_BLUE,
      red: '#e53935',
      green: '#43a047',
      yellow: '#f5c518',
    };
    return map[color] || LCL_BLUE;
  };

  const getProgressPercentage = (balance) => {
    if (!accounts || accounts.length === 0) return 0;
    const max = Math.max(...accounts.map((a) => a.balance));
    return Math.min((balance / max) * 100, 100);
  };

  return (
    <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {accounts && accounts.length > 0 ? (
          accounts.map((account, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:shadow-md transition-shadow"
            >
              {/* Type de compte */}
              <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                <span
                  className="text-xl sm:text-2xl"
                  style={{ color: getBarColor(account.color) }}
                >
                  ●
                </span>
                <span className="text-gray-600 text-[10px] sm:text-xs font-semibold uppercase truncate">
                  {account.type}
                </span>
              </div>

              {/* Montant */}
              <div className="text-gray-900 text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3">
                {formatCurrency(account.balance)}
                <span style={{ color: LCL_BLUE }}>{account.currency}</span>
              </div>

              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-1 sm:h-1.5">
                <div
                  className="h-1 sm:h-1.5 rounded-full transition-all"
                  style={{
                    width: `${getProgressPercentage(account.balance)}%`,
                    background: getBarColor(account.color),
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center text-gray-500 py-6 sm:py-8 text-sm sm:text-base">
            Aucun compte disponible
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceCards;
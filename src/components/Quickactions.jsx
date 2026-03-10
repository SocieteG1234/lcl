import React from 'react';
import { ArrowDownLeft, ArrowUpRight, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LCL_BLUE = '#1a237e';

const QuickActions = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const actions = [
    { id: 'historique', label: 'Historique', icon: ArrowDownLeft, page: '/historique' },
    { id: 'virement',   label: 'Virement',   icon: ArrowUpRight,  page: '/virement'   },
    { id: 'cartes',     label: 'Cartes',     icon: CreditCard,    page: '/cartes'     },
  ];

  const handleClick = (action) => {
    if (setActiveTab) setActiveTab(action.id);
    navigate(action.page);
  };

  return (
    <div className="px-4 sm:px-6 mb-6">
      <div className="flex justify-around items-center py-4 border-b border-gray-200">
        {actions.map((action) => {
          const Icon     = action.icon;
          const isActive = activeTab === action.id;
          return (
            <button
              key={action.id}
              onClick={() => handleClick(action)}
              className="flex flex-col items-center gap-1.5 transition-all"
              style={{ color: isActive ? LCL_BLUE : '#6B7280' }}
            >
              <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-xs sm:text-sm font-medium">{action.label}</span>
              {isActive && (
                <div className="w-full h-0.5 rounded-full" style={{ backgroundColor: LCL_BLUE }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
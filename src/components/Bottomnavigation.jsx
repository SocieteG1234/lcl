import React, { useState } from 'react';
import { LayoutGrid, ArrowUpRight, CreditCard, MessageCircle, Bell } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const LCL_BLUE = '#1a237e';

const BottomNavigation = () => {
  const navigate   = useNavigate();
  const location   = useLocation();

  const navItems = [
    { id: 'synthese',   label: 'Synthèse',   icon: LayoutGrid,    page: '/dashboard'  },
    { id: 'virements',  label: 'Virements',  icon: ArrowUpRight,  page: '/virement'   },
    { id: 'cartes',     label: 'Cartes',     icon: CreditCard,    page: '/cartes'     },
    { id: 'conseiller', label: 'Conseiller', icon: MessageCircle, page: '/conseiller' },
    { id: 'actus',      label: 'Mes actus',  icon: Bell,          page: '/actus'      },
  ];

  const getActive = () => {
    const match = navItems.find(i => location.pathname === i.page);
    return match ? match.id : 'synthese';
  };

  const activeItem = getActive();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center py-2 px-1">
        {navItems.map((item) => {
          const Icon     = item.icon;
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.page)}
              className="flex flex-col items-center gap-0.5 transition-all min-w-0 px-1 py-1"
              style={{ color: isActive ? LCL_BLUE : '#9CA3AF' }}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.8} />
              <span
                className="text-[9px] font-medium leading-tight"
                style={{ color: isActive ? LCL_BLUE : '#9CA3AF' }}
              >
                {item.label}
              </span>
              {isActive && (
                <div
                  className="w-4 h-0.5 rounded-full mt-0.5"
                  style={{ backgroundColor: LCL_BLUE }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
import React, { useState } from 'react';
import { Home, ArrowUpRight, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LCL_BLUE = '#1a237e';

const BottomNavigation = () => {
  const navigate                    = useNavigate();
  const { logout }                  = useAuth();
  const [activeItem, setActiveItem] = useState('accueil');

  const handleLogout = () => {
    if (window.confirm('Voulez-vous vraiment vous déconnecter ?')) {
      logout();
      navigate('/');
    }
  };

  const navItems = [
    {
      id:     'accueil',
      label:  'Accueil',
      icon:   Home,
      action: () => { setActiveItem('accueil'); navigate('/dashboard'); },
    },
    {
      id:     'virement',
      label:  'Virement',
      icon:   ArrowUpRight,
      action: () => { setActiveItem('virement'); navigate('/virement'); },
    },
    {
      id:     'deconnexion',
      label:  'Quitter',
      icon:   LogOut,
      action: handleLogout,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center py-2 sm:py-3 px-1">
        {navItems.map((item) => {
          const Icon     = item.icon;
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              onClick={item.action}
              className="flex flex-col items-center gap-0.5 sm:gap-1 transition-all min-w-0 px-1"
              style={{ color: isActive ? LCL_BLUE : '#6B7280' }}
            >
              <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-[9px] sm:text-[10px] font-medium leading-tight">{item.label}</span>
              {isActive && (
                <div className="w-4 h-0.5 rounded-full" style={{ backgroundColor: LCL_BLUE }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
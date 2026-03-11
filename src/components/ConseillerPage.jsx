import React from 'react';
import { ChevronLeft, Phone, Mail, MessageCircle, Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BottomNavigation from './BottomNavigation';

const LCL_BLUE   = '#1a237e';
const LCL_YELLOW = '#f5c518';

const ConseillerPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const conseiller = {
    name:    'Marie Dubois',
    role:    'Votre conseillère personnelle',
    agency:  'Agence Paris République',
    phone:   '01 23 45 67 89',
    email:   'marie.dubois@lcl.fr',
    hours:   'Lun–Ven : 9h00 – 18h00',
    nextRdv: 'Aucun rendez-vous prévu',
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-4 sticky top-0 z-40"
        style={{ backgroundColor: LCL_BLUE }}
      >
        <button onClick={() => navigate('/dashboard')}>
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white font-bold text-base tracking-wide uppercase">Mon Conseiller</h1>
        <div className="w-6" />
      </div>

      {/* Avatar + infos conseiller */}
      <div
        className="mx-4 mt-6 rounded-2xl p-5 text-white shadow-lg"
        style={{ background: `linear-gradient(135deg, ${LCL_BLUE}, #283593)` }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black shadow-inner"
            style={{ backgroundColor: LCL_YELLOW, color: LCL_BLUE }}
          >
            {conseiller.name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-lg">{conseiller.name}</p>
            <p className="text-xs opacity-80">{conseiller.role}</p>
            <p className="text-xs opacity-60 mt-0.5">{conseiller.agency}</p>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-2 gap-3 px-4 mt-5">
        <a
          href={`tel:${conseiller.phone.replace(/\s/g, '')}`}
          className="flex flex-col items-center gap-2 bg-white rounded-2xl p-4 shadow-sm active:scale-95 transition-transform"
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${LCL_BLUE}15` }}
          >
            <Phone className="w-5 h-5" style={{ color: LCL_BLUE }} />
          </div>
          <span className="text-xs font-semibold text-gray-700">Appeler</span>
          <span className="text-[10px] text-gray-400">{conseiller.phone}</span>
        </a>

        <a
          href={`mailto:${conseiller.email}`}
          className="flex flex-col items-center gap-2 bg-white rounded-2xl p-4 shadow-sm active:scale-95 transition-transform"
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${LCL_BLUE}15` }}
          >
            <Mail className="w-5 h-5" style={{ color: LCL_BLUE }} />
          </div>
          <span className="text-xs font-semibold text-gray-700">Email</span>
          <span className="text-[10px] text-gray-400 truncate w-full text-center">{conseiller.email}</span>
        </a>

        <button className="flex flex-col items-center gap-2 bg-white rounded-2xl p-4 shadow-sm active:scale-95 transition-transform">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${LCL_BLUE}15` }}
          >
            <MessageCircle className="w-5 h-5" style={{ color: LCL_BLUE }} />
          </div>
          <span className="text-xs font-semibold text-gray-700">Message</span>
          <span className="text-[10px] text-gray-400">Messagerie sécurisée</span>
        </button>

        <button className="flex flex-col items-center gap-2 bg-white rounded-2xl p-4 shadow-sm active:scale-95 transition-transform">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${LCL_YELLOW}30` }}
          >
            <Calendar className="w-5 h-5" style={{ color: '#b8860b' }} />
          </div>
          <span className="text-xs font-semibold text-gray-700">Rendez-vous</span>
          <span className="text-[10px] text-gray-400">Prendre RDV</span>
        </button>
      </div>

      {/* Horaires */}
      <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4" style={{ color: LCL_BLUE }} />
          <p className="text-sm font-bold text-gray-800">Disponibilités</p>
        </div>
        <p className="text-sm text-gray-600">{conseiller.hours}</p>
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">Prochain rendez-vous</p>
          <p className="text-sm font-medium text-gray-700 mt-0.5">{conseiller.nextRdv}</p>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default ConseillerPage;
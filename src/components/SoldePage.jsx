import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const LCL_BLUE = '#1a237e';

export default function SoldePage({ navigate }) {
  const { user } = useAuth();

  useEffect(() => {
    navigate('/dashboard');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div
          className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
          style={{ borderColor: LCL_BLUE, borderTopColor: 'transparent' }}
        ></div>
        <p className="text-gray-600">Chargement...</p>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import {
  ArrowLeft, Download, Share2, Copy, CheckCircle,
  Wallet, Clock, ArrowLeftRight, CreditCard, FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LCL_BLUE   = '#1a237e';
const LCL_YELLOW = '#f5c518';

export default function RIBPage() {
  const navigate      = useNavigate();
  const { user: authUser } = useAuth();

  const [activeTab, setActiveTab] = useState('rib');
  const [copied, setCopied]       = useState(false);

  const defaultUser = {
    id: 1,
    name: 'MARIE-FRANÇOISE BOIGNON',
    accountNumber: '20250000011',
    rib: {
      iban:          'FR76 3000 4000 0100 0123 4567 890',
      bankCode:      '30004',
      branchCode:    '00001',
      accountNumber: '00123456789',
      key:           '90',
    },
  };

  const currentUser = authUser || defaultUser;

  const menuItems = [
    { id: 'solde',      icon: Wallet,        label: 'Solde'      },
    { id: 'historique', icon: Clock,          label: 'Historique' },
    { id: 'virement',   icon: ArrowLeftRight, label: 'Virement'   },
    { id: 'cartes',     icon: CreditCard,     label: 'Cartes'     },
    { id: 'rib',        icon: FileText,       label: 'RIB'        },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    const routes = {
      solde:      '/dashboard',
      historique: '/historique',
      virement:   '/virement',
      cartes:     '/cartes',
      rib:        '/rib',
    };
    if (routes[tabId]) navigate(routes[tabId]);
  };

  const getBankInfo = (u) => {
    const swift = 'CRLYFRPPXXX';
    if (u.rib?.iban) {
      return {
        accountHolder: u.name,
        iban:          u.rib.iban,
        swift,
        accountNumber: u.accountNumber,
        bankCode:      u.rib.bankCode  || '30002',
        branchCode:    u.rib.branchCode,
        accountKey:    u.rib.key,
        countryCode:   u.rib.iban.substring(0, 2),
      };
    }
    return {
      accountHolder: u.name,
      iban:          'Non défini',
      swift,
      accountNumber: u.accountNumber,
      bankCode:      '30002',
      branchCode:    'N/A',
      accountKey:    'N/A',
      countryCode:   'FR',
    };
  };

  const bankInfo = getBankInfo(currentUser);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text.replace(/\s/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    canvas.width  = 595;
    canvas.height = 842;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = LCL_BLUE;
    ctx.fillRect(0, 0, canvas.width, 120);
    ctx.fillStyle = LCL_YELLOW;
    ctx.fillRect(0, 112, canvas.width, 8);

    ctx.fillStyle = LCL_YELLOW;
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('LCL', 40, 65);
    ctx.fillStyle = '#ffffff';
    ctx.font = '11px Arial';
    ctx.fillText("Pour aller de l'avant", 40, 85);
    ctx.font = '14px Arial';
    ctx.textAlign = 'right';
    ctx.fillText("Relevé d'Identité Bancaire", 555, 65);

    let y = 160;
    ctx.textAlign = 'left';

    ctx.fillStyle = '#6b7280';
    ctx.font = '10px Arial';
    ctx.fillText('TITULAIRE DU COMPTE', 40, y);
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 18px Arial';
    ctx.fillText(bankInfo.accountHolder, 40, y + 25);
    y += 60;

    ctx.fillStyle = '#6b7280';
    ctx.font = '10px Arial';
    ctx.fillText('IBAN', 40, y);
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(40, y + 5, 515, 35);
    ctx.fillStyle = '#1f2937';
    ctx.font = '16px Courier New';
    ctx.fillText(bankInfo.iban, 50, y + 28);
    y += 60;

    ctx.fillStyle = '#6b7280';
    ctx.font = '10px Arial';
    ctx.fillText('CODE SWIFT/BIC', 40, y);
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(40, y + 5, 515, 35);
    ctx.fillStyle = '#1f2937';
    ctx.font = '16px Courier New';
    ctx.fillText(bankInfo.swift, 50, y + 28);
    y += 70;

    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, y); ctx.lineTo(555, y);
    ctx.stroke();
    y += 25;

    ctx.fillStyle = '#6b7280';
    ctx.font = '10px Arial';
    ctx.fillText('DÉTAILS DU COMPTE', 40, y);
    y += 25;

    const gridData = [
      { label: 'Code banque',      value: bankInfo.bankCode,      x: 40  },
      { label: 'Code guichet',     value: bankInfo.branchCode,    x: 310 },
      { label: 'Numéro de compte', value: bankInfo.accountNumber, x: 40  },
      { label: 'Clé RIB',         value: bankInfo.accountKey,    x: 310 },
    ];

    gridData.forEach((item, i) => {
      const yPos = y + Math.floor(i / 2) * 50;
      ctx.fillStyle = '#6b7280';
      ctx.font = '10px Arial';
      ctx.fillText(item.label, item.x, yPos);
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(item.x, yPos + 5, 235, 30);
      ctx.fillStyle = '#1f2937';
      ctx.font = '14px Courier New';
      ctx.fillText(item.value, item.x + 10, yPos + 25);
    });
    y += 130;

    ctx.strokeStyle = '#e5e7eb';
    ctx.beginPath();
    ctx.moveTo(40, y); ctx.lineTo(555, y);
    ctx.stroke();
    y += 25;
    ctx.fillStyle = '#6b7280';
    ctx.font = '11px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(
      `Document généré le ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`,
      canvas.width / 2, y
    );
    ctx.fillText('Ce RIB peut être utilisé pour effectuer des virements bancaires.', canvas.width / 2, y + 20);

    canvas.toBlob((blob) => {
      const url  = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href     = url;
      link.download = `RIB_LCL_${currentUser.name.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  const handleShare = async () => {
    const text = `RIB LCL - ${bankInfo.accountHolder}\n\nIBAN: ${bankInfo.iban}\nSWIFT: ${bankInfo.swift}`;
    if (navigator.share) {
      try { await navigator.share({ title: 'Mon RIB LCL', text }); }
      catch (err) { if (err.name !== 'AbortError') handleCopy(text); }
    } else {
      handleCopy(text);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={20} />
            <span>Retour</span>
          </button>

          {/* Logo L1 centré */}
          <div className="flex items-center gap-2">
            <img
              src="/images/L1.jpeg"
              alt="LCL"
              className="h-9 w-auto object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <span className="font-bold text-xl hidden" style={{ color: LCL_BLUE }}>LCL</span>
          </div>

          <div className="flex gap-2">
            <button onClick={handleShare}   className="p-2 hover:bg-gray-100 rounded-lg transition" title="Partager">
              <Share2 size={20} className="text-gray-600" />
            </button>
            <button onClick={handleDownload} className="p-2 hover:bg-gray-100 rounded-lg transition" title="Télécharger">
              <Download size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Contenu */}
      <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">

          {/* En-tête LCL */}
          <div className="p-6 text-white" style={{ background: LCL_BLUE }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Logo L1 dans l'en-tête RIB */}
                <div
                  className="px-2 py-2 rounded overflow-hidden flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.15)', border: `2px solid ${LCL_YELLOW}` }}
                >
                  <img
                    src="/images/L1.jpeg"
                    alt="LCL"
                    className="h-10 w-auto object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="flex-col items-center hidden">
                    <span style={{ color: LCL_YELLOW, fontWeight: 900, fontSize: 20, letterSpacing: 2 }}>LCL</span>
                    <span style={{ color: 'white', fontSize: 7 }}>Pour aller de l'avant</span>
                  </div>
                </div>
                <div>
                  <h2 className="font-bold text-lg">LCL — Le Crédit Lyonnais</h2>
                  <p className="text-sm opacity-80">Relevé d'Identité Bancaire</p>
                </div>
              </div>
            </div>
          </div>

          {/* Informations */}
          <div className="p-6 space-y-6">
            <div>
              <p className="text-xs text-gray-500 mb-1 uppercase">Titulaire du compte</p>
              <p className="text-lg font-bold text-gray-800">{bankInfo.accountHolder}</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-500 uppercase">IBAN ({bankInfo.countryCode})</p>
                <button
                  onClick={() => handleCopy(bankInfo.iban)}
                  className="flex items-center gap-1 text-xs font-medium transition"
                  style={{ color: LCL_BLUE }}
                >
                  {copied ? <><CheckCircle size={14} /> Copié</> : <><Copy size={14} /> Copier</>}
                </button>
              </div>
              <p className="font-mono text-base text-gray-800 bg-gray-50 p-3 rounded-lg">
                {bankInfo.iban}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-500 uppercase">Code SWIFT/BIC</p>
                <button
                  onClick={() => handleCopy(bankInfo.swift)}
                  className="flex items-center gap-1 text-xs font-medium transition"
                  style={{ color: LCL_BLUE }}
                >
                  <Copy size={14} /> Copier
                </button>
              </div>
              <p className="font-mono text-base text-gray-800 bg-gray-50 p-3 rounded-lg">
                {bankInfo.swift}
              </p>
            </div>

            <div className="border-t pt-4">
              <p className="text-xs text-gray-500 mb-3 uppercase">Détails du compte</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Code banque',  value: bankInfo.bankCode      },
                  { label: 'Code guichet', value: bankInfo.branchCode    },
                  { label: 'N° de compte', value: bankInfo.accountNumber },
                  { label: 'Clé RIB',     value: bankInfo.accountKey    },
                ].map(item => (
                  <div key={item.label}>
                    <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                    <p className="font-mono text-sm text-gray-800">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Boutons actions */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleDownload}
            className="text-white py-4 rounded-xl font-medium transition flex items-center justify-center gap-2 shadow-sm hover:opacity-90"
            style={{ background: LCL_BLUE }}
          >
            <Download size={20} />Télécharger
          </button>
          <button
            onClick={handleShare}
            className="bg-white hover:bg-gray-50 text-gray-800 py-4 rounded-xl font-medium transition flex items-center justify-center gap-2 shadow-sm border border-gray-200"
          >
            <Share2 size={20} />Partager
          </button>
        </div>
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
        <div className="max-w-4xl mx-auto px-2">
          <div className="flex items-center justify-around">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className="flex flex-col items-center gap-1 py-3 px-4 transition"
                style={{ color: activeTab === item.id ? LCL_BLUE : '#6B7280' }}
              >
                <item.icon size={24} />
                <span className="text-xs font-medium">{item.label}</span>
                {activeTab === item.id && (
                  <div className="w-4 h-0.5 rounded-full" style={{ background: LCL_BLUE }} />
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
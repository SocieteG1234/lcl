import React from 'react';
import { CheckCircle, Download, ArrowLeft } from 'lucide-react';

const LCL_BLUE   = '#1a237e';
const LCL_YELLOW = '#f5c518';

export default function RecuPage({ navigate, virementData }) {
  if (!virementData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-3xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Aucune donnée de virement</h2>
          <p className="text-gray-600 mb-6">Les informations du virement ne sont pas disponibles.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full text-white py-3 rounded-lg transition hover:opacity-90"
            style={{ background: LCL_BLUE }}
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    canvas.width  = 800;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');

    // Fond blanc
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Header bleu LCL
    ctx.fillStyle = LCL_BLUE;
    ctx.fillRect(0, 0, canvas.width, 120);

    // Bande jaune
    ctx.fillStyle = LCL_YELLOW;
    ctx.fillRect(0, 112, canvas.width, 8);

    // Logo + titre
    ctx.fillStyle = LCL_YELLOW;
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('LCL', 40, 60);
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.fillText('Pour aller de l\'avant', 40, 80);

    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('REÇU DE VIREMENT', canvas.width - 40, 65);

    // Badge succès
    ctx.fillStyle = '#e8eaf6';
    ctx.fillRect(200, 140, 400, 50);
    ctx.fillStyle = LCL_BLUE;
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('✓ VIREMENT EFFECTUÉ', canvas.width / 2, 170);

    // Référence
    ctx.fillStyle = '#fff9c4';
    ctx.fillRect(150, 210, 500, 60);
    ctx.strokeStyle = LCL_YELLOW;
    ctx.lineWidth = 2;
    ctx.strokeRect(150, 210, 500, 60);
    ctx.fillStyle = '#5d4037';
    ctx.font = '11px Arial';
    ctx.fillText('RÉFÉRENCE', canvas.width / 2, 230);
    ctx.font = 'bold 16px Courier New';
    ctx.fillText(virementData.reference, canvas.width / 2, 255);

    // Montant
    ctx.fillStyle = LCL_BLUE;
    ctx.font = 'bold 42px Arial';
    ctx.fillText(`${virementData.amount} €`, canvas.width / 2, 320);

    // Détails
    ctx.textAlign = 'left';
    let y = 380;
    const details = [
      { label: 'ÉMETTEUR',    value: virementData.senderName  },
      { label: 'BÉNÉFICIAIRE',value: virementData.beneficiary },
      { label: 'EMAIL',       value: virementData.email       },
      { label: 'IBAN',        value: virementData.iban        },
      { label: 'BIC',         value: virementData.bic         },
      { label: 'DATE',        value: virementData.date        },
    ];

    details.forEach(detail => {
      ctx.fillStyle = '#6b7280';
      ctx.font = '11px Arial';
      ctx.fillText(detail.label, 80, y);
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 14px Arial';
      ctx.fillText(detail.value || '—', 80, y + 20);
      y += 50;
    });

    if (virementData.message) {
      ctx.fillStyle = '#6b7280';
      ctx.font = '11px Arial';
      ctx.fillText('MESSAGE', 80, y);
      ctx.fillStyle = '#1f2937';
      ctx.font = '12px Arial';
      ctx.fillText(virementData.message, 80, y + 20);
    }

    ctx.textAlign = 'center';
    ctx.fillStyle = '#6b7280';
    ctx.font = '11px Arial';
    ctx.fillText(
      'Document généré le ' + new Date().toLocaleDateString('fr-FR'),
      canvas.width / 2, 960
    );

    canvas.toBlob((blob) => {
      const url  = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href     = url;
      link.download = `Recu_LCL_${virementData.reference}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
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
          <h1 className="text-xl font-bold text-gray-800">Reçu</h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">

          {/* Header bleu LCL */}
          <div className="p-8 text-center text-white" style={{ background: LCL_BLUE }}>
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(255,255,255,0.15)' }}
            >
              <CheckCircle size={40} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Virement effectué !</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>Votre transaction a été traitée avec succès</p>
          </div>

          {/* Référence */}
          <div
            className="mx-6 -mt-4 rounded-lg shadow-sm p-4"
            style={{ background: '#fff9c4', borderLeft: `4px solid ${LCL_YELLOW}` }}
          >
            <p className="text-xs text-yellow-800 mb-1">RÉFÉRENCE DE TRANSACTION</p>
            <p className="text-lg font-bold font-mono" style={{ color: '#5d4037' }}>{virementData.reference}</p>
          </div>

          {/* Montant */}
          <div className="p-6 text-center border-b">
            <p className="text-sm text-gray-600 mb-1">Montant</p>
            <p className="text-4xl font-bold" style={{ color: LCL_BLUE }}>{virementData.amount} €</p>
          </div>

          {/* Détails */}
          <div className="p-6 space-y-4">
            {[
              { label: 'ÉMETTEUR',      value: virementData.senderName  },
              { label: 'BÉNÉFICIAIRE',  value: virementData.beneficiary },
              { label: 'EMAIL',         value: virementData.email       },
              { label: 'IBAN',          value: virementData.iban,  mono: true },
              { label: 'CODE BIC/SWIFT',value: virementData.bic,   mono: true },
              { label: 'DATE ET HEURE', value: virementData.date        },
            ].map(item => (
              <div key={item.label}>
                <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                <p className={`text-base text-gray-800 ${item.mono ? 'font-mono text-sm' : 'font-semibold'}`}>
                  {item.value || '—'}
                </p>
              </div>
            ))}

            {virementData.message && (
              <div>
                <p className="text-xs text-gray-500 mb-1">MESSAGE</p>
                <p className="text-base text-gray-700">{virementData.message}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-6 bg-gray-50 space-y-3">
            <button
              onClick={handleDownload}
              className="w-full text-white py-3 rounded-lg transition hover:opacity-90 flex items-center justify-center gap-2"
              style={{ background: LCL_BLUE }}
            >
              <Download size={20} />
              Télécharger le reçu
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition"
            >
              Retour au tableau de bord
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
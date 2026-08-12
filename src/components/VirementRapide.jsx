import React, { useState, useRef } from 'react';
import { CheckCircle, AlertCircle, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserServices from '../services/UserServices';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const LCL_BLUE   = '#1a237e';
const LCL_YELLOW = '#f5c518';

export default function VirementRapide() {
  const navigate    = useNavigate();
  const { user, updateUser } = useAuth();
  const recuRef = useRef(null);

  const beneficiaires = user?.beneficiaires || [
    { id: 1, nom: 'Jean Dupont',  iban: 'FR76 3000 6000 0112 3456 7890 189', banque: 'BNP Paribas'       },
    { id: 2, nom: 'Marie Martin', iban: 'FR76 1027 8000 0100 2345 6789 012', banque: 'Société Générale'  },
    { id: 3, nom: 'Paul Bernard', iban: 'FR76 2004 1010 0505 0013 0026 83',  banque: 'Crédit Agricole'   },
  ];

  const [form, setForm]         = useState({ beneficiaireId: '', montant: '', motif: '' });
  const [step, setStep]         = useState('form'); // 'form' | 'confirm' | 'success'
  const [loading, setLoading]   = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [lastTransaction, setLastTransaction] = useState(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const mainAccount = user?.accounts?.find(a => a.type === 'LIQUIDITE') || user?.accounts?.[0];
  const solde    = mainAccount?.balance || 0;
  const currency = mainAccount?.currency || '€';

  const fmt = (n) => new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2 }).format(n);

  const selectedBenef = beneficiaires.find(b => b.id === Number(form.beneficiaireId));

  const handleSubmit = () => {
    setErrorMsg('');
    if (!form.beneficiaireId) { setErrorMsg('Veuillez sélectionner un bénéficiaire.'); return; }
    const montant = parseFloat(form.montant.replace(',', '.'));
    if (!montant || montant <= 0)  { setErrorMsg('Montant invalide.'); return; }
    if (montant > solde)           { setErrorMsg(`Solde insuffisant (${fmt(solde)} ${currency} disponible).`); return; }
    setStep('confirm');
  };

  const handleConfirm = async () => {
    setLoading(true);

    const montant = parseFloat(form.montant.replace(',', '.'));
    const accountIndex = user.accounts.findIndex(a => a.type === 'LIQUIDITE');
    const idx = accountIndex >= 0 ? accountIndex : 0;

    const updatedAccounts = [...user.accounts];
    updatedAccounts[idx] = {
      ...updatedAccounts[idx],
      balance: updatedAccounts[idx].balance - montant,
    };

    const reference = `VIR${Date.now()}`;
    const transaction = {
      id: Date.now(),
      type: 'Virement',
      reference,
      date: new Date().toLocaleDateString('fr-FR'),
      heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      amount: montant,
      isCredit: false,
      beneficiaire: selectedBenef.nom,
      iban: selectedBenef.iban,
      motif: form.motif || null,
      statut: 'Effectué',
    };

    const updates = {
      balance: (user.balance || 0) - montant,
      accounts: updatedAccounts,
      transactions: [transaction, ...(user.transactions || [])],
    };

    try {
      await UserServices.updateUser(user.id, updates);
      updateUser({ ...user, ...updates });

      setLastTransaction(transaction);
      setStep('success');
    } catch (err) {
      setErrorMsg("Le virement n'a pas pu être enregistré. Veuillez réessayer.");
      setStep('form');
    } finally {
      setLoading(false);
    }
  };

  const telechargerRecu = async () => {
    if (!lastTransaction || !recuRef.current) return;
    setGeneratingPdf(true);

    try {
      const img = recuRef.current.querySelector('img');
      if (img && !img.complete) {
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      }

      const canvas = await html2canvas(recuRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ unit: 'px', format: [canvas.width / 2, canvas.height / 2] });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`recu-virement-${lastTransaction.reference}.pdf`);
    } catch (err) {
      console.error('Erreur génération PDF:', err);
    } finally {
      setGeneratingPdf(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="flex flex-col items-center text-center py-10 gap-5">
        <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: '#e8f5e9' }}>
          <CheckCircle className="w-10 h-10" style={{ color: '#43a047' }} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Virement envoyé !</h2>
        <p className="text-gray-500 text-sm">
          <span className="font-semibold" style={{ color: LCL_BLUE }}>
            {fmt(lastTransaction?.amount || 0)} {currency}
          </span>{' '}
          ont été envoyés à <span className="font-semibold">{lastTransaction?.beneficiaire}</span>.
        </p>

        {/* ── Reçu caché, capturé pour le PDF ────────────────────── */}
        <div style={{ position: 'fixed', top: '-9999px', left: '-9999px' }}>
          <div
            ref={recuRef}
            style={{
              width: '480px',
              fontFamily: 'Arial, sans-serif',
              background: '#ffffff',
              borderRadius: '16px',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{ background: LCL_BLUE, padding: '28px 32px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <div style={{ background: 'white', borderRadius: '8px', padding: '6px 12px', display: 'inline-block' }}>
                  <img
                    src="/images/L1.jpeg"
                    alt="LCL"
                    crossOrigin="anonymous"
                    style={{ height: '24px', width: 'auto', objectFit: 'contain', display: 'block' }}
                  />
                </div>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>Pour aller de l'avant</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ color: '#43a047', fontSize: '20px' }}>✓</span>
                </div>
                <div>
                  <p style={{ color: 'white', fontWeight: 'bold', fontSize: '16px', margin: 0 }}>Virement effectué</p>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', margin: 0 }}>
                    {lastTransaction?.date} à {lastTransaction?.heure}
                  </p>
                </div>
              </div>
            </div>
            <div style={{ background: LCL_YELLOW, height: '4px' }} />

            {/* Montant */}
            <div style={{ padding: '24px 32px 8px', textAlign: 'center' }}>
              <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Montant envoyé
              </p>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: LCL_BLUE, margin: 0 }}>
                {fmt(lastTransaction?.amount || 0)} {currency}
              </p>
            </div>

            {/* Détails */}
            <div style={{ padding: '16px 32px 28px' }}>
              {[
                { label: 'Bénéficiaire', value: lastTransaction?.beneficiaire },
                { label: 'IBAN',         value: lastTransaction?.iban },
                { label: 'Référence',    value: lastTransaction?.reference },
                { label: 'Motif',        value: lastTransaction?.motif || '—' },
                { label: 'Statut',       value: lastTransaction?.statut },
              ].map((row, i) => (
                <div
                  key={row.label}
                  style={{
                    display: 'flex', justifyContent: 'space-between', padding: '10px 0',
                    borderTop: i === 0 ? 'none' : '1px solid #F3F4F6',
                    fontSize: '13px',
                  }}
                >
                  <span style={{ color: '#9CA3AF' }}>{row.label}</span>
                  <span style={{ color: '#111827', fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{ background: '#F9FAFB', padding: '14px 32px', textAlign: 'center' }}>
              <p style={{ fontSize: '10px', color: '#9CA3AF', margin: 0 }}>
                LCL — Document généré électroniquement, ne nécessite pas de signature
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs pt-2">
          <button
            onClick={telechargerRecu}
            disabled={generatingPdf}
            className="px-6 py-2.5 rounded-full border-2 font-semibold text-sm transition hover:bg-gray-50 disabled:opacity-60"
            style={{ borderColor: LCL_BLUE, color: LCL_BLUE }}
          >
            {generatingPdf ? 'Génération...' : 'Télécharger le reçu'}
          </button>
          <button
            onClick={() => { setStep('form'); setForm({ beneficiaireId: '', montant: '', motif: '' }); setLastTransaction(null); }}
            className="px-8 py-3 rounded-full font-semibold text-white transition hover:opacity-90"
            style={{ background: LCL_BLUE }}
          >
            Nouveau virement
          </button>
          <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-500 hover:underline">
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  if (step === 'confirm') {
    const montant = parseFloat(form.montant.replace(',', '.'));
    return (
      <div className="space-y-4">
        <h2 className="text-base font-bold text-gray-900">Confirmer le virement</h2>
        <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
          {[
            { label: 'Bénéficiaire', value: selectedBenef?.nom },
            { label: 'IBAN',         value: selectedBenef?.iban },
            { label: 'Banque',       value: selectedBenef?.banque },
            { label: 'Montant',      value: `${fmt(montant)} ${currency}`, bold: true, color: LCL_BLUE },
            { label: 'Motif',        value: form.motif || '—' },
          ].map(row => (
            <div key={row.label} className="flex justify-between px-4 py-3 text-sm">
              <span className="text-gray-500">{row.label}</span>
              <span
                className={`font-${row.bold ? 'bold' : 'medium'} text-right`}
                style={{ color: row.color || '#111827' }}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-700 border border-blue-100">
          Le montant sera débité immédiatement de votre compte.
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {errorMsg}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => setStep('form')}
            className="flex-1 py-3 rounded-full border-2 font-semibold text-sm transition hover:bg-gray-50"
            style={{ borderColor: LCL_BLUE, color: LCL_BLUE }}
          >
            Modifier
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 py-3 rounded-full font-semibold text-sm text-white transition hover:opacity-90 disabled:opacity-60"
            style={{ background: LCL_BLUE }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Envoi...
              </span>
            ) : 'Confirmer'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-4 text-white" style={{ background: LCL_BLUE }}>
        <p className="text-xs opacity-70 mb-1">Solde disponible</p>
        <p className="text-2xl font-bold">{fmt(solde)} {currency}</p>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {errorMsg}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Bénéficiaire</label>
        <div className="relative">
          <select
            value={form.beneficiaireId}
            onChange={e => setForm({ ...form, beneficiaireId: e.target.value })}
            className="w-full bg-white border-2 rounded-xl px-4 py-3 text-sm appearance-none focus:outline-none transition"
            style={{ borderColor: form.beneficiaireId ? LCL_BLUE : '#E5E7EB' }}
          >
            <option value="">Sélectionner un bénéficiaire...</option>
            {beneficiaires.map(b => (
              <option key={b.id} value={b.id}>{b.nom} — {b.banque}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        {selectedBenef && (
          <p className="text-xs text-gray-400 mt-1 pl-1">{selectedBenef.iban}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Montant</label>
        <div className="relative">
          <input
            type="number"
            placeholder="0,00"
            min="0"
            step="0.01"
            value={form.montant}
            onChange={e => setForm({ ...form, montant: e.target.value })}
            className="w-full bg-white border-2 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none transition"
            style={{ borderColor: form.montant ? LCL_BLUE : '#E5E7EB' }}
          />
          <span className="absolute right-4 top-3.5 text-sm font-bold text-gray-500">{currency}</span>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Motif (optionnel)</label>
        <input
          type="text"
          placeholder="Ex: Loyer, remboursement..."
          value={form.motif}
          onChange={e => setForm({ ...form, motif: e.target.value })}
          className="w-full bg-white border-2 rounded-xl px-4 py-3 text-sm focus:outline-none transition"
          style={{ borderColor: form.motif ? LCL_BLUE : '#E5E7EB' }}
          maxLength={70}
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-4 rounded-full font-bold text-white text-sm transition hover:opacity-90 mt-2"
        style={{ background: LCL_BLUE }}
      >
        Continuer
      </button>
    </div>
  );
}
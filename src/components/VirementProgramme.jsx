import React, { useState } from 'react';
import { CheckCircle, AlertCircle, ChevronDown, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LCL_BLUE = '#1a237e';

const FREQUENCES = [
  { value: 'unique',       label: 'Une seule fois' },
  { value: 'hebdomadaire', label: 'Hebdomadaire' },
  { value: 'mensuel',      label: 'Mensuel' },
  { value: 'trimestriel',  label: 'Trimestriel' },
];

export default function VirementProgramme({ navigate }) {
  const { user } = useAuth();

  const beneficiaires = user?.beneficiaires || [
    { id: 1, nom: 'Jean Dupont',    iban: 'FR76 3000 6000 0112 3456 7890 189', banque: 'BNP Paribas' },
    { id: 2, nom: 'Marie Martin',   iban: 'FR76 1027 8000 0100 2345 6789 012', banque: 'Société Générale' },
    { id: 3, nom: 'Paul Bernard',   iban: 'FR76 2004 1010 0505 0013 0026 83',  banque: 'Crédit Agricole' },
  ];

  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    beneficiaireId: '',
    montant: '',
    motif: '',
    dateDebut: today,
    frequence: 'unique',
  });
  const [step, setStep] = useState('form');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const mainAccount = user?.accounts?.find(a => a.type === 'LIQUIDITE') || user?.accounts?.[0];
  const currency = mainAccount?.currency || '€';
  const fmt = (n) => new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2 }).format(n);
  const selectedBenef = beneficiaires.find(b => b.id === Number(form.beneficiaireId));

  const handleSubmit = () => {
    setErrorMsg('');
    if (!form.beneficiaireId) { setErrorMsg('Veuillez sélectionner un bénéficiaire.'); return; }
    const montant = parseFloat(form.montant.replace(',', '.'));
    if (!montant || montant <= 0) { setErrorMsg('Montant invalide.'); return; }
    if (!form.dateDebut) { setErrorMsg('Veuillez choisir une date.'); return; }
    setStep('confirm');
  };

  const handleConfirm = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setStep('success');
  };

  if (step === 'success') {
    const montant = parseFloat(form.montant.replace(',', '.'));
    const freqLabel = FREQUENCES.find(f => f.value === form.frequence)?.label;
    return (
      <div className="flex flex-col items-center text-center py-10 gap-5">
        <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: '#e8f5e9' }}>
          <CheckCircle className="w-10 h-10" style={{ color: '#43a047' }} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Virement programmé !</h2>
        <p className="text-gray-500 text-sm max-w-xs">
          <span className="font-semibold" style={{ color: LCL_BLUE }}>{fmt(montant)} {currency}</span> seront envoyés à <span className="font-semibold">{selectedBenef?.nom}</span> — <span>{freqLabel}</span> à partir du {new Date(form.dateDebut).toLocaleDateString('fr-FR')}.
        </p>
        <button
          onClick={() => { setStep('form'); setForm({ beneficiaireId: '', montant: '', motif: '', dateDebut: today, frequence: 'unique' }); }}
          className="mt-4 px-8 py-3 rounded-full font-semibold text-white transition hover:opacity-90"
          style={{ background: LCL_BLUE }}
        >
          Nouveau virement
        </button>
        <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-500 hover:underline">
          Retour au tableau de bord
        </button>
      </div>
    );
  }

  if (step === 'confirm') {
    const montant = parseFloat(form.montant.replace(',', '.'));
    const freqLabel = FREQUENCES.find(f => f.value === form.frequence)?.label;
    return (
      <div className="space-y-4">
        <h2 className="text-base font-bold text-gray-900">Confirmer le virement programmé</h2>
        <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
          {[
            { label: 'Bénéficiaire', value: selectedBenef?.nom },
            { label: 'IBAN',         value: selectedBenef?.iban },
            { label: 'Montant',      value: `${fmt(montant)} ${currency}`, bold: true, color: LCL_BLUE },
            { label: 'Date de début',value: new Date(form.dateDebut).toLocaleDateString('fr-FR') },
            { label: 'Fréquence',    value: freqLabel },
            { label: 'Motif',        value: form.motif || '—' },
          ].map(row => (
            <div key={row.label} className="flex justify-between px-4 py-3 text-sm">
              <span className="text-gray-500">{row.label}</span>
              <span className={`font-${row.bold ? 'bold' : 'medium'} text-right max-w-[55%]`} style={{ color: row.color || '#111827' }}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
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
      {errorMsg && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* Bénéficiaire */}
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
      </div>

      {/* Montant */}
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

      {/* Date */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Date de début</label>
        <div className="relative">
          <input
            type="date"
            min={today}
            value={form.dateDebut}
            onChange={e => setForm({ ...form, dateDebut: e.target.value })}
            className="w-full bg-white border-2 rounded-xl px-4 py-3 text-sm focus:outline-none transition"
            style={{ borderColor: form.dateDebut ? LCL_BLUE : '#E5E7EB' }}
          />
          <Calendar className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Fréquence */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Fréquence</label>
        <div className="grid grid-cols-2 gap-2">
          {FREQUENCES.map(f => (
            <button
              key={f.value}
              onClick={() => setForm({ ...form, frequence: f.value })}
              className="py-2.5 px-3 rounded-xl text-sm font-medium border-2 transition"
              style={{
                borderColor: form.frequence === f.value ? LCL_BLUE : '#E5E7EB',
                background: form.frequence === f.value ? '#e8eaf6' : 'white',
                color: form.frequence === f.value ? LCL_BLUE : '#6B7280',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Motif */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Motif (optionnel)</label>
        <input
          type="text"
          placeholder="Ex: Loyer mensuel..."
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
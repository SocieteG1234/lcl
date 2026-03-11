import React, { useState } from 'react';
import { ChevronLeft, FileText, Download, Eye, Lock, Shield, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BottomNavigation from './Bottomnavigation';

const LCL_BLUE   = '#1a237e';
const LCL_YELLOW = '#f5c518';

// ── Génération PDF dynamique avec jsPDF (chargé via CDN) ──────────
const loadJsPDF = () => new Promise((res) => {
  if (window.jspdf) { res(window.jspdf.jsPDF); return; }
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
  script.onload = () => res(window.jspdf.jsPDF);
  document.head.appendChild(script);
});

const loadImage = (src) => new Promise((res) => {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload  = () => res(img);
  img.onerror = () => res(null);
  img.src = src;
});

const generateActeBlocage = async (user) => {
  const jsPDF = await loadJsPDF();
  const doc   = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const W      = 210;
  const BLUE   = [26, 35, 126];
  const YELLOW = [245, 197, 24];
  const WHITE  = [255, 255, 255];
  const GRAY   = [107, 114, 128];
  const LGRAY  = [243, 244, 246];
  const DARK   = [31, 41, 55];
  const RED    = [220, 38, 38];

  const userName    = (user.name || 'TITULAIRE').toUpperCase();
  const accountNum  = user.accountNumber || '—';
  const iban        = user.rib?.iban || 'FR76 XXXX XXXX XXXX XXXX XXXX XXX';
  const balance     = Number(user.balance || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' €';
  const unlockFee   = Number(user.unlockFee || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' €';
  const blockReason = user.blockReason || 'Blocage temporaire pour régularisation successorale';
  const manager     = user.manager || 'Marie Dubois';
  const agency      = user.city ? `LCL ${user.city}` : 'LCL Paris République';
  const blockDate   = '14 décembre 2017';
  const docDate     = '03 janvier 2018';
  const docRef      = `LCL-BLK-20180103-${String(user.id || 1).padStart(3, '0')}`;

  let y = 0;
  const PAGE_H   = 297;
  const MARGIN_B = 18;

  const checkPage = (needed = 20) => {
    if (y + needed > PAGE_H - MARGIN_B) {
      doc.addPage();
      y = 14;
    }
  };

  const sectionTitle = (title, yPos) => {
    doc.setFillColor(...BLUE);
    doc.rect(14, yPos, W - 28, 8, 'F');
    doc.setTextColor(...WHITE);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 18, yPos + 5.5);
    return yPos + 12;
  };

  const infoCol = (label, value, x, yy) => {
    doc.setTextColor(...GRAY);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.text(label, x, yy);
    doc.setTextColor(...DARK);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(String(value), x, yy + 5);
  };

  // ── EN-TÊTE BLEU ─────────────────────────────────────────────
  doc.setFillColor(...BLUE);
  doc.rect(0, 0, W, 32, 'F');
  doc.setFillColor(...YELLOW);
  doc.rect(0, 28, W, 4, 'F');

  // Logo
  const logo = await loadImage('/images/L1.jpeg');
  if (logo) {
    doc.addImage(logo, 'JPEG', 8, 4, 38, 20);
  } else {
    doc.setTextColor(...WHITE);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('LCL', 14, 14);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Le Crédit Lyonnais', 14, 20);
  }

  // Titre centre
  doc.setTextColor(...WHITE);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('ACTE DE BLOCAGE DE COMPTE', W / 2, 12, { align: 'center' });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Document officiel — Confidentiel', W / 2, 18, { align: 'center' });

  // Réf droite
  doc.setFontSize(7.5);
  doc.text(`Réf. : ${docRef}`, W - 14, 12, { align: 'right' });
  doc.text(`Date : ${docDate}`, W - 14, 18, { align: 'right' });

  y = 38;

  // ── BANDEAU TITRE JAUNE ────────────────────────────────────────
  doc.setFillColor(...YELLOW);
  doc.roundedRect(14, y, W - 28, 10, 2, 2, 'F');
  doc.setTextColor(...BLUE);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('NOTIFICATION DE MESURE CONSERVATOIRE', W / 2, y + 6.5, { align: 'center' });
  y += 16;

  // ── 1. INFORMATIONS DU COMPTE ─────────────────────────────────
  checkPage(50);
  y = sectionTitle('1. INFORMATIONS DU COMPTE', y);

  doc.setFillColor(...LGRAY);
  doc.rect(14, y, W - 28, 26, 'F');
  doc.setDrawColor(229, 231, 235);
  doc.rect(14, y, W - 28, 26, 'S');
  infoCol('Titulaire',       userName,   18,  y + 6);
  infoCol('N° Compte',       accountNum, 110, y + 6);
  infoCol('Agence',          agency,     18,  y + 17);
  infoCol('Date de blocage', blockDate,  110, y + 17);
  y += 30;

  doc.setFillColor(...LGRAY);
  doc.rect(14, y, W - 28, 10, 'F');
  doc.setDrawColor(229, 231, 235);
  doc.rect(14, y, W - 28, 10, 'S');
  doc.setTextColor(...GRAY); doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');
  doc.text('IBAN', 18, y + 4);
  doc.setTextColor(...DARK); doc.setFontSize(9); doc.setFont('helvetica', 'normal');
  doc.text(iban, 18, y + 9);
  doc.setTextColor(...GRAY); doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');
  doc.text('BIC/SWIFT', 140, y + 4);
  doc.setTextColor(...DARK); doc.setFontSize(9); doc.setFont('helvetica', 'normal');
  doc.text('CRLYFRPPXXX', 140, y + 9);
  y += 16;

  // ── 2. SITUATION FINANCIÈRE ───────────────────────────────────
  checkPage(40);
  y = sectionTitle('2. SITUATION FINANCIÈRE DU COMPTE', y);

  doc.setFillColor(232, 234, 246);
  doc.rect(14, y, 86, 18, 'F');
  doc.setDrawColor(...BLUE); doc.setLineWidth(0.8);
  doc.rect(14, y, 86, 18, 'S'); doc.setLineWidth(0.2);
  doc.setTextColor(...GRAY); doc.setFontSize(8); doc.setFont('helvetica', 'bold');
  doc.text('Solde total du compte', 57, y + 6, { align: 'center' });
  doc.setTextColor(...BLUE); doc.setFontSize(14); doc.setFont('helvetica', 'bold');
  doc.text(balance, 57, y + 14, { align: 'center' });

  doc.setFillColor(254, 242, 242);
  doc.rect(110, y, 86, 18, 'F');
  doc.setDrawColor(...RED); doc.setLineWidth(0.8);
  doc.rect(110, y, 86, 18, 'S'); doc.setLineWidth(0.2);
  doc.setTextColor(...GRAY); doc.setFontSize(8); doc.setFont('helvetica', 'bold');
  doc.text('Frais de déblocage requis', 153, y + 6, { align: 'center' });
  doc.setTextColor(...RED); doc.setFontSize(14); doc.setFont('helvetica', 'bold');
  doc.text(unlockFee, 153, y + 14, { align: 'center' });
  y += 24;

  // ── 3. MOTIF DU BLOCAGE ───────────────────────────────────────
  checkPage(55);
  y = sectionTitle('3. NATURE ET MOTIF DU BLOCAGE', y);

  doc.setFillColor(255, 248, 225);
  doc.rect(14, y, W - 28, 38, 'F');
  doc.setDrawColor(...YELLOW); doc.setLineWidth(1);
  doc.rect(14, y, W - 28, 38, 'S'); doc.setLineWidth(0.2);
  doc.setTextColor(...DARK); doc.setFontSize(9); doc.setFont('helvetica', 'bold');
  doc.text(`Motif : ${blockReason}`, 18, y + 7);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5);
  const motifLines = [
    "Suite au transfert de fonds provenant d'une succession, le compte fait actuellement l'objet",
    "d'une mesure de sécurité conformément aux règlements fiscaux et bancaires en vigueur.",
    "Ce blocage temporaire intervient dans le cadre de la vérification de l'origine des fonds",
    "ainsi que la régularisation des obligations fiscales liées à la succession du défunt.",
    "L'accès complet au compte sera rétabli dès la finalisation des formalités administratives,",
    "fiscales et notariales requises, ainsi que le règlement des frais de déblocage ci-dessus.",
  ];
  motifLines.forEach((line, i) => doc.text(line, 18, y + 14 + i * 4.8));
  y += 44;

  // ── 4. BASE LÉGALE ────────────────────────────────────────────
  checkPage(50);
  y = sectionTitle('4. BASE LÉGALE ET RÉGLEMENTAIRE', y);
  doc.setTextColor(...DARK); doc.setFontSize(8.5); doc.setFont('helvetica', 'normal');
  const legalItems = [
    'Art. L. 562-1 Code monétaire et financier — Gel des avoirs',
    'Directive européenne 2015/849 — Lutte contre le blanchiment de capitaux',
    'Articles 777 et suivants du Code civil — Dévolution successorale',
    'Article 1649 A du Code général des impôts — Obligations déclaratives',
    'Règlement intérieur LCL — Procédures de conformité et de sécurité bancaire',
  ];
  legalItems.forEach((item, i) => doc.text(`• ${item}`, 18, y + i * 5.5));
  y += legalItems.length * 5.5 + 6;

  // ── 5. CONDITIONS DE DÉBLOCAGE ────────────────────────────────
  checkPage(60);
  y = sectionTitle('5. CONDITIONS DE DÉBLOCAGE', y);
  doc.setFillColor(...BLUE); doc.rect(14, y, W - 28, 8, 'F');
  doc.setTextColor(...WHITE); doc.setFontSize(8); doc.setFont('helvetica', 'bold');
  doc.text('Étape', 20, y + 5.5);
  doc.text('Document / Action requise', 35, y + 5.5);
  doc.text('Délai', 175, y + 5.5, { align: 'right' });
  y += 8;
  const steps = [
    ['1', "Fournir l'acte notarial de succession certifié",                '5 à 10 jours'],
    ['2', 'Attestation fiscale de régularisation des droits de succession', '3 à 7 jours' ],
    ['3', `Règlement des frais de déblocage : ${unlockFee}`,                'Immédiat'    ],
    ['4', 'Validation par le département conformité LCL',                  '2 à 5 jours' ],
    ['5', "Rétablissement complet de l'accès au compte",                   'Sous 48h'    ],
  ];
  steps.forEach(([num, action, delay], i) => {
    const bg = i % 2 === 0 ? LGRAY : WHITE;
    doc.setFillColor(...bg);
    doc.rect(14, y, W - 28, 8, 'F');
    doc.setDrawColor(229, 231, 235); doc.rect(14, y, W - 28, 8, 'S');
    doc.setTextColor(...DARK); doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold'); doc.text(num, 20, y + 5.5);
    doc.setFont('helvetica', 'normal'); doc.text(action, 35, y + 5.5);
    doc.text(delay, 175, y + 5.5, { align: 'right' });
    y += 8;
  });
  y += 8;

  // ── 6. CONTACT ────────────────────────────────────────────────
  checkPage(45);
  y = sectionTitle('6. CONTACT ET INFORMATIONS', y);
  const contactCols = [
    { title: 'Conseiller(ère) assigné(e)', lines: [manager, 'marie.dubois@lcl.fr', '01 23 45 67 89'] },
    { title: 'Service Conformité LCL',     lines: ['Département Succession', 'conformite@lcl.fr', '0 800 123 456'] },
    { title: 'Adresse postale',             lines: ['LCL — Service Conformité', '19 bd des Italiens', '75002 Paris'] },
  ];
  const colW = (W - 28) / 3;
  contactCols.forEach((col, i) => {
    const cx = 14 + i * colW;
    doc.setFillColor(...LGRAY); doc.rect(cx, y, colW, 22, 'F');
    doc.setDrawColor(229, 231, 235); doc.rect(cx, y, colW, 22, 'S');
    doc.setTextColor(...BLUE); doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');
    doc.text(col.title, cx + 4, y + 5);
    doc.setTextColor(...DARK); doc.setFont('helvetica', 'normal');
    col.lines.forEach((line, j) => doc.text(line, cx + 4, y + 10 + j * 4.5));
  });
  y += 28;

  // ── PIED DE PAGE ──────────────────────────────────────────────
  checkPage(35);
  doc.setDrawColor(229, 231, 235);
  doc.line(14, y, W - 14, y);
  y += 6;
  doc.setTextColor(...DARK); doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
  doc.text(`Document émis le ${docDate} — LCL Le Crédit Lyonnais`, 14, y);
  doc.text('Siège social : 19 boulevard des Italiens, 75002 Paris', 14, y + 5);
  doc.setTextColor(...GRAY);
  doc.text('Ce document est généré automatiquement et a valeur officielle.', 14, y + 10);

  doc.setFillColor(232, 234, 246); doc.setDrawColor(...BLUE);
  doc.rect(130, y - 2, 66, 18, 'FD');
  doc.setTextColor(...BLUE); doc.setFont('helvetica', 'bold'); doc.setFontSize(8);
  doc.text('Cachet officiel LCL', 163, y + 3, { align: 'center' });
  doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5);
  doc.text('Direction Conformité & Risques', 163, y + 8, { align: 'center' });
  doc.text(`Validé électroniquement — ${docDate}`, 163, y + 13, { align: 'center' });

  doc.save(`acte_blocage_${userName.replace(/\s+/g, '_')}.pdf`);
};

// ── Page principale ────────────────────────────────────────────────
const GestionDocuments = () => {
  const navigate              = useNavigate();
  const { user }              = useAuth();
  const [downloading, setDownloading] = useState(null);

  if (!user) return null;

  const docDate = '03 janvier 2018';

  const documents = [
    {
      id:          'acte_blocage',
      titre:       'Acte de blocage de compte',
      description: user.blockReason || 'Notification de mesure conservatoire',
      date:        docDate,
      type:        'PDF',
      icon:        Lock,
      couleur:     '#fef3c7',
      iconColor:   '#b45309',
      urgent:      true,
      visible:     !!user.isBlocked,
    },
    {
      id:          'rib',
      titre:       'Relevé d\'Identité Bancaire (RIB)',
      description: 'Coordonnées bancaires — IBAN & BIC',
      date:        docDate,
      type:        'PDF',
      icon:        FileText,
      couleur:     '#e8eaf6',
      iconColor:   LCL_BLUE,
      urgent:      false,
      visible:     true,
      route:       '/rib',
    },
  ];

  const handleDownload = async (doc) => {
    setDownloading(doc.id);
    try {
      if (doc.id === 'acte_blocage') {
        await generateActeBlocage(user);
      } else if (doc.route) {
        navigate(doc.route);
      }
    } catch (e) {
      console.error(e);
    }
    setDownloading(null);
  };

  const handleConsult = (doc) => {
    if (doc.route) navigate(doc.route);
  };

  const visibleDocs = documents.filter(d => d.visible);

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 sticky top-0 z-40"
        style={{ backgroundColor: LCL_BLUE }}>
        <button onClick={() => navigate('/dashboard')}>
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white font-bold text-base tracking-wide uppercase">Gestion de documents</h1>
        <div className="w-6" />
      </div>

      {/* Intro */}
      <div className="mx-4 mt-5 rounded-2xl p-4 text-white"
        style={{ background: `linear-gradient(135deg, ${LCL_BLUE}, #283593)` }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: LCL_YELLOW }}>
            <Shield className="w-5 h-5" style={{ color: LCL_BLUE }} />
          </div>
          <div>
            <p className="font-bold text-sm">{user.name}</p>
            <p className="text-xs opacity-75">N° {user.accountNumber} — Documents officiels LCL</p>
          </div>
        </div>

        {/* Infos financières */}
        {user.isBlocked && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl p-3" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
              <p className="text-[10px] opacity-70">Solde du compte</p>
              <p className="font-black text-base mt-0.5">
                {Number(user.balance).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
              </p>
            </div>
            <div className="rounded-xl p-3" style={{ backgroundColor: 'rgba(220,38,38,0.25)' }}>
              <p className="text-[10px] opacity-70">Frais de déblocage</p>
              <p className="font-black text-base mt-0.5 text-red-300">
                {Number(user.unlockFee).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Alerte compte bloqué */}
      {user.isBlocked && (
        <div className="mx-4 mt-4 rounded-2xl p-4 flex items-start gap-3"
          style={{ backgroundColor: '#fef3c7', border: '1.5px solid #f59e0b' }}>
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#b45309' }} />
          <div>
            <p className="text-xs font-bold" style={{ color: '#92400e' }}>Compte temporairement bloqué</p>
            <p className="text-xs mt-0.5" style={{ color: '#92400e' }}>
              {user.blockReason} — Bloqage effectif depuis le 14 décembre 2017.
            </p>
          </div>
        </div>
      )}

      {/* Liste documents */}
      <div className="mx-4 mt-5 space-y-3">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Documents disponibles</p>

        {visibleDocs.map((doc) => {
          const Icon = doc.icon;
          return (
            <div key={doc.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: doc.couleur }}>
                  <Icon className="w-6 h-6" style={{ color: doc.iconColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-gray-900">{doc.titre}</p>
                    {doc.urgent && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-white"
                        style={{ backgroundColor: '#ef4444' }}>
                        IMPORTANT
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{doc.description}</p>
                  <p className="text-[10px] text-gray-400 mt-1">Émis le {doc.date} • {doc.type}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 flex">
                <button
                  onClick={() => handleDownload(doc)}
                  disabled={downloading === doc.id}
                  className="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold transition active:bg-gray-50"
                  style={{ color: LCL_BLUE }}
                >
                  {downloading === doc.id
                    ? <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: LCL_BLUE }} />
                    : <Download className="w-4 h-4" />}
                  {downloading === doc.id ? 'Génération...' : 'Télécharger'}
                </button>
                {doc.route && (
                  <>
                    <div className="w-px bg-gray-100" />
                    <button
                      onClick={() => handleConsult(doc)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold text-gray-500 transition active:bg-gray-50"
                    >
                      <Eye className="w-4 h-4" />
                      Consulter
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Info légale */}
      <div className="mx-4 mt-5 bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: LCL_BLUE }} />
          <div>
            <p className="text-xs font-bold text-gray-800 mb-1">Documents officiels LCL</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Ces documents sont émis par LCL — Le Crédit Lyonnais et ont valeur officielle.
              Pour toute question, contactez votre conseiller(ère) <span className="font-semibold">{user.manager}</span> ou
              appelez le <span className="font-semibold">01 23 45 67 89</span>.
            </p>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default GestionDocuments;
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Phone, Mail, MessageCircle, Calendar, Clock, X, Send, CheckCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BottomNavigation from './Bottomnavigation';

const LCL_BLUE   = '#1a237e';
const LCL_YELLOW = '#f5c518';

const AUTO_REPLIES = [
  "Bien sûr, je comprends votre demande. Pouvez-vous me donner plus de détails ?",
  "Je vais vérifier cela pour vous immédiatement.",
  "Votre demande a bien été prise en compte. Je vous recontacte sous 24h.",
  "N'hésitez pas à me poser d'autres questions, je suis là pour vous aider.",
  "Je vous conseille de consulter votre espace client pour plus d'informations.",
  "Votre dossier est en cours de traitement. Tout se passe bien de notre côté.",
];

// ── Modal RDV ─────────────────────────────────────────────────────
const RDVModal = ({ onClose }) => {
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm]       = useState({ date: '', heure: '', motif: '' });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const HORAIRES = ['09:00','09:30','10:00','10:30','11:00','11:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30'];
  const MOTIFS   = ['Gestion de compte','Prêt immobilier','Épargne & placements','Assurance','Carte bancaire','Autre'];

  const handleSubmit = async () => {
    if (!form.date || !form.heure || !form.motif) { setError('Veuillez remplir tous les champs.'); return; }
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSuccess(true);
  };

  if (success) return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
      <div className="bg-white w-full max-w-md rounded-t-3xl p-6 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#e8f5e9' }}>
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">Rendez-vous confirmé !</h2>
        <p className="text-sm text-gray-500 mb-1">
          <span className="font-semibold" style={{ color: LCL_BLUE }}>
            {new Date(form.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span> à <span className="font-semibold" style={{ color: LCL_BLUE }}>{form.heure}</span>
        </p>
        <p className="text-sm text-gray-500 mb-6">Motif : {form.motif}</p>
        <button onClick={onClose} className="w-full py-3 rounded-full font-bold text-white" style={{ backgroundColor: LCL_BLUE }}>
          Fermer
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
      <div className="bg-white w-full max-w-md rounded-t-3xl p-6 pb-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold" style={{ color: LCL_BLUE }}>Prendre rendez-vous</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="space-y-4">
          {error && <p className="text-xs text-red-500 bg-red-50 rounded-xl p-3">{error}</p>}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Date</label>
            <input type="date" min={today} value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
              className="w-full border-2 rounded-xl px-4 py-3 text-sm focus:outline-none"
              style={{ borderColor: form.date ? LCL_BLUE : '#E5E7EB' }} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Heure</label>
            <div className="grid grid-cols-4 gap-2">
              {HORAIRES.map(h => (
                <button key={h} onClick={() => setForm({ ...form, heure: h })}
                  className="py-2 rounded-xl text-xs font-semibold border-2 transition"
                  style={{ borderColor: form.heure === h ? LCL_BLUE : '#E5E7EB', backgroundColor: form.heure === h ? '#e8eaf6' : 'white', color: form.heure === h ? LCL_BLUE : '#6B7280' }}>
                  {h}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Motif</label>
            <div className="space-y-2">
              {MOTIFS.map(m => (
                <button key={m} onClick={() => setForm({ ...form, motif: m })}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm border-2 transition"
                  style={{ borderColor: form.motif === m ? LCL_BLUE : '#E5E7EB', backgroundColor: form.motif === m ? '#e8eaf6' : 'white', color: form.motif === m ? LCL_BLUE : '#374151', fontWeight: form.motif === m ? 600 : 400 }}>
                  {m}
                </button>
              ))}
            </div>
          </div>
          <button onClick={handleSubmit} disabled={loading}
            className="w-full py-4 rounded-full font-bold text-white text-sm disabled:opacity-60"
            style={{ backgroundColor: LCL_BLUE }}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Confirmation...
              </span>
            ) : 'Confirmer le rendez-vous'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Page Chat (page entière, remplace ConseillerPage) ─────────────
const ChatPage = ({ onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { id: 1, from: 'conseiller', text: "Bonjour ! Je suis Marie Dubois, votre conseillère LCL. Comment puis-je vous aider ?", time: new Date() }
  ]);
  const [input, setInput]   = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef           = useRef(null);
  const inputRef            = useRef(null);
  const replyIndex          = useRef(0);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), from: 'user', text: input.trim(), time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000));
    setTyping(false);
    const reply = AUTO_REPLIES[replyIndex.current % AUTO_REPLIES.length];
    replyIndex.current++;
    setMessages(prev => [...prev, { id: Date.now() + 1, from: 'conseiller', text: reply, time: new Date() }]);
  };

  const fmt = (d) => d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f3f4f6' }}>

      {/* Header */}
      <div style={{ backgroundColor: LCL_BLUE, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <ChevronLeft style={{ color: 'white', width: 24, height: 24 }} />
        </button>
        <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: LCL_YELLOW, color: LCL_BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 14, flexShrink: 0 }}>M</div>
        <div style={{ flex: 1 }}>
          <p style={{ color: 'white', fontWeight: 'bold', fontSize: 14, margin: 0 }}>Marie Dubois</p>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, margin: 0 }}>Conseillère personnelle • En ligne</p>
        </div>
        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#4ade80' }} />
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ display: 'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 8 }}>
            {msg.from === 'conseiller' && (
              <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: LCL_YELLOW, color: LCL_BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 11, flexShrink: 0 }}>M</div>
            )}
            <div style={{ maxWidth: '75%' }}>
              <div style={{
                padding: '10px 16px',
                borderRadius: 18,
                fontSize: 14,
                ...(msg.from === 'user'
                  ? { backgroundColor: LCL_BLUE, color: 'white', borderBottomRightRadius: 4 }
                  : { backgroundColor: 'white', color: '#1f2937', borderBottomLeftRadius: 4, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' })
              }}>
                {msg.text}
              </div>
              <p style={{ fontSize: 10, color: '#9ca3af', margin: '4px 4px 0', textAlign: msg.from === 'user' ? 'right' : 'left' }}>
                {fmt(msg.time)}
              </p>
            </div>
          </div>
        ))}

        {typing && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: LCL_YELLOW, color: LCL_BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 11, flexShrink: 0 }}>M</div>
            <div style={{ backgroundColor: 'white', padding: '12px 16px', borderRadius: 18, borderBottomLeftRadius: 4, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', display: 'flex', gap: 4 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#9ca3af', animation: 'bounce 1s infinite', animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Champ de saisie — FIXÉ en bas */}
      <div style={{
        backgroundColor: 'white',
        borderTop: '1px solid #e5e7eb',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexShrink: 0,
      }}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Écrivez votre message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          style={{
            flex: 1,
            backgroundColor: '#f3f4f6',
            border: 'none',
            borderRadius: 24,
            padding: '10px 16px',
            fontSize: 14,
            outline: 'none',
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          style={{
            width: 40, height: 40,
            borderRadius: '50%',
            backgroundColor: input.trim() ? LCL_BLUE : '#d1d5db',
            border: 'none',
            cursor: input.trim() ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            transition: 'background-color 0.2s',
          }}
        >
          <Send style={{ color: 'white', width: 16, height: 16 }} />
        </button>
      </div>
    </div>
  );
};

// ── Page principale ───────────────────────────────────────────────
const ConseillerPage = () => {
  const navigate               = useNavigate();
  const { user, logout }       = useAuth();
  const [showRDV, setShowRDV]   = useState(false);
  const [showChat, setShowChat] = useState(false);

  const conseiller = {
    name:    'Marie Dubois',
    role:    'Votre conseillère personnelle',
    agency:  'Agence Paris République',
    phone:   '01 23 45 67 89',
    email:   'marie.dubois@lcl.fr',
    hours:   'Lun–Ven : 9h00 – 18h00',
    nextRdv: 'Aucun rendez-vous prévu',
  };

  const handleLogout = () => {
    if (window.confirm('Voulez-vous vraiment vous déconnecter ?')) {
      logout();
      navigate('/');
    }
  };

  // Si chat ouvert, affiche la page chat (sans BottomNavigation)
  if (showChat) return <ChatPage onClose={() => setShowChat(false)} />;

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24">

      {showRDV && <RDVModal onClose={() => setShowRDV(false)} />}

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 sticky top-0 z-40" style={{ backgroundColor: LCL_BLUE }}>
        <button onClick={() => navigate('/dashboard')}><ChevronLeft className="w-6 h-6 text-white" /></button>
        <h1 className="text-white font-bold text-base tracking-wide uppercase">Mon Conseiller</h1>
        <div className="w-6" />
      </div>

      {/* Avatar */}
      <div className="mx-4 mt-6 rounded-2xl p-5 text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${LCL_BLUE}, #283593)` }}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black" style={{ backgroundColor: LCL_YELLOW, color: LCL_BLUE }}>
            {conseiller.name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-lg">{conseiller.name}</p>
            <p className="text-xs opacity-80">{conseiller.role}</p>
            <p className="text-xs opacity-60 mt-0.5">{conseiller.agency}</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-[11px] opacity-80">En ligne</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3 px-4 mt-5">
        <a href={`tel:${conseiller.phone.replace(/\s/g, '')}`}
          className="flex flex-col items-center gap-2 bg-white rounded-2xl p-4 shadow-sm active:scale-95 transition-transform">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${LCL_BLUE}15` }}>
            <Phone className="w-5 h-5" style={{ color: LCL_BLUE }} />
          </div>
          <span className="text-xs font-semibold text-gray-700">Appeler</span>
          <span className="text-[10px] text-gray-400">{conseiller.phone}</span>
        </a>

        <a href={`mailto:${conseiller.email}`}
          className="flex flex-col items-center gap-2 bg-white rounded-2xl p-4 shadow-sm active:scale-95 transition-transform">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${LCL_BLUE}15` }}>
            <Mail className="w-5 h-5" style={{ color: LCL_BLUE }} />
          </div>
          <span className="text-xs font-semibold text-gray-700">Email</span>
          <span className="text-[10px] text-gray-400 truncate w-full text-center">{conseiller.email}</span>
        </a>

        <button onClick={() => setShowChat(true)}
          className="flex flex-col items-center gap-2 bg-white rounded-2xl p-4 shadow-sm active:scale-95 transition-transform relative">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${LCL_BLUE}15` }}>
            <MessageCircle className="w-5 h-5" style={{ color: LCL_BLUE }} />
          </div>
          <span className="text-xs font-semibold text-gray-700">Message</span>
          <span className="text-[10px] text-gray-400">Messagerie sécurisée</span>
          <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-white" />
        </button>

        <button onClick={() => setShowRDV(true)}
          className="flex flex-col items-center gap-2 bg-white rounded-2xl p-4 shadow-sm active:scale-95 transition-transform">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${LCL_YELLOW}30` }}>
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

      {/* Déconnexion */}
      <div className="mx-4 mt-4 mb-2">
        <button onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-sm text-red-600 bg-red-50 active:scale-95 transition-transform">
          <LogOut className="w-4 h-4" />
          Se déconnecter
        </button>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default ConseillerPage;
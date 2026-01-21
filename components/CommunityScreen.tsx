import React, { useState } from 'react';
import { 
  AlertTriangle, 
  PartyPopper, 
  Users, 
  ChevronRight, 
  ChevronLeft, 
  Info, 
  Camera, 
  CheckCircle2, 
  Clock, 
  CalendarDays, 
  MapPin, 
  MessageCircle, 
  Plus, 
  Trash2, 
  Trophy,
  X,
  Key,
  Share2,
  Ban,
  QrCode,
  Smartphone,
  Globe,
  CreditCard
} from 'lucide-react';
import { Incident, CommunityEvent, Match, GuestKey } from '../types';
import { MOCK_INCIDENTS, MOCK_EVENTS, MOCK_MATCHES, MOCK_USER, MOCK_GUEST_KEYS } from '../constants';
import { Input } from './Input';

export type ViewState = 'MENU' | 'INCIDENTS' | 'EVENTS' | 'MATCHMAKING' | 'GUEST_MANAGEMENT';

interface CommunityScreenProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
}

// --- SUB-COMPONENT: GUEST WEB INTERFACE (SIMULATION) ---
const GuestWebInterface: React.FC<{ guestKey: GuestKey; onClose: () => void }> = ({ guestKey, onClose }) => {
  const [activeTab, setActiveTab] = useState<'ACCESS' | 'BOOKING'>('ACCESS');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Simulated Web View Styles (White Theme)
  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center animate-fade-in p-4">
      {/* Phone Frame */}
      <div className="w-full max-w-[375px] h-[812px] max-h-[90vh] bg-white rounded-[3rem] overflow-hidden shadow-2xl relative flex flex-col">
        
        {/* Phone Notch/Status Bar Simulation */}
        <div className="h-12 bg-white w-full flex justify-center items-end pb-2 shrink-0 z-20">
           <div className="w-32 h-6 bg-gray-100 rounded-full"></div>
        </div>

        {/* Close Simulation Button */}
        <button 
           onClick={onClose}
           className="absolute top-4 right-6 z-50 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold"
        >
          <X className="w-4 h-4" />
        </button>

        {/* --- WEB APP CONTENT --- */}
        <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden font-sans text-slate-900">
           
           {/* Web Header */}
           <div className="px-6 py-6 bg-white border-b border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Bienvenido a</p>
              <h1 className="text-2xl font-serif text-slate-900">Sierra Blanca</h1>
              <p className="text-sm text-emerald-600 font-medium mt-1">
                 Hola, {guestKey.guestName.split(' ')[0]}
              </p>
           </div>

           {/* Content Area */}
           <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'ACCESS' && (
                 <div className="flex flex-col items-center justify-center h-full space-y-8 animate-fade-in">
                    <div className="text-center">
                       <p className="text-gray-500 mb-6">Escanea este código en el lector principal o usa NFC.</p>
                       <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200 border border-gray-100">
                          <QrCode className="w-48 h-48 text-slate-900" />
                       </div>
                       <p className="mt-6 text-xs text-gray-400 font-mono">TOKEN: {guestKey.id.toUpperCase()}-SECURE</p>
                    </div>
                    
                    <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center space-x-2 active:scale-95 transition-transform">
                       <Key className="w-5 h-5" />
                       <span>Abrir Puerta Principal</span>
                    </button>
                 </div>
              )}

              {activeTab === 'BOOKING' && (
                 <div className="animate-fade-in">
                    {!guestKey.permissions.canBookSports ? (
                       <div className="flex flex-col items-center justify-center h-64 text-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                             <Ban className="w-8 h-8 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-bold text-slate-800">Reservas no permitidas</h3>
                          <p className="text-sm text-gray-500 mt-2">El propietario no ha habilitado el permiso de reservas para este pase.</p>
                       </div>
                    ) : (
                       <div className="space-y-6">
                          <h2 className="text-lg font-bold text-slate-800">Reservar Pista</h2>
                          
                          {/* Sport Selector */}
                          <div className="flex space-x-3">
                             <button className="flex-1 bg-slate-900 text-white py-3 rounded-xl text-sm font-bold shadow-md">Padel</button>
                             <button className="flex-1 bg-white text-slate-600 border border-gray-200 py-3 rounded-xl text-sm font-bold">Tenis</button>
                          </div>

                          {/* Simple Grid */}
                          <div>
                             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Hoy</p>
                             <div className="grid grid-cols-3 gap-2">
                                {['10:00', '11:00', '16:00', '17:00', '19:00'].map(time => (
                                   <button 
                                     key={time}
                                     onClick={() => setSelectedTime(time)}
                                     className={`py-3 rounded-lg text-sm font-semibold border transition-colors ${
                                        selectedTime === time 
                                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                                        : 'bg-white border-gray-200 text-slate-700 hover:border-emerald-500'
                                     }`}
                                   >
                                      {time}
                                   </button>
                                ))}
                             </div>
                          </div>

                          {/* Pay Button */}
                          <div className="pt-4 border-t border-gray-100">
                             <button 
                                disabled={!selectedTime}
                                className="w-full bg-black text-white py-4 rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                             >
                                <CreditCard className="w-5 h-5" />
                                <span>Pagar con Apple Pay</span>
                             </button>
                             <p className="text-center text-[10px] text-gray-400 mt-3">Powered by Stripe</p>
                          </div>
                       </div>
                    )}
                 </div>
              )}
           </div>

           {/* Web Tab Bar */}
           <div className="h-20 bg-white border-t border-gray-100 flex items-center justify-around px-6 pb-4">
              <button 
                onClick={() => setActiveTab('ACCESS')}
                className={`flex flex-col items-center space-y-1 ${activeTab === 'ACCESS' ? 'text-slate-900' : 'text-gray-400'}`}
              >
                 <Key className="w-6 h-6" />
                 <span className="text-[10px] font-bold">Acceso</span>
              </button>
              <button 
                onClick={() => setActiveTab('BOOKING')}
                className={`flex flex-col items-center space-y-1 ${activeTab === 'BOOKING' ? 'text-slate-900' : 'text-gray-400'}`}
              >
                 <Trophy className="w-6 h-6" />
                 <span className="text-[10px] font-bold">Reservar</span>
              </button>
           </div>

           {/* Home Indicator */}
           <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-900 rounded-full opacity-20"></div>
        </div>
      </div>
    </div>
  );
};


// --- MAIN COMPONENT ---

export const CommunityScreen: React.FC<CommunityScreenProps> = ({ currentView, onViewChange }) => {
  // --- STATE ---
  
  // Guest Access State (Main Module)
  const [guestKeys, setGuestKeys] = useState<GuestKey[]>(MOCK_GUEST_KEYS);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyForm, setKeyForm] = useState({ 
    name: '', 
    startDate: '', 
    endDate: '',
    permissions: { canOpenDoors: true, canBookSports: false }
  });
  const [generatedKey, setGeneratedKey] = useState<GuestKey | null>(null);
  
  // Simulation State
  const [simulatedKey, setSimulatedKey] = useState<GuestKey | null>(null);

  // Incidents State
  const [incidents, setIncidents] = useState<Incident[]>(MOCK_INCIDENTS);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [incidentForm, setIncidentForm] = useState({ zone: 'Zonas Comunes', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Events State
  const [events, setEvents] = useState<CommunityEvent[]>(MOCK_EVENTS);

  // Matchmaking State
  const [matches, setMatches] = useState<Match[]>(MOCK_MATCHES);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [newMatch, setNewMatch] = useState({ sport: 'Padel', level: 'Intermedio', time: '' });

  // --- HANDLERS: GUEST ACCESS ---

  const handleGenerateKey = () => {
    // Basic validation
    if (!keyForm.name || !keyForm.startDate || !keyForm.endDate) return;

    // Simulate creation
    const newKey: GuestKey = {
      id: `k-${Date.now()}`,
      guestName: keyForm.name,
      startDate: keyForm.startDate,
      endDate: keyForm.endDate,
      status: 'ACTIVE',
      link: `https://accesskey.app/guest/${Math.random().toString(36).substr(2, 5)}`,
      permissions: keyForm.permissions
    };

    setGeneratedKey(newKey);
    setGuestKeys([newKey, ...guestKeys]);
  };

  const handleCloseKeyModal = () => {
    setShowKeyModal(false);
    setGeneratedKey(null); // Reset result
    setKeyForm({ 
      name: '', 
      startDate: '', 
      endDate: '', 
      permissions: { canOpenDoors: true, canBookSports: false } 
    }); // Reset form
  };

  const handleRevokeKey = (id: string) => {
    setGuestKeys(guestKeys.map(k => k.id === id ? { ...k, status: 'REVOKED' } : k));
  };

  const handleShareWhatsApp = (link: string) => {
    const text = `Hola, aquí tienes tu llave digital para acceder a la urbanización: ${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  // --- HANDLERS: OTHERS ---

  const handleOpenIncidents = () => {
    setShowDisclaimer(true);
  };

  const handleAcceptDisclaimer = () => {
    setShowDisclaimer(false);
    onViewChange('INCIDENTS');
  };

  const handleSubmitIncident = () => {
    if (!incidentForm.description) return;
    setIsSubmitting(true);
    setTimeout(() => {
      const newIncident: Incident = {
        id: `inc-${Date.now()}`,
        zone: incidentForm.zone,
        description: incidentForm.description,
        status: 'PENDING',
        date: 'Hoy'
      };
      setIncidents([newIncident, ...incidents]);
      setIncidentForm({ ...incidentForm, description: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleToggleRSVP = (eventId: string) => {
    setEvents(events.map(ev => {
      if (ev.id === eventId) {
        return {
          ...ev,
          isAttending: !ev.isAttending,
          attendees: ev.isAttending ? ev.attendees - 1 : ev.attendees + 1
        };
      }
      return ev;
    }));
  };

  const handleCreateMatch = () => {
    const match: Match = {
        id: `m-${Date.now()}`,
        sport: newMatch.sport,
        level: newMatch.level,
        time: newMatch.time || 'Próximamente',
        hostName: MOCK_USER.name,
        hostAvatar: MOCK_USER.avatarUrl,
        spotsLeft: 3,
        isMine: true
    };
    setMatches([match, ...matches]);
    setShowMatchModal(false);
  };

  const handleDeleteMatch = (id: string) => {
    setMatches(matches.filter(m => m.id !== id));
  };

  // --- RENDERERS ---

  const renderMenu = () => (
    <div className="px-6 py-6 space-y-8 animate-fade-in-up pb-32">
      <div className="space-y-1">
        <h1 className="text-3xl font-light text-white">Gestión & Comunidad</h1>
        <p className="text-slate-400 text-sm">Control de accesos y vida social.</p>
      </div>

      {/* --- HERO: GUEST ACCESS LINK --- */}
      <button 
         onClick={() => onViewChange('GUEST_MANAGEMENT')}
         className="w-full bg-slate-800 rounded-3xl p-6 border border-white/5 shadow-2xl relative overflow-hidden group text-left transition-transform active:scale-[0.98]"
      >
         {/* Decorative BG */}
         <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-colors"></div>
         
         <div className="flex justify-between items-center mb-6 relative z-10">
            <div>
               <h2 className="text-xl font-bold text-white flex items-center">
                  <Key className="w-5 h-5 mr-2 text-emerald-500" /> 
                  Acceso de Invitados
               </h2>
               <p className="text-xs text-slate-400 mt-1">Gestiona llaves temporales para visitas o Airbnb.</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-slate-900 transition-colors">
               <ChevronRight className="w-5 h-5" />
            </div>
         </div>
         
         <div className="flex space-x-2 relative z-10">
            {guestKeys.filter(k => k.status === 'ACTIVE').slice(0,3).map(k => (
               <div key={k.id} className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs font-bold text-emerald-400">
                  {k.guestName.charAt(0)}
               </div>
            ))}
            {guestKeys.filter(k => k.status === 'ACTIVE').length > 3 && (
               <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs text-slate-400">
                  +{guestKeys.filter(k => k.status === 'ACTIVE').length - 3}
               </div>
            )}
         </div>
      </button>

      {/* --- GRID: SERVICES --- */}
      <div>
         <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Servicios Comunitarios</h3>
         <div className="grid grid-cols-2 gap-4">
            
            {/* INCIDENTS */}
            <button 
               onClick={handleOpenIncidents}
               className="bg-slate-800 p-5 rounded-2xl border border-white/5 shadow-lg flex flex-col items-start hover:border-amber-500/30 transition-all active:scale-[0.98] group"
            >
               <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-3 group-hover:bg-amber-500 group-hover:text-slate-900 transition-colors">
                  <AlertTriangle className="w-5 h-5" />
               </div>
               <span className="text-sm font-bold text-white leading-tight text-left">Reportar<br/>Incidencia</span>
            </button>

            {/* EVENTS */}
            <button 
               onClick={() => onViewChange('EVENTS')}
               className="bg-slate-800 p-5 rounded-2xl border border-white/5 shadow-lg flex flex-col items-start hover:border-purple-500/30 transition-all active:scale-[0.98] group"
            >
               <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-3 group-hover:bg-purple-500 group-hover:text-slate-900 transition-colors">
                  <PartyPopper className="w-5 h-5" />
               </div>
               <span className="text-sm font-bold text-white leading-tight text-left">Eventos y<br/>Fiestas</span>
            </button>

            {/* MATCHMAKING */}
            <button 
               onClick={() => onViewChange('MATCHMAKING')}
               className="bg-slate-800 p-5 rounded-2xl border border-white/5 shadow-lg flex flex-col items-start hover:border-blue-500/30 transition-all active:scale-[0.98] group col-span-2 flex-row items-center space-x-4"
            >
               <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0 group-hover:bg-blue-500 group-hover:text-slate-900 transition-colors">
                  <Trophy className="w-5 h-5" />
               </div>
               <div className="text-left">
                  <span className="block text-sm font-bold text-white">Busco Rival</span>
                  <span className="block text-xs text-slate-500">Encuentra compañeros de deporte</span>
               </div>
               <ChevronRight className="w-5 h-5 text-slate-600 ml-auto group-hover:text-white" />
            </button>

         </div>
      </div>
    </div>
  );

  const renderGuestManagement = () => (
    <div className="min-h-full flex flex-col animate-fade-in-up">
       <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center space-x-4">
           <button onClick={() => onViewChange('MENU')} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-slate-700">
              <ChevronLeft className="w-5 h-5" />
           </button>
           <h2 className="text-lg font-medium text-white">Gestión de Invitados</h2>
        </div>
        <button 
          onClick={() => setShowKeyModal(true)}
          className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-slate-900 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"
        >
           <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="p-6 space-y-4 pb-32">
         {guestKeys.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
               <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
               <p>No tienes invitados activos.</p>
            </div>
         ) : (
            guestKeys.map(key => (
               <div key={key.id} className="bg-slate-800 rounded-2xl p-5 border border-white/5 shadow-md">
                  <div className="flex justify-between items-start mb-4">
                     <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                           key.status === 'ACTIVE' 
                           ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                           : 'bg-red-500/10 text-red-500 border border-red-500/20'
                        }`}>
                           {key.guestName.charAt(0)}
                        </div>
                        <div>
                           <h3 className="text-white font-bold text-lg leading-tight">{key.guestName}</h3>
                           <p className="text-xs text-slate-400 mt-0.5">
                              {key.startDate} <span className="text-slate-600">|</span> {key.endDate}
                           </p>
                        </div>
                     </div>
                     <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                        key.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                     }`}>
                        {key.status}
                     </span>
                  </div>

                  {/* PERMISSIONS GRID */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                     <div className={`flex items-center space-x-2 p-2 rounded-lg ${key.permissions.canOpenDoors ? 'bg-slate-700/50 text-slate-200' : 'bg-slate-800/50 text-slate-600'}`}>
                        <Key className="w-4 h-4" />
                        <span className="text-xs font-medium">Acceso Puertas</span>
                        {key.permissions.canOpenDoors ? <CheckCircle2 className="w-3 h-3 text-emerald-500 ml-auto" /> : <Ban className="w-3 h-3 ml-auto" />}
                     </div>
                     <div className={`flex items-center space-x-2 p-2 rounded-lg ${key.permissions.canBookSports ? 'bg-slate-700/50 text-slate-200' : 'bg-slate-800/50 text-slate-600'}`}>
                        <Trophy className="w-4 h-4" />
                        <span className="text-xs font-medium">Reservar Pistas</span>
                        {key.permissions.canBookSports ? <CheckCircle2 className="w-3 h-3 text-emerald-500 ml-auto" /> : <Ban className="w-3 h-3 ml-auto" />}
                     </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex space-x-2 border-t border-white/5 pt-4">
                     {key.status === 'ACTIVE' && (
                        <>
                           <button 
                              onClick={() => setSimulatedKey(key)}
                              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-colors"
                           >
                              <Globe className="w-4 h-4" />
                              <span>Vista Invitado</span>
                           </button>
                           <button 
                              onClick={() => handleShareWhatsApp(key.link)}
                              className="w-10 h-10 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-xl flex items-center justify-center transition-colors"
                           >
                              <Share2 className="w-4 h-4" />
                           </button>
                           <button 
                              onClick={() => handleRevokeKey(key.id)}
                              className="w-10 h-10 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl flex items-center justify-center transition-colors"
                           >
                              <Ban className="w-4 h-4" />
                           </button>
                        </>
                     )}
                  </div>
               </div>
            ))
         )}
      </div>
    </div>
  );

  const renderIncidents = () => (
    <div className="min-h-full flex flex-col animate-fade-in-up">
      {/* Header */}
      <div className="px-6 py-4 flex items-center space-x-4 border-b border-white/5 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <button onClick={() => onViewChange('MENU')} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-slate-700">
           <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-medium text-white">Reportar Incidencia</h2>
      </div>

      <div className="p-6 space-y-8 pb-32">
         {/* Form */}
         <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-2">Nueva Incidencia</h3>
            
            <div className="space-y-2">
              <label className="text-xs text-slate-500 ml-1">Zona Afectada</label>
              <select 
                value={incidentForm.zone}
                onChange={(e) => setIncidentForm({...incidentForm, zone: e.target.value})}
                className="w-full bg-slate-900 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-amber-500/50 transition-colors"
              >
                <option>Zonas Comunes</option>
                <option>Piscina</option>
                <option>Garaje</option>
                <option>Pistas Deportivas</option>
                <option>Jardines</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-500 ml-1">Descripción</label>
              <textarea 
                value={incidentForm.description}
                onChange={(e) => setIncidentForm({...incidentForm, description: e.target.value})}
                placeholder="Describe brevemente el problema..."
                className="w-full bg-slate-900 border border-white/10 text-white rounded-xl px-4 py-3 h-24 resize-none outline-none focus:border-amber-500/50 transition-colors placeholder:text-slate-600"
              />
            </div>

            <button className="w-full py-3 border border-dashed border-slate-600 rounded-xl text-slate-400 hover:text-white hover:border-slate-400 hover:bg-slate-800 transition-all flex items-center justify-center space-x-2">
               <Camera className="w-5 h-5" />
               <span className="text-sm">Adjuntar Foto</span>
            </button>

            <button 
              onClick={handleSubmitIncident}
              disabled={!incidentForm.description || isSubmitting}
              className="w-full bg-amber-500 text-slate-900 font-bold py-4 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
               {isSubmitting ? 'Enviando...' : 'Enviar Reporte'}
            </button>
         </div>

         {/* History */}
         <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Mis Reportes</h3>
            <div className="space-y-3">
               {incidents.map(inc => (
                 <div key={inc.id} className="bg-slate-800 rounded-xl p-4 flex justify-between items-center border border-white/5">
                    <div>
                       <div className="flex items-center space-x-2 mb-1">
                          <span className="text-white font-medium">{inc.zone}</span>
                          <span className="text-[10px] text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-white/5">{inc.date}</span>
                       </div>
                       <p className="text-xs text-slate-400 line-clamp-1">{inc.description}</p>
                    </div>
                    <div>
                       {inc.status === 'RESOLVED' ? (
                          <div className="flex flex-col items-center text-emerald-500">
                             <CheckCircle2 className="w-5 h-5 mb-1" />
                             <span className="text-[9px] font-bold uppercase">Resuelto</span>
                          </div>
                       ) : (
                          <div className="flex flex-col items-center text-amber-500">
                             <Clock className="w-5 h-5 mb-1" />
                             <span className="text-[9px] font-bold uppercase">Pendiente</span>
                          </div>
                       )}
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );

  const renderEvents = () => (
    <div className="min-h-full flex flex-col animate-fade-in-up">
      <div className="px-6 py-4 flex items-center space-x-4 border-b border-white/5 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <button onClick={() => onViewChange('MENU')} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-slate-700">
           <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-medium text-white">Eventos y Actividades</h2>
      </div>

      <div className="p-6 space-y-4 pb-32">
         {events.map(ev => (
           <div key={ev.id} className="bg-slate-800 rounded-2xl overflow-hidden border border-white/5 shadow-lg">
              <div className="flex">
                 {/* Left: Date */}
                 <div className="w-24 bg-slate-900 flex flex-col items-center justify-center p-4 border-r border-white/5">
                    <CalendarDays className="w-6 h-6 text-purple-400 mb-2" />
                    <span className="text-lg font-bold text-white text-center leading-tight">{ev.date.split(' ')[0]}<br/><span className="text-xs font-normal text-slate-400 uppercase">{ev.date.split(' ')[1]}</span></span>
                 </div>
                 {/* Right: Info */}
                 <div className="flex-1 p-5">
                    <h3 className="text-lg font-bold text-white mb-1">{ev.title}</h3>
                    <div className="flex items-center text-xs text-slate-400 mb-3 space-x-3">
                       <span className="flex items-center"><Clock className="w-3 h-3 mr-1"/> {ev.time}</span>
                       <span className="flex items-center"><MapPin className="w-3 h-3 mr-1"/> {ev.location}</span>
                    </div>
                    <p className="text-sm text-slate-300 mb-4 leading-relaxed">{ev.description}</p>
                    
                    <div className="flex items-center justify-between">
                       <div className="flex items-center space-x-1 text-xs text-slate-500">
                          <Users className="w-3 h-3" />
                          <span>{ev.attendees} Asistentes</span>
                       </div>
                       <button 
                         onClick={() => handleToggleRSVP(ev.id)}
                         className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${
                           ev.isAttending 
                           ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                           : 'bg-white text-slate-900 hover:bg-slate-200'
                         }`}
                       >
                         {ev.isAttending ? 'Asistiendo' : 'Asistiré'}
                       </button>
                    </div>
                 </div>
              </div>
           </div>
         ))}
      </div>
    </div>
  );

  const renderMatchmaking = () => (
    <div className="min-h-full flex flex-col animate-fade-in-up">
      <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center space-x-4">
           <button onClick={() => onViewChange('MENU')} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-slate-700">
              <ChevronLeft className="w-5 h-5" />
           </button>
           <h2 className="text-lg font-medium text-white">Busco Rival</h2>
        </div>
        <button className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white border border-white/5">
           <MessageCircle className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 pb-32">
         {/* Action Header */}
         <button 
           onClick={() => setShowMatchModal(true)}
           className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-1 rounded-2xl shadow-lg shadow-blue-500/20 mb-8 active:scale-[0.98] transition-transform"
         >
            <div className="bg-slate-900/20 rounded-xl px-4 py-4 flex items-center justify-between backdrop-blur-sm">
               <div className="flex items-center space-x-3">
                  <div className="bg-white/20 rounded-full p-2">
                     <Plus className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                     <span className="block font-bold text-lg">Crear Anuncio</span>
                     <span className="block text-xs opacity-90">Busca compañeros para jugar</span>
                  </div>
               </div>
               <ChevronRight className="w-5 h-5 text-white/80" />
            </div>
         </button>

         <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Partidos Disponibles</h3>
         
         <div className="space-y-4">
            {matches.map(match => (
               <div key={match.id} className="bg-slate-800 rounded-2xl p-4 border border-white/5 shadow-md flex items-center justify-between group">
                  <div className="flex items-center space-x-4">
                     <img src={match.hostAvatar} alt={match.hostName} className="w-12 h-12 rounded-full object-cover border border-white/10" />
                     <div>
                        <p className="text-xs text-slate-500 mb-0.5">{match.hostName} busca rival</p>
                        <h4 className="text-white font-bold">{match.sport} <span className="font-normal text-slate-400">• {match.level}</span></h4>
                        <div className="flex items-center text-xs text-blue-400 mt-1">
                           <Clock className="w-3 h-3 mr-1" /> {match.time}
                        </div>
                     </div>
                  </div>

                  {match.isMine ? (
                     <button 
                       onClick={() => handleDeleteMatch(match.id)}
                       className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                     >
                        <Trash2 className="w-4 h-4" />
                     </button>
                  ) : (
                     <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-semibold transition-colors">
                        Jugar
                     </button>
                  )}
               </div>
            ))}
         </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 pt-12">
      {currentView === 'MENU' && renderMenu()}
      {currentView === 'GUEST_MANAGEMENT' && renderGuestManagement()}
      {currentView === 'INCIDENTS' && renderIncidents()}
      {currentView === 'EVENTS' && renderEvents()}
      {currentView === 'MATCHMAKING' && renderMatchmaking()}

      {/* --- MODALS --- */}

      {/* 1. GUEST KEY MODAL (MAGIC LINK CREATION) */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md animate-fade-in">
           <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-sm border border-white/10 shadow-2xl relative">
              <button 
                 onClick={handleCloseKeyModal}
                 className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                 <X className="w-5 h-5" />
              </button>

              {!generatedKey ? (
                 <>
                    <div className="flex items-center space-x-3 mb-6">
                       <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">
                          <Key className="w-5 h-5" />
                       </div>
                       <div>
                          <h3 className="text-lg font-bold text-white">Nuevo Pase</h3>
                          <p className="text-slate-400 text-xs">Configura los accesos</p>
                       </div>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                       <Input 
                          placeholder="Nombre (ej: Airbnb)" 
                          value={keyForm.name}
                          onChange={(e) => setKeyForm({...keyForm, name: e.target.value})}
                       />
                       <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                             <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Entrada</label>
                             <input 
                                type="date"
                                className="w-full bg-slate-800 border border-white/10 text-white rounded-xl px-3 py-3 text-sm focus:border-emerald-500/50 outline-none"
                                value={keyForm.startDate}
                                onChange={(e) => setKeyForm({...keyForm, startDate: e.target.value})}
                             />
                          </div>
                          <div className="space-y-1">
                             <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Salida</label>
                             <input 
                                type="date"
                                className="w-full bg-slate-800 border border-white/10 text-white rounded-xl px-3 py-3 text-sm focus:border-emerald-500/50 outline-none"
                                value={keyForm.endDate}
                                onChange={(e) => setKeyForm({...keyForm, endDate: e.target.value})}
                             />
                          </div>
                       </div>

                       {/* PERMISSIONS TOGGLES */}
                       <div className="bg-slate-800 rounded-xl p-4 border border-white/5 space-y-4">
                          <div className="flex justify-between items-center">
                             <div className="flex items-center space-x-2">
                                <Key className="w-4 h-4 text-slate-400" />
                                <span className="text-sm font-medium text-white">Acceso a Recinto</span>
                             </div>
                             {/* Custom Toggle Switch */}
                             <button 
                                onClick={() => setKeyForm({
                                   ...keyForm, 
                                   permissions: { ...keyForm.permissions, canOpenDoors: !keyForm.permissions.canOpenDoors }
                                })}
                                className={`w-10 h-6 rounded-full transition-colors relative ${keyForm.permissions.canOpenDoors ? 'bg-emerald-500' : 'bg-slate-700'}`}
                             >
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${keyForm.permissions.canOpenDoors ? 'left-5' : 'left-1'}`}></div>
                             </button>
                          </div>

                          <div className="flex justify-between items-center">
                             <div className="flex items-center space-x-2">
                                <Trophy className="w-4 h-4 text-slate-400" />
                                <div>
                                   <span className="block text-sm font-medium text-white">Reservar Pistas</span>
                                   <span className="block text-[10px] text-slate-500">Permite pagar reservas</span>
                                </div>
                             </div>
                             <button 
                                onClick={() => setKeyForm({
                                   ...keyForm, 
                                   permissions: { ...keyForm.permissions, canBookSports: !keyForm.permissions.canBookSports }
                                })}
                                className={`w-10 h-6 rounded-full transition-colors relative ${keyForm.permissions.canBookSports ? 'bg-emerald-500' : 'bg-slate-700'}`}
                             >
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${keyForm.permissions.canBookSports ? 'left-5' : 'left-1'}`}></div>
                             </button>
                          </div>
                       </div>
                    </div>

                    <button 
                       onClick={handleGenerateKey}
                       disabled={!keyForm.name || !keyForm.startDate || !keyForm.endDate}
                       className="w-full bg-emerald-500 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                       Generar Llave
                    </button>
                 </>
              ) : (
                 <div className="text-center">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 mx-auto text-emerald-500 border border-emerald-500/20">
                       <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">¡Llave Generada!</h3>
                    <p className="text-slate-400 text-sm mb-6">
                       Comparte este enlace. Solo funcionará en las fechas seleccionadas.
                    </p>

                    <div className="bg-slate-800 p-4 rounded-xl border border-white/5 mb-6 break-all">
                       <p className="text-xs text-emerald-400 font-mono">{generatedKey.link}</p>
                    </div>

                    <button 
                       onClick={() => handleShareWhatsApp(generatedKey.link)}
                       className="w-full bg-[#25D366] text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center justify-center space-x-2 mb-3"
                    >
                       <Share2 className="w-5 h-5" />
                       <span>Enviar por WhatsApp</span>
                    </button>
                 </div>
              )}
           </div>
        </div>
      )}

      {/* 2. GUEST WEB SIMULATOR */}
      {simulatedKey && (
         <GuestWebInterface 
            guestKey={simulatedKey} 
            onClose={() => setSimulatedKey(null)} 
         />
      )}

      {/* 3. DISCLAIMER MODAL */}
      {showDisclaimer && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-sm border border-white/10 shadow-2xl">
               <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 text-blue-500">
                  <Info className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-bold text-white mb-2">Aviso Importante</h3>
               <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  Vas a reportar una incidencia al Administrador. Se adjuntarán automáticamente tus datos de contacto <span className="text-white font-medium">(Penthouse B2)</span> para el seguimiento.
               </p>
               <div className="flex space-x-3">
                  <button onClick={() => setShowDisclaimer(false)} className="flex-1 py-3 text-slate-400 font-medium hover:text-white">Cancelar</button>
                  <button onClick={handleAcceptDisclaimer} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors">Continuar</button>
               </div>
            </div>
         </div>
      )}

      {/* 4. MATCH CREATION MODAL */}
      {showMatchModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-sm border border-white/10 shadow-2xl">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">Crear Partido</h3>
                  <button onClick={() => setShowMatchModal(false)}><X className="w-5 h-5 text-slate-500 hover:text-white" /></button>
               </div>
               
               <div className="space-y-4 mb-8">
                  <div>
                     <label className="text-xs text-slate-500 ml-1 mb-1 block">Deporte</label>
                     <select 
                       value={newMatch.sport}
                       onChange={(e) => setNewMatch({...newMatch, sport: e.target.value})}
                       className="w-full bg-slate-800 border border-white/10 text-white rounded-xl px-4 py-3 outline-none"
                     >
                        <option>Padel</option>
                        <option>Tenis</option>
                        <option>Golf</option>
                     </select>
                  </div>
                  <div>
                     <label className="text-xs text-slate-500 ml-1 mb-1 block">Nivel</label>
                     <select 
                       value={newMatch.level}
                       onChange={(e) => setNewMatch({...newMatch, level: e.target.value})}
                       className="w-full bg-slate-800 border border-white/10 text-white rounded-xl px-4 py-3 outline-none"
                     >
                        <option>Principiante</option>
                        <option>Intermedio</option>
                        <option>Avanzado</option>
                        <option>Pro</option>
                     </select>
                  </div>
                  <div>
                     <label className="text-xs text-slate-500 ml-1 mb-1 block">Horario Preferido</label>
                     <Input 
                        placeholder="Ej: Martes 19:30" 
                        value={newMatch.time} 
                        onChange={(e) => setNewMatch({...newMatch, time: e.target.value})} 
                     />
                  </div>
               </div>

               <button 
                 onClick={handleCreateMatch}
                 className="w-full bg-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all"
               >
                  Publicar Anuncio
               </button>
            </div>
         </div>
      )}
    </div>
  );
};
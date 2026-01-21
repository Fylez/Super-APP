import React, { useState } from 'react';
import { MapPin, QrCode, Calendar, Trash2, X, Plus, Clock, Map } from 'lucide-react';
import { Booking } from '../types';
import { MOCK_USER_BOOKINGS } from '../constants';

interface MyBookingsScreenProps {
  onNavigateToNewBooking: () => void;
}

export const MyBookingsScreen: React.FC<MyBookingsScreenProps> = ({ onNavigateToNewBooking }) => {
  const [bookings, setBookings] = useState<Booking[]>(MOCK_USER_BOOKINGS);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Date Formatting Helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('es-ES', { month: 'short' });
    const weekday = date.toLocaleDateString('es-ES', { weekday: 'long' });
    return { day, month, weekday };
  };

  const handleCancelBooking = () => {
    if (selectedBooking) {
      // Simulate API call
      setBookings(bookings.filter(b => b.id !== selectedBooking.id));
      setSelectedBooking(null);
    }
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6 animate-fade-in-up">
      <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-xl border border-white/5">
        <Calendar className="w-8 h-8 text-slate-500" />
      </div>
      <h3 className="text-xl font-light text-white mb-2">No tienes reservas activas</h3>
      <p className="text-slate-400 text-sm mb-8 max-w-xs">
        Explora las instalaciones y reserva tu próxima sesión deportiva.
      </p>
      <button 
        onClick={onNavigateToNewBooking}
        className="flex items-center space-x-2 bg-amber-500 text-slate-900 px-6 py-3 rounded-xl font-semibold shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all active:scale-95"
      >
        <Plus className="w-5 h-5" />
        <span>Reservar Pista Ahora</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen pb-32 animate-fade-in-up">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10 border-b border-white/5 flex justify-between items-end">
        <div>
           <h1 className="text-3xl font-light text-white">Mis Reservas</h1>
           <p className="text-slate-400 text-sm mt-1">Gestiona tus próximos accesos</p>
        </div>
        {bookings.length > 0 && (
           <button 
             onClick={onNavigateToNewBooking}
             className="bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-slate-900 border border-amber-500/20 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all active:scale-95 flex items-center space-x-1 mb-0.5"
           >
             <Plus className="w-3.5 h-3.5" />
             <span>Nueva</span>
           </button>
        )}
      </div>

      {/* Bookings List */}
      <div className="px-6 mt-4 space-y-4">
        {bookings.length === 0 ? renderEmptyState() : bookings.map((booking) => {
          const { day, month, weekday } = formatDate(booking.date);
          
          return (
            <div 
              key={booking.id} 
              className="bg-slate-800 rounded-2xl p-4 flex items-center shadow-lg border border-white/5 relative overflow-hidden group"
            >
              {/* Left: Date */}
              <div className="flex flex-col items-center justify-center pr-4 border-r border-white/10 min-w-[4.5rem]">
                <span className="text-xs text-amber-500 font-bold uppercase tracking-wider mb-1">{month}</span>
                <span className="text-3xl font-light text-white leading-none mb-1">{day}</span>
                <span className="text-[10px] text-slate-500 capitalize">{weekday}</span>
              </div>

              {/* Center: Info */}
              <div className="flex-1 pl-4">
                 <h3 className="text-lg font-semibold text-white mb-1 flex items-center">
                    {booking.activityName}
                 </h3>
                 <p className="text-sm text-slate-300 font-medium mb-1">{booking.courtName}</p>
                 <div className="flex items-center text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5 mr-1.5" />
                    {booking.time}
                 </div>
              </div>

              {/* Right: Actions */}
              <div className="flex flex-col space-y-2 ml-3">
                 <button 
                   onClick={() => setShowLocationModal(true)}
                   className="w-10 h-10 rounded-full bg-slate-700/50 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors border border-white/5"
                 >
                    <MapPin className="w-4 h-4" />
                 </button>
                 <button 
                   onClick={() => setSelectedBooking(booking)}
                   className="w-10 h-10 rounded-full bg-amber-500/10 hover:bg-amber-500 flex items-center justify-center text-amber-500 hover:text-slate-900 transition-all border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)] hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                 >
                    <QrCode className="w-4 h-4" />
                 </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- LOCATION MODAL (Simple) --- */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
           <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-sm border border-white/10 shadow-2xl relative">
              <button 
                onClick={() => setShowLocationModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-light text-white mb-4">Ubicación</h3>
              <div className="aspect-video bg-slate-800 rounded-xl mb-4 flex items-center justify-center border border-white/5 relative overflow-hidden">
                  {/* Mock Map Background */}
                  <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  <Map className="w-12 h-12 text-slate-600" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <MapPin className="w-8 h-8 text-amber-500 drop-shadow-lg animate-bounce" />
                  </div>
              </div>
              <p className="text-slate-300 text-center text-sm">Sierra Blanca Country Club<br/><span className="text-slate-500 text-xs">Zona Deportiva Norte</span></p>
              <button 
                onClick={() => setShowLocationModal(false)}
                className="w-full mt-6 bg-slate-800 text-white py-3 rounded-xl border border-white/10 hover:bg-slate-700 transition-colors"
              >
                Cerrar
              </button>
           </div>
        </div>
      )}

      {/* --- DIGITAL TICKET MODAL --- */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm relative">
             <button 
               onClick={() => setSelectedBooking(null)}
               className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white border border-white/10"
             >
               <X className="w-5 h-5" />
             </button>

             {/* TICKET CARD */}
             <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-amber-500/30 relative">
                {/* Animated Border Glow */}
                <div className="absolute inset-0 rounded-3xl border-2 border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.15)] animate-pulse pointer-events-none"></div>
                
                {/* Header Image */}
                <div className="h-32 bg-cover bg-center relative" style={{ backgroundImage: `url(${selectedBooking.image})` }}>
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                   <div className="absolute bottom-4 left-6">
                      <h2 className="text-2xl font-bold text-white">{selectedBooking.activityName}</h2>
                      <p className="text-amber-500 font-medium text-sm">{selectedBooking.courtName}</p>
                   </div>
                </div>

                {/* QR Section */}
                <div className="p-8 flex flex-col items-center bg-slate-900">
                   <div className="text-center mb-6">
                      <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Pase Digital</p>
                      <p className="text-white text-lg font-medium">{selectedBooking.date} • {selectedBooking.time}</p>
                   </div>

                   <div className="p-4 bg-white rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.1)] mb-8 relative group">
                      <img src={selectedBooking.qrCode} alt="Access QR" className="w-48 h-48 object-contain mix-blend-multiply opacity-90 group-hover:opacity-100 transition-opacity" />
                      {/* Scan Line Animation */}
                      <div className="absolute top-0 left-0 w-full h-1 bg-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.8)] animate-[scan_2s_linear_infinite]"></div>
                   </div>

                   <button 
                     onClick={handleCancelBooking}
                     className="flex items-center space-x-2 text-red-400 hover:text-red-300 text-sm font-medium border border-red-500/20 hover:border-red-500/40 px-6 py-2 rounded-full transition-all"
                   >
                     <Trash2 className="w-4 h-4" />
                     <span>Cancelar Reserva</span>
                   </button>
                </div>
             </div>
             
             <p className="text-center text-slate-500 text-xs mt-6">
                Muestra este código en el lector de la entrada.
             </p>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};
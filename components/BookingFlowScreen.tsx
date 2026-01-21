import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, Info, Calendar as CalendarIcon, Clock, Check, AlertCircle, ArrowRight, Construction, CheckCircle2, MapPin } from 'lucide-react';
import { Activity } from '../types';
import { MOCK_SLOTS, MOCK_ACTIVITIES } from '../constants';

interface BookingFlowScreenProps {
  onClose: () => void;
  onNavigateToBookings: () => void;
}

export const BookingFlowScreen: React.FC<BookingFlowScreenProps> = ({ onClose, onNavigateToBookings }) => {
  // Added 'SUMMARY' to step state
  const [step, setStep] = useState<'ACTIVITY' | 'SLOTS' | 'SUMMARY'>('ACTIVITY');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  
  // State for Booking Details
  const [selectedDate, setSelectedDate] = useState<number>(0); // 0 = Today
  const [selectedCourt, setSelectedCourt] = useState<number>(1); // Default to Court 1
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  
  // UI State
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Helper to show brief toasts
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Reset court to 1 when activity changes
  useEffect(() => {
    setSelectedCourt(1);
    setSelectedSlots([]);
  }, [selectedActivity, selectedDate]);

  // Helper to calculate End Time
  const getTimeRange = (startTime: string) => {
    const [hour, minute] = startTime.split(':').map(Number);
    const endHour = hour + 1;
    const endStr = `${endHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    return `${startTime} - ${endStr}`;
  };

  // Helper to get Date String
  const getDateString = (offset: number) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  // --- HANDLERS ---

  const handleActivitySelect = (activity: Activity) => {
    if (activity.type === 'GYM') {
      showToast("Accediendo a sistema QR...");
      setTimeout(() => onClose(), 1500);
      return;
    }
    
    setSelectedActivity(activity);
    setStep('SLOTS');
  };

  const handleSlotToggle = (slotId: string, status: string) => {
    if (status !== 'AVAILABLE') return;

    if (selectedSlots.includes(slotId)) {
      setSelectedSlots(selectedSlots.filter(id => id !== slotId));
    } else {
      if (selectedSlots.length >= 2) {
        showToast("Límite diario alcanzado (Máx 2h)");
        return;
      }
      setSelectedSlots([...selectedSlots, slotId]);
    }
  };

  const handleGoToSummary = () => {
    if (selectedSlots.length === 0) return;
    setStep('SUMMARY');
  };

  const handleFinalizeBooking = () => {
    setShowSuccessModal(true);
  };

  const handleBack = () => {
    if (step === 'SUMMARY') {
      setStep('SLOTS');
    } else if (step === 'SLOTS') {
      setStep('ACTIVITY');
    } else {
      onClose();
    }
  };

  const handleKeepBooking = () => {
    setShowSuccessModal(false);
    setSelectedSlots([]);
    setStep('ACTIVITY');
  };

  const handleViewBookings = () => {
    onNavigateToBookings();
  };

  // --- RENDERERS ---

  const renderActivityHub = () => (
    <div className="p-6 space-y-6 animate-fade-in-up pb-24 overflow-y-auto flex-1">
      <div className="space-y-2">
        <h2 className="text-3xl font-light text-white">Nueva Reserva</h2>
        <p className="text-slate-400">Selecciona una instalación</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {MOCK_ACTIVITIES.map((activity: Activity) => (
          <button
            key={activity.id}
            onClick={() => handleActivitySelect(activity)}
            className="relative h-48 w-full rounded-2xl overflow-hidden shadow-lg border border-white/5 text-left transition-transform active:scale-95 duration-300 group"
          >
            {/* LAYER 1: The Image (Absolute Background) */}
            <img 
              src={activity.image} 
              alt={activity.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* LAYER 2: Dark Overlay (Gradient for readability) */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent"></div>
            
            {/* LAYER 3: Content (Relative, on top) */}
            <div className="relative h-full flex flex-col justify-end p-6 z-10">
              <h3 className="text-2xl font-semibold text-white mb-1">{activity.name}</h3>
              <div className="flex justify-between items-center">
                <span className="text-amber-500 font-medium text-sm tracking-wide uppercase">
                  {activity.subtext}
                </span>
                {activity.type === 'GYM' ? (
                   <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                     <ArrowRight className="w-4 h-4 text-white" />
                   </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-slate-900 shadow-[0_0_15px_rgba(245,158,11,0.5)] opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                    <Check className="w-5 h-5" />
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderSlotsView = () => {
    const totalCourts = selectedActivity?.type === 'PADEL' || selectedActivity?.type === 'TENNIS' ? 4 : 1;
    const courts = Array.from({ length: totalCourts }, (_, i) => i + 1);
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + selectedDate);
    const monthName = currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

    return (
      <div className="flex flex-col h-full animate-fade-in-up">
        
        {/* Main Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto min-h-0 pb-4 [&::-webkit-scrollbar]:hidden">
            
            {/* Header Info */}
            <div className="px-6 py-4 space-y-3">
              <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-light text-white">Reservar {selectedActivity?.name}</h2>
              </div>
              <div className="flex items-start space-x-2 bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg">
                <Info className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-200/90 leading-relaxed">
                  <span className="font-bold text-amber-500 uppercase tracking-wider mr-1">Normativa:</span> 
                  Máximo 2 horas de reserva por día y vivienda.
                </p>
              </div>
            </div>

            {/* Date Selector */}
            <div className="pb-4">
              <div className="px-6 flex justify-between items-end mb-3">
                 <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Fecha</h3>
                 <span className="text-xs text-amber-500 font-medium capitalize">{monthName}</span>
              </div>
              <div className="flex space-x-3 overflow-x-auto pb-2 -mx-6 px-6 [&::-webkit-scrollbar]:hidden">
                {[0, 1, 2, 3, 4, 5, 6].map((offset) => {
                  const date = new Date();
                  date.setDate(date.getDate() + offset);
                  const isSelected = selectedDate === offset;
                  const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', '');
                  const dayNum = date.getDate();

                  return (
                    <button
                      key={offset}
                      onClick={() => setSelectedDate(offset)}
                      className={`flex flex-col items-center justify-center min-w-[4rem] h-[5.5rem] rounded-2xl transition-all duration-300 relative overflow-hidden group shrink-0 ${
                        isSelected 
                          ? 'bg-amber-500 text-slate-900 shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-105 z-10' 
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isSelected ? 'opacity-70' : 'opacity-50'}`}>
                        {offset === 0 ? 'Hoy' : dayName}
                      </span>
                      <span className={`text-2xl font-bold ${isSelected ? 'text-slate-900' : 'text-slate-200'}`}>
                        {dayNum}
                      </span>
                      {isSelected && <div className="absolute bottom-1.5 w-1 h-1 bg-slate-900 rounded-full" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Court Selector */}
            {totalCourts > 1 && (
              <div className="px-6 mb-6">
                 <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Pista</h3>
                 <div className="flex space-x-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
                    {courts.map(courtNum => {
                      const isActive = selectedCourt === courtNum;
                      return (
                        <button
                          key={courtNum}
                          onClick={() => setSelectedCourt(courtNum)}
                          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap border shrink-0 ${
                            isActive 
                            ? 'bg-white text-slate-900 border-white shadow-lg' 
                            : 'bg-transparent text-slate-400 border-slate-700 hover:border-slate-500'
                          }`}
                        >
                          Pista {courtNum}
                        </button>
                      )
                    })}
                 </div>
              </div>
            )}

            {/* Time Slots */}
            <div className="px-6">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 flex items-center">
                <Clock className="w-3 h-3 mr-1.5" /> Disponibilidad {totalCourts > 1 && `(Pista ${selectedCourt})`}
              </h3>
              
              <div className="grid grid-cols-2 gap-3 pb-6">
                {MOCK_SLOTS.map((slot) => {
                  const hour = parseInt(slot.startTime.split(':')[0]);
                  const seed = hour + (selectedCourt * 100) + (selectedDate * 1000);
                  const pseudoRandom = Math.sin(seed) * 10000; 
                  const randomValue = pseudoRandom - Math.floor(pseudoRandom); 

                  let effectiveStatus = 'AVAILABLE';
                  let bookedBy = undefined;

                  if (selectedCourt === 1 && selectedDate === 0) {
                     effectiveStatus = slot.status;
                     bookedBy = slot.bookedBy;
                  } else {
                     if (randomValue < 0.05) {
                        effectiveStatus = 'MAINTENANCE';
                     } else {
                        const isPeak = (hour >= 9 && hour <= 11) || (hour >= 17 && hour <= 20);
                        const bookingThreshold = isPeak ? 0.6 : 0.2; 
                        if (randomValue > (1 - bookingThreshold)) {
                           effectiveStatus = 'BOOKED';
                           const names = ["Javier M.", "Sofia L.", "Marc P."];
                           const nameIndex = Math.floor(randomValue * 100) % names.length;
                           bookedBy = names[nameIndex];
                        }
                     }
                  }

                  const isSelected = selectedSlots.includes(slot.id);
                  const isBooked = effectiveStatus === 'BOOKED';
                  const isMaintenance = effectiveStatus === 'MAINTENANCE';
                  const timeRange = getTimeRange(slot.startTime);

                  let slotClasses = "relative py-4 px-3 rounded-xl text-sm font-medium border transition-all duration-200 flex flex-col justify-center min-h-[5rem] ";
                  
                  if (isSelected) {
                    slotClasses += "bg-amber-500 border-amber-500 text-slate-900 shadow-lg scale-[1.02] z-10";
                  } else if (isBooked) {
                    slotClasses += "bg-red-900/30 border-red-900/40 text-red-200 cursor-not-allowed";
                  } else if (isMaintenance) {
                    slotClasses += "bg-slate-800 border-slate-700/50 text-slate-500 cursor-not-allowed opacity-80";
                  } else {
                    slotClasses += "bg-slate-800 border-slate-700 text-white hover:border-slate-500";
                  }

                  return (
                    <button
                      key={slot.id}
                      disabled={isBooked || isMaintenance}
                      onClick={() => handleSlotToggle(slot.id, effectiveStatus)}
                      className={slotClasses}
                    >
                      <span className={`text-sm ${isSelected ? 'font-bold' : 'font-medium'}`}>
                        {timeRange}
                      </span>
                      {isBooked && (
                        <span className="text-[10px] mt-1 text-red-300/80 font-normal border-t border-red-500/20 pt-1 w-full text-center truncate">
                          {bookedBy ? `Reservado: ${bookedBy}` : 'Reservado'}
                        </span>
                      )}
                      {isSelected && (
                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white rounded-full flex items-center justify-center border-2 border-amber-500 shadow-sm">
                          <Check className="w-3 h-3 text-amber-600" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
        </div>

        {/* Floating Bottom Action - Clean, No Bar */}
        <div className="p-6 bg-slate-900 border-t border-white/5 z-20 shrink-0">
          <div className="flex items-center justify-between text-sm text-slate-400 mb-4 px-1">
             <span>{selectedSlots.length} horas seleccionadas</span>
             <span>Total: <span className="text-white font-semibold">Gratuito</span></span>
          </div>
          <button
            onClick={handleGoToSummary}
            disabled={selectedSlots.length === 0}
            className="w-full bg-amber-500 text-slate-900 font-semibold py-4 rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.25)] hover:shadow-[0_0_35px_rgba(245,158,11,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none active:scale-[0.98]"
          >
            Confirmar Reserva
          </button>
        </div>
      </div>
    );
  };

  const renderSummaryView = () => {
    return (
      <div className="flex flex-col h-full animate-fade-in-up p-6">
        <h2 className="text-3xl font-light text-white mb-6">Resumen</h2>
        
        {/* Ticket Card - DARK THEME UPDATE */}
        <div className="bg-slate-800 text-white rounded-3xl overflow-hidden shadow-2xl relative border border-white/5">
            {/* Header Image as img tag for consistency */}
            <div className="h-32 relative">
                <img 
                   src={selectedActivity?.image} 
                   alt={selectedActivity?.name}
                   className="absolute inset-0 w-full h-full object-cover"
                />
            </div>
            
            <div className="p-6 relative">
                <div className="absolute -top-8 right-6 w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center border-4 border-slate-800 shadow-md text-slate-900">
                   {selectedActivity?.type === 'PADEL' || selectedActivity?.type === 'TENNIS' ? (
                       <div className="text-center leading-none">
                           <span className="block text-[10px] font-bold uppercase tracking-wider">Pista</span>
                           <span className="text-2xl font-bold">{selectedCourt}</span>
                       </div>
                   ) : (
                       <CheckCircle2 className="w-8 h-8 text-slate-900" />
                   )}
                </div>

                <h3 className="text-2xl font-bold mb-1 text-white">{selectedActivity?.name}</h3>
                <p className="text-slate-400 font-medium mb-6">{selectedActivity?.subtext}</p>

                <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                        <CalendarIcon className="w-5 h-5 text-amber-500 mt-0.5" />
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Fecha</p>
                            <p className="text-lg font-semibold capitalize text-white">{getDateString(selectedDate)}</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3">
                        <Clock className="w-5 h-5 text-amber-500 mt-0.5" />
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Horario</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {selectedSlots.map(slotId => {
                                    const slot = MOCK_SLOTS.find(s => s.id === slotId);
                                    return (
                                        <span key={slotId} className="bg-slate-700 px-2 py-1 rounded-md text-sm font-bold border border-slate-600 text-slate-200">
                                            {slot ? getTimeRange(slot.startTime) : ''}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                        <MapPin className="w-5 h-5 text-amber-500 mt-0.5" />
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Ubicación</p>
                            <p className="text-base font-medium text-slate-200">Sierra Blanca Country Club</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-700 flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Total a pagar</span>
                    <span className="text-2xl font-bold text-emerald-400">0,00 €</span>
                </div>
            </div>

            {/* Tear Line Decoration (Matching slate-800) */}
            <div className="absolute top-32 left-0 w-full h-4 bg-[radial-gradient(circle,transparent_8px,#1e293b_8px)] bg-[length:24px_24px] -mt-2"></div>
        </div>

        <div className="mt-auto pt-6">
             <button
                onClick={handleFinalizeBooking}
                className="w-full bg-amber-500 text-slate-900 font-bold py-4 rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.25)] hover:shadow-[0_0_35px_rgba(245,158,11,0.4)] transition-all active:scale-[0.98] mb-4"
              >
                Confirmar Reserva
              </button>
              <button
                onClick={() => setStep('SLOTS')}
                className="w-full bg-transparent text-slate-400 font-medium py-3 rounded-xl hover:text-white transition-colors"
              >
                Cancelar
              </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col">
      {/* Top Bar */}
      <div className="px-6 py-4 flex items-center justify-between bg-slate-900/90 backdrop-blur-sm border-b border-white/5 z-30 shrink-0">
        <button 
          onClick={handleBack}
          className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white border border-white/5 active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-xs text-slate-400 tracking-widest uppercase">
            {step === 'SUMMARY' ? 'Confirmación' : (step === 'ACTIVITY' ? 'Paso 1/3' : 'Paso 2/3')}
          </span>
          <span className="text-sm font-medium text-white">
            {step === 'SUMMARY' ? 'Resumen' : (step === 'ACTIVITY' ? 'Actividad' : 'Horario')}
          </span>
        </div>
        <button 
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white border border-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content Area - Fixed Flex for Proper Scroll */}
      <div className="flex-1 min-h-0 relative flex flex-col">
        {step === 'ACTIVITY' && renderActivityHub()}
        {step === 'SLOTS' && renderSlotsView()}
        {step === 'SUMMARY' && renderSummaryView()}
      </div>

      {/* Toast Notification */}
      {toast && (
         <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[60] bg-slate-800/90 backdrop-blur-md border border-amber-500/20 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2 animate-fade-in-down whitespace-nowrap">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium">{toast}</span>
         </div>
      )}

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
           <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl shadow-black/50 transform transition-all scale-100">
              
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                 <CheckCircle2 className="w-10 h-10 text-emerald-500 animate-pulse" strokeWidth={2} />
              </div>
              
              <h3 className="text-2xl font-light text-white mb-2">¡Reserva Confirmada!</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                Pista {selectedCourt} • {MOCK_SLOTS.find(s => s.id === selectedSlots[0])?.startTime}
                <br/>Hemos enviado el código de acceso a tu perfil.
              </p>

              <div className="space-y-3">
                 <button 
                   onClick={handleKeepBooking}
                   className="w-full bg-transparent border border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 font-medium py-3.5 rounded-xl transition-all active:scale-[0.98]"
                 >
                   Seguir Reservando
                 </button>

                 <button 
                   onClick={handleViewBookings}
                   className="w-full bg-amber-500 text-slate-900 font-bold py-3.5 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all active:scale-[0.98]"
                 >
                   Ver Mis Reservas
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
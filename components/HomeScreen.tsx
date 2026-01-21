import React, { useState } from 'react';
import { 
  Sun, 
  Wind, 
  Clock, 
  Car, 
  ChefHat, 
  Trophy, 
  CheckCircle2, 
  X,
  Settings,
  Bell,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, WeatherData, Match, Service, Notice } from '../types';
import { BottomNav } from './BottomNav';
import { MyBookingsScreen } from './MyBookingsScreen';
import { CommunityScreen } from './CommunityScreen';
import { WalletScreen } from './WalletScreen';
import { SettingsScreen } from './SettingsScreen';
import { ViewState } from './CommunityScreen'; // Imported type

interface HomeScreenProps {
  user: User;
  weather: WeatherData;
  notices: Notice[];
  matches: Match[];
  services: Service[];
  onLogout: () => void;
  onFabClick?: () => void;
  activeTab: string; // Controlled prop
  onTabChange: (tab: string) => void; // Controlled prop
  onNavigateToMatchmaking: () => void; // New Prop
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ 
  user, 
  weather, 
  notices, 
  matches, 
  services,
  onLogout,
  onFabClick,
  activeTab,
  onTabChange,
  onNavigateToMatchmaking
}) => {
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFabClickInternal = () => {
    if (onFabClick) onFabClick();
  };

  // Auto-expire logic
  const today = new Date().toISOString().split('T')[0];
  const activeNotices = notices.filter(n => n.fullDate >= today);

  // Styles Helper
  const getNoticeStyles = (type: Notice['type']) => {
    switch (type) {
      case 'EVENT': return { badge: 'border-indigo-400 text-indigo-400 bg-indigo-400/10', title: 'text-white' };
      case 'ALERT': return { badge: 'border-rose-400 text-rose-400 bg-rose-400/10', title: 'text-white' };
      default: return { badge: 'border-slate-400 text-slate-400 bg-slate-400/10', title: 'text-white' };
    }
  };

  // --- SUB-COMPONENTS ---
  
  const TopHeader = () => (
    <header className="px-6 pt-12 pb-6 flex justify-between items-center bg-gradient-to-b from-slate-900 via-slate-900 to-transparent z-10 sticky top-0 backdrop-blur-sm pointer-events-none">
      {/* Left: User Badge (Settings Trigger) */}
      <motion.button 
        onClick={() => setShowSettings(true)}
        whileTap={{ scale: 0.95, opacity: 0.8 }}
        className="pointer-events-auto flex items-center space-x-3 bg-slate-800/60 backdrop-blur-md rounded-full pl-1 pr-4 py-1 border border-white/5 hover:bg-slate-800 transition-colors group"
      >
        <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-600 group-hover:border-amber-500 transition-colors relative">
           <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
        </div>
        <div className="text-left">
           <p className="text-sm font-medium text-white leading-none">{user.name.split(' ')[0]}</p>
           <p className="text-[10px] text-slate-400 font-light">Penthouse B2</p>
        </div>
        <Settings className="w-4 h-4 text-slate-500 group-hover:text-amber-500 transition-colors" />
      </motion.button>

      {/* Right: Weather & Location */}
      <div className="flex items-center space-x-4 pointer-events-auto">
         {/* Location Info */}
         <div className="text-right hidden sm:block">
            <p className="text-white font-medium text-sm">Sierra Blanca Estates</p>
            <p className="text-[10px] text-slate-400 flex items-center justify-end">
              <MapPin className="w-3 h-3 mr-0.5" /> Marbella, ES
            </p>
         </div>

         {/* Weather Widget */}
         <div className="flex flex-col items-end text-right">
            <div className="flex items-center space-x-2 text-amber-500">
              <Sun className="w-5 h-5" />
              <span className="text-xl font-light text-white">{weather.temp}º</span>
            </div>
            <div className="flex items-center space-x-1 text-slate-500 text-xs mt-0.5">
              <Wind className="w-3 h-3" />
              <span>{weather.windSpeed} km/h</span>
            </div>
         </div>
      </div>
    </header>
  );

  const DashboardContent = () => (
    <div className="space-y-8 pb-24">
        {/* 1. COMMUNITY NOTICES */}
        {activeNotices.length > 0 && (
          <section className="animate-fade-in-up">
            <div className="px-6 mb-3 flex justify-between items-end">
               <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Noticias</h2>
               <Bell className="w-4 h-4 text-slate-600" />
            </div>
            
            {/* Horizontal Scroll with Visible Scrollbar Style */}
            <div className="flex space-x-3 overflow-x-auto -mx-6 px-6 pb-4 snap-x snap-mandatory scroll-pl-6">
              {activeNotices.map(notice => {
                const styles = getNoticeStyles(notice.type);
                return (
                  <motion.div 
                    whileTap={{ scale: 0.98 }}
                    key={notice.id} 
                    className="snap-start shrink-0 w-64 bg-slate-800 rounded-2xl p-4 border border-white/5 relative hover:border-white/10 transition-colors"
                  >
                     <div className="flex justify-between items-center mb-3">
                        <span className={`px-2 py-0.5 rounded-md border text-[9px] font-bold tracking-widest uppercase ${styles.badge}`}>
                          {notice.type}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {notice.month} {notice.day}
                        </span>
                     </div>
                     <div className="space-y-2">
                       <h3 className={`text-base font-bold leading-tight ${styles.title}`}>{notice.title}</h3>
                       <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{notice.description}</p>
                     </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* 2. MATCHES */}
        <section className="px-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Partidos</h2>
            <button 
              onClick={onNavigateToMatchmaking}
              className="text-xs text-amber-500 hover:text-amber-400 font-medium uppercase tracking-wide"
            >
              Ver todo
            </button>
          </div>
          <div className="space-y-3">
            {matches.map(match => (
              <motion.div 
                whileTap={{ scale: 0.98 }}
                key={match.id} 
                className="bg-slate-800 rounded-2xl p-4 flex items-center justify-between border border-white/5 shadow-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col items-center space-y-1 min-w-[3.5rem]">
                    <div className="relative">
                      <img src={match.hostAvatar} alt={match.hostName} className="w-12 h-12 rounded-full object-cover border border-white/10" />
                      <div className="absolute -bottom-1 -right-1 bg-slate-700 text-[8px] px-1.5 py-0.5 rounded-full border border-slate-800 text-slate-300">HOST</div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                       <span className="text-white font-medium text-base">{match.sport}</span>
                       <span className="text-slate-500 text-xs bg-slate-900 px-2 py-0.5 rounded text-[10px] uppercase border border-white/5">{match.level}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-400 mt-1.5">
                       <Clock className="w-3.5 h-3.5 mr-1.5 text-amber-500/70" />
                       {match.time}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={onNavigateToMatchmaking}
                  className="bg-slate-700/50 text-slate-300 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border border-white/5 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  Ver Info
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 3. SERVICES */}
        <section className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="px-6 mb-3">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Servicios</h2>
          </div>
          <div className="flex space-x-4 overflow-x-auto pb-6 -mx-6 px-6 snap-x snap-mandatory scroll-pl-6 no-scrollbar">
            {services.map(service => {
              const Icon = service.iconName === 'CAR' ? Car : service.iconName === 'CHEF' ? ChefHat : Trophy;
              return (
                <motion.div 
                  whileTap={{ scale: 0.95 }}
                  key={service.id} 
                  className={`min-w-[150px] h-40 ${service.bgGradient} rounded-2xl p-4 flex flex-col justify-between snap-start shadow-xl relative overflow-hidden group cursor-pointer`}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8 blur-2xl group-hover:bg-white/10 transition-colors"></div>
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm text-white border border-white/10">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-sm leading-tight mb-1">{service.name}</h3>
                    <p className="text-white/70 text-[10px] leading-snug">{service.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
    </div>
  );

  // We lift state for CommunityScreen's view to App.tsx usually, but here we pass props from App.
  // For HomeScreen to render it, we rely on App passing the correct props when activeTab is 'community'.
  // But HomeScreen handles 'home' tab content.
  // We need to access props for Community Screen if we were rendering it directly, but we are switching tabs in App.tsx

  // Wait, App.tsx renders the component based on activeTab. HomeScreen is only rendered when activeTab === 'home'.
  // So we just need to emit the event to change tab.

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans pb-28 relative overflow-x-hidden">
      
      {/* GLOBAL TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-24 left-1/2 z-[60] w-[90%] max-w-sm"
          >
             <div className={`backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl p-4 flex items-center space-x-3 ${toast.type === 'success' ? 'bg-emerald-500/90' : 'bg-red-500/90'} text-white`}>
                <div className="bg-white/20 rounded-full p-1">
                  {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5"/> : <X className="w-5 h-5"/>}
                </div>
                <span className="font-medium text-base">{toast.message}</span>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OVERLAYS */}
      <AnimatePresence>
        {showSettings && (
           <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50"
           >
             <SettingsScreen onClose={() => setShowSettings(false)} onLogout={onLogout} />
           </motion.div>
        )}
      </AnimatePresence>

      {/* FIXED HEADER (Always Visible on Home, Optional on others) */}
      {activeTab === 'home' && <TopHeader />}

      {/* MAIN CONTENT AREA WITH TRANSITIONS */}
      <div className="relative">
         <AnimatePresence mode='wait'>
            {activeTab === 'home' && (
              <motion.div 
                key="home"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <DashboardContent />
              </motion.div>
            )}

            {/* Note: Other tabs are rendered by App.tsx, but we keep this structure if we want HomeScreen to manage all tabs. 
                However, looking at App.tsx structure, it renders HomeScreen only when authenticated.
                BUT, inside HomeScreen, it was rendering other components based on activeTab.
                We need to make sure we pass the props correctly down.
            */}
         </AnimatePresence>
      </div>

      {/* BottomNav is rendered by parent (App.tsx) or here? 
          In the previous file, BottomNav was INSIDE HomeScreen. 
          If HomeScreen is responsible for rendering all tabs, then CommunityScreen needs the props passed through HomeScreen.
          
          Let's look at the App.tsx logic. 
          App.tsx renders:
          <HomeScreen ... activeTab={activeTab} onTabChange={setActiveTab} />
          
          So HomeScreen IS responsible for rendering the tab content.
      */}

    </div>
  );
};
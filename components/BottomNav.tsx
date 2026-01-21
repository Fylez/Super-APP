import React from 'react';
import { Home, Calendar, Users, Wallet, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onFabClick: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, onFabClick }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Inicio' },
    { id: 'bookings', icon: Calendar, label: 'Reservas' },
    { id: 'fab', icon: null, label: '' }, // Spacer for FAB central column
    { id: 'community', icon: Users, label: 'Club' },
    { id: 'wallet', icon: Wallet, label: 'Wallet' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      
      {/* 
        CONTAINER: Fixed Height (h-20), Visible Overflow for the FAB 
        pointer-events-auto ensures clicks work on the bar
      */}
      <div className="relative h-20 bg-slate-900/95 backdrop-blur-xl border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.4)] pointer-events-auto overflow-visible pb-safe">
        
        {/* --- FLOATING FAB (ABSOLUTE) --- */}
        {/* Positioned relative to the bar container: Moves UP 24px (-top-6) */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
          <motion.button 
            onClick={onFabClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 shadow-lg shadow-amber-500/40 flex items-center justify-center text-slate-900 ring-4 ring-slate-900"
          >
            <Plus className="w-7 h-7" strokeWidth={2.5} />
          </motion.button>
        </div>

        {/* --- ICONS GRID --- */}
        <div className="grid grid-cols-5 h-full items-center max-w-md mx-auto relative z-10">
          {navItems.map((item) => {
            // Spacer Column (Middle)
            if (item.id === 'fab') {
              return <div key="fab" className="pointer-events-none" />; 
            }

            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className="flex flex-col items-center justify-center h-full pt-2 pb-1 active:scale-95 transition-transform duration-200"
              >
                <div className={`relative transition-colors duration-300 ${isActive ? 'text-amber-500' : 'text-slate-400 group-hover:text-slate-200'}`}>
                   {/* Icon */}
                   {Icon && <Icon className={`w-6 h-6 mb-1 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />}
                   
                   {/* Subtle Indicator Dot for Active State */}
                   {isActive && (
                      <motion.div 
                        layoutId="nav-dot"
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                   )}
                </div>
                
                <span className={`text-[10px] font-medium tracking-wide mt-1 transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-500'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
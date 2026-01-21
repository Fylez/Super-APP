import React from 'react';
import { CreditCard, Wallet, Plus, ArrowUpRight, Smartphone } from 'lucide-react';
import { MOCK_TRANSACTIONS } from '../constants';

export const WalletScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 pb-32 animate-fade-in-up">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-3xl font-light text-white">Wallet</h1>
        <p className="text-slate-400 text-sm mt-1">Gestión de saldo y pagos</p>
      </div>

      <div className="px-6 space-y-8">
        
        {/* Virtual Card */}
        <div className="relative w-full aspect-[1.586] rounded-2xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl group">
           {/* Background Gradient & Effects */}
           <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950"></div>
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.15),transparent_40%)]"></div>
           <div className="absolute inset-0 border border-amber-500/30 rounded-2xl"></div>
           
           {/* Decorative sheen */}
           <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 group-hover:animate-[shimmer_2s_infinite]"></div>

           {/* Card Top */}
           <div className="relative z-10 flex justify-between items-start">
              <div className="text-amber-500/80">
                 <Wallet className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <span className="text-xs font-bold text-slate-500 tracking-widest uppercase">Prepago</span>
           </div>

           {/* Card Center (Balance) */}
           <div className="relative z-10 text-center">
              <span className="block text-xs text-slate-400 font-medium mb-1">SALDO DISPONIBLE</span>
              <span className="text-4xl font-light text-white tracking-tight">20,00€</span>
           </div>

           {/* Card Bottom */}
           <div className="relative z-10 flex justify-between items-end">
              <div>
                 <p className="text-[10px] text-slate-500 uppercase tracking-wide">Vinculado a</p>
                 <div className="flex items-center space-x-2">
                    <div className="flex space-x-0.5">
                       <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                       <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                       <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                       <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                    </div>
                    <span className="text-sm font-medium text-slate-300">8842</span>
                 </div>
              </div>
              {/* Fake Mastercard/Visa Logo */}
              <div className="flex -space-x-2 opacity-80">
                 <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm"></div>
                 <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm"></div>
              </div>
           </div>
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-2 gap-4">
           <button className="bg-slate-800 hover:bg-slate-700 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center space-y-2 transition-all active:scale-95 group">
              <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white border border-white/10 group-hover:border-white/20">
                 <Smartphone className="w-5 h-5" />
              </div>
              <div className="text-center">
                 <span className="block text-sm font-semibold text-white">Recarga Rápida</span>
                 <span className="block text-xs text-slate-500">10,00€ (Apple Pay)</span>
              </div>
           </button>

           <button className="bg-slate-800 hover:bg-slate-700 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center space-y-2 transition-all active:scale-95 group">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-slate-900 transition-colors">
                 <Plus className="w-6 h-6" />
              </div>
              <div className="text-center">
                 <span className="block text-sm font-semibold text-white">Añadir Fondos</span>
                 <span className="block text-xs text-slate-500">Manual</span>
              </div>
           </button>
        </div>

        {/* Transactions History */}
        <div>
           <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Actividad Reciente</h3>
           <div className="space-y-0">
              {MOCK_TRANSACTIONS.map((tx, index) => (
                 <div 
                   key={tx.id} 
                   className={`flex items-center justify-between p-4 bg-slate-800/50 border-white/5 hover:bg-slate-800 transition-colors ${
                     index === 0 ? 'rounded-t-2xl' : ''
                   } ${
                     index === MOCK_TRANSACTIONS.length - 1 ? 'rounded-b-2xl' : 'border-b'
                   }`}
                 >
                    <div className="flex items-center space-x-3">
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          tx.type === 'TOPUP' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-700 text-slate-400'
                       }`}>
                          {tx.type === 'TOPUP' ? <ArrowUpRight className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                       </div>
                       <div>
                          <p className="text-sm font-medium text-white">{tx.title}</p>
                          <p className="text-xs text-slate-500">{tx.date}</p>
                       </div>
                    </div>
                    <span className={`text-sm font-semibold ${
                       tx.amount > 0 ? 'text-emerald-400' : 'text-white'
                    }`}>
                       {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}€
                    </span>
                 </div>
              ))}
           </div>
        </div>

      </div>
      
      <style>{`
        @keyframes shimmer {
          100% {
            left: 200%;
          }
        }
      `}</style>
    </div>
  );
};
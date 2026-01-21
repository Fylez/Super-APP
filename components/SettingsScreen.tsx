import React, { useState } from 'react';
import { 
  User, 
  Globe, 
  Bell, 
  Shield, 
  KeyRound, 
  LifeBuoy, 
  FileText, 
  LogOut, 
  ChevronLeft
} from 'lucide-react';

interface SettingsScreenProps {
  onClose: () => void;
  onLogout: () => void;
}

// Reusable Toggle Switch Component
const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
  <button 
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
      checked ? 'bg-amber-500' : 'bg-slate-600'
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

// Reusable Row Component
const SettingRow = ({ 
  icon: Icon, 
  label, 
  action, 
  isLast = false,
  onClick 
}: { 
  icon: React.ElementType; 
  label: string; 
  action?: React.ReactNode; 
  isLast?: boolean;
  onClick?: () => void;
}) => (
  <div 
    onClick={onClick}
    className={`flex items-center justify-between p-4 bg-slate-800 border-white/5 hover:bg-slate-700/50 transition-colors cursor-pointer ${
      !isLast ? 'border-b' : ''
    }`}
  >
    <div className="flex items-center space-x-3">
      <div className="p-1.5 bg-slate-700/50 rounded-lg text-slate-300">
         <Icon className="w-5 h-5" />
      </div>
      <span className="text-sm font-medium text-white">{label}</span>
    </div>
    <div className="flex items-center text-slate-500">
      {action || <ChevronLeft className="w-4 h-4 rotate-180" />} 
      {/* Using ChevronLeft rotated to simulate ChevronRight to avoid unused import or import ChevronRight if available. Original code used ChevronRight. Let's fix import to include ChevronRight for clarity or just use ChevronRight if imported. */}
    </div>
  </div>
);

// Section Component - Defined outside with optional children to satisfy Typescript
const Section = ({ title, children }: { title: string; children?: React.ReactNode }) => (
  <div className="mb-6">
    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 px-4">{title}</h3>
    <div className="rounded-xl overflow-hidden border border-white/5">
      {children}
    </div>
  </div>
);

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onClose, onLogout }) => {
  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(true);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 animate-fade-in-up overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-900/90 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-white/5">
        <button 
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-slate-700 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-medium text-white">Ajustes</h2>
        <div className="w-8" /> {/* Spacer */}
      </div>

      <div className="p-6 pb-20">
        
        {/* Account Group */}
        <Section title="Cuenta">
           <SettingRow icon={User} label="Editar Perfil" />
           <SettingRow 
             icon={Globe} 
             label="Idioma" 
             action={<span className="text-xs font-bold text-slate-400 mr-2">ESPAÑOL</span>}
             isLast 
           />
        </Section>

        {/* Security Group */}
        <Section title="App & Seguridad">
           <SettingRow 
             icon={Bell} 
             label="Notificaciones" 
             action={<Toggle checked={notifications} onChange={setNotifications} />}
           />
           <SettingRow 
             icon={Shield} 
             label="Face ID / Biometría" 
             action={<Toggle checked={biometrics} onChange={setBiometrics} />}
           />
           <SettingRow icon={KeyRound} label="Cambiar Contraseña" isLast />
        </Section>

        {/* Support Group */}
        <Section title="Soporte">
           <SettingRow icon={LifeBuoy} label="Ayuda / Concierge" />
           <SettingRow icon={FileText} label="Términos y Privacidad" isLast />
        </Section>

        {/* Danger Zone */}
        <div className="mt-12 space-y-4">
           <button 
             onClick={onLogout}
             className="w-full bg-slate-800 text-white font-medium py-4 rounded-xl border border-white/5 hover:border-red-500/50 hover:text-red-400 transition-all flex items-center justify-center space-x-2"
           >
              <LogOut className="w-5 h-5" />
              <span>Cerrar Sesión</span>
           </button>
           
           <button className="w-full text-center text-xs text-slate-500 hover:text-red-500 transition-colors">
              Eliminar mi cuenta
           </button>
        </div>
        
        <div className="mt-8 text-center text-xs text-slate-600">
           <p>AccessKey v1.0.2 (Build 2024)</p>
        </div>

      </div>
    </div>
  );
};
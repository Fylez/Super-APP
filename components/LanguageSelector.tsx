import React from 'react';
import { Language } from '../types';

interface Props {
  current: Language;
  onChange: (lang: Language) => void;
}

export const LanguageSelector: React.FC<Props> = ({ current, onChange }) => {
  return (
    <div className="flex items-center space-x-1 bg-black/20 backdrop-blur-md rounded-full p-1 border border-white/10">
      <button
        onClick={() => onChange('ES')}
        className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
          current === 'ES' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        ES
      </button>
      <div className="w-px h-3 bg-white/10"></div>
      <button
        onClick={() => onChange('EN')}
        className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
          current === 'EN' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        EN
      </button>
    </div>
  );
};

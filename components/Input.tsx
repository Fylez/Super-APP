import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  icon, 
  rightIcon, 
  onRightIconClick, 
  className = '', 
  ...props 
}) => {
  return (
    <div className="w-full space-y-2 group">
      {label && (
        <label className="block text-xs font-medium text-slate-400 uppercase tracking-widest ml-1 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input 
          className={`w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 
            rounded-xl py-4 focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500/50 
            transition-all duration-300 backdrop-blur-sm hover:bg-white/10
            ${icon ? 'pl-11' : 'pl-4'} 
            ${rightIcon ? 'pr-11' : 'pr-4'} 
            ${className}`}
          {...props}
        />
        
        {/* Left Icon */}
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors pointer-events-none">
            {icon}
          </div>
        )}

        {/* Right Icon (Interactive) */}
        {rightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-500 transition-colors cursor-pointer focus:outline-none"
          >
            {rightIcon}
          </button>
        )}
      </div>
    </div>
  );
};
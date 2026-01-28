import React, { useState } from 'react';
import {
  ChevronLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
} from 'lucide-react';
import { Language, Community } from '../types';
import { Button } from './Button';
import { Input } from './Input';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

interface AuthScreenProps {
  community: Community;
  lang: Language;
  onBack: () => void;
  onSuccess: () => void;
}

type AuthMode = 'LOGIN' | 'SIGNUP';

export const AuthScreen: React.FC<AuthScreenProps> = ({
  community,
  lang,
  onBack,
  onSuccess,
}) => {
  const { signUp, signIn } = useAuth();
  const [mode, setMode] = useState<AuthMode>('LOGIN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const content = {
    ES: {
      back: 'Volver',
      verified: 'Comunidad Verificada',
      login: 'Iniciar Sesión',
      signup: 'Crear Cuenta',
      noAccount: '¿No tienes cuenta?',
      haveAccount: '¿Ya tienes cuenta?',
      createAccount: 'Crear Cuenta',
      signIn: 'Iniciar Sesión',
      fullName: 'Nombre Completo',
      email: 'Correo Electrónico',
      password: 'Contraseña',
      emailPlaceholder: 'correo@ejemplo.com',
      passPlaceholder: '••••••••',
      namePlaceholder: 'Juan Pérez',
      forgotPass: '¿Olvidaste contraseña?',
      rememberMe: 'Recordar credenciales',
    },
    EN: {
      back: 'Back',
      verified: 'Verified Community',
      login: 'Sign In',
      signup: 'Create Account',
      noAccount: 'No account?',
      haveAccount: 'Already have an account?',
      createAccount: 'Create Account',
      signIn: 'Sign In',
      fullName: 'Full Name',
      email: 'Email',
      password: 'Password',
      emailPlaceholder: 'email@example.com',
      passPlaceholder: '••••••••',
      namePlaceholder: 'John Doe',
      forgotPass: 'Forgot password?',
      rememberMe: 'Remember me',
    },
  };

  const t = content[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (mode === 'SIGNUP') {
      if (!fullName.trim()) {
        setError(lang === 'ES' ? 'Por favor ingresa tu nombre' : 'Please enter your name');
        setLoading(false);
        return;
      }

      const result = await signUp(
        { email, password, fullName },
        community
      );

      if (result.success) {
        setLoading(false);
        onSuccess();
      } else {
        setError(result.error);
        setLoading(false);
      }
    } else {
      const result = await signIn({ email, password });

      if (result.success) {
        setLoading(false);
        onSuccess();
      } else {
        setError(result.error);
        setLoading(false);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <button
        onClick={onBack}
        className="flex items-center text-slate-400 hover:text-white transition-colors text-sm group mb-4"
      >
        <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
        {t.back}
      </button>

      <div className="glass-panel p-8 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-8 relative z-10">
          <div className="relative mx-auto w-24 h-24 mb-4 group cursor-default">
            <div className="absolute inset-0 rounded-full border border-white/10 scale-100 group-hover:scale-110 transition-transform duration-700 ease-out" />
            <div className="absolute inset-2 rounded-full border border-amber-500/20 scale-100 group-hover:scale-105 transition-transform duration-500" />

            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-slate-800 to-slate-950 shadow-inner flex items-center justify-center border border-white/5">
              <span className="font-serif text-4xl text-transparent bg-clip-text bg-gradient-to-b from-amber-300 to-amber-600 select-none">
                {community.name.charAt(0)}
              </span>
            </div>

            <div className="absolute bottom-0 right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-900">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>

          <h2 className="text-2xl font-light text-white mb-1">{community.name}</h2>
          <div className="flex items-center justify-center space-x-2 text-slate-400 text-xs tracking-[0.2em] uppercase opacity-60">
            <span>{t.verified}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'SIGNUP' && (
            <Input
              label={t.fullName}
              type="text"
              placeholder={t.namePlaceholder}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              icon={<User className="w-5 h-5" />}
            />
          )}

          <Input
            label={t.email}
            type="email"
            placeholder={t.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-5 h-5" />}
          />

          <div className="space-y-3">
            <Input
              label={t.password}
              type={showPassword ? 'text' : 'password'}
              placeholder={t.passPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-5 h-5" />}
              rightIcon={showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              onRightIconClick={() => setShowPassword(!showPassword)}
            />

            {mode === 'LOGIN' && (
              <div className="flex justify-end text-xs px-1">
                <a href="#" className="text-amber-500/80 hover:text-amber-400 transition-colors">
                  {t.forgotPass}
                </a>
              </div>
            )}
          </div>

          {error && (
            <p className="text-red-400 text-sm flex items-center animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 mr-2" />
              {error}
            </p>
          )}

          <Button type="submit" isLoading={loading} className="mt-2 shadow-lg shadow-amber-900/20">
            {mode === 'LOGIN' ? t.login : t.signup}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-slate-400 text-sm">
            {mode === 'LOGIN' ? t.noAccount : t.haveAccount}{' '}
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'LOGIN' ? 'SIGNUP' : 'LOGIN');
                setError(null);
                setPassword('');
                setFullName('');
              }}
              className="text-white font-medium hover:text-amber-500 transition-colors underline decoration-slate-600 underline-offset-4 hover:decoration-amber-500"
            >
              {mode === 'LOGIN' ? t.createAccount : t.signIn}
            </button>
          </p>
        </div>
      </div>

      <style>{`
        .font-serif {
          font-family: 'Times New Roman', Times, serif;
        }
      `}</style>
    </motion.div>
  );
};

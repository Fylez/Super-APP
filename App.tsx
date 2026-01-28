import React, { useState, useEffect } from 'react';
import {
  Key,
  Building2,
  ArrowRight,
  Lock,
  Mail,
  ChevronLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Square,
  CheckSquare,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { Language, AuthStep, Community } from './types';
import {
  MOCK_COMMUNITIES,
  DEFAULT_BG,
  MOCK_WEATHER,
  MOCK_NOTICES,
  MOCK_MATCHES,
  MOCK_SERVICES
} from './constants';
import { Button } from './components/Button';
import { Input } from './components/Input';
import { LanguageSelector } from './components/LanguageSelector';
import { HomeScreen } from './components/HomeScreen';
import { BookingFlowScreen } from './components/BookingFlowScreen';
import { MyBookingsScreen } from './components/MyBookingsScreen';
import { CommunityScreen, ViewState as CommunityViewState } from './components/CommunityScreen';
import { WalletScreen } from './components/WalletScreen';
import { BottomNav } from './components/BottomNav';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './src/hooks/useAuth';
import { authService } from './src/services/auth.service';
import { supabase, initError } from './src/lib/supabase';

console.log('[App] Mounting...');

const App: React.FC = () => {
  const { user, profile, loading: authLoading } = useAuth();

  const [lang, setLang] = useState<Language>('ES');
  const [step, setStep] = useState<AuthStep>('COMMUNITY_CODE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [code, setCode] = useState('');
  const [community, setCommunity] = useState<Community | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [bgImage, setBgImage] = useState(DEFAULT_BG);

  const [activeTab, setActiveTab] = useState('home');
  const [showBookingFlow, setShowBookingFlow] = useState(false);

  const [communityView, setCommunityView] = useState<CommunityViewState>('MENU');

  useEffect(() => {
    if (user && profile && profile.communities) {
      setCommunity({
        id: profile.communities.id,
        name: profile.communities.name,
        code: profile.communities.code,
        backgroundImage: profile.communities.background_image,
      });
      setBgImage(profile.communities.background_image || DEFAULT_BG);
      setStep('APP');
    }
  }, [user, profile]);

  const handleVerifyCommunity = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const foundCommunity = await authService.verifyCommunityCode(code);
      if (foundCommunity) {
        setCommunity({
          id: foundCommunity.id,
          name: foundCommunity.name,
          code: foundCommunity.code,
          backgroundImage: foundCommunity.background_image,
        });
        setBgImage(foundCommunity.background_image || DEFAULT_BG);
        setStep('LOGIN');
      } else {
        setError(lang === 'ES' ? 'Código de comunidad inválido' : 'Invalid community code');
      }
    } catch (err: any) {
      setError(lang === 'ES' ? 'Error al verificar código' : 'Error verifying code');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await authService.signIn(email, password);
    } catch (err: any) {
      setError(lang === 'ES' ? 'Credenciales inválidas' : 'Invalid credentials');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep('COMMUNITY_CODE');
    setCommunity(null);
    setCode('');
    setBgImage(DEFAULT_BG);
    setError(null);
    setPassword('');
    setEmail('');
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setStep('COMMUNITY_CODE');
      setPassword('');
      setEmail('');
      setActiveTab('home');
      setCommunityView('MENU');
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  const handleOpenBooking = () => {
    setShowBookingFlow(true);
  };

  const handleCloseBooking = () => {
    setShowBookingFlow(false);
  };

  const handleNavigateToBookings = () => {
    setShowBookingFlow(false);
    setActiveTab('bookings');
  };

  const handleNavigateToMatchmaking = () => {
    setActiveTab('community');
    setCommunityView('MATCHMAKING');
  };

  const content = {
    ES: {
      tagline: 'Experience Living',
      enterCode: 'Introduce tu Código de Comunidad',
      access: 'Acceder',
      welcomeBack: 'Bienvenido de nuevo',
      emailPlaceholder: 'correo@ejemplo.com',
      passPlaceholder: '••••••••',
      forgotPass: '¿Olvidaste contraseña?',
      login: 'Iniciar Sesión',
      noAccount: '¿No tienes cuenta?',
      createAccount: 'Crear Cuenta',
      requestAccess: 'Solicitar Acceso',
      noCode: '¿No tienes código?',
      back: 'Volver',
      rememberMe: 'Recordar credenciales',
      verified: 'Comunidad Verificada'
    },
    EN: {
      tagline: 'Experience Living',
      enterCode: 'Enter your Community Code',
      access: 'Access',
      welcomeBack: 'Welcome Back',
      emailPlaceholder: 'email@example.com',
      passPlaceholder: '••••••••',
      forgotPass: 'Forgot password?',
      login: 'Sign In',
      noAccount: 'No account?',
      createAccount: 'Create Account',
      requestAccess: 'Request Access',
      noCode: 'No code?',
      back: 'Back',
      rememberMe: 'Remember me',
      verified: 'Verified Community'
    }
  };

  const t = content[lang];

  if (initError) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-slate-800 rounded-2xl p-8 border border-red-500/30 shadow-xl"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-red-500/20 rounded-xl mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white text-center mb-2">Offline Mode</h2>
          <p className="text-sm text-slate-300 text-center mb-4">
            {initError}
          </p>
          <div className="bg-slate-900/50 rounded-lg p-3 mb-4">
            <p className="text-xs font-mono text-slate-400">
              Check your .env file for:<br />
              - VITE_SUPABASE_URL<br />
              - VITE_SUPABASE_ANON_KEY
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded-lg transition-colors"
          >
            Retry Connection
          </button>
        </motion.div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (step === 'APP' && community && profile) {
    const userForDisplay = {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      handle: profile.handle || '@user',
      avatarUrl: profile.avatar_url,
    };

    return (
      <>
        <div className="min-h-screen bg-slate-900 text-slate-50 font-sans pb-28 relative overflow-x-hidden">
          <AnimatePresence mode='wait'>
            {activeTab === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <HomeScreen
                  user={userForDisplay}
                  weather={MOCK_WEATHER}
                  notices={MOCK_NOTICES}
                  matches={MOCK_MATCHES}
                  services={MOCK_SERVICES}
                  onLogout={handleLogout}
                  onFabClick={handleOpenBooking}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  onNavigateToMatchmaking={handleNavigateToMatchmaking}
                />
              </motion.div>
            )}

            {activeTab === 'bookings' && (
              <motion.div
                key="bookings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <MyBookingsScreen onNavigateToNewBooking={handleOpenBooking} />
              </motion.div>
            )}

            {activeTab === 'community' && (
              <motion.div
                key="community"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <CommunityScreen currentView={communityView} onViewChange={setCommunityView} />
              </motion.div>
            )}

            {activeTab === 'wallet' && (
              <motion.div
                key="wallet"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <WalletScreen onLogout={handleLogout} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

        <AnimatePresence>
          {showBookingFlow && (
            <BookingFlowScreen
              onClose={handleCloseBooking}
              onNavigateToBookings={handleNavigateToBookings}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <div
      className="min-h-screen text-white font-sans overflow-hidden flex items-center justify-center"
      style={{
        backgroundImage: `url('${bgImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0"></div>
      <div className="relative z-10 w-full max-w-md px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {step === 'COMMUNITY_CODE' && (
            <div className="animate-fade-in-up">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center shadow-xl">
                    <Key className="w-6 h-6 text-slate-900" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">AccessKey</h1>
                    <p className="text-amber-200 text-xs font-semibold">{t.tagline}</p>
                  </div>
                </div>
                <LanguageSelector currentLang={lang} onLangChange={setLang} />
              </div>

              <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
                <h2 className="text-3xl font-light text-white mb-2">{t.enterCode}</h2>
                <p className="text-slate-400 text-sm mb-6">Ingresa el código de tu comunidad para continuar</p>

                <form onSubmit={handleVerifyCommunity} className="space-y-4">
                  <Input
                    placeholder="Ej: sierra-blanca"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value);
                      setError(null);
                    }}
                    icon={Building2}
                  />

                  {error && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg text-sm"
                    >
                      {error}
                    </motion.div>
                  )}

                  <Button
                    type="submit"
                    disabled={!code || loading}
                    loading={loading}
                  >
                    {loading ? 'Verificando...' : t.access}
                  </Button>
                </form>

                <p className="text-center text-slate-400 text-sm mt-6">
                  {t.noCode}{' '}
                  <button className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
                    {t.requestAccess}
                  </button>
                </p>
              </div>
            </div>
          )}

          {step === 'LOGIN' && community && (
            <div className="animate-fade-in-up">
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 text-slate-300 hover:text-white mb-6 transition-colors group"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span>{t.back}</span>
              </button>

              <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
                    <CheckCircle2 className="w-8 h-8 text-amber-400" />
                  </div>
                  <p className="text-amber-200 text-xs font-semibold uppercase tracking-wider">{t.verified}</p>
                  <h2 className="text-2xl font-bold text-white mt-1">{community.name}</h2>
                </div>

                <h3 className="text-2xl font-light text-white mb-2">{t.welcomeBack}</h3>
                <p className="text-slate-400 text-sm mb-6">Inicia sesión con tus credenciales</p>

                <form onSubmit={handleLogin} className="space-y-4">
                  <Input
                    type="email"
                    placeholder={t.emailPlaceholder}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    icon={Mail}
                  />

                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t.passPlaceholder}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError(null);
                      }}
                      icon={Lock}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg text-sm"
                    >
                      {error}
                    </motion.div>
                  )}

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setRememberMe(!rememberMe)}
                      className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
                    >
                      {rememberMe ? (
                        <CheckSquare className="w-5 h-5 text-amber-500" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                      <span className="text-sm">{t.rememberMe}</span>
                    </button>
                  </div>

                  <Button
                    type="submit"
                    disabled={!email || !password || loading}
                    loading={loading}
                  >
                    {loading ? 'Iniciando...' : t.login}
                  </Button>
                </form>

                <p className="text-center text-slate-400 text-sm mt-6">
                  {t.noAccount}{' '}
                  <button className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
                    {t.createAccount}
                  </button>
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default App;

import React, { useState } from 'react';
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
  CheckSquare
} from 'lucide-react';
import { Language, AuthStep, Community } from './types';
import {
  DEFAULT_BG,
  MOCK_USER,
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
// Import Tab Components to render them inside App or pass props
import { MyBookingsScreen } from './components/MyBookingsScreen';
import { CommunityScreen, ViewState as CommunityViewState } from './components/CommunityScreen';
import { WalletScreen } from './components/WalletScreen';
import { BottomNav } from './components/BottomNav';
import { motion, AnimatePresence } from 'framer-motion';
import { useCommunity } from './hooks/useCommunity';

const App: React.FC = () => {
  const { verifyCommunityCode } = useCommunity();

  // Application State
  const [lang, setLang] = useState<Language>('ES');
  const [step, setStep] = useState<AuthStep>('COMMUNITY_CODE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Community Data State
  const [code, setCode] = useState('');
  const [community, setCommunity] = useState<Community | null>(null);

  // Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Background Image State management
  const [bgImage, setBgImage] = useState(DEFAULT_BG);

  // Navigation & Flow State
  const [activeTab, setActiveTab] = useState('home');
  const [showBookingFlow, setShowBookingFlow] = useState(false);
  
  // Specific State for Community Tab Navigation (Deep Linking)
  const [communityView, setCommunityView] = useState<CommunityViewState>('MENU');

  // Handlers
  const handleVerifyCommunity = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const foundCommunity = await verifyCommunityCode(code);
    if (foundCommunity) {
      setCommunity(foundCommunity);
      setBgImage(foundCommunity.backgroundImage || DEFAULT_BG);
      setStep('LOGIN');
    } else {
      setError(lang === 'ES' ? 'Código de comunidad inválido' : 'Invalid community code');
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate login API
    setTimeout(() => {
      setLoading(false);
      setStep('APP');
    }, 1000);
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
  
  const handleLogout = () => {
    setStep('LOGIN');
    setPassword('');
    setActiveTab('home');
    setCommunityView('MENU');
  };

  const handleOpenBooking = () => {
    setShowBookingFlow(true);
  };

  const handleCloseBooking = () => {
    setShowBookingFlow(false);
  };

  const handleNavigateToBookings = () => {
    setShowBookingFlow(false);
    setActiveTab('bookings'); // Switch to bookings tab
  };

  const handleNavigateToMatchmaking = () => {
    setActiveTab('community');
    setCommunityView('MATCHMAKING');
  };

  // Content Dictionaries (Simple i18n)
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

  // RENDER APP
  if (step === 'APP' && community) {
    return (
      <>
        {/* We moved logic from HomeScreen internal rendering to here to allow better state control */}
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
                    user={MOCK_USER}
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
                  <WalletScreen />
               </motion.div>
             )}
          </AnimatePresence>

          <BottomNav 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
            onFabClick={handleOpenBooking}
          />
        </div>

        {showBookingFlow && (
          <BookingFlowScreen 
            onClose={handleCloseBooking}
            onNavigateToBookings={handleNavigateToBookings}
          />
        )}
      </>
    );
  }

  // RENDER AUTH FLOW
  return (
    <div className="relative min-h-screen w-full bg-slate-900 text-slate-50 overflow-hidden font-sans selection:bg-amber-500/30">
      
      {/* Background Layer with Overlay - Updated to use img for responsive cover */}
      <div className="absolute inset-0 z-0">
        <img 
          src={bgImage} 
          alt="Background" 
          className="w-full h-full object-cover transition-all duration-1000 ease-in-out transform scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/90" />
      </div>

      {/* Top Navigation */}
      <nav className="relative z-20 flex justify-between items-center px-6 py-6 md:px-12">
        <div className="flex items-center space-x-2">
           <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
             <Key className="w-4 h-4 text-slate-900" />
           </div>
           <span className="text-xl font-light tracking-widest uppercase text-white">
             Access<span className="font-semibold text-amber-500">Key</span>
           </span>
        </div>
        <LanguageSelector current={lang} onChange={setLang} />
      </nav>

      {/* Main Content Area */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
        
        <div className="w-full max-w-md mx-auto transition-all duration-500 ease-in-out">
          
          <AnimatePresence mode="wait">
          {/* STEP 1: COMMUNITY CODE */}
          {step === 'COMMUNITY_CODE' && (
            <motion.div 
              key="code-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="space-y-8 text-center"
            >
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white">
                  {t.tagline}
                </h1>
                <p className="text-slate-400 text-lg font-light">
                  {lang === 'ES' ? 'Lujo · Exclusividad · Comunidad' : 'Luxury · Exclusivity · Community'}
                </p>
              </div>

              <div className="glass-panel p-8 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-xl">
                <form onSubmit={handleVerifyCommunity} className="space-y-6">
                  <div className="space-y-4">
                    <Input 
                      placeholder={t.enterCode}
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      icon={<Building2 className="w-5 h-5" />}
                      autoFocus
                      className="text-center text-lg placeholder:font-light"
                    />
                    {error && (
                      <p className="text-red-400 text-sm flex items-center justify-center animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 mr-2" />
                        {error}
                      </p>
                    )}
                  </div>
                  
                  <Button type="submit" isLoading={loading}>
                    {t.access} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </form>
                
                <div className="mt-6 pt-6 border-t border-white/5">
                  <p className="text-sm text-slate-400">
                    {t.noCode} {' '}
                    <button className="text-amber-500 font-medium hover:text-amber-400 transition-colors hover:underline decoration-amber-500/50 underline-offset-4">
                      {t.requestAccess}
                    </button>
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: LOGIN FORM */}
          {step === 'LOGIN' && community && (
            <motion.div 
              key="login-step"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
               <button 
                onClick={handleBack}
                className="flex items-center text-slate-400 hover:text-white transition-colors text-sm group mb-4"
              >
                <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                {t.back}
              </button>

              <div className="glass-panel p-8 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                {/* Decorative background glow for the card */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Premium Monogram Logo */}
                <div className="text-center mb-8 relative z-10">
                  <div className="relative mx-auto w-24 h-24 mb-4 group cursor-default">
                    {/* Rings */}
                    <div className="absolute inset-0 rounded-full border border-white/10 scale-100 group-hover:scale-110 transition-transform duration-700 ease-out" />
                    <div className="absolute inset-2 rounded-full border border-amber-500/20 scale-100 group-hover:scale-105 transition-transform duration-500" />
                    
                    {/* Center Circle */}
                    <div className="absolute inset-4 rounded-full bg-gradient-to-br from-slate-800 to-slate-950 shadow-inner flex items-center justify-center border border-white/5">
                      <span className="font-serif text-4xl text-transparent bg-clip-text bg-gradient-to-b from-amber-300 to-amber-600 select-none">
                        {community.name.charAt(0)}
                      </span>
                    </div>
                    
                    {/* Badge */}
                    <div className="absolute bottom-0 right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-900">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <h2 className="text-2xl font-light text-white mb-1">{community.name}</h2>
                  <div className="flex items-center justify-center space-x-2 text-slate-400 text-xs tracking-[0.2em] uppercase opacity-60">
                     <span>{t.verified}</span>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  <Input 
                    label="Email"
                    type="email" 
                    placeholder={t.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<Mail className="w-5 h-5" />}
                  />
                  
                  <div className="space-y-3">
                    <Input 
                      label={lang === 'ES' ? 'Contraseña' : 'Password'}
                      type={showPassword ? 'text' : 'password'} 
                      placeholder={t.passPlaceholder}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      icon={<Lock className="w-5 h-5" />}
                      rightIcon={showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                      onRightIconClick={() => setShowPassword(!showPassword)}
                    />
                    
                    {/* Remember & Forgot Row */}
                    <div className="flex items-center justify-between text-xs px-1">
                      <button 
                        type="button"
                        onClick={() => setRememberMe(!rememberMe)}
                        className="flex items-center space-x-2 text-slate-400 hover:text-slate-200 transition-colors group"
                      >
                         {rememberMe ? (
                           <CheckSquare className="w-4 h-4 text-amber-500" />
                         ) : (
                           <Square className="w-4 h-4 text-slate-600 group-hover:text-slate-500" />
                         )}
                         <span>{t.rememberMe}</span>
                      </button>

                      <a href="#" className="text-amber-500/80 hover:text-amber-400 transition-colors">
                        {t.forgotPass}
                      </a>
                    </div>
                  </div>

                  <Button type="submit" isLoading={loading} className="mt-2 shadow-lg shadow-amber-900/20">
                    {t.login}
                  </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                  <p className="text-slate-400 text-sm">
                    {t.noAccount} {' '}
                    <button className="text-white font-medium hover:text-amber-500 transition-colors underline decoration-slate-600 underline-offset-4 hover:decoration-amber-500">
                      {t.createAccount}
                    </button>
                  </p>
                </div>
              </div>
            </motion.div>
          )}
          </AnimatePresence>

        </div>
      </main>

      {/* Footer / Copyright */}
      <footer className="relative z-10 w-full py-6 text-center text-xs text-slate-600">
        <p>&copy; 2024 AccessKey. All rights reserved.</p>
      </footer>

      {/* Tailwind Custom Animations */}
      <style>{`
        .font-serif {
            font-family: 'Times New Roman', Times, serif; /* Fallback simplified */
        }
      `}</style>
    </div>
  );
};

export default App;
import React, { useState } from 'react';
import {
  Key,
  Building2,
  ArrowRight,
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
import { AuthScreen } from './components/AuthScreen';
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
      setStep('AUTH');
    } else {
      setError(lang === 'ES' ? 'Código de comunidad inválido' : 'Invalid community code');
    }
    setLoading(false);
  };

  const handleAuthSuccess = () => {
    setStep('APP');
  };

  const handleBack = () => {
    setStep('COMMUNITY_CODE');
    setCommunity(null);
    setCode('');
    setBgImage(DEFAULT_BG);
    setError(null);
  };
  
  const handleLogout = () => {
    setStep('COMMUNITY_CODE');
    setActiveTab('home');
    setCommunityView('MENU');
    setCommunity(null);
    setCode('');
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

          {/* STEP 2: AUTH SCREEN (LOGIN/SIGNUP) */}
          {step === 'AUTH' && community && (
            <AuthScreen
              community={community}
              lang={lang}
              onBack={handleBack}
              onSuccess={handleAuthSuccess}
            />
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
import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard'; // Fixed import path
import { VerifySupply } from './components/views/VerifySupply';
import { FieldMonitor } from './components/views/FieldMonitor';
import { FieldDoctor } from './components/views/FieldDoctor';
import { CommunityMap } from './components/views/CommunityMap';
import { SettingsView } from './components/views/SettingsView';
import { AuthScreen } from './components/AuthScreen';
import { LandingPage } from './components/views/LandingPage';
import { ChatBot } from './components/ChatBot';
import { BottomNav } from './components/BottomNav';
import { OfflineBanner } from './components/OfflineBanner';
import { ViewType } from './types'; 
import { LogOut, Settings as SettingsIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const App = () => {
  // --- 1. STATE INITIALIZATION WITH LOCAL STORAGE ---
  
  // Check if user is already logged in
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('agri_user');
    return saved ? JSON.parse(saved) : null;
  });

  // If user is logged in, don't show landing. If not, show landing.
  const [showLanding, setShowLanding] = useState(() => {
    const savedUser = localStorage.getItem('agri_user');
    return !savedUser; 
  });

  // Remember the last view the user was on
  const [currentView, setCurrentView] = useState(() => {
    const savedView = localStorage.getItem('agri_view');
    return savedView || ViewType.DASHBOARD;
  });

  const [language, setLanguage] = useState('en');

  // Swipe Gesture State
  const touchStartX = useRef(null);
  const minSwipeDistance = 50;

  const viewOrder = [
    ViewType.DASHBOARD,
    ViewType.VERIFY,
    ViewType.MONITOR,
    ViewType.DIAGNOSE,
    ViewType.MAP,
    ViewType.SETTINGS
  ];

  // --- HANDLERS ---

  const handleEnterApp = () => {
    setShowLanding(false);
  };

  const handleBackToLanding = () => {
    setShowLanding(true);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    // Save view to storage
    localStorage.setItem('agri_view', view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    setShowLanding(false);
    // Save user to storage
    localStorage.setItem('agri_user', JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    setShowLanding(true); 
    setCurrentView(ViewType.DASHBOARD);
    // Clear storage
    localStorage.removeItem('agri_user');
    localStorage.removeItem('agri_view');
  };

  // Touch Handlers for Swipe
  const onTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (!touchStartX.current) return;
    const touchEndX = e.changedTouches[0].clientX;
    const distance = touchStartX.current - touchEndX;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    const currentIndex = viewOrder.indexOf(currentView);

    if (isLeftSwipe && currentIndex < viewOrder.length - 1) {
       handleViewChange(viewOrder[currentIndex + 1]);
    }

    if (isRightSwipe && currentIndex > 0) {
       handleViewChange(viewOrder[currentIndex - 1]);
    }
    
    touchStartX.current = null;
  };

  // --- RENDER LOGIC ---

  // 1. Landing Page (Only if no user and showLanding is true)
  if (showLanding && !user) {
    return (
      <LandingPage 
        onEnter={handleEnterApp} 
        language={language} 
        setLanguage={setLanguage} 
      />
    );
  }

  // 2. Login Screen (Auth) (If no user but passed landing)
  if (!user) {
    return (
      <AuthScreen 
        onLogin={handleLogin} 
        onBack={handleBackToLanding}
        language={language} 
        setLanguage={setLanguage} 
      />
    );
  }

  // 3. Main Dashboard
  const renderContent = () => {
    switch (currentView) {
      case ViewType.DASHBOARD:
        return <Dashboard onViewChange={handleViewChange} user={user} language={language} />;
      case ViewType.VERIFY:
        return <VerifySupply language={language} />;
      case ViewType.MONITOR:
        return <FieldMonitor language={language} />;
      case ViewType.DIAGNOSE:
        return <FieldDoctor language={language} />;
      case ViewType.MAP:
        return <CommunityMap language={language} />;
      case ViewType.SETTINGS:
        return <SettingsView language={language} user={user} />;
      default:
        return <Dashboard onViewChange={handleViewChange} user={user} language={language} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-800 font-sans">
      
      <OfflineBanner language={language} />

      {/* Sidebar - Desktop Only */}
      <Sidebar 
        currentView={currentView} 
        onViewChange={handleViewChange} 
        user={user}
        onLogout={handleLogout}
        language={language}
        setLanguage={setLanguage}
      />

      {/* Main Content Area */}
      <main 
        className="flex-1 overflow-y-auto relative w-full scroll-smooth bg-slate-50 touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        
        {/* Mobile Header - Light Theme */}
        <div className="lg:hidden sticky top-0 z-30 px-4 py-3 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-slate-200">
           <h1 className="text-xl font-bold text-emerald-900 tracking-tight flex items-center gap-2">
             <div className="w-8 h-8 bg-gradient-to-br from-lime-400 to-emerald-600 rounded-lg flex items-center justify-center text-white">
                <span className="font-bold text-xs">AS</span>
             </div>
             Agri-Sentry
           </h1>
           <div className="flex items-center gap-3">
             <button 
                onClick={() => setLanguage(language === 'en' ? 'hi' : language === 'hi' ? 'or' : 'en')}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200 uppercase"
             >
                {language}
             </button>
             <button 
               onClick={() => handleViewChange(ViewType.SETTINGS)}
               className={`p-2 rounded-lg transition-colors ${currentView === ViewType.SETTINGS ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
             >
               <SettingsIcon size={20} />
             </button>
             <button 
               onClick={handleLogout}
               className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
             >
               <LogOut size={20} />
             </button>
           </div>
        </div>

        {/* Content Container */}
        <div className="p-4 lg:p-10 max-w-7xl mx-auto min-h-full pb-24 lg:pb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav 
        currentView={currentView}
        onViewChange={handleViewChange}
        language={language}
      />

      {/* Chat Bot Overlay */}
      <ChatBot language={language} />
    </div>
  );
};

export default App;
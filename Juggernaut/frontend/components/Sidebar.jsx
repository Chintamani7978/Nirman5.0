import React from 'react';
import { ViewType } from '../types'; // User and Language types are removed as they don't exist in JS runtime
import { LayoutDashboard, ShieldCheck, ScanEye, Stethoscope, Map, Shield, LogOut, CalendarDays, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { translations } from '../translations';

export const Sidebar = ({ 
  currentView, 
  onViewChange, 
  user, 
  onLogout,
  language,
  setLanguage
}) => {
  const t = translations[language];

  const navItems = [
    { id: ViewType.DASHBOARD, label: t.dashboard, icon: <LayoutDashboard size={20} /> },
    { id: ViewType.VERIFY, label: t.verifySupply, icon: <ShieldCheck size={20} /> },
    { id: ViewType.MONITOR, label: t.monitorField, icon: <ScanEye size={20} /> },
    { id: ViewType.DIAGNOSE, label: t.diagnoseDisease, icon: <Stethoscope size={20} /> },
    { id: ViewType.MAP, label: t.communityMap, icon: <Map size={20} /> },
  ];

  return (
    <aside className="hidden lg:block w-72 h-screen shrink-0 z-40 sticky top-0 bg-slate-950">
      <div className="flex flex-col h-full bg-slate-950 bg-gradient-to-b from-slate-950 to-emerald-950 border-r border-white/5 relative overflow-hidden text-slate-300">
        {/* Decorative Glow */}
        <div className="absolute top-0 left-0 w-full h-96 bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Header */}
        <div className="p-8 flex items-center gap-3 z-10">
          <div className="p-2.5 bg-gradient-to-br from-lime-400 to-emerald-600 rounded-2xl shadow-[0_0_15px_rgba(163,230,53,0.3)]">
            <Shield className="text-emerald-950" size={26} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white leading-none">Agri-Sentry</h1>
            <p className="text-[10px] text-lime-400 font-bold tracking-[0.2em] uppercase mt-1 opacity-80">AI Protection</p>
          </div>
        </div>

         {/* Language Switcher */}
         <div className="px-8 pb-6 z-10">
          <div className="flex bg-white/5 rounded-xl p-1 border border-white/5">
            {['en', 'hi', 'or'].map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all duration-300 ${
                  language === lang 
                    ? 'bg-lime-400 text-emerald-950 shadow-lg shadow-lime-400/20' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2 z-10 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                  isActive 
                    ? 'text-white shadow-[0_0_20px_rgba(16,185,129,0.15)]' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabBg"
                    className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-transparent border-l-2 border-lime-400"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                <span className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-lime-400' : 'group-hover:text-lime-300'}`}>
                  {item.icon}
                </span>
                <span className="font-medium relative z-10 text-sm tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer User Profile */}
        <div className="p-6 border-t border-white/5 bg-black/20 z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative cursor-pointer group" onClick={() => onViewChange(ViewType.SETTINGS)}>
               <img 
                 src="https://picsum.photos/40/40" 
                 alt="User" 
                 className="w-10 h-10 rounded-full border border-lime-400/30 group-hover:border-lime-400 transition-colors"
               />
               <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-lime-400 rounded-full border-2 border-slate-900"></div>
            </div>
            <div className="overflow-hidden cursor-pointer" onClick={() => onViewChange(ViewType.SETTINGS)}>
              <p className="text-sm font-semibold text-white truncate hover:text-lime-400 transition-colors">{user.name}</p>
              <p className="text-xs text-slate-400 truncate opacity-70">Premium Plan</p>
            </div>
            <button
               onClick={() => onViewChange(ViewType.SETTINGS)}
               className="ml-auto p-1.5 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
               title="Settings"
            >
              <Settings size={16} />
            </button>
          </div>
          <button 
            onClick={onLogout}
            className="w-full py-2.5 px-4 bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/30 text-slate-300 hover:text-red-400 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 group"
          >
            <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
            {t.signOut}
          </button>
        </div>
      </div>
    </aside>
  );
};
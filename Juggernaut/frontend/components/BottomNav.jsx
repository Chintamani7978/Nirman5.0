import React from 'react';
import { ViewType } from '../types'; 
import { LayoutDashboard, ShieldCheck, ScanEye, Stethoscope, Map } from 'lucide-react';
import { translations } from '../translations';
import { motion } from 'framer-motion';

export const BottomNav = ({ currentView, onViewChange, language }) => {
  const t = translations[language];

  const navItems = [
    { id: ViewType.DASHBOARD, icon: <LayoutDashboard size={22} />, label: t.dashboard },
    { id: ViewType.VERIFY, icon: <ShieldCheck size={22} />, label: t.verifySupply },
    { id: ViewType.MONITOR, icon: <ScanEye size={22} />, label: t.monitorField },
    { id: ViewType.DIAGNOSE, icon: <Stethoscope size={22} />, label: t.diagnoseDisease },
    { id: ViewType.MAP, icon: <Map size={22} />, label: t.communityMap },
  ];

  return (
    // Fixed container at bottom, hidden on large screens (lg:hidden)
    // added safe-area padding for modern phones (pb-safe or fallback pb-2)
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 z-50 pb-[env(safe-area-inset-bottom)]">
      
      <div className="flex justify-between items-center px-1">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              // flex-1 ensures equal spacing across the width
              className="relative flex-1 flex flex-col items-center justify-center py-3 active:scale-95 transition-transform"
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavActive"
                  className="absolute -top-[1px] w-12 h-1 bg-emerald-500 rounded-b-full shadow-[0_2px_8px_rgba(16,185,129,0.4)]"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              
              <div
                className={`transition-all duration-300 ${
                  isActive 
                    ? 'text-emerald-600 -translate-y-0.5' 
                    : 'text-slate-400'
                }`}
              >
                {item.icon}
              </div>
              
              <span className={`text-[10px] font-medium mt-1 transition-all duration-300 max-w-[64px] truncate leading-tight ${
                  isActive 
                    ? 'text-emerald-800 font-bold' 
                    : 'text-slate-400'
              }`}>
                {/* Cleanly truncate to first word to prevent breaking layout on small screens */}
                {item.label.split(' ')[0]} 
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
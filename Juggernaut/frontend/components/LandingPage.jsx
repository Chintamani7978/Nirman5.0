import React from 'react';
import { motion } from 'framer-motion';
import { Sprout, ShieldCheck, ScanEye, Stethoscope, Map } from 'lucide-react';
import { translations } from '../translations';

export const LandingPage = ({ onEnter, language, setLanguage }) => {
  const t = translations[language];
  const lt = t.landing; // Access landing page specific translations

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col relative overflow-y-auto font-sans">
      {/* Background Gradients */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-lime-500/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-20 flex gap-2">
        {['en', 'hi', 'or'].map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all border ${
              language === lang 
                ? 'bg-lime-400 text-emerald-950 border-lime-400 shadow-[0_0_15px_rgba(163,230,53,0.3)]' 
                : 'bg-white/5 text-emerald-100/60 border-white/5 hover:bg-white/10 hover:text-white'
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 pt-20 pb-20">
        
        {/* The Digital Tree (Interactive Button) */}
        <div className="relative mb-12 group cursor-pointer" onClick={onEnter}>
          {/* Orbiting Rings */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-20px] rounded-full border border-emerald-500/30 border-dashed"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-40px] rounded-full border border-lime-500/20 border-dotted"
          />
          
          {/* Pulse Effect */}
          <div className="absolute inset-0 bg-lime-400/20 rounded-full blur-xl animate-pulse"></div>

          {/* Central Icon */}
          <motion.div 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-32 h-32 bg-gradient-to-br from-emerald-900 to-slate-950 rounded-full flex items-center justify-center border-2 border-lime-400 shadow-[0_0_30px_rgba(163,230,53,0.2)] relative z-10"
          >
             <Sprout size={48} className="text-lime-400" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
            className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-lime-400 text-xs font-bold tracking-widest uppercase whitespace-nowrap"
          >
            {lt.clickToInit}
          </motion.div>
        </div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-6xl font-bold text-center tracking-tighter mb-4"
        >
          Agri-Sentry
          <span className="text-lime-400">.AI</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-slate-400 text-center max-w-md text-lg mb-20"
        >
          {lt.subtitle}
        </motion.p>

        {/* Feature Cards (Abstract) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{lt.agriChainTitle}</h3>
            <p className="text-sm text-slate-400">{lt.agriChainDesc}</p>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.7 }}
             className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 text-blue-400">
              <ScanEye size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{lt.fieldSentryTitle}</h3>
            <p className="text-sm text-slate-400">{lt.fieldSentryDesc}</p>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.8 }}
             className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-lime-500/20 flex items-center justify-center mb-4 text-lime-400">
              <Stethoscope size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{lt.fieldDoctorTitle}</h3>
            <p className="text-sm text-slate-400">{lt.fieldDoctorDesc}</p>
          </motion.div>
        </div>

        {/* Detailed Workflow Section */}
        <div className="w-full max-w-5xl">
           <h2 className="text-2xl font-bold text-center mb-10 text-white flex items-center justify-center gap-3">
             <div className="h-px bg-white/10 w-20"></div>
             {lt.workflowTitle}
             <div className="h-px bg-white/10 w-20"></div>
           </h2>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              
              {/* Workflow 1: Diagnosis & Analysis */}
              <div className="space-y-6">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-lime-400/10 text-lime-400 border border-lime-400/20">
                      <Stethoscope size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{lt.diagnosisFlowTitle}</h3>
                      <p className="text-slate-400 text-sm">{lt.diagnosisFlowSub}</p>
                    </div>
                 </div>
                 
                 <div className="space-y-0 pl-4 border-l border-white/10 ml-5">
                    <div className="relative pl-8 pb-8">
                       <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-slate-600 ring-4 ring-slate-900"></div>
                       <h4 className="font-bold text-white text-sm mb-1">{lt.dfStep1Title}</h4>
                       <p className="text-slate-400 text-xs leading-relaxed">{lt.dfStep1Desc}</p>
                    </div>
                    <div className="relative pl-8 pb-8">
                       <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-slate-900"></div>
                       <h4 className="font-bold text-white text-sm mb-1">{lt.dfStep2Title}</h4>
                       <p className="text-slate-400 text-xs leading-relaxed">{lt.dfStep2Desc}</p>
                    </div>
                    <div className="relative pl-8">
                       <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-lime-400 ring-4 ring-slate-900"></div>
                       <h4 className="font-bold text-white text-sm mb-1">{lt.dfStep3Title}</h4>
                       <p className="text-slate-400 text-xs leading-relaxed">{lt.dfStep3Desc}</p>
                    </div>
                 </div>
              </div>

              {/* Workflow 2: Community Map */}
              <div className="space-y-6">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                      <Map size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{lt.communityFlowTitle}</h3>
                      <p className="text-slate-400 text-sm">{lt.communityFlowSub}</p>
                    </div>
                 </div>
                 
                 <div className="space-y-0 pl-4 border-l border-white/10 ml-5">
                    <div className="relative pl-8 pb-8">
                       <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-slate-600 ring-4 ring-slate-900"></div>
                       <h4 className="font-bold text-white text-sm mb-1">{lt.cfStep1Title}</h4>
                       <p className="text-slate-400 text-xs leading-relaxed">{lt.cfStep1Desc}</p>
                    </div>
                    <div className="relative pl-8 pb-8">
                       <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-slate-900"></div>
                       <h4 className="font-bold text-white text-sm mb-1">{lt.cfStep2Title}</h4>
                       <p className="text-slate-400 text-xs leading-relaxed">{lt.cfStep2Desc}</p>
                    </div>
                    <div className="relative pl-8">
                       <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-lime-400 ring-4 ring-slate-900"></div>
                       <h4 className="font-bold text-white text-sm mb-1">{lt.cfStep3Title}</h4>
                       <p className="text-slate-400 text-xs leading-relaxed">{lt.cfStep3Desc}</p>
                    </div>
                 </div>
              </div>

           </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center border-t border-white/5 text-slate-500 text-sm font-medium z-10 relative bg-slate-900">
        {lt.footer}
      </footer>
    </div>
  );
};
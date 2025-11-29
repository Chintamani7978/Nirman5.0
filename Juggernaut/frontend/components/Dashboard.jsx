import React from 'react';
import { ViewType } from '../types'; // Assuming types/ViewType exists in JS
import { WeatherWidget } from "./WeatherWidget";
import { ActionCard } from "./ActionCard"; // Adjusted import path (was ./ActionCard)
import { ScanEye, Droplets, Sprout, ShieldCheck, Stethoscope, CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';
import { translations } from '../translations'; // Adjusted path if translations is in src/
import { CropCalendar } from './views/CropCalendar'; // Adjusted path

export const Dashboard = ({ onViewChange, user, language }) => {
  const t = translations[language];

  return (
    // Added pb-20 for mobile so content isn't hidden behind bottom navigation (if any)
    <div className="space-y-6 md:space-y-8 pb-20 md:pb-0">
      
      {/* Welcome & Weather Header */}
      {/* Changed to xl:flex-row to stack earlier on smaller laptops for better readability */}
      <div className="flex flex-col xl:flex-row gap-6 md:gap-8 justify-between items-start xl:items-end">
        <div className="relative z-10 w-full xl:w-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
             <h2 className="text-3xl md:text-5xl font-bold text-slate-800 tracking-tight leading-tight tracking-in-expand">
              {t.goodMorning}, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-800">
                {user.name}
              </span>
            </h2>
            <div className="flex items-center gap-3 mt-4 bg-emerald-50/50 p-2 rounded-lg inline-flex border border-emerald-100/50">
               <div className="h-3 w-3 md:h-2.5 md:w-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
               <p className="text-slate-600 text-sm md:text-sm font-medium tracking-wide uppercase">
                 System Status: <span className="text-emerald-700 font-bold">{t.protectionActive}</span>
               </p>
            </div>
          </motion.div>
        </div>
        
        {/* Weather Widget Container - Ensures it doesn't overflow on mobile */}
        <div className="w-full xl:w-auto overflow-x-hidden rounded-3xl">
          <WeatherWidget />
        </div>
      </div>

      {/* Quick Stats Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        // Mobile: 1 column (Stack). Tablet: 2 cols. Laptop: 3 cols.
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
      >
        <div className="bg-white rounded-3xl p-5 md:p-6 border border-slate-200 shadow-md shadow-emerald-900/5 relative overflow-hidden group hover:shadow-lg transition-shadow">
           <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                <Sprout size={28} /> {/* Bigger icon for farmers */}
              </div>
              <span className="text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full text-xs font-bold">+2.4%</span>
           </div>
           <div>
             <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">{t.fieldHealth}</p>
             <p className="text-4xl font-bold text-slate-800 mt-1">98%</p>
           </div>
        </div>

         <div className="bg-white rounded-3xl p-5 md:p-6 border border-slate-200 shadow-md shadow-emerald-900/5 relative overflow-hidden group hover:shadow-lg transition-shadow">
           <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                <Droplets size={28} />
              </div>
              <span className="text-blue-700 bg-blue-100 px-3 py-1 rounded-full text-xs font-bold">Optimal</span>
           </div>
           <div>
             <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">{t.soilMoisture}</p>
             <div className="flex items-end gap-2 mt-1">
               <p className="text-4xl font-bold text-slate-800">64%</p>
               <span className="text-xs text-slate-400 mb-1.5">Avg Today</span>
             </div>
           </div>
        </div>

         {/* This card spans 2 columns on tablet to fill the gap, normal on others */}
         <div className="bg-white rounded-3xl p-5 md:p-6 border border-slate-200 shadow-md shadow-emerald-900/5 relative overflow-hidden group hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1 ">
           <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-lime-50 rounded-2xl text-lime-600">
                <ScanEye size={28} />
              </div>
              <span className="text-lime-700 bg-lime-100 px-3 py-1 rounded-full text-xs font-bold">On Track</span>
           </div>
           <div>
             <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">{t.nextHarvest}</p>
             <p className="text-4xl font-bold text-slate-800 mt-1">14 Days</p>
           </div>
        </div>
      </motion.div>

      {/* Embedded Smart Crop Calendar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25 }}
      >
        <div className="flex items-center gap-3 mb-4 pl-1">
           <div className="bg-emerald-100 p-2 rounded-lg">
             <CalendarDays className="text-emerald-700" size={20} />
           </div>
           <h3 className="text-xl font-bold text-emerald-900">{t.smartCalendar}</h3>
        </div>
        <CropCalendar language={language} embedded={true} />
      </motion.div>

      {/* Action Cards Grid */}
      <div>
        <h3 className="text-xl font-semibold text-emerald-900 mb-6 flex items-center gap-3 pl-1">
          {t.coreActions}
          <div className="h-px bg-slate-200 flex-1 ml-2" />
        </h3>
        
        {/* Responsive Grid for Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 ">
          <ActionCard
            title={t.verifyTitle}
            description={t.verifyDesc}
            icon={<ShieldCheck size={32} />}
            buttonText={t.scanNow}
            onClick={() => onViewChange(ViewType.VERIFY)}
            delay={0.3}
            color="emerald"
          />
          <ActionCard
            title={t.monitorTitle}
            description={t.monitorDesc}
            icon={<ScanEye size={32} />}
            buttonText={t.uploadPhoto}
            onClick={() => onViewChange(ViewType.MONITOR)}
            delay={0.4}
            color="blue"
          />
          {/* Make Diagnose card span full width on tablets for balance */}
          <div className="md:col-span-2 lg:col-span-1">
            <ActionCard
              title={t.diagnoseTitle}
              description={t.diagnoseDesc}
              icon={<Stethoscope size={32} />}
              buttonText={t.diagnoseLeaf}
              onClick={() => onViewChange(ViewType.DIAGNOSE)}
              delay={0.5}
              color="lime"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
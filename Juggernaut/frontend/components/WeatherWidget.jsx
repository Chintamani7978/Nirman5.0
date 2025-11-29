import React, { useState, useEffect } from 'react';
import { Sun, CloudRain, Wind, Clock, Droplet } from 'lucide-react'; 
import { motion } from 'framer-motion';

export const WeatherWidget = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Placeholders
  const humidity = '65%';
  const windSpeed = '4 km/h';
  const rainChance = '10%';

  const metrics = [
    { label: 'WIND', value: windSpeed, icon: <Wind size={14} className="text-blue-100" /> },
    { label: 'HUMIDITY', value: humidity, icon: <Droplet size={14} className="text-blue-100" /> },
    { label: 'RAIN CHANCE', value: rainChance, icon: <CloudRain size={14} className="text-blue-100" /> },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      // RESPONSIVE WIDTH LOGIC:
      // Phone: w-full (Full width)
      // Tablet (md): w-[56rem] (Wide Banner) - YOUR TEAM'S DESIGN KEPT
      // Laptop (lg): w-96 (Small Card) - NEW CHANGE FOR LARGE SCREENS
      className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-3xl p-4 py-3 md:p-6 lg:p-5 shadow-xl shadow-blue-900/10 relative overflow-hidden group w-full md:w-[56rem] lg:w-96 border border-blue-400/20"
    >
      {/* Background decoration */}
      <div className="absolute -top-10 -right-10 bg-white/20 w-32 h-32 rounded-full blur-2xl group-hover:bg-white/30 transition-all duration-700" />
      
      <div className="flex justify-between items-start relative z-10">
        <div>
          <div className="flex items-center gap-1 mb-0.5 md:gap-2 md:mb-2 lg:mb-1">
            <span className="text-blue-100 text-[9px] font-bold uppercase tracking-widest border border-blue-400/50 px-1.5 py-0 md:px-2 md:py-0.5 rounded-full bg-blue-900/20 md:text-[10px]">Local Weather</span>
          </div>
          <div className="flex items-baseline gap-1 mt-1 md:mt-2 lg:mt-1">
            {/* TEXT SIZE LOGIC: Small on phone -> Big on Tablet -> Small again on Laptop */}
            <span className="text-4xl md:text-5xl lg:text-4xl font-bold tracking-tighter drop-shadow-md">28°</span>
          </div>
          <p className="text-xs md:text-sm lg:text-xs text-blue-100 font-medium mt-0.5 md:mt-1">Sunny & Clear</p>
        </div>
        
        <div className="flex flex-col items-end gap-2 md:gap-3 lg:gap-2">
           <div className="bg-gradient-to-b from-yellow-300 to-amber-500 p-2 md:p-3 lg:p-2 rounded-xl shadow-[0_4px_15px_rgba(252,211,77,0.4)]">
             <Sun size={20} className="text-white animate-spin-slow" />
           </div>
           <div className="flex items-center gap-1 text-[9px] md:text-xs lg:text-[10px] text-blue-100 font-mono bg-black/10 px-1.5 py-0 rounded-lg md:px-2 md:py-1">
             <Clock size={9} />
             {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
           </div>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="mt-2 pt-2 lg:mt-3 lg:pt-3 border-t border-white/20 
                      flex flex-row md:flex-row md:justify-around gap-2 text-xs text-blue-100 md:gap-2">
        
        {metrics.map((metric, index) => (
          <div 
            key={index} 
            className="flex flex-row md:flex-col lg:flex-row items-center justify-start md:justify-center lg:justify-start gap-1 md:gap-1 lg:gap-2
                       bg-blue-800/50 px-2 py-0.5 rounded-lg shadow-md md:px-3 md:py-2 lg:px-2 lg:py-1
                       w-full md:flex-1 md:min-w-0" 
          >
            
            {/* Label: Visible on Tablet (md), Hidden on Phone & Laptop (lg) to keep it compact */}
            <span className="hidden md:block lg:hidden text-[10px] uppercase font-medium text-blue-200">
              {metric.label}
            </span>
            
            <div className="flex items-center gap-1">
              {metric.icon} 
              <span className="font-semibold text-xs md:text-sm lg:text-xs">{metric.value}</span>
            </div>
          </div>
        ))}

      </div>
    </motion.div>
  );
};
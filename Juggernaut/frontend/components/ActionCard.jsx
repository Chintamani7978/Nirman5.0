import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export const ActionCard = ({ 
  title, 
  description, 
  icon, 
  buttonText, 
  onClick,
  delay,
  color
}) => {
  const getStyles = () => {
    switch(color) {
      case 'emerald': 
        return {
          bg: 'hover:shadow-[0_8px_30px_rgba(16,185,129,0.15)] hover:border-emerald-200',
          iconBg: 'bg-emerald-50 text-emerald-600',
          btn: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
        };
      case 'blue': 
        return {
          bg: 'hover:shadow-[0_8px_30px_rgba(59,130,246,0.15)] hover:border-blue-200',
          iconBg: 'bg-blue-50 text-blue-600',
          btn: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
        };
      case 'lime': 
        return {
          bg: 'hover:shadow-[0_8px_30px_rgba(132,204,22,0.15)] hover:border-lime-200',
          iconBg: 'bg-lime-50 text-lime-600',
          btn: 'bg-lime-600 hover:bg-lime-700 text-white shadow-lime-500/20'
        };
      default: return { bg: '', iconBg: '', btn: '' };
    }
  };

  const styles = getStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      onClick={onClick}
      className={`group relative p-8 rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 cursor-pointer ${styles.bg}`}
    >
      <div className={`mb-6 inline-block p-4 rounded-2xl ${styles.iconBg} transition-transform group-hover:scale-110 duration-300 border border-black/5`}>
        {icon}
      </div>
      
      <h3 className="text-2xl font-bold mb-3 text-slate-800 transition-all">{title}</h3>
      <p className="text-slate-500 mb-8 leading-relaxed h-12 text-sm font-medium">{description}</p>
      
      <div className="relative">
        <button 
          className={`w-full py-3.5 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all transform group-hover:translate-x-1 shadow-lg ${styles.btn}`}
        >
          {buttonText}
          <ArrowRight size={18} />
        </button>
      </div>
    </motion.div>
  );
};
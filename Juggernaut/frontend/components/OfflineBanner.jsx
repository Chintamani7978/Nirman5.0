import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const OfflineBanner = ({ language }) => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const messages = {
    en: "You are currently offline. Some features may be limited.",
    hi: "आप अभी ऑफ़लाइन हैं। कुछ सुविधाएँ सीमित हो सकती हैं।",
    or: "ଆପଣ ବର୍ତ୍ତମାନ ଅଫଲାଇନ୍ ଅଛନ୍ତି | କିଛି ବୈଶିଷ୍ଟ୍ୟ ସୀମିତ ହୋଇପାରେ |"
  };

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 right-0 z-[60] bg-red-600 text-white px-4 py-3 shadow-lg flex items-center justify-center gap-2"
        >
          <WifiOff size={18} />
          <span className="text-sm font-bold">{messages[language]}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
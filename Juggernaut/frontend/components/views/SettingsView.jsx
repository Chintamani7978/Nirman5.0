import React, { useState, useRef } from 'react';
import { Settings, User, Bell, Save, Check, Camera, Languages, MapPin, Sprout, Loader2, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { translations } from '../../translations';

export const SettingsView = ({ language, user }) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form States
  const [farmName, setFarmName] = useState('Green Valley Estate');
  const [cropTypes, setCropTypes] = useState('Rice, Wheat, Cotton');
  const [location, setLocation] = useState('Punjab, India');
  const [avatar, setAvatar] = useState(null); // State for profile image
  
  // Location State
  const [isLocating, setIsLocating] = useState(false);

  // Refs
  const fileInputRef = useRef(null);

  // Notification States
  const [notifications, setNotifications] = useState({
    storm: true,
    pest: true,
    market: false
  });

  // --- Image Upload Logic ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
    }
  };

  // --- Live Location Logic ---
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Using a free API to convert coordinates to City/State (Reverse Geocoding)
          // Note: In a real production app, you might use Google Maps API key here.
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await response.json();
          
          const city = data.city || data.locality || "";
          const region = data.principalSubdivision || data.countryName || "";
          
          if (city && region) {
            setLocation(`${city}, ${region}`);
          } else {
            setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          }
        } catch (error) {
          console.error("Error fetching address:", error);
          // Fallback to coordinates if API fails
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location. Please check permissions.");
        setIsLocating(false);
      }
    );
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1000);
  };

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 h-full flex flex-col w-full max-w-6xl mx-auto pb-24 md:pb-8">
      
      {/* Header */}
      <div className="flex flex-col gap-1 px-1">
        <h2 className="text-2xl md:text-3xl font-bold text-emerald-900 flex items-center gap-3">
          <Settings className="text-emerald-600" size={32} />
          {t.settingsHeader}
        </h2>
        <p className="text-slate-500 text-sm md:text-base">
          {t.settingsSub || "Manage your farm profile and app preferences."}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 flex-1">
        
        {/* Navigation */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white/50 backdrop-blur-sm p-1.5 rounded-2xl flex lg:flex-col gap-2 border border-slate-200 lg:border-none lg:bg-transparent">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex-1 lg:w-full p-3 lg:px-6 lg:py-4 rounded-xl flex items-center justify-center lg:justify-start gap-3 font-semibold transition-all ${
                activeTab === 'profile' 
                  ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-slate-100' 
                  : 'text-slate-500 hover:bg-slate-100/50 hover:text-slate-700'
              }`}
            >
              <User size={20} /> 
              <span className="text-sm md:text-base">{t.profileSettings || "Profile"}</span>
            </button>
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`flex-1 lg:w-full p-3 lg:px-6 lg:py-4 rounded-xl flex items-center justify-center lg:justify-start gap-3 font-semibold transition-all ${
                activeTab === 'notifications' 
                  ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-slate-100' 
                  : 'text-slate-500 hover:bg-slate-100/50 hover:text-slate-700'
              }`}
            >
              <Bell size={20} /> 
              <span className="text-sm md:text-base">{t.notifications}</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm p-5 md:p-8 min-h-[500px] relative overflow-hidden">
          <AnimatePresence mode="wait">
            
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <motion.div 
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                {/* Avatar Section - Now Clickable */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 pb-6 border-b border-slate-100">
                  <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center text-emerald-700 text-3xl font-bold border-4 border-white shadow-lg shadow-emerald-100 overflow-hidden">
                      {avatar ? (
                        <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        user.name.charAt(0)
                      )}
                    </div>
                    {/* Hidden Input */}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageUpload} 
                        accept="image/*" 
                        className="hidden" 
                    />
                    <div className="absolute bottom-0 right-0 p-2 bg-slate-800 text-white rounded-full hover:bg-emerald-600 transition-colors shadow-md group-hover:scale-110">
                      <Camera size={16} />
                    </div>
                  </div>
                  
                  <div className="text-center md:text-left space-y-1 pt-2">
                    <h3 className="text-2xl font-bold text-slate-800">{user.name}</h3>
                    <p className="text-slate-500">{user.email || "farmer@agrisentry.com"}</p>
                    <div className="flex items-center justify-center md:justify-start gap-2 pt-1">
                       <span className="px-3 py-1 bg-lime-100 text-lime-700 text-xs font-bold rounded-full border border-lime-200">
                         Pro Member
                       </span>
                       <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full border border-slate-200 flex items-center gap-1">
                         <Languages size={12} /> {language.toUpperCase()}
                       </span>
                    </div>
                  </div>
                </div>

                {/* Form Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Farm Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                      <Sprout size={14} /> {t.farmName}
                    </label>
                    <input 
                      type="text" 
                      value={farmName}
                      onChange={(e) => setFarmName(e.target.value)}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium text-slate-700"
                    />
                  </div>

                  {/* Location with Detect Button */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                      <MapPin size={14} /> Location
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full p-4 pr-24 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium text-slate-700"
                      />
                      <button 
                        onClick={handleGetLocation}
                        disabled={isLocating}
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-500 hover:text-emerald-600 hover:border-emerald-200 transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        {isLocating ? (
                            <Loader2 size={12} className="animate-spin" />
                        ) : (
                            <MapPin size={12} />
                        )}
                        {isLocating ? "Locating..." : "Detect"}
                      </button>
                    </div>
                  </div>

                  {/* Crop Types */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                      <Sprout size={14} /> {t.cropTypes}
                    </label>
                    <input 
                      type="text" 
                      value={cropTypes}
                      onChange={(e) => setCropTypes(e.target.value)}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium text-slate-700"
                    />
                    <p className="text-xs text-slate-400 pl-1">Separate crops with a comma (e.g., Rice, Wheat)</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <motion.div 
                key="notifications"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="border-b border-slate-100 pb-4">
                   <h3 className="text-xl font-bold text-slate-800">{t.notifications}</h3>
                   <p className="text-slate-500 text-sm mt-1">Choose what alerts you want to receive.</p>
                </div>
                
                <div className="space-y-4">
                  {[
                    { key: 'storm', label: t.stormAlerts, desc: 'Heavy rain, hail, or strong winds alerts.', icon: '⚡' },
                    { key: 'pest', label: t.pestWarnings, desc: 'Real-time pest outbreak warnings near you.', icon: '🐛' },
                    { key: 'market', label: t.marketFluctuations, desc: 'Daily crop price updates from local mandi.', icon: '💰' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 md:p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-emerald-200 transition-colors cursor-pointer" onClick={() => toggleNotification(item.key)}>
                      <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl shadow-sm border border-slate-100">
                           {item.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-800 text-sm md:text-base">{item.label}</h4>
                          <p className="text-xs md:text-sm text-slate-500 leading-snug">{item.desc}</p>
                        </div>
                      </div>
                      
                      {/* Custom Toggle Switch */}
                      <div className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 relative ${notifications[item.key] ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                        <motion.div 
                          className="w-5 h-5 bg-white rounded-full shadow-sm"
                          animate={{ x: notifications[item.key] ? 20 : 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating/Fixed Save Button */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={`w-full md:w-auto px-8 py-4 md:py-3 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 ${
                saved 
                  ? 'bg-emerald-500 hover:bg-emerald-600 ring-2 ring-emerald-200' 
                  : 'bg-slate-900 hover:bg-slate-800'
              }`}
            >
              {isSaving ? (
                <>Saving...</>
              ) : saved ? (
                <><Check size={20} /> {t.saved}</>
              ) : (
                <><Save size={20} /> {t.saveChanges}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
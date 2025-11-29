import React, { useState, useEffect } from 'react';
import { CalendarDays, Sprout, Droplets, Bug, CheckCircle2, Circle, Loader2, CloudRain, Sun, Thermometer, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { translations } from '../../translations';

const crops = [
  { id: 'rice', name: { en: 'Rice (Paddy)', hi: 'चावल (धान)', or: 'ଧାନ' } },
  { id: 'wheat', name: { en: 'Wheat', hi: 'गेहूं', or: 'ଗହମ' } },
  { id: 'cotton', name: { en: 'Cotton', hi: 'कपास', or: 'କପା' } },
  { id: 'corn', name: { en: 'Corn (Maize)', hi: 'मक्का', or: 'ମକା' } }
];

export const CropCalendar = ({ language, embedded = false }) => {
  const t = translations[language];
  const [selectedCrop, setSelectedCrop] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [schedule, setSchedule] = useState(null);
  
  // Weather States
  const [weather, setWeather] = useState(null);
  const [locationName, setLocationName] = useState('Detecting Location...');
  const [loadingWeather, setLoadingWeather] = useState(true);

  // Fetch Weather on Mount
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoadingWeather(true);
        // Attempt to get location, default to Central India (Nagpur) if denied
        let lat = 20.5937;
        let lon = 78.9629;
        
        // Simulating Geolocation access for demo robustness (or falling back)
        if (navigator.geolocation) {
           navigator.geolocation.getCurrentPosition(
             (pos) => {
               lat = pos.coords.latitude;
               lon = pos.coords.longitude;
               setLocationName("Local Field Data");
               getWeatherData(lat, lon);
             },
             (err) => {
               console.warn("Geolocation denied, using default:", err);
               setLocationName("Regional Default (Central India)");
               getWeatherData(lat, lon);
             }
           );
        } else {
           setLocationName("Regional Default (Central India)");
           getWeatherData(lat, lon);
        }
      } catch (e) {
        console.error("Weather fetch failed", e);
        setLoadingWeather(false);
      }
    };

    const getWeatherData = async (lat, lon) => {
      try {
        // Open-Meteo Free API
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,precipitation_sum&timezone=auto&forecast_days=3`
        );
        const data = await response.json();
        
        if (data && data.daily) {
           const todayMaxTemp = data.daily.temperature_2m_max[0];
           const todayPrecip = data.daily.precipitation_sum[0];
           
           setWeather({
             maxTemp: todayMaxTemp,
             precipProb: todayPrecip > 0 ? (todayPrecip * 10) : 0, // Approx prob
             condition: todayPrecip > 2 ? 'rain' : todayMaxTemp > 35 ? 'heat' : 'clear'
           });
        }
      } catch (err) {
        console.error("API Error", err);
      } finally {
        setLoadingWeather(false);
      }
    };

    fetchWeather();
  }, []);

  const handleGenerate = () => {
    if (!selectedCrop) return;
    setIsGenerating(true);
    
    // Simulate AI Generation with Weather Context
    setTimeout(() => {
      let baseSchedule = [
        { id: 1, day: 1, title: 'Sowing Seeds', type: 'sow', completed: true, description: 'Plant seeds at 2-3 cm depth.' },
        { id: 2, day: 3, title: 'First Irrigation', type: 'water', completed: false, description: 'Ensure soil is moist for germination.' },
        { id: 3, day: 15, title: 'Weed Control', type: 'care', completed: false, description: 'Remove weeds manually or use mild herbicide.' },
        { id: 4, day: 25, title: 'Nitrogen Boost', type: 'care', completed: false, description: 'Apply Urea for leaf growth.' },
        { id: 5, day: 45, title: 'Mid-Season Check', type: 'care', completed: false, description: 'Check for stem borers.' },
        { id: 6, day: 90, title: 'Harvest Ready', type: 'harvest', completed: false, description: 'Harvest when grains are golden.' },
      ];

      // --- APPLY WEATHER LOGIC ---
      if (weather) {
        // 1. Rain Logic: If raining, skip early irrigation
        if (weather.condition === 'rain') {
           baseSchedule = baseSchedule.map(task => 
             task.id === 2 ? {
               ...task,
               title: t.skipIrrigation,
               description: 'Soil moisture sufficient due to forecasted rain.',
               weatherReason: t.rainExpected,
               weatherIcon: 'rain',
               type: 'care' // Change type to avoid water icon confusion
             } : task
           );
        }

        // 2. Heat Logic: If hot, add water warning
        if (weather.condition === 'heat') {
           baseSchedule = baseSchedule.map(task => 
             task.id === 2 ? {
               ...task,
               title: 'Deep Irrigation Needed',
               description: 'Increase water volume by 20% due to heatwave.',
               weatherReason: t.heatAlert,
               weatherIcon: 'heat'
             } : task
           );
        }
      }

      setSchedule(baseSchedule);
      setIsGenerating(false);
    }, 2000);
  };

  const toggleTask = (id) => {
    if (!schedule) return;
    setSchedule(schedule.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const getTaskIcon = (type) => {
    switch (type) {
      case 'sow': return <Sprout size={20} className="text-emerald-500" />;
      case 'water': return <Droplets size={20} className="text-blue-500" />;
      case 'care': return <Bug size={20} className="text-amber-500" />;
      case 'harvest': return <CheckCircle2 size={20} className="text-lime-600" />;
      default: return <Circle size={20} className="text-slate-400" />;
    }
  };

  const completedCount = schedule?.filter(t => t.completed).length || 0;
  const totalCount = schedule?.length || 0;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className={`space-y-6 h-full flex flex-col ${embedded ? 'py-2' : ''}`}>
      {!embedded && (
        <div className="mb-4">
          <h2 className="text-3xl font-bold text-emerald-900 flex items-center gap-3">
            <CalendarDays className="text-emerald-600" size={36} />
            {t.calendarHeader}
          </h2>
          <p className="text-slate-500 mt-2 text-lg max-w-2xl">
            {t.calendarSub}
          </p>
        </div>
      )}

      <div className={`grid grid-cols-1 ${embedded ? 'xl:grid-cols-3' : 'lg:grid-cols-3'} gap-8 flex-1`}>
        
        {/* Left Panel: Configuration & Weather Context */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Weather Context Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 shadow-md border border-blue-100 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <CloudRain size={80} />
             </div>
             <div className="flex items-center gap-2 mb-4 text-blue-800">
               <MapPin size={18} />
               <span className="text-xs font-bold uppercase tracking-wider">{locationName}</span>
             </div>
             
             {loadingWeather ? (
               <div className="flex items-center gap-2 text-blue-600 text-sm">
                 <Loader2 size={16} className="animate-spin" /> Fetching Forecast...
               </div>
             ) : weather ? (
               <div>
                  <div className="flex items-end gap-2 mb-1">
                     <h3 className="text-4xl font-bold text-blue-900">{weather.maxTemp}°C</h3>
                     <span className="text-blue-600 font-medium mb-2">High</span>
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                     <div className="flex items-center gap-1.5 bg-white/60 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-800">
                        {weather.condition === 'rain' ? <CloudRain size={14} /> : <Sun size={14} />}
                        {weather.condition === 'rain' ? 'Rain Likely' : 'Clear Sky'}
                     </div>
                     <div className="flex items-center gap-1.5 bg-white/60 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-800">
                        <Droplets size={14} />
                        {Math.round(weather.precipProb)}mm Precip
                     </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-blue-200/50">
                    <p className="text-xs text-blue-700 leading-relaxed">
                       {t.weatherAdjusted}
                    </p>
                  </div>
               </div>
             ) : (
               <p className="text-sm text-blue-500">Weather data unavailable</p>
             )}
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-md shadow-emerald-900/5 border border-slate-200">
            <label className="block text-sm font-bold text-slate-500 mb-4 uppercase tracking-wide">{t.selectCrop}</label>
            <div className="space-y-3">
              {crops.map((crop) => (
                <button
                  key={crop.id}
                  onClick={() => setSelectedCrop(crop.id)}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between group ${
                    selectedCrop === crop.id 
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm' 
                      : 'border-slate-200 hover:border-emerald-400 text-slate-600 hover:text-emerald-800 bg-white hover:bg-slate-50'
                  }`}
                >
                  <span className="font-semibold">{crop.name[language]}</span>
                  {selectedCrop === crop.id && <CheckCircle2 className="text-emerald-500" size={20} />}
                </button>
              ))}
            </div>

            <button
              onClick={handleGenerate}
              disabled={!selectedCrop || isGenerating}
              className={`w-full mt-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                !selectedCrop || isGenerating 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  {t.generating}
                </>
              ) : (
                <>
                  <Sprout size={20} />
                  {t.generateSchedule}
                </>
              )}
            </button>
          </div>

          {schedule && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-900 border border-emerald-800 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg"
            >
               <div className="absolute top-0 right-0 w-32 h-32 bg-lime-400/10 rounded-full blur-3xl pointer-events-none"></div>
               <h3 className="font-bold text-lg mb-2">{t.progress}</h3>
               <div className="flex items-end gap-2 mb-4">
                 <span className="text-4xl font-bold text-lime-400">{Math.round(progress)}%</span>
                 <span className="text-emerald-300 text-sm mb-1">{t.completed}</span>
               </div>
               <div className="w-full bg-black/30 rounded-full h-3 overflow-hidden border border-white/10">
                 <motion.div 
                   className="h-full bg-lime-400 shadow-[0_0_10px_rgba(163,230,53,0.5)]"
                   initial={{ width: 0 }}
                   animate={{ width: `${progress}%` }}
                   transition={{ duration: 1 }}
                 />
               </div>
            </motion.div>
          )}
        </div>

        {/* Right Panel: Timeline */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-md shadow-emerald-900/5 p-6 lg:p-8 overflow-y-auto relative min-h-[500px]">
          {!schedule ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
               <CalendarDays size={64} className="mb-4 opacity-20" />
               <p>{t.calendarSub}</p>
             </div>
          ) : (
             <div className="relative">
                <div className="flex justify-between items-center mb-8">
                   <h3 className="text-2xl font-bold text-slate-800">{t.yourSchedule}</h3>
                   {weather && (
                     <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 flex items-center gap-1">
                        <MapPin size={12} /> Live Weather Integrated
                     </span>
                   )}
                </div>
                
                {/* Timeline Line */}
                <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-slate-200"></div>

                <div className="space-y-6">
                  {schedule.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`relative flex items-start gap-6 group ${task.completed ? 'opacity-60' : ''}`}
                    >
                      {/* Date Bubble */}
                      <div className={`z-10 w-16 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0 border transition-colors ${
                        task.completed 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                          : task.weatherIcon 
                             ? 'bg-blue-50 border-blue-200 text-blue-700'
                             : 'bg-white border-slate-200 text-slate-700 shadow-sm'
                      }`}>
                         <span className="text-[10px] font-bold uppercase text-slate-400">Day</span>
                         <span className="text-xl font-bold">{task.day}</span>
                      </div>

                      {/* Card */}
                      <div 
                        onClick={() => toggleTask(task.id)}
                        className={`flex-1 p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
                        task.completed 
                          ? 'bg-emerald-50/50 border-emerald-100' 
                          : task.weatherReason
                            ? 'bg-blue-50/30 border-blue-200 hover:border-blue-300'
                            : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/20'
                      }`}>
                        <div className="flex justify-between items-start mb-2">
                           <div className="flex items-center gap-3">
                             <div className={`p-2 rounded-lg ${task.completed ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                               {getTaskIcon(task.type)}
                             </div>
                             <div>
                               <h4 className={`font-bold text-lg ${task.completed ? 'text-emerald-800/70 line-through' : 'text-slate-800'}`}>
                                 {task.title}
                               </h4>
                               {task.weatherReason && (
                                 <span className="text-xs font-bold text-white bg-blue-500 px-2 py-0.5 rounded-full flex items-center gap-1 w-fit mt-1">
                                    {task.weatherIcon === 'rain' ? <CloudRain size={10} /> : <Thermometer size={10} />}
                                    {task.weatherReason}
                                 </span>
                               )}
                             </div>
                           </div>
                           <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                             task.completed 
                               ? 'bg-emerald-500 border-emerald-500 text-white' 
                               : 'border-slate-300 group-hover:border-emerald-400'
                           }`}>
                             {task.completed && <CheckCircle2 size={14} />}
                           </div>
                        </div>
                        <p className="text-slate-500 text-sm ml-11">{task.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
             </div>
          )}
        </div>

      </div>
    </div>
  );
};
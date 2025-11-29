import React, { useState, useEffect } from 'react';
import { 
  CloudSun, Wind, Droplets, CloudRain, Sun, Cloud, CloudRainWind, 
  Eye, Thermometer, Navigation, Gauge, Sunrise, Sunset, MapPin,
  TrendingUp, Activity, Calendar, Clock
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [isRaining, setIsRaining] = useState(false);
  const [rainIntensity, setRainIntensity] = useState(0);
  const [hourlyData, setHourlyData] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const generateWeatherData = () => {
      const weatherConditions = [
        { type: "Clear", icon: "☀️", color: "#f39c12", chance: 0.3 },
        { type: "Partly Cloudy", icon: "⛅", color: "#95a5a6", chance: 0.3 },
        { type: "Cloudy", icon: "☁️", color: "#7f8c8d", chance: 0.2 },
        { type: "Rainy", icon: "🌧️", color: "#3498db", chance: 0.1 },
        { type: "Stormy", icon: "⛈️", color: "#8e44ad", chance: 0.05 },
        { type: "Foggy", icon: "🌫️", color: "#bdc3c7", chance: 0.05 }
      ];

      let randomIndex = 0;
      const rand = Math.random();
      let cumulative = 0;
      for (let i = 0; i < weatherConditions.length; i++) {
        cumulative += weatherConditions[i].chance;
        if (rand <= cumulative) {
          randomIndex = i;
          break;
        }
      }

      const randomCondition = weatherConditions[randomIndex];
      const randomTemp = Math.floor(Math.random() * (35 - 10 + 1)) + 10;
      const randomWind = (Math.random() * (25 - 0) + 0).toFixed(1);
      const randomHumidity = Math.floor(Math.random() * (95 - 20 + 1)) + 20;
      const randomPressure = Math.floor(Math.random() * (1040 - 980 + 1)) + 980;
      const randomVisibility = (Math.random() * (20 - 1) + 1).toFixed(1);
      const randomUvIndex = Math.floor(Math.random() * 11);
      
      let rainChance = 0;
      if (randomCondition.type === "Rainy" || randomCondition.type === "Stormy") {
        rainChance = Math.floor(Math.random() * 80) + 20;
      } else if (randomCondition.type === "Cloudy") {
        rainChance = Math.floor(Math.random() * 40);
      } else {
        rainChance = Math.floor(Math.random() * 20);
      }

      const days = ["Today", "Tomorrow", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const forecast = days.map((day, index) => {
        const forecastCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
        const forecastTempHigh = Math.floor(Math.random() * (35 - 15 + 1)) + 15;
        const forecastTempLow = forecastTempHigh - Math.floor(Math.random() * 10 + 5);
        return {
          day,
          icon: forecastCondition.icon,
          tempHigh: forecastTempHigh,
          tempLow: forecastTempLow,
          condition: forecastCondition.type,
          rain: Math.floor(Math.random() * 100)
        };
      });

      // Generate hourly data for chart
      const hours = [];
      for (let i = 0; i < 24; i++) {
        const hour = new Date();
        hour.setHours(i, 0, 0, 0);
        hours.push({
          time: hour.toLocaleTimeString('en-US', { hour: '2-digit', hour12: false }),
          temperature: randomTemp + (Math.random() - 0.5) * 8,
          humidity: randomHumidity + (Math.random() - 0.5) * 20,
          pressure: randomPressure + (Math.random() - 0.5) * 20
        });
      }

      const weatherData = {
        temperature: randomTemp,
        description: randomCondition.type,
        wind: `${randomWind} km/h`,
        humidity: `${randomHumidity}%`,
        pressure: `${randomPressure} hPa`,
        visibility: `${randomVisibility} km`,
        uvIndex: randomUvIndex,
        rain: `${rainChance}%`,
        icon: randomCondition.icon,
        color: randomCondition.color,
        forecast,
        feelsLike: randomTemp + (Math.random() - 0.5) * 5,
        dewPoint: randomTemp - 10 + Math.random() * 5,
        windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)]
      };

      setWeather(weatherData);
      setHourlyData(hours);
      setIsRaining(['Rainy', 'Stormy'].includes(randomCondition.type));
      setRainIntensity(randomCondition.type === "Rainy" ? Math.random() * 100 : 0);
    };

    generateWeatherData();

    const rainInterval = setInterval(() => {
      if (weather?.description === "Rainy" || weather?.description === "Stormy") {
        const intensityChange = (Math.random() - 0.5) * 20;
        setRainIntensity(prev => Math.max(0, Math.min(100, prev + intensityChange)));
        
        if (Math.random() < 0.1) {
          setIsRaining(prev => !prev);
        }
      }
    }, 2000);

    const weatherUpdateInterval = setInterval(generateWeatherData, 10 * 60 * 1000);

    return () => {
      clearInterval(rainInterval);
      clearInterval(weatherUpdateInterval);
    };
  }, [weather?.description]);

  if (!weather) return <div className="loading">Loading weather data...</div>;

  const getWeatherIcon = (condition) => {
    const iconProps = { size: 24 };
    switch (condition) {
      case "Clear": return <Sun {...iconProps} className="text-yellow-400" />;
      case "Partly Cloudy": return <CloudSun {...iconProps} className="text-yellow-300" />;
      case "Cloudy": return <Cloud {...iconProps} className="text-gray-400" />;
      case "Rainy": return <CloudRain {...iconProps} className="text-blue-400" />;
      case "Stormy": return <CloudRainWind {...iconProps} className="text-purple-400" />;
      case "Foggy": return <Cloud {...iconProps} className="text-gray-300" />;
      default: return <CloudSun {...iconProps} />;
    }
  };

  const getLargeWeatherIcon = (condition) => {
    const iconProps = { size: 80 };
    switch (condition) {
      case "Clear": return <Sun {...iconProps} className="text-yellow-400 animate-spin" style={{animationDuration: '20s'}} />;
      case "Partly Cloudy": return <CloudSun {...iconProps} className="text-yellow-300 animate-bounce" style={{animationDuration: '3s'}} />;
      case "Cloudy": return <Cloud {...iconProps} className="text-gray-400 animate-pulse" />;
      case "Rainy": return <CloudRain {...iconProps} className="text-blue-400 animate-bounce" style={{animationDuration: '2s'}} />;
      case "Stormy": return <CloudRainWind {...iconProps} className="text-purple-400 animate-pulse" />;
      case "Foggy": return <Cloud {...iconProps} className="text-gray-300 animate-pulse" style={{animationDuration: '4s'}} />;
      default: return <CloudSun {...iconProps} />;
    }
  };

  const getUvIndexColor = (index) => {
    if (index <= 2) return 'text-green-400';
    if (index <= 5) return 'text-yellow-400';
    if (index <= 7) return 'text-orange-400';
    if (index <= 10) return 'text-red-400';
    return 'text-purple-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <MapPin className="text-blue-400" size={32} />
            Weather Dashboard
          </h1>
          <p className="text-blue-200">Bhubaneswar, Odisha, India</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-full p-2 flex gap-2">
            {[
              { id: 'overview', label: 'Overview', icon: <Activity size={16} /> },
              { id: 'forecast', label: 'Forecast', icon: <Calendar size={16} /> },
              { id: 'charts', label: 'Charts', icon: <TrendingUp size={16} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'bg-white text-blue-900 shadow-lg' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Rain Animation */}
        {isRaining && (
          <div className="fixed inset-0 pointer-events-none z-10" style={{ opacity: rainIntensity / 150 }}>
            {[...Array(100)].map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 bg-blue-300"
                style={{
                  left: `${Math.random() * 100}%`,
                  height: `${Math.random() * 30 + 10}px`,
                  animationDelay: `${Math.random() * 2}s`,
                  animation: `fall ${0.5 + Math.random() * 0.5}s linear infinite`
                }}
              />
            ))}
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Weather Card */}
            <div className="lg:col-span-2 bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <CloudSun className="text-blue-400" size={24} />
                  <span className="text-white font-semibold text-lg">Current Weather</span>
                  <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                    LIVE
                  </span>
                </div>
                <div className="text-white/60 text-sm flex items-center gap-2">
                  <Clock size={16} />
                  {new Date().toLocaleTimeString()}
                </div>
              </div>

              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    {getLargeWeatherIcon(weather.description)}
                    {weather.description === 'Clear' && (
                      <div className="absolute inset-0 bg-yellow-400/20 rounded-full animate-ping" />
                    )}
                  </div>
                  <div>
                    <div className="text-6xl font-light text-white mb-2">
                      {weather.temperature}°C
                    </div>
                    <div className="text-xl text-blue-200 mb-1">{weather.description}</div>
                    <div className="text-sm text-white/60">
                      Feels like {Math.round(weather.feelsLike)}°C
                    </div>
                    {isRaining && (
                      <div className="text-sm text-blue-300 mt-2 animate-pulse">
                        Rain Intensity: {Math.round(rainIntensity)}%
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-white/80 text-sm mb-2">
                    <Sunrise className="inline mr-1" size={16} />
                    Sunrise: 6:23 AM
                  </div>
                  <div className="text-white/80 text-sm">
                    <Sunset className="inline mr-1" size={16} />
                    Sunset: 6:45 PM
                  </div>
                </div>
              </div>

              {/* Weather Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: <Wind size={20} />, label: 'Wind', value: weather.wind, extra: weather.windDirection },
                  { icon: <Droplets size={20} />, label: 'Humidity', value: weather.humidity },
                  { icon: <Gauge size={20} />, label: 'Pressure', value: weather.pressure },
                  { icon: <Eye size={20} />, label: 'Visibility', value: weather.visibility }
                ].map((item, index) => (
                  <div key={index} className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-blue-400">{item.icon}</div>
                      <span className="text-white/80 text-sm">{item.label}</span>
                    </div>
                    <div className="text-white font-semibold text-lg">
                      {item.value}
                      {item.extra && <span className="text-sm text-white/60 ml-1">{item.extra}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Side Info Cards */}
            <div className="space-y-6">
              {/* UV Index & Air Quality */}
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Sun size={20} className="text-yellow-400" />
                  UV Index & More
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">UV Index</span>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${getUvIndexColor(weather.uvIndex)}`}>
                        {weather.uvIndex}
                      </span>
                      <span className="text-white/60 text-sm">
                        {weather.uvIndex <= 2 ? 'Low' : weather.uvIndex <= 5 ? 'Moderate' : weather.uvIndex <= 7 ? 'High' : weather.uvIndex <= 10 ? 'Very High' : 'Extreme'}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Dew Point</span>
                    <span className="text-white font-semibold">{Math.round(weather.dewPoint)}°C</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Rain Chance</span>
                    <div className="flex items-center gap-2">
                      <CloudRain size={16} className="text-blue-400" />
                      <span className="text-white font-semibold">{weather.rain}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl">
                <h3 className="text-white font-semibold mb-4">Today's Highlights</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/80">Air Quality</span>
                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Good</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/80">Pollen Count</span>
                    <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">Medium</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/80">Fire Risk</span>
                    <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">Low</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Forecast Tab */}
        {activeTab === 'forecast' && (
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Calendar className="text-blue-400" />
              7-Day Forecast
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
              {weather.forecast.map((day, index) => (
                <div 
                  key={index} 
                  className={`bg-white/10 rounded-2xl p-4 border border-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-105 ${
                    index === 0 ? 'ring-2 ring-blue-400' : ''
                  }`}
                >
                  <div className="text-center">
                    <div className="text-white/80 font-medium mb-3">
                      {day.day}
                    </div>
                    <div className="mb-4 flex justify-center">
                      {getWeatherIcon(day.condition)}
                    </div>
                    <div className="text-white font-bold text-lg mb-1">
                      {day.tempHigh}°
                    </div>
                    <div className="text-white/60 text-sm mb-2">
                      {day.tempLow}°
                    </div>
                    <div className="text-white/70 text-xs mb-2">
                      {day.condition}
                    </div>
                    <div className="flex items-center justify-center gap-1 text-xs text-blue-300">
                      <CloudRain size={12} />
                      {day.rain}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Charts Tab */}
        {activeTab === 'charts' && (
          <div className="space-y-6">
            {/* Temperature Chart */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <TrendingUp className="text-blue-400" />
                24-Hour Temperature Trend
              </h2>
              
              <div className="h-80 relative">
                <svg className="w-full h-full" viewBox="0 0 800 300">
                  <defs>
                    <linearGradient id="tempGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8"/>
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1"/>
                    </linearGradient>
                  </defs>
                  
                  {/* Grid lines */}
                  {[0, 1, 2, 3, 4, 5].map(i => (
                    <line key={i} x1="50" y1={50 + i * 40} x2="750" y2={50 + i * 40} 
                          stroke="rgba(255,255,255,0.1)" strokeDasharray="3,3" />
                  ))}
                  
                  {/* Temperature curve */}
                  <path
                    d={hourlyData.map((point, index) => {
                      const x = 50 + (index * (700 / (hourlyData.length - 1)));
                      const y = 250 - ((point.temperature - 10) * 8);
                      return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
                    }).join(' ')}
                    stroke="#3b82f6"
                    strokeWidth="3"
                    fill="none"
                  />
                  
                  {/* Fill area under curve */}
                  <path
                    d={hourlyData.map((point, index) => {
                      const x = 50 + (index * (700 / (hourlyData.length - 1)));
                      const y = 250 - ((point.temperature - 10) * 8);
                      return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
                    }).join(' ') + ' L750,250 L50,250 Z'}
                    fill="url(#tempGradient)"
                  />
                  
                  {/* Data points */}
                  {hourlyData.map((point, index) => {
                    const x = 50 + (index * (700 / (hourlyData.length - 1)));
                    const y = 250 - ((point.temperature - 10) * 8);
                    return (
                      <g key={index}>
                        <circle cx={x} cy={y} r="4" fill="#3b82f6" stroke="white" strokeWidth="2"/>
                        {index % 4 === 0 && (
                          <>
                            <text x={x} y="280" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="12">
                              {point.time}
                            </text>
                            <text x={x} y={y - 10} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                              {Math.round(point.temperature)}°
                            </text>
                          </>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Humidity Chart */}
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Droplets className="text-blue-400" size={20} />
                  Humidity Levels
                </h3>
                <div className="h-64">
                  {/* Humidity Bar Chart */}
                  <div className="flex items-end justify-between h-full pt-8">
                    {hourlyData.slice(0, 12).map((point, index) => (
                      <div key={index} className="flex flex-col items-center flex-1 mx-1">
                        <div className="text-white text-xs mb-2 font-semibold">
                          {Math.round(point.humidity)}%
                        </div>
                        <div 
                          className="bg-gradient-to-t from-green-500 to-green-300 rounded-t-md w-full transition-all duration-1000 ease-out"
                          style={{ 
                            height: `${(point.humidity / 100) * 180}px`,
                            animationDelay: `${index * 100}ms`
                          }}
                        />
                        <div className="text-white/60 text-xs mt-2 rotate-45 origin-bottom-left">
                          {point.time}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pressure Chart */}
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Gauge className="text-yellow-400" size={20} />
                  Pressure Changes
                </h3>
                <div className="h-64 relative">
                  {/* Circular Progress for Current Pressure */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-40 h-40">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="#f59e0b"
                          strokeWidth="8"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 40}`}
                          strokeDashoffset={`${2 * Math.PI * 40 * (1 - (weather.pressure.replace(' hPa', '') - 980) / 60)}`}
                          className="transition-all duration-2000 ease-out"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                        <div className="text-2xl font-bold">{weather.pressure.replace(' hPa', '')}</div>
                        <div className="text-xs text-white/60">hPa</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Pressure trend indicators */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex justify-between text-xs text-white/60">
                      <span>Low (980)</span>
                      <span>Normal (1013)</span>
                      <span>High (1040)</span>
                    </div>
                    <div className="mt-2 h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full opacity-60"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Wind Direction Compass */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Navigation className="text-green-400" size={20} />
                Wind Direction & Speed
              </h3>
              
              <div className="flex items-center justify-center">
                <div className="relative w-64 h-64">
                  {/* Compass */}
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    {/* Compass circle */}
                    <circle cx="100" cy="100" r="80" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" />
                    <circle cx="100" cy="100" r="60" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" />
                    <circle cx="100" cy="100" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" />
                    
                    {/* Compass directions */}
                    {['N', 'E', 'S', 'W'].map((dir, index) => {
                      const angle = index * 90;
                      const x = 100 + 70 * Math.cos((angle - 90) * Math.PI / 180);
                      const y = 100 + 70 * Math.sin((angle - 90) * Math.PI / 180);
                      return (
                        <text key={dir} x={x} y={y + 5} textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
                          {dir}
                        </text>
                      );
                    })}
                    
                    {/* Wind direction arrow */}
                    <g className="animate-pulse">
                      <path
                        d="M100,100 L100,40 L110,55 M100,40 L90,55"
                        stroke="#22c55e"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        transform={`rotate(${['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'].indexOf(weather.windDirection) * 45} 100 100)`}
                      />
                      <circle cx="100" cy="100" r="5" fill="#22c55e" />
                    </g>
                  </svg>
                  
                  {/* Wind speed display */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <div className="text-3xl font-bold mb-1">{weather.wind.replace(' km/h', '')}</div>
                    <div className="text-sm text-white/60 mb-1">km/h</div>
                    <div className="text-xs text-green-400 font-semibold">{weather.windDirection}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fall {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
        
        .loading {
          @apply flex items-center justify-center h-64 text-white text-xl;
        }
        
        .animate-spin {
          animation: spin 20s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default WeatherWidget;
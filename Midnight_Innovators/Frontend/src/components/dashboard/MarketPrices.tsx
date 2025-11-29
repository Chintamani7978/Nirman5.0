import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, Search, Filter, MapPin, Calendar, 
  DollarSign, Wheat, Apple, Carrot, Leaf, BarChart3, RefreshCw,
  ArrowUpCircle, ArrowDownCircle, MinusCircle, Star, Bell,
  Globe, Users, Package, Clock, AlertTriangle
} from 'lucide-react';

const MarketPrices = () => {
  const [prices, setPrices] = useState([]);
  const [selectedState, setSelectedState] = useState('All India');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isLoading, setIsLoading] = useState(false);

  // Comprehensive market data for all Indian states
  const marketData = {
    'All India': [
      { name: 'Rice (Swarna)', price: 2150, prevPrice: 2100, category: 'Cereals', unit: 'Qt', state: 'All India', trending: 'up', volume: '12,450 MT', market: 'APMC Delhi' },
      { name: 'Wheat (PBW-343)', price: 2280, prevPrice: 2320, category: 'Cereals', unit: 'Qt', state: 'All India', trending: 'down', volume: '18,650 MT', market: 'APMC Mumbai' },
      { name: 'Maize', price: 1980, prevPrice: 1950, category: 'Cereals', unit: 'Qt', state: 'All India', trending: 'up', volume: '8,750 MT', market: 'APMC Bangalore' },
      { name: 'Bajra', price: 2200, prevPrice: 2180, category: 'Cereals', unit: 'Qt', state: 'All India', trending: 'up', volume: '5,420 MT', market: 'APMC Jodhpur' },
      { name: 'Jowar', price: 3150, prevPrice: 3200, category: 'Cereals', unit: 'Qt', state: 'All India', trending: 'down', volume: '3,240 MT', market: 'APMC Pune' },
      
      { name: 'Tur/Arhar', price: 6800, prevPrice: 6750, category: 'Pulses', unit: 'Qt', state: 'All India', trending: 'up', volume: '2,150 MT', market: 'APMC Indore' },
      { name: 'Moong', price: 7200, prevPrice: 7350, category: 'Pulses', unit: 'Qt', state: 'All India', trending: 'down', volume: '1,890 MT', market: 'APMC Jaipur' },
      { name: 'Urad', price: 6900, prevPrice: 6850, category: 'Pulses', unit: 'Qt', state: 'All India', trending: 'up', volume: '1,650 MT', market: 'APMC Kota' },
      { name: 'Masoor', price: 5400, prevPrice: 5450, category: 'Pulses', unit: 'Qt', state: 'All India', trending: 'down', volume: '2,780 MT', market: 'APMC Kanpur' },
      { name: 'Gram', price: 4800, prevPrice: 4750, category: 'Pulses', unit: 'Qt', state: 'All India', trending: 'up', volume: '4,120 MT', market: 'APMC Bhopal' },
      
      { name: 'Groundnut', price: 5750, prevPrice: 5700, category: 'Oilseeds', unit: 'Qt', state: 'All India', trending: 'up', volume: '6,450 MT', market: 'APMC Rajkot' },
      { name: 'Mustard', price: 5200, prevPrice: 5250, category: 'Oilseeds', unit: 'Qt', state: 'All India', trending: 'down', volume: '3,890 MT', market: 'APMC Bharatpur' },
      { name: 'Sunflower', price: 5850, prevPrice: 5800, category: 'Oilseeds', unit: 'Qt', state: 'All India', trending: 'up', volume: '2,340 MT', market: 'APMC Gulbarga' },
      { name: 'Soybean', price: 4200, prevPrice: 4180, category: 'Oilseeds', unit: 'Qt', state: 'All India', trending: 'up', volume: '8,750 MT', market: 'APMC Indore' },
      { name: 'Sesame', price: 12500, prevPrice: 12400, category: 'Oilseeds', unit: 'Qt', state: 'All India', trending: 'up', volume: '890 MT', market: 'APMC Madurai' },
      
      { name: 'Cotton (Medium Staple)', price: 6200, prevPrice: 6150, category: 'Cash Crops', unit: 'Qt', state: 'All India', trending: 'up', volume: '5,670 MT', market: 'APMC Akola' },
      { name: 'Sugarcane', price: 350, prevPrice: 345, category: 'Cash Crops', unit: 'Qt', state: 'All India', trending: 'up', volume: '45,230 MT', market: 'APMC Meerut' },
      { name: 'Jute', price: 4800, prevPrice: 4750, category: 'Cash Crops', unit: 'Qt', state: 'All India', trending: 'up', volume: '1,230 MT', market: 'APMC Kolkata' },
      
      { name: 'Turmeric (Salem)', price: 8400, prevPrice: 8200, category: 'Spices', unit: 'Qt', state: 'All India', trending: 'up', volume: '1,450 MT', market: 'APMC Salem' },
      { name: 'Coriander', price: 7800, prevPrice: 7900, category: 'Spices', unit: 'Qt', state: 'All India', trending: 'down', volume: '890 MT', market: 'APMC Kota' },
      { name: 'Cumin', price: 24500, prevPrice: 24200, category: 'Spices', unit: 'Qt', state: 'All India', trending: 'up', volume: '560 MT', market: 'APMC Unjha' },
      { name: 'Black Pepper', price: 45000, prevPrice: 44500, category: 'Spices', unit: 'Qt', state: 'All India', trending: 'up', volume: '120 MT', market: 'APMC Kochi' },
      { name: 'Cardamom', price: 120000, prevPrice: 118000, category: 'Spices', unit: 'Qt', state: 'All India', trending: 'up', volume: '45 MT', market: 'APMC Bodinayakanur' },
      
      { name: 'Onion', price: 1200, prevPrice: 1350, category: 'Vegetables', unit: 'Qt', state: 'All India', trending: 'down', volume: '15,670 MT', market: 'APMC Lasalgaon' },
      { name: 'Potato', price: 800, prevPrice: 750, category: 'Vegetables', unit: 'Qt', state: 'All India', trending: 'up', volume: '28,450 MT', market: 'APMC Agra' },
      { name: 'Tomato', price: 2200, prevPrice: 2500, category: 'Vegetables', unit: 'Qt', state: 'All India', trending: 'down', volume: '12,340 MT', market: 'APMC Chennai' },
      { name: 'Cabbage', price: 900, prevPrice: 850, category: 'Vegetables', unit: 'Qt', state: 'All India', trending: 'up', volume: '8,920 MT', market: 'APMC Pune' },
      
      { name: 'Apple (Delicious)', price: 8500, prevPrice: 8200, category: 'Fruits', unit: 'Qt', state: 'All India', trending: 'up', volume: '3,450 MT', market: 'APMC Shimla' },
      { name: 'Banana', price: 1800, prevPrice: 1750, category: 'Fruits', unit: 'Qt', state: 'All India', trending: 'up', volume: '18,670 MT', market: 'APMC Madurai' },
      { name: 'Orange', price: 3200, prevPrice: 3150, category: 'Fruits', unit: 'Qt', state: 'All India', trending: 'up', volume: '9,840 MT', market: 'APMC Nagpur' },
      { name: 'Grapes', price: 4500, prevPrice: 4600, category: 'Fruits', unit: 'Qt', state: 'All India', trending: 'down', volume: '6,720 MT', market: 'APMC Nashik' }
    ],
    'Andhra Pradesh': [
      { name: 'Rice (BPT-5204)', price: 2180, prevPrice: 2120, category: 'Cereals', unit: 'Qt', state: 'Andhra Pradesh', trending: 'up', volume: '8,450 MT', market: 'APMC Vijayawada' },
      { name: 'Cotton (DCH-32)', price: 6350, prevPrice: 6280, category: 'Cash Crops', unit: 'Qt', state: 'Andhra Pradesh', trending: 'up', volume: '4,230 MT', market: 'APMC Guntur' },
      { name: 'Chilli (Teja)', price: 15600, prevPrice: 15200, category: 'Spices', unit: 'Qt', state: 'Andhra Pradesh', trending: 'up', volume: '1,890 MT', market: 'APMC Guntur' },
      { name: 'Turmeric (Rajapuri)', price: 9200, prevPrice: 8900, category: 'Spices', unit: 'Qt', state: 'Andhra Pradesh', trending: 'up', volume: '2,340 MT', market: 'APMC Erode' }
    ],
    'Tamil Nadu': [
      { name: 'Rice (CR-1009)', price: 2200, prevPrice: 2150, category: 'Cereals', unit: 'Qt', state: 'Tamil Nadu', trending: 'up', volume: '9,670 MT', market: 'APMC Thanjavur' },
      { name: 'Sugarcane', price: 380, prevPrice: 370, category: 'Cash Crops', unit: 'Qt', state: 'Tamil Nadu', trending: 'up', volume: '35,450 MT', market: 'APMC Erode' },
      { name: 'Coconut', price: 2800, prevPrice: 2750, category: 'Plantation', unit: '100 nuts', state: 'Tamil Nadu', trending: 'up', volume: '45,670 nuts', market: 'APMC Coimbatore' },
      { name: 'Banana (Robusta)', price: 1650, prevPrice: 1600, category: 'Fruits', unit: 'Qt', state: 'Tamil Nadu', trending: 'up', volume: '12,340 MT', market: 'APMC Madurai' }
    ],
    'Karnataka': [
      { name: 'Coffee (Arabica)', price: 35000, prevPrice: 34500, category: 'Plantation', unit: 'Qt', state: 'Karnataka', trending: 'up', volume: '450 MT', market: 'APMC Hassan' },
      { name: 'Ragi', price: 2800, prevPrice: 2750, category: 'Cereals', unit: 'Qt', state: 'Karnataka', trending: 'up', volume: '3,450 MT', market: 'APMC Bangalore' },
      { name: 'Arecanut', price: 45000, prevPrice: 44000, category: 'Plantation', unit: 'Qt', state: 'Karnataka', trending: 'up', volume: '890 MT', market: 'APMC Mangalore' },
      { name: 'Sunflower', price: 5900, prevPrice: 5850, category: 'Oilseeds', unit: 'Qt', state: 'Karnataka', trending: 'up', volume: '2,780 MT', market: 'APMC Davangere' }
    ],
    'Maharashtra': [
      { name: 'Onion', price: 1180, prevPrice: 1320, category: 'Vegetables', unit: 'Qt', state: 'Maharashtra', trending: 'down', volume: '18,450 MT', market: 'APMC Lasalgaon' },
      { name: 'Cotton (Shankar-6)', price: 6180, prevPrice: 6120, category: 'Cash Crops', unit: 'Qt', state: 'Maharashtra', trending: 'up', volume: '6,780 MT', market: 'APMC Akola' },
      { name: 'Soybean', price: 4150, prevPrice: 4100, category: 'Oilseeds', unit: 'Qt', state: 'Maharashtra', trending: 'up', volume: '12,340 MT', market: 'APMC Latur' },
      { name: 'Grapes (Thompson)', price: 4200, prevPrice: 4300, category: 'Fruits', unit: 'Qt', state: 'Maharashtra', trending: 'down', volume: '8,920 MT', market: 'APMC Nashik' }
    ],
    'Punjab': [
      { name: 'Wheat (HD-2967)', price: 2320, prevPrice: 2280, category: 'Cereals', unit: 'Qt', state: 'Punjab', trending: 'up', volume: '25,670 MT', market: 'APMC Ludhiana' },
      { name: 'Rice (PR-121)', price: 2250, prevPrice: 2200, category: 'Cereals', unit: 'Qt', state: 'Punjab', trending: 'up', volume: '18,450 MT', market: 'APMC Amritsar' },
      { name: 'Mustard', price: 5280, prevPrice: 5320, category: 'Oilseeds', unit: 'Qt', state: 'Punjab', trending: 'down', volume: '4,560 MT', market: 'APMC Bathinda' },
      { name: 'Potato', price: 750, prevPrice: 700, category: 'Vegetables', unit: 'Qt', state: 'Punjab', trending: 'up', volume: '15,230 MT', market: 'APMC Jalandhar' }
    ],
    'Haryana': [
      { name: 'Wheat (WH-542)', price: 2300, prevPrice: 2260, category: 'Cereals', unit: 'Qt', state: 'Haryana', trending: 'up', volume: '22,340 MT', market: 'APMC Karnal' },
      { name: 'Mustard', price: 5250, prevPrice: 5300, category: 'Oilseeds', unit: 'Qt', state: 'Haryana', trending: 'down', volume: '5,670 MT', market: 'APMC Hisar' },
      { name: 'Bajra', price: 2180, prevPrice: 2150, category: 'Cereals', unit: 'Qt', state: 'Haryana', trending: 'up', volume: '6,890 MT', market: 'APMC Rohtak' },
      { name: 'Gram', price: 4750, prevPrice: 4700, category: 'Pulses', unit: 'Qt', state: 'Haryana', trending: 'up', volume: '3,450 MT', market: 'APMC Bhiwani' }
    ],
    'Uttar Pradesh': [
      { name: 'Wheat (UP-2628)', price: 2280, prevPrice: 2240, category: 'Cereals', unit: 'Qt', state: 'Uttar Pradesh', trending: 'up', volume: '32,450 MT', market: 'APMC Meerut' },
      { name: 'Sugarcane', price: 340, prevPrice: 335, category: 'Cash Crops', unit: 'Qt', state: 'Uttar Pradesh', trending: 'up', volume: '56,780 MT', market: 'APMC Muzaffarnagar' },
      { name: 'Potato', price: 820, prevPrice: 780, category: 'Vegetables', unit: 'Qt', state: 'Uttar Pradesh', trending: 'up', volume: '45,670 MT', market: 'APMC Agra' },
      { name: 'Mentha Oil', price: 95000, prevPrice: 93000, category: 'Essential Oils', unit: 'Qt', state: 'Uttar Pradesh', trending: 'up', volume: '125 MT', market: 'APMC Chandausi' }
    ],
    'West Bengal': [
      { name: 'Rice (IET-4094)', price: 2120, prevPrice: 2080, category: 'Cereals', unit: 'Qt', state: 'West Bengal', trending: 'up', volume: '15,670 MT', market: 'APMC Kolkata' },
      { name: 'Jute (Capsularis)', price: 4850, prevPrice: 4800, category: 'Cash Crops', unit: 'Qt', state: 'West Bengal', trending: 'up', volume: '2,340 MT', market: 'APMC Coochbehar' },
      { name: 'Potato', price: 780, prevPrice: 720, category: 'Vegetables', unit: 'Qt', state: 'West Bengal', trending: 'up', volume: '18,920 MT', market: 'APMC Hooghly' },
      { name: 'Fish (Rohu)', price: 18000, prevPrice: 17500, category: 'Aquaculture', unit: 'Qt', state: 'West Bengal', trending: 'up', volume: '890 MT', market: 'Fish Market Kolkata' }
    ],
    'Rajasthan': [
      { name: 'Bajra', price: 2250, prevPrice: 2200, category: 'Cereals', unit: 'Qt', state: 'Rajasthan', trending: 'up', volume: '8,450 MT', market: 'APMC Jodhpur' },
      { name: 'Mustard', price: 5200, prevPrice: 5250, category: 'Oilseeds', unit: 'Qt', state: 'Rajasthan', trending: 'down', volume: '6,780 MT', market: 'APMC Bharatpur' },
      { name: 'Cumin', price: 24800, prevPrice: 24500, category: 'Spices', unit: 'Qt', state: 'Rajasthan', trending: 'up', volume: '670 MT', market: 'APMC Unjha' },
      { name: 'Guar Seed', price: 4200, prevPrice: 4100, category: 'Oilseeds', unit: 'Qt', state: 'Rajasthan', trending: 'up', volume: '3,450 MT', market: 'APMC Bikaner' }
    ],
    'Gujarat': [
      { name: 'Cotton (G-Cot 25)', price: 6250, prevPrice: 6180, category: 'Cash Crops', unit: 'Qt', state: 'Gujarat', trending: 'up', volume: '8,920 MT', market: 'APMC Ahmedabad' },
      { name: 'Groundnut (GG-20)', price: 5800, prevPrice: 5750, category: 'Oilseeds', unit: 'Qt', state: 'Gujarat', trending: 'up', volume: '12,340 MT', market: 'APMC Rajkot' },
      { name: 'Castor Seed', price: 5400, prevPrice: 5350, category: 'Oilseeds', unit: 'Qt', state: 'Gujarat', trending: 'up', volume: '4,560 MT', market: 'APMC Deesa' },
      { name: 'Fennel', price: 16500, prevPrice: 16200, category: 'Spices', unit: 'Qt', state: 'Gujarat', trending: 'up', volume: '890 MT', market: 'APMC Unjha' }
    ]
  };

  const states = Object.keys(marketData);
  const categories = ['All', 'Cereals', 'Pulses', 'Oilseeds', 'Cash Crops', 'Spices', 'Vegetables', 'Fruits', 'Plantation', 'Essential Oils', 'Aquaculture'];

  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      let filteredData = marketData[selectedState] || [];
      
      // Filter by category
      if (selectedCategory !== 'All') {
        filteredData = filteredData.filter(item => item.category === selectedCategory);
      }
      
      // Filter by search term
      if (searchTerm) {
        filteredData = filteredData.filter(item =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.market.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Sort data
      filteredData.sort((a, b) => {
        let aValue, bValue;
        switch (sortBy) {
          case 'price':
            aValue = a.price;
            bValue = b.price;
            break;
          case 'change':
            aValue = ((a.price - a.prevPrice) / a.prevPrice) * 100;
            bValue = ((b.price - b.prevPrice) / b.prevPrice) * 100;
            break;
          default:
            aValue = a.name;
            bValue = b.name;
        }
        
        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
      
      setPrices(filteredData);
      setIsLoading(false);
    }, 500);
  }, [selectedState, selectedCategory, searchTerm, sortBy, sortOrder]);

  const getTrendIcon = (item) => {
    const change = ((item.price - item.prevPrice) / item.prevPrice) * 100;
    if (change > 0) return <ArrowUpCircle className="text-green-500" size={16} />;
    if (change < 0) return <ArrowDownCircle className="text-red-500" size={16} />;
    return <MinusCircle className="text-gray-500" size={16} />;
  };

  const getTrendColor = (item) => {
    const change = ((item.price - item.prevPrice) / item.prevPrice) * 100;
    if (change > 0) return 'text-green-500';
    if (change < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  const getChangePercentage = (item) => {
    return (((item.price - item.prevPrice) / item.prevPrice) * 100).toFixed(2);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Cereals': return <Wheat className="text-yellow-500" size={16} />;
      case 'Pulses': return <Package className="text-green-500" size={16} />;
      case 'Oilseeds': return <Leaf className="text-blue-500" size={16} />;
      case 'Vegetables': return <Carrot className="text-orange-500" size={16} />;
      case 'Fruits': return <Apple className="text-red-500" size={16} />;
      case 'Spices': return <Star className="text-purple-500" size={16} />;
      case 'Cash Crops': return <DollarSign className="text-green-600" size={16} />;
      default: return <Package className="text-gray-500" size={16} />;
    }
  };

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      // Simulate fresh data fetch
      setIsLoading(false);
    }, 1000);
  };

  const topGainers = prices.filter(item => item.price > item.prevPrice).slice(0, 3);
  const topLosers = prices.filter(item => item.price < item.prevPrice).slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6 border border-green-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-2xl">
                <BarChart3 className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Market Prices Dashboard</h1>
                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  <Clock size={16} />
                  Last updated: {new Date().toLocaleString('en-IN')}
                  <button onClick={refreshData} className="ml-2 text-blue-500 hover:text-blue-700">
                    <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                  </button>
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-700 font-semibold text-sm">LIVE PRICES</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { title: 'Total Commodities', value: prices.length, icon: <Package />, color: 'blue' },
            { title: 'Markets Active', value: '1,247', icon: <Globe />, color: 'green' },
            { title: 'Daily Volume', value: '2.4M MT', icon: <BarChart3 />, color: 'purple' },
            { title: 'Active Traders', value: '45,672', icon: <Users />, color: 'orange' }
          ].map((stat, index) => (
            <div key={index} className={`bg-white rounded-2xl shadow-md p-4 border-l-4 border-${stat.color}-500 hover:shadow-lg transition-all duration-300`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.title}</p>
                  <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                </div>
                <div className={`p-2 bg-${stat.color}-100 rounded-xl text-${stat.color}-600`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Top Gainers & Losers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="text-green-500" />
              Top Gainers Today
            </h3>
            <div className="space-y-3">
              {topGainers.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    {getCategoryIcon(item.category)}
                    <div>
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.market}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">₹{item.price.toLocaleString()}</p>
                    <p className="text-green-600 text-sm font-semibold">+{getChangePercentage(item)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-red-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingDown className="text-red-500" />
              Top Losers Today
            </h3>
            <div className="space-y-3">
              {topLosers.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    {getCategoryIcon(item.category)}
                    <div>
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.market}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">₹{item.price.toLocaleString()}</p>
                    <p className="text-red-600 text-sm font-semibold">{getChangePercentage(item)}%</p>
                  </div>
                </div>
              ))}
              {topLosers.length === 0 && (
                <p className="text-gray-500 text-center py-4">No commodities in loss today</p>
              )}
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* State Filter */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <MapPin size={16} className="text-blue-500" />
                State/Region
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Filter size={16} className="text-green-500" />
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Search size={16} className="text-purple-500" />
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search commodities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="change">% Change</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Order</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Data Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="p-6 bg-gradient-to-r from-blue-50 to-green-50 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <DollarSign className="text-green-500" />
                Market Prices - {selectedState}
                {selectedCategory !== 'All' && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {selectedCategory}
                  </span>
                )}
              </h2>
              <div className="flex items-center gap-2 text-gray-600">
                <AlertTriangle size={16} />
                <span className="text-sm">Prices are indicative and may vary across markets</span>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">Loading market data...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Commodity</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Current Price</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Previous Price</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Change</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Volume</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Market</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {prices.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {getCategoryIcon(item.category)}
                          <div>
                            <p className="font-semibold text-gray-800">{item.name}</p>
                            <p className="text-sm text-gray-600">{item.state}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="font-bold text-lg text-gray-800">₹{item.price.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">per {item.unit}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="font-semibold text-gray-600">₹{item.prevPrice.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">per {item.unit}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {getTrendIcon(item)}
                          <span className={`font-semibold ${getTrendColor(item)}`}>
                            {getChangePercentage(item)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="font-semibold text-gray-700">{item.volume}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700">{item.market}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                            <Bell size={16} />
                          </button>
                          <button className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors duration-200">
                            <Star size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {prices.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <Package size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">No commodities found</p>
                  <p className="text-gray-400 text-sm">Try adjusting your filters</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Market Insights */}
        <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart3 className="text-blue-500" />
            Market Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <h4 className="font-semibold text-blue-800 mb-2">Market Trend</h4>
              <p className="text-sm text-blue-700">
                {topGainers.length > topLosers.length 
                  ? 'Most commodities are showing positive trends today with strong demand across multiple sectors.'
                  : 'Mixed market sentiment with balanced price movements across different commodity categories.'}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
              <h4 className="font-semibold text-green-800 mb-2">High Volume</h4>
              <p className="text-sm text-green-700">
                Cereals and cash crops are witnessing high trading volumes, indicating strong seasonal demand and good farmer participation.
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
              <h4 className="font-semibold text-orange-800 mb-2">Price Alert</h4>
              <p className="text-sm text-orange-700">
                Spices like cardamom and black pepper showing significant price volatility. Traders advised to monitor closely.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Information */}
        <div className="mt-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Data Sources</h4>
              <ul className="space-y-1">
                <li>• APMC Markets</li>
                <li>• State Agricultural Boards</li>
                <li>• Commodity Exchanges</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Update Frequency</h4>
              <ul className="space-y-1">
                <li>• Real-time during market hours</li>
                <li>• Daily closing prices</li>
                <li>• Weekly trend analysis</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Coverage</h4>
              <ul className="space-y-1">
                <li>• 28 States & 8 UTs</li>
                <li>• 1,200+ Markets</li>
                <li>• 200+ Commodities</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Disclaimer</h4>
              <p className="text-xs">
                Prices are indicative and may vary across different markets and quality grades. 
                Please verify with local markets before making trading decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPrices;
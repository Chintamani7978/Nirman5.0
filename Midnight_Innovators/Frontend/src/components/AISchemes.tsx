import React, { useState, useEffect } from 'react';
import { 
  Brain, Calculator, Star, MapPin, Calendar, DollarSign, Users, 
  CheckCircle, Clock, ArrowRight, Filter, Search, BookOpen,
  Award, Shield, Leaf, Tractor, Home, Briefcase, Heart,
  Phone, Mail, ExternalLink, Download, Bell, TrendingUp,
  Target, FileText, HelpCircle, Zap, Globe, BadgeCheck
} from 'lucide-react';

const AISchemes = ({ currentUser }) => {
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showDetails, setShowDetails] = useState(null);

  // Comprehensive schemes data
  const schemesData = [
    // Central Government Schemes
    {
      id: 1,
      name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
      category: 'Income Support',
      type: 'Government',
      provider: 'Ministry of Agriculture & Farmers Welfare',
      amount: '₹6,000 per year',
      description: 'Direct income support to small and marginal farmer families holding cultivable land up to 2 hectares.',
      eligibility: ['Small & marginal farmers', 'Land holding up to 2 hectares', 'Indian citizen'],
      documents: ['Land records', 'Aadhaar card', 'Bank account details'],
      benefits: ['₹2,000 in 3 installments', 'Direct bank transfer', 'No middleman'],
      applicationProcess: 'Online through PM-KISAN portal or CSC centers',
      image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=250&fit=crop',
      rating: 4.8,
      applicants: '11+ Crore',
      status: 'Active',
      deadline: 'Open throughout year',
      matchScore: 98,
      features: ['Direct Transfer', 'No Collateral', 'Quick Processing'],
      contact: {
        phone: '155261',
        email: 'pmkisan-ict@gov.in',
        website: 'https://pmkisan.gov.in'
      }
    },
    {
      id: 2,
      name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      category: 'Insurance',
      type: 'Government',
      provider: 'Ministry of Agriculture & Farmers Welfare',
      amount: 'Up to ₹2 Lakh coverage',
      description: 'Comprehensive crop insurance scheme providing financial protection against crop loss due to natural calamities.',
      eligibility: ['All farmers', 'Sharecroppers & tenant farmers', 'Notified crops only'],
      documents: ['Land records', 'Sowing certificate', 'Aadhaar card', 'Bank details'],
      benefits: ['Low premium rates', 'Quick claim settlement', 'Coverage for all stages'],
      applicationProcess: 'Through banks, CSCs, or online portal',
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop',
      rating: 4.5,
      applicants: '5.5+ Crore',
      status: 'Active',
      deadline: 'Crop season based',
      matchScore: 92,
      features: ['Weather Protection', 'Technology Integration', 'Satellite Monitoring'],
      contact: {
        phone: '18001801551',
        email: 'support@pmfby.gov.in',
        website: 'https://pmfby.gov.in'
      }
    },
    {
      id: 3,
      name: 'Kisan Credit Card (KCC)',
      category: 'Credit',
      type: 'Government',
      provider: 'Ministry of Agriculture & Farmers Welfare',
      amount: 'Up to ₹3 Lakh (without collateral)',
      description: 'Flexible credit facility for farmers to meet their production credit needs for crops, livestock, and fisheries.',
      eligibility: ['Individual farmers', 'Self-help groups', 'Joint liability groups'],
      documents: ['Identity proof', 'Address proof', 'Land documents', 'Income proof'],
      benefits: ['Flexible repayment', 'Low interest rates', 'No processing fee'],
      applicationProcess: 'Apply through any bank branch or online',
      image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=250&fit=crop',
      rating: 4.6,
      applicants: '7+ Crore',
      status: 'Active',
      deadline: 'Open throughout year',
      matchScore: 89,
      features: ['Easy Access', 'Multi-purpose', 'Renewable'],
      contact: {
        phone: '1800118001',
        email: 'kcc@nabard.org',
        website: 'https://www.nabard.org/kcc.aspx'
      }
    },
    {
      id: 4,
      name: 'PM Kisan Maandhan Yojana',
      category: 'Pension',
      type: 'Government',
      provider: 'Ministry of Agriculture & Farmers Welfare',
      amount: '₹3,000 per month after 60 years',
      description: 'Old age pension scheme for small and marginal farmers ensuring social security in old age.',
      eligibility: ['Age 18-40 years', 'Small & marginal farmers', 'Cultivable land up to 2 hectares'],
      documents: ['Aadhaar card', 'Savings bank account', 'Land records'],
      benefits: ['Guaranteed pension', 'Family pension on death', 'Government contribution'],
      applicationProcess: 'Through CSCs or online registration',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=250&fit=crop',
      rating: 4.4,
      applicants: '23+ Lakh',
      status: 'Active',
      deadline: 'Open throughout year',
      matchScore: 85,
      features: ['Guaranteed Returns', 'Government Backed', 'Voluntary Contribution'],
      contact: {
        phone: '18001801551',
        email: 'info@pmkmy.gov.in',
        website: 'https://pmkmy.gov.in'
      }
    },
    {
      id: 5,
      name: 'Pradhan Mantri Kisan Mitra Urja Yojana',
      category: 'Subsidy',
      type: 'Government',
      provider: 'Ministry of New & Renewable Energy',
      amount: 'Up to 60% subsidy',
      description: 'Solar pump subsidy scheme for farmers to reduce electricity costs and increase farm productivity.',
      eligibility: ['Individual farmers', 'Water user associations', 'Community farming'],
      documents: ['Land documents', 'Electricity connection proof', 'Bank details'],
      benefits: ['60% central subsidy', '30% state subsidy', 'Reduced electricity cost'],
      applicationProcess: 'State nodal agencies or online portal',
      image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400&h=250&fit=crop',
      rating: 4.7,
      applicants: '3+ Lakh',
      status: 'Active',
      deadline: 'Budget allocation based',
      matchScore: 87,
      features: ['Clean Energy', 'Cost Effective', 'Environment Friendly'],
      contact: {
        phone: '18001803333',
        email: 'kusum@mnre.gov.in',
        website: 'https://pmkusum.mnre.gov.in'
      }
    },
    {
      id: 6,
      name: 'National Mission on Edible Oils - Oil Palm',
      category: 'Production',
      type: 'Government',
      provider: 'Ministry of Agriculture & Farmers Welfare',
      amount: '₹29,000 per hectare',
      description: 'Promoting oil palm cultivation to reduce edible oil imports and increase farmers income.',
      eligibility: ['Farmers in suitable agro-climatic zones', 'Minimum 5 hectare area', 'Assured irrigation'],
      documents: ['Land documents', 'Water source certificate', 'Soil test report'],
      benefits: ['High plantation subsidy', 'Maintenance support', 'Buyback guarantee'],
      applicationProcess: 'Through state implementing agencies',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=250&fit=crop',
      rating: 4.3,
      applicants: '50,000+',
      status: 'Active',
      deadline: 'Plantation season based',
      matchScore: 78,
      features: ['High Returns', 'Assured Market', 'Long-term Crop'],
      contact: {
        phone: '18001234567',
        email: 'oilpalm@gov.in',
        website: 'https://nmeo.dac.gov.in'
      }
    },

    // State Government Schemes
    {
      id: 7,
      name: 'Rythu Bandhu (Telangana)',
      category: 'Income Support',
      type: 'Government',
      provider: 'Government of Telangana',
      amount: '₹10,000 per acre per year',
      description: 'Investment support scheme for farmers in Telangana providing financial assistance for cultivation.',
      eligibility: ['Farmers in Telangana', 'Owned agricultural land', 'Valid land records'],
      documents: ['Land records (Pahani)', 'Aadhaar card', 'Bank account'],
      benefits: ['₹5,000 per season', 'Direct bank transfer', '100% state funding'],
      applicationProcess: 'Automatic enrollment through village revenue officials',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop',
      rating: 4.9,
      applicants: '58+ Lakh',
      status: 'Active',
      deadline: 'Kharif & Rabi seasons',
      matchScore: 94,
      features: ['No Application Required', 'Universal Coverage', 'Timely Payment'],
      contact: {
        phone: '18004258080',
        email: 'rythubandhu@telangana.gov.in',
        website: 'https://rythubandhu.telangana.gov.in'
      }
    },
    {
      id: 8,
      name: 'Bhavantar Bhugtan Yojana (Madhya Pradesh)',
      category: 'Price Support',
      type: 'Government',
      provider: 'Government of Madhya Pradesh',
      amount: 'Difference between MSP and market price',
      description: 'Price deficiency payment scheme ensuring farmers get MSP for their produce.',
      eligibility: ['Farmers in MP', 'Registered on e-Uparjan portal', 'Notified crops only'],
      documents: ['Registration on portal', 'Sale receipt', 'Land documents'],
      benefits: ['Price protection', 'Market freedom', 'Quick payment'],
      applicationProcess: 'Registration on e-Uparajan portal',
      image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400&h=250&fit=crop',
      rating: 4.2,
      applicants: '20+ Lakh',
      status: 'Active',
      deadline: 'Crop season based',
      matchScore: 82,
      features: ['Market Flexibility', 'Price Guarantee', 'Digital Platform'],
      contact: {
        phone: '18002334035',
        email: 'bby@mp.gov.in',
        website: 'https://mpeuparjan.nic.in'
      }
    },

    // Private Sector Schemes
    {
      id: 9,
      name: 'HDFC Bank Agri Loan',
      category: 'Credit',
      type: 'Private',
      provider: 'HDFC Bank',
      amount: 'Up to ₹50 Lakh',
      description: 'Comprehensive agricultural financing solution for farmers with flexible repayment options.',
      eligibility: ['Individual farmers', 'Agri businesses', 'Minimum 2 years farming experience'],
      documents: ['Income proof', 'Land documents', 'Identity proof', 'Bank statements'],
      benefits: ['Competitive interest rates', 'Quick processing', 'Flexible tenure'],
      applicationProcess: 'Visit branch or apply online',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop',
      rating: 4.1,
      applicants: '5+ Lakh',
      status: 'Active',
      deadline: 'Open throughout year',
      matchScore: 76,
      features: ['Quick Approval', 'Doorstep Service', 'Digital Processing'],
      contact: {
        phone: '18002703333',
        email: 'agriloan@hdfcbank.com',
        website: 'https://www.hdfcbank.com/personal/borrow/popular-loans/loan-against-property/agricultural-loan'
      }
    },
    {
      id: 10,
      name: 'SBI Kisan Credit Card Plus',
      category: 'Credit',
      type: 'Private',
      provider: 'State Bank of India',
      amount: 'Up to ₹2 Lakh (without collateral)',
      description: 'Enhanced KCC with additional benefits and digital features for modern farmers.',
      eligibility: ['Individual farmers', 'Tenant farmers', 'SHG members'],
      documents: ['KYC documents', 'Land records', 'Income proof'],
      benefits: ['Overdraft facility', 'Insurance coverage', 'Digital banking'],
      applicationProcess: 'SBI branches or online application',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop',
      rating: 4.3,
      applicants: '2.5+ Crore',
      status: 'Active',
      deadline: 'Open throughout year',
      matchScore: 79,
      features: ['Multi-purpose Use', 'Digital Convenience', 'Pan-India Presence'],
      contact: {
        phone: '18004253800',
        email: 'kcc@sbi.co.in',
        website: 'https://www.onlinesbi.com/sbicorp/agrobanking/kisancreditcard.htm'
      }
    },
    {
      id: 11,
      name: 'Mahindra Finance Kisan Loan',
      category: 'Equipment Finance',
      type: 'Private',
      provider: 'Mahindra Rural Housing Finance',
      amount: 'Up to ₹25 Lakh',
      description: 'Specialized financing for farm equipment, tractors, and agricultural machinery.',
      eligibility: ['Farmers', 'Agri contractors', 'Rural entrepreneurs'],
      documents: ['Income proof', 'Identity documents', 'Property papers'],
      benefits: ['Flexible EMI options', 'Quick approval', 'Doorstep service'],
      applicationProcess: 'Branch visit or online application',
      image: 'https://images.unsplash.com/photo-1581594549595-35f6edc7b762?w=400&h=250&fit=crop',
      rating: 4.0,
      applicants: '3+ Lakh',
      status: 'Active',
      deadline: 'Open throughout year',
      matchScore: 74,
      features: ['Equipment Focus', 'Rural Expertise', 'Flexible Terms'],
      contact: {
        phone: '18002095577',
        email: 'customercare@mahindrafinance.com',
        website: 'https://www.mahindrafinance.com/loan-products/tractor-loan'
      }
    },
    {
      id: 12,
      name: 'IFFCO Kisan Drone Subsidy',
      category: 'Technology',
      type: 'Private',
      provider: 'IFFCO',
      amount: '50% subsidy up to ₹5 Lakh',
      description: 'Subsidized drone technology for precision agriculture and crop monitoring.',
      eligibility: ['Progressive farmers', 'FPOs', 'Custom hiring centers'],
      documents: ['Business registration', 'Technical training certificate', 'Financial documents'],
      benefits: ['Technology adoption', 'Precision farming', 'Cost reduction'],
      applicationProcess: 'IFFCO authorized dealers',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop',
      rating: 4.4,
      applicants: '5,000+',
      status: 'Active',
      deadline: 'Limited period offer',
      matchScore: 68,
      features: ['Advanced Technology', 'Training Included', 'Technical Support'],
      contact: {
        phone: '18001035570',
        email: 'drone@iffco.coop',
        website: 'https://www.iffco.coop'
      }
    }
  ];

  const categories = ['All', 'Income Support', 'Insurance', 'Credit', 'Subsidy', 'Pension', 'Production', 'Price Support', 'Equipment Finance', 'Technology'];
  const types = ['All', 'Government', 'Private'];

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const filteredSchemes = schemesData.filter(scheme => {
    const matchesCategory = selectedCategory === 'All' || scheme.category === selectedCategory;
    const matchesType = selectedType === 'All' || scheme.type === selectedType;
    const matchesSearch = scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scheme.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scheme.provider.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesType && matchesSearch;
  });

  const getMatchScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 75) return 'text-blue-600 bg-blue-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="flex items-center justify-center flex-col space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <Brain className="absolute inset-0 m-auto text-blue-600" size={24} />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">AI Analysis in Progress</h3>
                <p className="text-gray-600">Analyzing your profile for personalized scheme recommendations...</p>
                <div className="mt-4 w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-blue-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl">
                <Brain className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">AI-Powered Scheme Recommendations</h1>
                <p className="text-gray-600 flex items-center gap-2">
                  <Zap size={16} className="text-yellow-500" />
                  Personalized for {currentUser?.name || 'you'} • Updated {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{filteredSchemes.length}</div>
                  <div className="text-sm text-gray-600">Matching Schemes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">₹12.5L+</div>
                  <div className="text-sm text-gray-600">Potential Benefits</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Analysis Summary */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl shadow-2xl p-8 mb-8 text-white">
          <div className="flex items-center gap-3 mb-6">
            <BadgeCheck size={28} />
            <h2 className="text-2xl font-bold">AI Analysis Complete</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center">
              <Target className="mx-auto mb-2 text-green-300" size={24} />
              <div className="text-2xl font-bold">95%</div>
              <div className="text-sm opacity-90">Profile Match</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center">
              <Award className="mx-auto mb-2 text-yellow-300" size={24} />
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm opacity-90">Eligible Schemes</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center">
              <DollarSign className="mx-auto mb-2 text-green-300" size={24} />
              <div className="text-2xl font-bold">₹8.2L</div>
              <div className="text-sm opacity-90">Est. Benefits</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center">
              <TrendingUp className="mx-auto mb-2 text-blue-300" size={24} />
              <div className="text-2xl font-bold">3-5x</div>
              <div className="text-sm opacity-90">ROI Potential</div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Zap size={16} />
              Key Recommendations for You:
            </h4>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• Prioritize PM-KISAN for immediate income support</li>
              <li>• Apply for crop insurance before next season</li>
              <li>• Consider KCC for working capital needs</li>
              <li>• Explore solar pump subsidies for cost savings</li>
            </ul>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Filter size={16} className="inline mr-1 text-blue-500" />
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Shield size={16} className="inline mr-1 text-green-500" />
                Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 transition-all"
              >
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Search size={16} className="inline mr-1 text-purple-500" />
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search schemes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">View Mode</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex-1 p-3 rounded-xl transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex-1 p-3 rounded-xl transition-all ${
                    viewMode === 'list' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Schemes Grid/List */}
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' 
          : 'space-y-6'
        }>
          {filteredSchemes
            .sort((a, b) => b.matchScore - a.matchScore)
            .map(scheme => (
            <div 
              key={scheme.id} 
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden group"
            >
              {/* Scheme Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={scheme.image} 
                  alt={scheme.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(scheme.status)}`}>
                    {scheme.status}
                  </span>
                  {scheme.type === 'Government' && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                      Govt
                    </span>
                  )}
                </div>
                <div className="absolute top-4 right-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${getMatchScoreColor(scheme.matchScore)}`}>
                    {scheme.matchScore}% Match
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Header */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{scheme.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{scheme.provider}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">{scheme.amount}</span>
                    <div className="flex items-center gap-1">
                      <Star className="text-yellow-400 fill-current" size={16} />
                      <span className="text-sm font-semibold">{scheme.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 text-sm mb-4 line-clamp-3">{scheme.description}</p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {scheme.features.slice(0, 3).map((feature, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg border border-blue-100"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="text-blue-500" size={16} />
                    <span className="text-gray-600">{scheme.applicants} users</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="text-green-500" size={16} />
                    <span className="text-gray-600">{scheme.deadline}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDetails(scheme.id)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <ArrowRight size={16} />
                    View Details
                  </button>
                  <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    <Bell size={16} className="text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredSchemes.length === 0 && (
          <div className="text-center py-16">
            <FileText size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No schemes found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms</p>
          </div>
        )}

        {/* Scheme Detail Modal */}
        {showDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {(() => {
                const scheme = schemesData.find(s => s.id === showDetails);
                return (
                  <div>
                    {/* Modal Header */}
                    <div className="relative h-64 overflow-hidden rounded-t-3xl">
                      <img 
                        src={scheme.image} 
                        alt={scheme.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-6 left-6 right-6 text-white">
                        <h2 className="text-3xl font-bold mb-2">{scheme.name}</h2>
                        <p className="text-lg opacity-90">{scheme.provider}</p>
                      </div>
                      <button
                        onClick={() => setShowDetails(null)}
                        className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white/30 transition-colors"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="p-8">
                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
                          <DollarSign className="mx-auto text-green-600 mb-2" size={24} />
                          <div className="text-xl font-bold text-green-600">{scheme.amount}</div>
                          <div className="text-sm text-gray-600">Benefit Amount</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                          <Target className="mx-auto text-blue-600 mb-2" size={24} />
                          <div className="text-xl font-bold text-blue-600">{scheme.matchScore}%</div>
                          <div className="text-sm text-gray-600">Match Score</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-100">
                          <Users className="mx-auto text-purple-600 mb-2" size={24} />
                          <div className="text-xl font-bold text-purple-600">{scheme.applicants}</div>
                          <div className="text-sm text-gray-600">Beneficiaries</div>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                          <Star className="mx-auto text-yellow-600 mb-2" size={24} />
                          <div className="text-xl font-bold text-yellow-600">{scheme.rating}/5</div>
                          <div className="text-sm text-gray-600">User Rating</div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="mb-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Description</h3>
                        <p className="text-gray-700 leading-relaxed">{scheme.description}</p>
                      </div>

                      {/* Eligibility */}
                      <div className="mb-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <CheckCircle className="text-green-500" size={20} />
                          Eligibility Criteria
                        </h3>
                        <ul className="space-y-2">
                          {scheme.eligibility.map((criterion, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={16} />
                              <span className="text-gray-700">{criterion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Required Documents */}
                      <div className="mb-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <FileText className="text-blue-500" size={20} />
                          Required Documents
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {scheme.documents.map((doc, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <FileText className="text-gray-500" size={16} />
                              <span className="text-gray-700">{doc}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Benefits */}
                      <div className="mb-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <Award className="text-yellow-500" size={20} />
                          Key Benefits
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {scheme.benefits.map((benefit, index) => (
                            <div key={index} className="p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-100">
                              <Award className="text-green-600 mb-2" size={20} />
                              <p className="text-gray-700 font-medium">{benefit}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Application Process */}
                      <div className="mb-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <BookOpen className="text-purple-500" size={20} />
                          How to Apply
                        </h3>
                        <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                          <p className="text-gray-700">{scheme.applicationProcess}</p>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="mb-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <Phone className="text-green-500" size={20} />
                          Contact & Support
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                            <Phone className="text-green-600 mb-2" size={20} />
                            <p className="font-semibold text-gray-800">Phone</p>
                            <p className="text-green-600">{scheme.contact.phone}</p>
                          </div>
                          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <Mail className="text-blue-600 mb-2" size={20} />
                            <p className="font-semibold text-gray-800">Email</p>
                            <p className="text-blue-600">{scheme.contact.email}</p>
                          </div>
                          <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                            <Globe className="text-purple-600 mb-2" size={20} />
                            <p className="font-semibold text-gray-800">Website</p>
                            <a 
                              href={scheme.contact.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-600 hover:underline flex items-center gap-1"
                            >
                              Visit Site <ExternalLink size={14} />
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2">
                          <ExternalLink size={18} />
                          Apply Now
                        </button>
                        <button className="flex-1 bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                          <Download size={18} />
                          Download Form
                        </button>
                        <button className="flex-1 bg-yellow-100 text-yellow-700 py-4 px-6 rounded-xl font-semibold hover:bg-yellow-200 transition-colors flex items-center justify-center gap-2">
                          <Bell size={18} />
                          Set Alert
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="text-center mb-8">
            <HelpCircle className="mx-auto text-blue-500 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Need Help?</h2>
            <p className="text-gray-600">Get assistance with scheme applications and eligibility</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-100">
              <Phone className="mx-auto text-blue-600 mb-3" size={32} />
              <h3 className="font-semibold text-gray-800 mb-2">Call Support</h3>
              <p className="text-sm text-gray-600 mb-3">Get instant help from our experts</p>
              <p className="text-blue-600 font-bold">1800-123-4567</p>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-xl border border-green-100">
              <Mail className="mx-auto text-green-600 mb-3" size={32} />
              <h3 className="font-semibold text-gray-800 mb-2">Email Support</h3>
              <p className="text-sm text-gray-600 mb-3">Send your queries and get detailed responses</p>
              <p className="text-green-600 font-bold">schemes@agritech.gov.in</p>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-xl border border-purple-100">
              <BookOpen className="mx-auto text-purple-600 mb-3" size={32} />
              <h3 className="font-semibold text-gray-800 mb-2">User Guide</h3>
              <p className="text-sm text-gray-600 mb-3">Step-by-step application guides</p>
              <button className="text-purple-600 font-bold hover:underline">
                Download Guide
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISchemes;
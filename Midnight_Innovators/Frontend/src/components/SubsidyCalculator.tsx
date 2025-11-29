import React, { useState } from 'react';
import { 
  Calculator, 
  Search, 
  TrendingUp, 
  Shield, 
  Clock, 
  CheckCircle, 
  Sprout, 
  Tractor,
  Droplets,
  Wheat,
  IndianRupee,
  MapPin,
  LandPlot,
  BadgeIndianRupee,
  Award,
  FileText,
  Phone,
  Mail,
  Calendar,
  Target,
  Zap,
  Users,
  Star,
  ChevronRight,
  Info,
  Banknote,
  PiggyBank,
  Building2,
  Landmark,
  CreditCard,
  Percent,
  TrendingDown,
  Leaf
} from 'lucide-react';
import { User, Scheme, ModalContent } from '../types';

interface SubsidyCalculatorProps {
  currentUser: User;
  showModal: (content: ModalContent) => void;
}

const SubsidyCalculator: React.FC<SubsidyCalculatorProps> = ({ currentUser, showModal }) => {
  const [formData, setFormData] = useState({
    landSize: currentUser.landSize,
    annualIncome: currentUser.annualIncome,
    cropType: currentUser.cropType,
    state: currentUser.state || 'maharashtra'
  });
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'landSize' || name === 'annualIncome' ? parseFloat(value) : value
    }));
  };

  const calculateSubsidy = () => {
    if (!formData.landSize || !formData.annualIncome) {
      showModal({
        type: 'error',
        title: 'Incomplete Information',
        content: 'Please provide both land size and annual income to calculate subsidies.'
      });
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      const generatedSchemes = generateSubsidyRecommendations(
        formData.landSize,
        formData.annualIncome,
        formData.cropType,
        formData.state
      );
      setSchemes(generatedSchemes);
      setLoading(false);
    }, 2000);
  };

  const generateSubsidyRecommendations = (landSize: number, income: number, cropType: string, state: string): Scheme[] => {
    const schemes: Scheme[] = [];

    // Base schemes available to most farmers
    schemes.push({
      name: 'PM-KISAN Samman Nidhi',
      type: 'Central Government',
      amount: '₹6,000/year',
      eligibility: '100%',
      interestRate: '0%',
      description: 'Direct income support scheme for farmer families',
      benefits: ['₹2,000 every 4 months', 'Direct bank transfer', 'No collateral required', 'All landholding farmers eligible'],
      bestMatch: income <= 150000,
      image: '/images/pm-kisan.jpg',
      icon: <Landmark size={20} />
    });

    schemes.push({
      name: 'Pradhan Mantri Fasal Bima Yojana',
      type: 'Central Government',
      amount: `₹${Math.round(landSize * 15000)}/season`,
      eligibility: '95%',
      interestRate: '2%',
      description: 'Comprehensive crop insurance against natural calamities',
      benefits: ['Weather risk coverage', 'Yield loss protection', 'Premium subsidy up to 95%', 'Quick claim settlement'],
      bestMatch: cropType === 'wheat' || cropType === 'rice',
      image: '/images/crop-insurance.jpg',
      icon: <Shield size={20} />
    });

    // Income-based schemes
    if (income <= 300000) {
      schemes.push({
        name: 'Kisan Credit Card Scheme',
        type: 'Banking',
        amount: `₹${Math.round(landSize * 50000)}`,
        eligibility: '92%',
        interestRate: '4%',
        description: 'Flexible credit for agricultural needs',
        benefits: ['Flexible repayment options', 'Crop loan coverage', 'Insurance included', 'Low processing fees'],
        bestMatch: income <= 200000,
        image: '/images/kisan-credit.jpg',
        icon: <CreditCard size={20} />
      });
    }

    // Land size based schemes
    if (landSize >= 1) {
      schemes.push({
        name: 'Micro Irrigation Fund Scheme',
        type: 'Central Government',
        amount: `₹${Math.round(landSize * 25000)}`,
        eligibility: '85%',
        interestRate: '3%',
        description: 'Subsidy for drip and sprinkler irrigation systems',
        benefits: ['Water conservation', 'Increased yield', 'Energy saving', '55-90% subsidy'],
        bestMatch: landSize >= 2 && landSize <= 10,
        image: '/images/micro-irrigation.jpg',
        icon: <Droplets size={20} />
      });
    }

    if (landSize >= 2) {
      schemes.push({
        name: 'Agri-Gold Loan Scheme',
        type: 'Banking',
        amount: `₹${Math.round(landSize * 75000)}`,
        eligibility: '88%',
        interestRate: '7.5%',
        description: 'Loan against gold for agricultural purposes',
        benefits: ['Competitive interest rates', 'Quick processing', 'Doorstep service', 'Flexible tenure'],
        bestMatch: landSize >= 3,
        image: '/images/agri-gold.jpg',
        icon: <PiggyBank size={20} />
      });
    }

    // State-specific schemes
    if (state === 'maharashtra') {
      schemes.push({
        name: 'Mahatma Jyotiba Phule Shetkari Karjmukti Yojana',
        type: 'State Government',
        amount: '₹1,50,000 waiver',
        eligibility: '90%',
        interestRate: 'N/A',
        description: 'Agricultural loan waiver scheme for Maharashtra farmers',
        benefits: ['Complete loan waiver', 'Debt relief', 'Fresh loans availability', 'Documentation support'],
        bestMatch: income <= 300000,
        image: '/images/maharashtra-farmer.jpg',
        icon: <Building2 size={20} />
      });
    }

    // Crop-specific schemes
    if (cropType === 'sugarcane') {
      schemes.push({
        name: 'Sugarcane Subsidy Scheme',
        type: 'Central Government',
        amount: '₹6,850/hectare',
        eligibility: '88%',
        interestRate: '4%',
        description: 'Special assistance for sugarcane cultivation',
        benefits: ['Input subsidy', 'Transport assistance', 'Processing support', 'Price stabilization'],
        bestMatch: cropType === 'sugarcane',
        image: '/images/sugarcane-farmer.jpg',
        icon: <Leaf size={20} />
      });
    }

    if (cropType === 'cotton') {
      schemes.push({
        name: 'Cotton Development Scheme',
        type: 'Central Government',
        amount: '₹8,500/hectare',
        eligibility: '82%',
        interestRate: '3.5%',
        description: 'Support for cotton farmers and technology adoption',
        benefits: ['Seed distribution', 'Technology transfer', 'Market support', 'Quality improvement'],
        bestMatch: cropType === 'cotton',
        image: '/images/cotton-farmer.jpg',
        icon: <Target size={20} />
      });
    }

    return schemes.sort((a, b) => {
      if (a.bestMatch && !b.bestMatch) return -1;
      if (!a.bestMatch && b.bestMatch) return 1;
      return parseFloat(b.eligibility) - parseFloat(a.eligibility);
    });
  };

  const applyScheme = (schemeName: string) => {
    const applicationId = `AGC${Date.now().toString().slice(-6)}`;
    
    showModal({
      type: 'success',
      title: 'Application Submitted Successfully!',
      content: (
        <div style={{ textAlign: 'center', padding: '25px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #059669, #10b981)', 
            width: '90px', 
            height: '90px', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 25px', 
            color: 'white',
            boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4)'
          }}>
            <CheckCircle size={45} />
          </div>
          
          <h2 style={{ 
            color: '#065f46', 
            marginBottom: '8px',
            fontSize: '1.5rem',
            fontWeight: '700'
          }}>
            Application Received
          </h2>
          
          <p style={{ 
            marginBottom: '25px', 
            color: '#6b7280',
            fontSize: '1.05rem',
            lineHeight: '1.6'
          }}>
            Your application for <strong style={{ color: '#059669' }}>{schemeName}</strong> has been submitted successfully and is now under review.
          </p>
          
          <div style={{ 
            background: 'linear-gradient(135deg, #ecfdf5, #f0fdf4)', 
            padding: '20px', 
            borderRadius: '16px', 
            marginBottom: '25px',
            border: '1px solid #bbf7d0',
            textAlign: 'left'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '15px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <FileText size={18} style={{ marginRight: '8px', color: '#059669' }} />
                <strong style={{ color: '#065f46' }}>Application ID:</strong>
              </div>
              <span style={{ 
                fontFamily: 'monospace', 
                background: '#059669',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}>
                {applicationId}
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <Calendar size={18} style={{ marginRight: '8px', color: '#059669' }} />
              <span style={{ color: '#374151' }}>
                <strong>Expected processing:</strong> 7-14 business days
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Phone size={18} style={{ marginRight: '8px', color: '#059669' }} />
              <span style={{ color: '#374151' }}>
                <strong>Status updates:</strong> SMS & Email notifications
              </span>
            </div>
          </div>
          
          <div style={{ 
            background: 'rgba(5, 150, 105, 0.08)', 
            padding: '20px', 
            borderRadius: '16px', 
            marginBottom: '20px',
            textAlign: 'left',
            border: '1px solid rgba(5, 150, 105, 0.2)'
          }}>
            <h4 style={{ 
              color: '#065f46', 
              marginBottom: '15px', 
              display: 'flex', 
              alignItems: 'center',
              fontSize: '1.1rem',
              fontWeight: '600'
            }}>
              <Clock size={20} style={{ marginRight: '10px' }} />
              Next Steps & Requirements:
            </h4>
            
            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <CheckCircle size={16} style={{ marginRight: '12px', marginTop: '2px', color: '#10b981' }} />
                <span style={{ color: '#374151' }}>Check your registered mobile for SMS confirmation within 2 hours</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <FileText size={16} style={{ marginRight: '12px', marginTop: '2px', color: '#10b981' }} />
                <span style={{ color: '#374151' }}>Upload required documents within 48 hours via your dashboard</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <Users size={16} style={{ marginRight: '12px', marginTop: '2px', color: '#10b981' }} />
                <span style={{ color: '#374151' }}>Field verification may be scheduled by local agriculture officer</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <TrendingUp size={16} style={{ marginRight: '12px', marginTop: '2px', color: '#10b981' }} />
                <span style={{ color: '#374151' }}>Track real-time application status in your personalized dashboard</span>
              </div>
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            gap: '12px',
            justifyContent: 'center'
          }}>
            <button style={{
              background: 'linear-gradient(135deg, #059669, #10b981)',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer'
            }}>
              <FileText size={16} style={{ marginRight: '6px' }} />
              View Application
            </button>
            <button style={{
              background: 'white',
              color: '#059669',
              border: '2px solid #059669',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer'
            }}>
              <Phone size={16} style={{ marginRight: '6px' }} />
              Contact Support
            </button>
          </div>
        </div>
      )
    });
  };

  const getSchemeIcon = (schemeType: string, schemeName: string) => {
    if (schemeName.toLowerCase().includes('insurance') || schemeName.toLowerCase().includes('bima')) {
      return <Shield size={24} className="text-blue-600" />;
    }
    if (schemeName.toLowerCase().includes('credit') || schemeName.toLowerCase().includes('loan')) {
      return <CreditCard size={24} className="text-purple-600" />;
    }
    if (schemeName.toLowerCase().includes('irrigation') || schemeName.toLowerCase().includes('water')) {
      return <Droplets size={24} className="text-cyan-600" />;
    }
    if (schemeType === 'Central Government') {
      return <Landmark size={24} className="text-green-600" />;
    }
    if (schemeType === 'State Government') {
      return <Building2 size={24} className="text-blue-600" />;
    }
    return <PiggyBank size={24} className="text-orange-600" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 p-8 mb-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl mb-6 shadow-lg">
              <Calculator size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Agricultural Subsidy Calculator
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              <Sprout size={20} className="inline mr-2 text-emerald-500" />
              Discover personalized government and banking subsidies tailored to your farming needs with our advanced matching algorithm
            </p>
          </div>

          {/* Form Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <LandPlot size={18} className="mr-2 text-emerald-500" />
                Land Size (Acres)
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="landSize"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                  value={formData.landSize}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0.1"
                  max="100"
                  placeholder="Enter land area"
                />
                <LandPlot size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <BadgeIndianRupee size={18} className="mr-2 text-emerald-500" />
                Annual Income (₹)
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="annualIncome"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                  value={formData.annualIncome}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="Enter annual income"
                />
                <IndianRupee size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <Wheat size={18} className="mr-2 text-emerald-500" />
                Primary Crop Type
              </label>
              <div className="relative">
                <select
                  name="cropType"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
                  value={formData.cropType}
                  onChange={handleInputChange}
                >
                  <option value="wheat">🌾 Wheat</option>
                  <option value="rice">🍚 Rice</option>
                  <option value="cotton">🧵 Cotton</option>
                  <option value="sugarcane">🎋 Sugarcane</option>
                  <option value="pulses">🥜 Pulses</option>
                  <option value="oilseeds">🫒 Oilseeds</option>
                </select>
                <Wheat size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <ChevronRight size={18} className="absolute right-4 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <MapPin size={18} className="mr-2 text-emerald-500" />
                State/Region
              </label>
              <div className="relative">
                <select
                  name="state"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
                  value={formData.state}
                  onChange={handleInputChange}
                >
                  <option value="maharashtra">🏛️ Maharashtra</option>
                  <option value="punjab">🌾 Punjab</option>
                  <option value="up">🏛️ Uttar Pradesh</option>
                  <option value="gujarat">🌊 Gujarat</option>
                  <option value="karnataka">🌴 Karnataka</option>
                  <option value="tamilnadu">🏛️ Tamil Nadu</option>
                </select>
                <MapPin size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <ChevronRight size={18} className="absolute right-4 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <button 
              onClick={calculateSubsidy} 
              disabled={loading}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold text-lg rounded-xl shadow-lg hover:from-emerald-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  Analyzing Your Profile...
                </>
              ) : (
                <>
                  <Search size={20} className="mr-3" />
                  Find Matching Subsidies
                </>
              )}
            </button>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <TrendingUp size={28} className="mr-3 text-emerald-500" />
              Why Choose Agricultural Subsidies?
            </h2>
            <p className="text-gray-600 text-lg">Unlock the potential of your farm with government-backed financial support</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Shield size={32} className="text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <Zap size={16} className="text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Financial Risk Protection</h3>
              <p className="text-gray-600 leading-relaxed">
                Comprehensive insurance coverage against crop failure, natural disasters, and market price fluctuations to secure your livelihood
              </p>
              <div className="mt-4 flex justify-center space-x-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Insurance</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Safety Net</span>
              </div>
            </div>

            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Tractor size={32} className="text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <Target size={16} className="text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Modern Technology Access</h3>
              <p className="text-gray-600 leading-relaxed">
                Subsidized access to latest farming equipment, smart irrigation systems, and sustainable agricultural technologies
              </p>
              <div className="mt-4 flex justify-center space-x-2">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">Equipment</span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">Innovation</span>
              </div>
            </div>

            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Droplets size={32} className="text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <Leaf size={16} className="text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Resource Optimization</h3>
              <p className="text-gray-600 leading-relaxed">
                Implement water-efficient irrigation, renewable energy solutions, and precision farming for maximum productivity
              </p>
              <div className="mt-4 flex justify-center space-x-2">
                <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium">Efficiency</span>
                <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">Sustainability</span>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 p-12 text-center">
            <div className="relative mb-8">
              <div className="w-24 h-24 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Calculator size={32} className="text-emerald-500" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Analyzing Your Farm Profile</h3>
            <p className="text-gray-600 mb-2 text-lg">Matching with optimal subsidy schemes...</p>
            <p className="text-emerald-600 font-medium">Scanning 50+ government and banking schemes for best matches</p>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-2 text-gray-500">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm">Eligibility Check</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-500">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <span className="text-sm">Amount Calculation</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-500">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <span className="text-sm">Ranking Results</span>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {schemes.length > 0 && !loading && (
          <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 p-8">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
                  <Award size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Your Personalized Subsidy Matches</h2>
                  <p className="text-gray-600 mt-1">Ranked by eligibility and potential benefit</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">{schemes.length}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Schemes Found</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {schemes.filter(s => s.bestMatch).length}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Best Matches</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              {schemes.map((scheme, index) => (
                <div 
                  key={index}
                  className={`relative bg-gradient-to-r ${
                    scheme.bestMatch 
                      ? 'from-emerald-50 via-green-50 to-teal-50 border-2 border-emerald-300 shadow-lg' 
                      : 'from-gray-50 to-white border border-gray-200 hover:border-gray-300'
                  } rounded-2xl p-6 transition-all duration-300 hover:shadow-lg group`}
                >
                  {scheme.bestMatch && (
                    <div className="absolute -top-3 left-6">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center shadow-lg">
                        <Star size={14} className="mr-1" />
                        RECOMMENDED FOR YOU
                      </div>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-md ${
                        scheme.type === 'Central Government' 
                          ? 'bg-gradient-to-br from-emerald-500 to-green-600' 
                          : scheme.type === 'State Government' 
                            ? 'bg-gradient-to-br from-blue-500 to-indigo-600' 
                            : 'bg-gradient-to-br from-purple-500 to-pink-600'
                      }`}>
                        {getSchemeIcon(scheme.type, scheme.name)}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                          {scheme.name}
                        </h3>
                        <p className="text-gray-600 mb-3 leading-relaxed">
                          {scheme.description}
                        </p>
                        
                        <div className="flex items-center space-x-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            scheme.type === 'Central Government' 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : scheme.type === 'State Government' 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'bg-purple-100 text-purple-700'
                          }`}>
                            {scheme.type}
                          </span>
                          
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock size={14} className="mr-1" />
                            Processing: 7-14 days
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                          Maximum Amount
                        </div>
                        <Banknote size={16} className="text-emerald-500" />
                      </div>
                      <div className="text-2xl font-bold text-emerald-600 flex items-center">
                        <IndianRupee size={18} className="mr-1" />
                        {scheme.amount.replace('₹', '')}
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                          Eligibility Score
                        </div>
                        <Target size={16} className="text-blue-500" />
                      </div>
                      <div className="flex items-center">
                        <div className="text-2xl font-bold text-blue-600 mr-2">
                          {scheme.eligibility}
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-1000"
                            style={{ width: scheme.eligibility }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                          Interest Rate
                        </div>
                        <Percent size={16} className="text-purple-500" />
                      </div>
                      <div className="text-2xl font-bold text-purple-600">
                        {scheme.interestRate === '0%' || scheme.interestRate === 'N/A' ? (
                          <span className="text-green-600 flex items-center">
                            <TrendingDown size={18} className="mr-1" />
                            {scheme.interestRate === '0%' ? 'FREE' : 'N/A'}
                          </span>
                        ) : (
                          scheme.interestRate
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Benefits Section */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <CheckCircle size={18} className="mr-2 text-emerald-500" />
                      Key Benefits & Features
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {scheme.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-emerald-200 transition-colors">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center text-sm text-gray-500 hover:text-emerald-600 transition-colors">
                        <Info size={16} className="mr-1" />
                        View Details
                      </button>
                      <button className="flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors">
                        <FileText size={16} className="mr-1" />
                        Required Documents
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => applyScheme(scheme.name)}
                      className={`inline-flex items-center px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 transform hover:scale-105 ${
                        scheme.bestMatch
                          ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg hover:shadow-xl'
                          : 'bg-white border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      <CheckCircle size={16} className="mr-2" />
                      {scheme.bestMatch ? 'Apply Now - Priority Processing' : 'Submit Application'}
                      <ChevronRight size={16} className="ml-2" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Resources */}
            <div className="mt-8 pt-8 border-t border-gray-100">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Users size={20} className="mr-2 text-blue-600" />
                  Need Help with Your Application?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Phone size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Call Support</div>
                      <div className="text-sm text-gray-600">1800-123-4567</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Mail size={18} className="text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Email Us</div>
                      <div className="text-sm text-gray-600">support@agrisubsidy.gov.in</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users size={18} className="text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Local Officer</div>
                      <div className="text-sm text-gray-600">Visit nearest center</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .success-animation {
          animation: slideInUp 0.5s ease-out;
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .group:hover .group-hover\\:scale-110 {
          transform: scale(1.1);
        }
        
        .group:hover .group-hover\\:text-emerald-600 {
          color: #059669;
        }
        
        input:focus, select:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
        }
        
        button:hover {
          transform: translateY(-1px);
        }
        
        button:active {
          transform: translateY(0);
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: .5;
          }
        }
      `}</style>
    </div>
  );
};

export default SubsidyCalculator;
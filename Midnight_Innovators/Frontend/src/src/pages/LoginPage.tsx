import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, Lock, LogIn, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import Header from '../components/Header';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    aadhaar: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatAadhaar = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 12);
    return cleaned.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const aadhaarNumber = formData.aadhaar.replace(/\s/g, '');
    
    if (!/^\d{12}$/.test(aadhaarNumber)) {
      toast.error('Please enter a valid 12-digit Aadhaar number');
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/farmer/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          aadhaar: aadhaarNumber,
          password: formData.password
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success('Login successful! Welcome to your dashboard');
        
        // Store farmer data
        sessionStorage.setItem('farmerName', data.farmer.name);
        sessionStorage.setItem('farmerData', JSON.stringify(data.farmer));
        sessionStorage.setItem('aadhaars', data.farmer.aadhaar);
        sessionStorage.setItem('mobile', data.farmer.mobile);
        sessionStorage.setItem('email', data.farmer.email);
        sessionStorage.setItem('paddress', data.farmer.presentAddress);
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        toast.error(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <CheckCircle className="w-6 h-6 text-green-400" />,
      text: "Secure Aadhaar Authentication"
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-green-400" />,
      text: "Real-time Market Prices"
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-green-400" />,
      text: "Weather & Crop Advisory"
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-green-400" />,
      text: "Government Scheme Access"
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-green-400" />,
      text: "Digital Record Management"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header />
      
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
        {/* Left Side - Video/Content Section */}
        <div className="lg:flex-1 relative overflow-hidden bg-gradient-to-br from-green-700 to-teal-600">
          <div className="absolute inset-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-30"
            >
              <source src="https://assets.mixkit.co/videos/preview/mixkit-agricultural-field-and-farmhouse-aerial-view-28450-large.mp4" type="video/mp4" />
            </video>
          </div>
          
          <div className="relative z-10 h-full flex items-center justify-center p-8">
            <div className="max-w-md text-center text-white">
              <div className="bg-white/10 rounded-full p-6 mb-8 mx-auto w-fit backdrop-blur-sm">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              <h1 className="text-4xl font-bold mb-4 leading-tight">
                Digital Agriculture Portal
              </h1>
              <p className="text-xl mb-8 opacity-90 leading-relaxed">
                Empowering farmers with technology for sustainable agriculture and better livelihoods
              </p>
              
              <div className="space-y-4 text-left max-w-sm mx-auto">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    {feature.icon}
                    <span className="font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="lg:flex-1 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Farmer Login</h2>
              <p className="text-gray-600">Access your agricultural dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="aadhaar" className="block text-sm font-medium text-gray-700 mb-2">
                  Aadhaar Number
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    id="aadhaar"
                    name="aadhaar"
                    value={formData.aadhaar}
                    onChange={(e) => {
                      const formatted = formatAadhaar(e.target.value);
                      setFormData(prev => ({ ...prev, aadhaar: formatted }));
                    }}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="**** **** ****"
                    maxLength={14}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Login to Dashboard</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/forgot-password"
                className="text-green-600 hover:text-green-700 font-medium transition-colors"
              >
                Forgot your password?
              </Link>
            </div>

            <div className="mt-8 bg-green-50 rounded-xl p-6 text-center border border-green-100">
              <div className="text-gray-700 mb-2">New farmer?</div>
              <Link
                to="/register"
                className="text-green-600 hover:text-green-700 font-semibold transition-colors"
              >
                Register here to get started
              </Link>
            </div>

            {/* Government Support Info */}
            <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="text-blue-800 font-medium mb-1">Need Help?</p>
                  <p className="text-blue-700">
                    Call our farmer helpline: <strong>1800-180-1551</strong> (Toll-free)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
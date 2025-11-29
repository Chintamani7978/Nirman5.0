import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  LogOut, 
  Bell, 
  TrendingUp, 
  Droplets, 
  Sun, 
  DollarSign,
  FileText,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Award,
  Sprout
} from 'lucide-react';
import toast from 'react-hot-toast';
import Header from '../components/Header';

interface FarmerData {
  name: string;
  aadhaar: string;
  mobile: string;
  email: string;
  presentAddress: string;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [farmerData, setFarmerData] = useState<FarmerData | null>(null);
  const [currentWeather, setCurrentWeather] = useState({
    temperature: '28°C',
    humidity: '65%',
    condition: 'Partly Cloudy'
  });

  useEffect(() => {
    // Load farmer data from session storage
    const storedFarmerName = sessionStorage.getItem('farmerName');
    const storedAadhaar = sessionStorage.getItem('aadhaars');
    const storedMobile = sessionStorage.getItem('mobile');
    const storedEmail = sessionStorage.getItem('email');
    const storedAddress = sessionStorage.getItem('paddress');

    if (storedFarmerName) {
      setFarmerData({
        name: storedFarmerName,
        aadhaar: storedAadhaar || '',
        mobile: storedMobile || '',
        email: storedEmail || '',
        presentAddress: storedAddress || ''
      });
    } else {
      // If no farmer data found, redirect to login
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.clear();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (!farmerData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-center mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const dashboardCards = [
    {
      title: 'Crop Advisory',
      value: 'View Now',
      icon: <Sprout className="w-8 h-8 text-green-600" />,
      color: 'bg-green-50 border-green-200',
      textColor: 'text-green-800'
    },
    {
      title: 'Market Prices',
      value: '₹2,450/qtl',
      icon: <TrendingUp className="w-8 h-8 text-blue-600" />,
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-800'
    },
    {
      title: 'Weather Alert',
      value: currentWeather.condition,
      icon: <Sun className="w-8 h-8 text-orange-600" />,
      color: 'bg-orange-50 border-orange-200',
      textColor: 'text-orange-800'
    },
    {
      title: 'Soil Health',
      value: 'Good',
      icon: <Droplets className="w-8 h-8 text-teal-600" />,
      color: 'bg-teal-50 border-teal-200',
      textColor: 'text-teal-800'
    },
    {
      title: 'PM-KISAN Status',
      value: 'Active',
      icon: <DollarSign className="w-8 h-8 text-green-600" />,
      color: 'bg-green-50 border-green-200',
      textColor: 'text-green-800'
    },
    {
      title: 'Insurance',
      value: 'Covered',
      icon: <Award className="w-8 h-8 text-purple-600" />,
      color: 'bg-purple-50 border-purple-200',
      textColor: 'text-purple-800'
    }
  ];

  const recentActivities = [
    {
      title: 'PM-KISAN Payment Received',
      description: '₹2,000 credited to your account',
      time: '2 hours ago',
      icon: <DollarSign className="w-5 h-5 text-green-600" />
    },
    {
      title: 'Weather Alert',
      description: 'Light rain expected in next 24 hours',
      time: '5 hours ago',
      icon: <Droplets className="w-5 h-5 text-blue-600" />
    },
    {
      title: 'Crop Advisory Update',
      description: 'New fertilizer recommendations available',
      time: '1 day ago',
      icon: <Sprout className="w-5 h-5 text-green-600" />
    },
    {
      title: 'Document Uploaded',
      description: 'Land records successfully uploaded',
      time: '2 days ago',
      icon: <FileText className="w-5 h-5 text-gray-600" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {farmerData.name}!</h1>
              <p className="text-green-100 text-lg">Here's your agricultural dashboard overview</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all">
                <Bell className="w-6 h-6" />
              </button>
              <button 
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full transition-all flex items-center space-x-2"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Dashboard Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardCards.map((card, index) => (
                <div key={index} className={`${card.color} border-2 rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105`}>
                  <div className="flex items-start justify-between mb-4">
                    {card.icon}
                    <span className={`text-2xl font-bold ${card.textColor}`}>
                      {card.value}
                    </span>
                  </div>
                  <h3 className={`font-semibold ${card.textColor}`}>{card.title}</h3>
                </div>
              ))}
            </div>

            {/* Weather Information */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Sun className="w-6 h-6 mr-2 text-orange-500" />
                Weather Information
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-2 flex items-center justify-center">
                    <Sun className="w-8 h-8 text-orange-600" />
                  </div>
                  <p className="font-semibold text-gray-800">{currentWeather.temperature}</p>
                  <p className="text-gray-600">Temperature</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-2 flex items-center justify-center">
                    <Droplets className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="font-semibold text-gray-800">{currentWeather.humidity}</p>
                  <p className="text-gray-600">Humidity</p>
                </div>
                <div className="text-center">
                  <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-2 flex items-center justify-center">
                    <Sun className="w-8 h-8 text-gray-600" />
                  </div>
                  <p className="font-semibold text-gray-800">{currentWeather.condition}</p>
                  <p className="text-gray-600">Condition</p>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Activities</h3>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="bg-white p-2 rounded-full border border-gray-200">
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{activity.title}</h4>
                      <p className="text-gray-600 text-sm">{activity.description}</p>
                      <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Farmer Profile */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <User className="w-6 h-6 mr-2 text-green-600" />
                Farmer Profile
              </h3>
              <div className="space-y-4">
                <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <User className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-center">
                  <h4 className="font-bold text-lg text-gray-800">{farmerData.name}</h4>
                  <p className="text-gray-600">Registered Farmer</p>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{farmerData.mobile}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{farmerData.email}</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                    <span className="text-gray-700">{farmerData.presentAddress}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>View Documents</span>
                </button>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Market Prices</span>
                </button>
                <button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                  <Sprout className="w-5 h-5" />
                  <span>Crop Advisory</span>
                </button>
                <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>Apply for Loan</span>
                </button>
              </div>
            </div>

            {/* Support */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-bold text-blue-800 mb-3">Need Help?</h3>
              <p className="text-blue-700 text-sm mb-4">
                Contact our farmer support team for assistance
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-800 font-medium">1800-180-1551</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-800">support@agri.gov.in</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
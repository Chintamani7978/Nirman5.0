import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Users, TrendingUp, Shield, Video, FileText, Phone, Mail } from 'lucide-react';
import VideoCarousel from '../components/VideoCarousel';
import Header from '../components/Header';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: <Users className="w-8 h-8 text-white" />,
      title: "Farmer Registration",
      description: "Quick and secure registration process with Aadhaar verification"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-white" />,
      title: "Market Intelligence",
      description: "Real-time crop prices and market trends for informed decisions"
    },
    {
      icon: <Shield className="w-8 h-8 text-white" />,
      title: "Government Schemes",
      description: "Access to subsidies, loans, and agricultural support programs"
    },
    {
      icon: <Video className="w-8 h-8 text-white" />,
      title: "Expert Guidance",
      description: "Agricultural advisories, weather updates, and best practices"
    }
  ];

  const schemes = [
    {
      title: "PM-KISAN Scheme",
      description: "Direct income support of ₹6,000 per year to eligible farmer families",
      eligibility: "Small and marginal farmers with cultivable land",
      benefits: "₹2,000 every 4 months"
    },
    {
      title: "Crop Insurance",
      description: "Comprehensive crop insurance coverage against natural calamities",
      eligibility: "All farmers growing notified crops",
      benefits: "Up to 90% premium subsidy"
    },
    {
      title: "Soil Health Card",
      description: "Free soil testing and nutrient management recommendations",
      eligibility: "All farmers with agricultural land",
      benefits: "Improved crop yield and soil health"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-800 via-green-700 to-teal-600 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-6 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
              <Sprout className="w-10 h-10 text-amber-300" />
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Digital Agriculture Portal
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed opacity-90">
              Empowering farmers through technology-driven solutions for sustainable agriculture and rural development
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/register"
              className="bg-amber-500 hover:bg-amber-400 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Register as Farmer
            </Link>
            <Link
              to="/login"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg border border-white/30 transition-all duration-300"
            >
              Login to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Video Carousel Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Agricultural Programs & Success Stories</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover government initiatives, farmer success stories, and innovative agricultural practices
            </p>
          </div>
          <VideoCarousel />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Platform Features</h2>
            <p className="text-lg text-gray-600">Comprehensive digital solutions for modern agriculture</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="bg-gradient-to-r from-green-600 to-teal-600 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Government Schemes Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Government Schemes</h2>
            <p className="text-lg text-gray-600">Access various agricultural support programs and subsidies</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {schemes.map((scheme, index) => (
              <div key={index} className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 border border-green-100 hover:border-green-200 transition-colors duration-300">
                <h3 className="text-xl font-semibold text-green-800 mb-3">{scheme.title}</h3>
                <p className="text-gray-700 mb-4">{scheme.description}</p>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium text-gray-800">Eligibility: </span>
                    <span className="text-gray-600">{scheme.eligibility}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">Benefits: </span>
                    <span className="text-green-600 font-medium">{scheme.benefits}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gradient-to-r from-green-700 to-teal-600 text-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl font-bold mb-2">50L+</div>
              <div className="text-lg opacity-90">Registered Farmers</div>
            </div>
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl font-bold mb-2">₹500Cr+</div>
              <div className="text-lg opacity-90">Subsidies Distributed</div>
            </div>
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl font-bold mb-2">1000+</div>
              <div className="text-lg opacity-90">Agricultural Centers</div>
            </div>
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-lg opacity-90">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Need Help?</h2>
            <p className="text-lg text-gray-300">Our support team is available to assist you</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
            <div className="bg-gray-800 rounded-xl p-6">
              <Phone className="w-8 h-8 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Helpline</h3>
              <p className="text-green-400 text-lg font-medium">1800-180-1551</p>
              <p className="text-gray-400 text-sm mt-1">Toll-free support</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-6">
              <Mail className="w-8 h-8 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Email Support</h3>
              <p className="text-green-400 text-lg font-medium">support@agri.gov.in</p>
              <p className="text-gray-400 text-sm mt-1">24/7 email support</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-6">
              <FileText className="w-8 h-8 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Documentation</h3>
              <p className="text-green-400 text-lg font-medium">User Guide</p>
              <p className="text-gray-400 text-sm mt-1">Step-by-step guides</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Sprout className="w-8 h-8 text-green-400 mr-3" />
              <span className="text-xl font-semibold">Digital Agriculture Portal</span>
            </div>
            <p className="text-gray-400">© 2025 Government of India. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
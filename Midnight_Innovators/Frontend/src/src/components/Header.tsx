import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Menu, X, Phone, Globe } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-lg relative">
      {/* Government Bar */}
      <div className="bg-gray-800 text-white text-sm py-2">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Globe className="w-4 h-4 mr-2" />
              Government of India
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              Helpline: 1800-180-1551
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 p-2 rounded-lg">
              <Sprout className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Digital Agriculture Portal</h1>
              <p className="text-sm text-gray-600">Ministry of Agriculture & Farmers Welfare</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
              Home
            </Link>
            <Link to="/register" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
              Register
            </Link>
            <Link to="/login" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
              Login
            </Link>
            <a href="#schemes" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
              Schemes
            </a>
            <a href="#contact" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
              Contact
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/register" 
                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
              <Link 
                to="/login" 
                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <a href="#schemes" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                Schemes
              </a>
              <a href="#contact" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                Contact
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Lock, Eye, EyeOff, CheckCircle, AlertCircle, User } from 'lucide-react';
import toast from 'react-hot-toast';
import Header from '../components/Header';

interface FarmerData {
  name: string;
  mobile: string;
  email: string;
  profilePhoto?: string;
}

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    aadhaar: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [farmerData, setFarmerData] = useState<FarmerData | null>(null);

  const formatAadhaar = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 12);
    return cleaned.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[!@#$%^&*]/.test(password)) strength += 25;
    return strength;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const verifyAadhaar = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const aadhaarNumber = formData.aadhaar.replace(/\s/g, '');
    
    if (!/^\d{12}$/.test(aadhaarNumber)) {
      toast.error('Please enter a valid 12-digit Aadhaar number');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/farmer/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ aadhaar: aadhaarNumber }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setFarmerData(data.farmer);
        setCurrentStep(2);
        toast.success('Account found! Please confirm to reset password');
      } else {
        toast.error(data.error || 'Aadhaar verification failed');
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      toast.error('Network error. Please check your connection');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { newPassword, confirmPassword } = formData;
    
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/farmer/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          aadhaar: formData.aadhaar.replace(/\s/g, ''),
          newPassword
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setCurrentStep(4);
        toast.success('Password updated successfully!');
      } else {
        toast.error(data.error || 'Password reset failed');
      }
    } catch (error: any) {
      console.error('Reset error:', error);
      toast.error('Network error. Please try again');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-700 to-teal-600 text-white p-6 text-center">
              <h1 className="text-2xl font-bold">Reset Password</h1>
              <p className="text-green-100 mt-2">Recover access to your account</p>
            </div>

            <div className="p-6">
              {/* Step 1: Enter Aadhaar */}
              {currentStep === 1 && (
                <form onSubmit={verifyAadhaar} className="space-y-6">
                  <div className="text-center mb-6">
                    <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <CreditCard className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Enter Aadhaar Number</h2>
                    <p className="text-gray-600">We'll verify your account details</p>
                  </div>

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

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <span>Verify Aadhaar</span>
                    )}
                  </button>
                </form>
              )}

              {/* Step 2: Confirm Account */}
              {currentStep === 2 && farmerData && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Account Found</h2>
                    <p className="text-gray-600">Please confirm this is your account</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <div className="flex items-center space-x-4 mb-4">
                      {farmerData.profilePhoto ? (
                        <img
                          src={farmerData.profilePhoto}
                          alt="Profile"
                          className="w-16 h-16 rounded-full object-cover border-2 border-green-500"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center border-2 border-green-500">
                          <User className="w-8 h-8 text-green-600" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg">{farmerData.name}</h3>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium text-gray-700">Mobile:</span> {farmerData.mobile}</p>
                      <p><span className="font-medium text-gray-700">Email:</span> {farmerData.email}</p>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300"
                    >
                      Yes, Reset Password
                    </button>
                    <button
                      onClick={() => navigate('/login')}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Reset Password */}
              {currentStep === 3 && (
                <form onSubmit={resetPassword} className="space-y-6">
                  <div className="text-center mb-6">
                    <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Lock className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Create New Password</h2>
                    <p className="text-gray-600">Choose a strong password for your account</p>
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showPassword ? "text" : "password"}
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="Enter new password (min 6 characters)"
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
                    {formData.newPassword && (
                      <div className="mt-2">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${
                              passwordStrength < 50 ? 'bg-red-500' : 
                              passwordStrength < 75 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${passwordStrength}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          Password strength: {
                            passwordStrength < 50 ? 'Weak' : 
                            passwordStrength < 75 ? 'Medium' : 'Strong'
                          }
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="Confirm new password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Updating...</span>
                      </>
                    ) : (
                      <span>Update Password</span>
                    )}
                  </button>
                </form>
              )}

              {/* Step 4: Success */}
              {currentStep === 4 && (
                <div className="text-center space-y-6">
                  <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto flex items-center justify-center">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Password Updated Successfully!</h2>
                    <p className="text-gray-600">Your password has been changed successfully. You can now login with your new password.</p>
                  </div>
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300"
                  >
                    Return to Login
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            {currentStep !== 4 && (
              <div className="bg-gray-50 p-4 text-center border-t">
                <Link
                  to="/login"
                  className="text-green-600 hover:text-green-700 font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Login</span>
                </Link>
              </div>
            )}
          </div>

          {/* Help Section */}
          <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="text-blue-800 font-medium mb-1">Need Help?</p>
                <p className="text-blue-700">
                  Contact our support team: <strong>1800-180-1551</strong> (Toll-free)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
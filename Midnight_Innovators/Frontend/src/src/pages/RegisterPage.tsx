import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, User, MapPin, FileText, Upload, Check, Phone, Mail, Lock, Calendar, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import Header from '../components/Header';

interface FormData {
  name: string;
  dob: string;
  aadhaar: string;
  mobile: string;
  email: string;
  password: string;
  presentAddress: string;
  permanentAddress: string;
  state: string;
  district: string;
  pincode: string;
  aadhaarCard: File | null;
  landDocument: File | null;
  bankPassbook: File | null;
  profilePhoto: File | null;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    dob: '',
    aadhaar: '',
    mobile: '',
    email: '',
    password: '',
    presentAddress: '',
    permanentAddress: '',
    state: '',
    district: '',
    pincode: '',
    aadhaarCard: null,
    landDocument: null,
    bankPassbook: null,
    profilePhoto: null
  });

  const states = [
    'Andhra Pradesh', 'Karnataka', 'Kerala', 'Tamil Nadu', 'Maharashtra',
    'Punjab', 'Haryana', 'Uttar Pradesh', 'Odisha', 'Gujarat', 'Rajasthan'
  ];

  const districtsByState: Record<string, string[]> = {
    'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Kurnool'],
    'Karnataka': ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubli'],
    'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik'],
    'Punjab': ['Amritsar', 'Ludhiana', 'Jalandhar', 'Patiala'],
    'Haryana': ['Gurugram', 'Faridabad', 'Panipat', 'Ambala'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi', 'Agra'],
    'Odisha': ['Bhubaneswar', 'Cuttack', 'Puri', 'Berhampur'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota']
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'state') {
      setFormData(prev => ({ ...prev, district: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setFormData(prev => ({ ...prev, [name]: file }));
      toast.success(`${file.name} uploaded successfully`);
    }
  };

  const formatAadhaar = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 12);
    return cleaned.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
  };

  const validateStep1 = () => {
    const { name, dob, aadhaar, mobile, email, password } = formData;
    
    if (!name.trim() || name.length < 2) {
      toast.error('Please enter a valid full name');
      return false;
    }
    
    if (!dob) {
      toast.error('Please select date of birth');
      return false;
    }
    
    const age = new Date().getFullYear() - new Date(dob).getFullYear();
    if (age < 18) {
      toast.error('Must be at least 18 years old');
      return false;
    }
    
    const cleanedAadhaar = aadhaar.replace(/\D/g, '');
    if (cleanedAadhaar.length !== 12) {
      toast.error('Aadhaar must be exactly 12 digits');
      return false;
    }
    
    if (!/^\d{10}$/.test(mobile)) {
      toast.error('Mobile number must be exactly 10 digits');
      return false;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    
    if (password.length < 8 || !/\d/.test(password)) {
      toast.error('Password must be at least 8 characters with one number');
      return false;
    }
    
    return true;
  };

  const validateStep2 = () => {
    const { presentAddress, permanentAddress, state, district, pincode, aadhaarCard, landDocument, bankPassbook, profilePhoto } = formData;
    
    if (!presentAddress.trim() || !permanentAddress.trim()) {
      toast.error('Please fill in both addresses');
      return false;
    }
    
    if (!state || !district) {
      toast.error('Please select state and district');
      return false;
    }
    
    if (!/^\d{6}$/.test(pincode)) {
      toast.error('Pincode must be exactly 6 digits');
      return false;
    }
    
    if (!aadhaarCard || !landDocument || !bankPassbook || !profilePhoto) {
      toast.error('Please upload all required documents');
      return false;
    }
    
    return true;
  };

  const nextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
      toast.success('Step 1 completed successfully!');
    }
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) return;
    
    setLoading(true);
    
    try {
      const submitFormData = new FormData();
      
      // Clean Aadhaar number
      const cleanedAadhaar = formData.aadhaar.replace(/\D/g, '');
      submitFormData.append('aadhaar', cleanedAadhaar);
      
      // Append text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (typeof value === 'string' && key !== 'aadhaar') {
          submitFormData.append(key, value);
        }
      });
      
      // Append files
      if (formData.aadhaarCard) submitFormData.append('aadhaarCard', formData.aadhaarCard);
      if (formData.landDocument) submitFormData.append('ror', formData.landDocument);
      if (formData.bankPassbook) submitFormData.append('bankPassbook', formData.bankPassbook);
      if (formData.profilePhoto) submitFormData.append('profilePhoto', formData.profilePhoto);
      
      const response = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        body: submitFormData
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }
      
      const result = await response.json();
      toast.success('Registration completed successfully!');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[!@#$%^&*]/.test(password)) strength += 25;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-700 to-teal-600 text-white p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-2">Farmer Registration</h1>
              <p className="text-xl opacity-90">Join the Digital Agriculture Revolution</p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="bg-gray-50 p-6 border-b">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-8">
                <div className={`flex items-center ${currentStep >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= 1 ? 'bg-green-600 border-green-600 text-white' : 'border-gray-300'}`}>
                    {currentStep > 1 ? <Check className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  </div>
                  <span className="ml-2 font-medium">Personal Information</span>
                </div>
                
                <div className={`h-1 w-16 rounded ${currentStep >= 2 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                
                <div className={`flex items-center ${currentStep >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= 2 ? 'bg-green-600 border-green-600 text-white' : 'border-gray-300'}`}>
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="ml-2 font-medium">Address & Documents</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-0">
            <div className="flex flex-col lg:flex-row min-h-[600px]">
              {/* Form Content */}
              <div className="flex-1 p-8">
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center mb-6">
                      <User className="w-6 h-6 mr-3 text-green-600" />
                      Personal Information
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date of Birth
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Aadhaar Number
                        </label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            name="aadhaar"
                            value={formData.aadhaar}
                            onChange={(e) => {
                              const formatted = formatAadhaar(e.target.value);
                              setFormData(prev => ({ ...prev, aadhaar: formatted }));
                            }}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            placeholder="XXXX-XXXX-XXXX"
                            maxLength={14}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mobile Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="tel"
                            name="mobile"
                            value={formData.mobile}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                              setFormData(prev => ({ ...prev, mobile: value }));
                            }}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            placeholder="10-digit mobile number"
                            maxLength={10}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            placeholder="your.email@example.com"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Create Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            placeholder="Minimum 8 characters with one number"
                            required
                          />
                        </div>
                        {formData.password && (
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
                    </div>

                    <button
                      type="button"
                      onClick={nextStep}
                      className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all duration-300 transform hover:scale-105"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center mb-6">
                      <MapPin className="w-6 h-6 mr-3 text-green-600" />
                      Address & Documents
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Present Address
                        </label>
                        <input
                          type="text"
                          name="presentAddress"
                          value={formData.presentAddress}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          placeholder="Current residential address"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Permanent Address
                        </label>
                        <input
                          type="text"
                          name="permanentAddress"
                          value={formData.permanentAddress}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          placeholder="Permanent residential address"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State
                        </label>
                        <select
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          required
                        >
                          <option value="">Select State</option>
                          {states.map(state => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          District
                        </label>
                        <select
                          name="district"
                          value={formData.district}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          required
                          disabled={!formData.state}
                        >
                          <option value="">Select District</option>
                          {formData.state && districtsByState[formData.state]?.map(district => (
                            <option key={district} value={district}>{district}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pincode
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                            setFormData(prev => ({ ...prev, pincode: value }));
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          placeholder="6-digit pincode"
                          maxLength={6}
                          required
                        />
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-green-600" />
                        Upload Required Documents
                      </h3>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Aadhaar Card
                          </label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-500 transition-colors">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <input
                              type="file"
                              name="aadhaarCard"
                              onChange={handleFileChange}
                              accept=".jpg,.jpeg,.png,.pdf"
                              className="hidden"
                              id="aadhaarCard"
                              required
                            />
                            <label htmlFor="aadhaarCard" className="cursor-pointer">
                              {formData.aadhaarCard ? (
                                <span className="text-green-600 font-medium">{formData.aadhaarCard.name}</span>
                              ) : (
                                <>
                                  <p className="text-gray-600">Click to upload Aadhaar Card</p>
                                  <p className="text-xs text-gray-500">JPG, PNG or PDF (Max 5MB)</p>
                                </>
                              )}
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Land Document
                          </label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-500 transition-colors">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <input
                              type="file"
                              name="landDocument"
                              onChange={handleFileChange}
                              accept=".jpg,.jpeg,.png,.pdf"
                              className="hidden"
                              id="landDocument"
                              required
                            />
                            <label htmlFor="landDocument" className="cursor-pointer">
                              {formData.landDocument ? (
                                <span className="text-green-600 font-medium">{formData.landDocument.name}</span>
                              ) : (
                                <>
                                  <p className="text-gray-600">Click to upload Land Document</p>
                                  <p className="text-xs text-gray-500">Revenue records or land papers</p>
                                </>
                              )}
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bank Passbook
                          </label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-500 transition-colors">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <input
                              type="file"
                              name="bankPassbook"
                              onChange={handleFileChange}
                              accept=".jpg,.jpeg,.png,.pdf"
                              className="hidden"
                              id="bankPassbook"
                              required
                            />
                            <label htmlFor="bankPassbook" className="cursor-pointer">
                              {formData.bankPassbook ? (
                                <span className="text-green-600 font-medium">{formData.bankPassbook.name}</span>
                              ) : (
                                <>
                                  <p className="text-gray-600">Click to upload Bank Passbook</p>
                                  <p className="text-xs text-gray-500">First page with account details</p>
                                </>
                              )}
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Profile Photo
                          </label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-500 transition-colors">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <input
                              type="file"
                              name="profilePhoto"
                              onChange={handleFileChange}
                              accept=".jpg,.jpeg,.png"
                              className="hidden"
                              id="profilePhoto"
                              required
                            />
                            <label htmlFor="profilePhoto" className="cursor-pointer">
                              {formData.profilePhoto ? (
                                <span className="text-green-600 font-medium">{formData.profilePhoto.name}</span>
                              ) : (
                                <>
                                  <p className="text-gray-600">Click to upload Photo</p>
                                  <p className="text-xs text-gray-500">Clear passport size photo</p>
                                </>
                              )}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-6">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
                      >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back</span>
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <span>Complete Registration</span>
                            <Check className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar with Agricultural Content */}
              <div className="lg:w-1/2 bg-gradient-to-br from-green-600 to-teal-700 text-white p-8 flex items-center justify-center">
                <div className="max-w-md text-center">
                  {currentStep === 1 ? (
                    <>
                      <div className="bg-white/10 rounded-full p-6 mb-6 mx-auto w-fit backdrop-blur-sm">
                        <User className="w-12 h-12 text-amber-300" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4">Join Our Farming Community</h3>
                      <p className="text-lg opacity-90 mb-6">
                        Create your secure farmer profile and access personalized agricultural solutions, 
                        government schemes, and modern farming techniques.
                      </p>
                      <div className="space-y-3 text-left">
                        <div className="flex items-center space-x-3">
                          <Check className="w-5 h-5 text-green-300" />
                          <span>Secure Aadhaar verification</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Check className="w-5 h-5 text-green-300" />
                          <span>Access to PM-KISAN benefits</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Check className="w-5 h-5 text-green-300" />
                          <span>Real-time market prices</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-white/10 rounded-full p-6 mb-6 mx-auto w-fit backdrop-blur-sm">
                        <FileText className="w-12 h-12 text-amber-300" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4">Secure Document Storage</h3>
                      <p className="text-lg opacity-90 mb-6">
                        Your documents are encrypted with bank-level security. Access government schemes, 
                        crop insurance, and agricultural loans seamlessly.
                      </p>
                      <div className="space-y-3 text-left">
                        <div className="flex items-center space-x-3">
                          <Check className="w-5 h-5 text-green-300" />
                          <span>256-bit encryption security</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Check className="w-5 h-5 text-green-300" />
                          <span>Instant scheme eligibility</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Check className="w-5 h-5 text-green-300" />
                          <span>Digital document access</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="bg-gray-50 p-6 text-center border-t">
            <p className="text-gray-600">
              Already have an account? <Link to="/login" className="text-green-600 hover:text-green-700 font-semibold">Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
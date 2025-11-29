import React, { useState } from 'react';
import { Shield, ArrowRight, Phone, ArrowLeft, Mail, Lock, User as UserIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { translations } from '../translations';

export const AuthScreen = ({ onLogin, onBack, language, setLanguage }) => {
  const t = translations[language];
  const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'
  const [inputMethod, setInputMethod] = useState('phone'); // 'phone' or 'email'
  
  // Form Data
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // --- API HANDLER ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    // 1. Basic Client-Side Validation
    if (authMode === 'signup' && !name) return setErrorMsg("Name is required");
    if (inputMethod === 'phone' && !mobile) return setErrorMsg("Phone number is required");
    if (inputMethod === 'email' && !email) return setErrorMsg("Email is required");
    if (!password) return setErrorMsg("Password is required");
    
    setLoading(true);

    // Prepare Data for Backend
    const endpoint = authMode === 'signup' ? '/signup' : '/login';
    const apiUrl = `http://localhost:5000/api/auth${endpoint}`;
    
    let payload = {};

    if (authMode === 'signup') {
      payload = {
        name,
        password,
        // Send ONLY the selected method, leave other as undefined
        email: inputMethod === 'email' ? email : undefined,
        phone: inputMethod === 'phone' ? mobile : undefined
      };
    } else {
      // Login Mode
      payload = {
        identifier: inputMethod === 'email' ? email : mobile,
        password
      };
    }

    try {
      // 2. Call Backend
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      // 3. Success!
      // Save token (Optional: use localStorage for persistence)
      // localStorage.setItem('agri_token', data.token);
      
      onLogin(data); // Pass the real user data to App.jsx

    } catch (err) {
      console.error("Auth Error:", err);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMethod = () => {
    setInputMethod(prev => prev === 'phone' ? 'email' : 'phone');
    setMobile('');
    setEmail('');
    setErrorMsg('');
  };

  const toggleAuthMode = () => {
    setAuthMode(prev => prev === 'signin' ? 'signup' : 'signin');
    setMobile('');
    setEmail('');
    setPassword('');
    setName('');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-64 bg-slate-900"></div>
      <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Top Controls */}
      <div className="absolute top-6 left-6 z-20">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all font-bold text-sm backdrop-blur-md"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-20 flex gap-2">
        {['en', 'hi', 'or'].map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all border ${
              language === lang 
                ? 'bg-lime-400 text-emerald-950 border-lime-400 shadow-lg' 
                : 'bg-white/10 text-white border-white/10 hover:bg-white/20'
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200 border border-slate-100 relative overflow-hidden">
          
          <div className="text-center mb-8 relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 mb-4 shadow-lg shadow-slate-900/20">
              <Shield className="text-lime-400" size={32} strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">{authMode === 'signin' ? t.signIn : t.createAccount}</h1>
            <p className="text-slate-500 text-sm">{t.welcomeLogin}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            
            {/* Error Message Display */}
            {errorMsg && (
              <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-lg border border-red-100 text-center">
                {errorMsg}
              </div>
            )}

            {/* Sign Up: Full Name */}
            <AnimatePresence>
              {authMode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1 overflow-hidden"
                >
                  <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">{t.fullName}</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <UserIcon size={18} />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Credential Field (Phone or Email) */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                 <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">
                   {inputMethod === 'phone' ? t.phoneNum : t.emailAddr}
                 </label>
                 <button 
                   type="button" 
                   onClick={toggleMethod}
                   className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                 >
                   {inputMethod === 'phone' ? t.useEmail : t.usePhone}
                 </button>
              </div>
              
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  {inputMethod === 'phone' ? <Phone size={18} /> : <Mail size={18} />}
                </div>
                
                {inputMethod === 'phone' ? (
                   <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                  />
                ) : (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="farmer@example.com"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                  />
                )}
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">{t.password}</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 mt-2 bg-slate-900 text-white font-bold rounded-xl shadow-lg shadow-slate-900/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-lg ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-slate-800'
              }`}
            >
              {loading ? (
                 <>
                    <Loader2 size={20} className="animate-spin" />
                    {authMode === 'signup' ? t.creatingAccount : t.verifying}
                 </>
              ) : (
                 <>
                    {authMode === 'signup' ? t.createAccount : t.secureLogin}
                    <ArrowRight size={20} />
                 </>
              )}
            </button>
          </form>

          {/* Switch Mode */}
          <div className="mt-8 text-center relative z-10">
            <p className="text-sm text-slate-500">
              {authMode === 'signin' ? t.noAccount : t.haveAccount}
              <button 
                onClick={toggleAuthMode} 
                className="ml-2 font-bold text-emerald-600 hover:text-emerald-700 underline decoration-2 decoration-emerald-200 underline-offset-2 transition-colors"
              >
                {authMode === 'signin' ? t.signUp : t.signIn}
              </button>
            </p>
          </div>
          
        </div>
      </motion.div>
    </div>
  );
};
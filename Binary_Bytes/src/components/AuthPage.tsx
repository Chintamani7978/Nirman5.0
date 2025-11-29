import { useState } from 'react';
import { Shield, Lock, User, Mail, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { AnimatedBackground } from './AnimatedBackground';
import { apiService } from '../services/api';

interface AuthPageProps {
  onLogin: (success: boolean) => void;
}

export function AuthPage({ onLogin }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    adminCode: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (isLogin) {
        if (!formData.email || !formData.password) {
          setError('Email and password are required');
          setIsLoading(false);
          return;
        }

        const response = await apiService.login({
          email: formData.email,
          password: formData.password,
        });

        localStorage.setItem('currentUser', JSON.stringify(response.user));
        setSuccess('Login successful! Redirecting...');
        onLogin(true);
      } else {
        if (!formData.name || !formData.email || !formData.password) {
          setError('Name, email, and password are required');
          setIsLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          setIsLoading(false);
          return;
        }

        if (formData.adminCode !== 'ADMIN2024') {
          setError('Invalid admin code. Only administrators can register.');
          setIsLoading(false);
          return;
        }

        const response = await apiService.signup({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        localStorage.setItem('currentUser', JSON.stringify(response.user));
        setSuccess('Account created successfully! Redirecting...');
        onLogin(true);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred. Please try again.';
      setError(errorMessage);
      console.error('Authentication error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setFormData({ ...formData, email: 'admin@cybersentinel.com', password: 'admin123' });
    setError('');
    setSuccess('Demo credentials loaded! Click Login to continue.');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-[#D5CEA3] blur-3xl opacity-30 rounded-full animate-pulse"></div>
                <Shield className="w-20 h-20 text-[#D5CEA3] relative" />
              </div>
            </div>
            <h1 className="text-5xl mb-2">
              <span className="text-[#D5CEA3]">Cyber</span>{' '}
              <span className="text-[#E5E5CB]">Sentinel</span>
            </h1>
            <p className="text-[#D5CEA3]">CCTV Security Operations Center</p>
          </div>

          {/* Auth Form */}
          <div className="bg-[#3C2A21]/70 backdrop-blur-xl border border-[#D5CEA3]/30 rounded-2xl p-8 shadow-2xl">
            {/* Toggle Tabs */}
            <div className="flex gap-2 mb-6 p-1 bg-[#1A120B]/50 rounded-lg">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setError('');
                  setSuccess('');
                }}
                className={`flex-1 py-2.5 rounded-lg transition-all duration-300 ${
                  isLogin 
                    ? 'bg-[#D5CEA3] text-[#1A120B]' 
                    : 'text-[#E5E5CB] hover:bg-[#3C2A21]'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setError('');
                  setSuccess('');
                  setFormData({ name: '', email: '', password: '', adminCode: '' });
                }}
                className={`flex-1 py-2.5 rounded-lg transition-all duration-300 ${
                  !isLogin 
                    ? 'bg-[#D5CEA3] text-[#1A120B]' 
                    : 'text-[#E5E5CB] hover:bg-[#3C2A21]'
                }`}
              >
                Admin Signup
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-400 text-sm animate-fadeIn">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-2 text-green-400 text-sm animate-fadeIn">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email (Login) */}
              <div>
                <label className="block text-sm text-[#D5CEA3] mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#D5CEA3]/50" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#1A120B]/50 border border-[#D5CEA3]/30 rounded-lg pl-11 pr-4 py-3 text-[#E5E5CB] placeholder-[#E5E5CB]/30 focus:outline-none focus:border-[#D5CEA3] transition-colors"
                    placeholder="admin@cybersentinel.com"
                    required
                  />
                </div>
              </div>

              {/* Name (Signup only) */}
              {!isLogin && (
                <div>
                  <label className="block text-sm text-[#D5CEA3] mb-2">Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#D5CEA3]/50" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#1A120B]/50 border border-[#D5CEA3]/30 rounded-lg pl-11 pr-4 py-3 text-[#E5E5CB] placeholder-[#E5E5CB]/30 focus:outline-none focus:border-[#D5CEA3] transition-colors"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div>
                <label className="block text-sm text-[#D5CEA3] mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#D5CEA3]/50" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-[#1A120B]/50 border border-[#D5CEA3]/30 rounded-lg pl-11 pr-11 py-3 text-[#E5E5CB] placeholder-[#E5E5CB]/30 focus:outline-none focus:border-[#D5CEA3] transition-colors"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#D5CEA3]/50 hover:text-[#D5CEA3] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Admin Code (Signup only) */}
              {!isLogin && (
                <div>
                  <label className="block text-sm text-[#D5CEA3] mb-2">Admin Access Code</label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#D5CEA3]/50" />
                    <input
                      type="text"
                      value={formData.adminCode}
                      onChange={(e) => setFormData({ ...formData, adminCode: e.target.value })}
                      className="w-full bg-[#1A120B]/50 border border-[#D5CEA3]/30 rounded-lg pl-11 pr-4 py-3 text-[#E5E5CB] placeholder-[#E5E5CB]/30 focus:outline-none focus:border-[#D5CEA3] transition-colors"
                      placeholder="Enter admin code"
                      required
                    />
                  </div>
                  <p className="text-xs text-[#E5E5CB]/50 mt-2 flex items-center gap-1">
                    <span>Demo code:</span>
                    <code className="text-[#D5CEA3] bg-[#1A120B]/50 px-2 py-0.5 rounded">ADMIN2024</code>
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#D5CEA3] text-[#1A120B] rounded-lg hover:bg-[#E5E5CB] transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#1A120B] border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>{isLogin ? 'Login to Dashboard' : 'Create Admin Account'}</span>
                    <Shield className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            {isLogin && (
              <div className="mt-6 pt-6 border-t border-[#D5CEA3]/20">
                <p className="text-sm text-[#E5E5CB]/70 mb-3 text-center">Quick Demo Access:</p>
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full py-2 bg-[#1A120B]/50 border border-[#D5CEA3]/30 rounded-lg text-[#D5CEA3] hover:bg-[#1A120B] hover:border-[#D5CEA3]/50 transition-all text-sm"
                >
                  Load Demo Credentials
                </button>
                <div className="mt-3 text-xs text-[#E5E5CB]/50 bg-[#1A120B]/30 p-3 rounded-lg space-y-1">
                  <div>Email: <span className="text-[#D5CEA3]">admin@cybersentinel.com</span></div>
                  <div>Password: <span className="text-[#D5CEA3]">admin123</span></div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-[#E5E5CB]/50 mt-6">
            🔒 Secure • Encrypted • Monitored 24/7
          </p>
        </div>
      </div>
    </div>
  );
}

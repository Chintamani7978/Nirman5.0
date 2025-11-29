import { Shield, Eye, Lock, Activity, LogOut } from 'lucide-react';
import { AnimatedBackground } from './AnimatedBackground';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';

interface HeroProps {
  onLogout: () => void;
}

export function Hero({ onLogout }: HeroProps) {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate('/dashboard');
  };
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}') as { name?: string; username?: string };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />
      
      {/* Logout Button */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 bg-[#3C2A21]/60 backdrop-blur-sm border border-[#D5CEA3]/30 rounded-lg text-[#E5E5CB] hover:bg-[#3C2A21] hover:border-[#D5CEA3]/50 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      {/* Welcome Message */}
      <div className="absolute top-6 left-6 z-20">
        <div className="px-4 py-2 bg-[#3C2A21]/60 backdrop-blur-sm border border-[#D5CEA3]/30 rounded-lg">
          <p className="text-sm text-[#D5CEA3]">Welcome back, <span className="text-[#E5E5CB]">{currentUser.username || 'Admin'}</span></p>
        </div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        <div className="text-center max-w-5xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-[#D5CEA3] blur-3xl opacity-20 rounded-full"></div>
              <img 
                src={logo} 
                alt="Cyber Sentinel Logo" 
                className="w-24 h-24 relative animate-pulse"
                style={{ filter: 'brightness(0) saturate(100%) invert(84%) sepia(9%) saturate(1034%) hue-rotate(16deg) brightness(95%) contrast(92%)' }}
              />
            </div>
          </div>
          
          <h1 className="text-7xl mb-6 tracking-tight">
            <span className="text-[#D5CEA3]">Cyber</span>{' '}
            <span className="text-[#E5E5CB]">Sentinel</span>
          </h1>
          
          <p className="text-2xl text-[#D5CEA3] mb-8 max-w-3xl mx-auto leading-relaxed">
            Advanced CCTV Cybersecurity Testing & Protection Platform
          </p>
          
          <p className="text-lg text-[#E5E5CB]/70 mb-12 max-w-2xl mx-auto">
            Discover vulnerabilities in surveillance systems. Test, analyze, and secure CCTV networks 
            with real-time threat detection and automated security hardening.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
            <FeatureCard 
              icon={<Eye className="w-8 h-8" />}
              title="CCTV Scanner"
              description="Scan & audit vulnerable cameras"
            />
            <FeatureCard 
              icon={<Activity className="w-8 h-8" />}
              title="Threat Detection"
              description="Real-time monitoring & alerts"
            />
            <FeatureCard 
              icon={<Lock className="w-8 h-8" />}
              title="Security Hardening"
              description="Automated protection fixes"
            />
            <FeatureCard 
              icon={<Shield className="w-8 h-8" />}
              title="Safe Testing"
              description="Virtual lab environment"
            />
          </div>

          <button 
            onClick={handleGetStarted}
            className="px-8 py-3 bg-[#D5CEA3] text-[#1A120B] rounded-lg font-medium hover:bg-[#E5E5CB] transition-colors duration-300 cursor-pointer"
          >
            <span className="relative z-10 flex items-center gap-2">
              Get Started
              <Shield className="w-5 h-5" />
            </span>
          </button>

          <p className="mt-8 text-sm text-[#E5E5CB]/50">
            ✔️ Safe ethical testing environment • No real infrastructure accessed
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1A120B] to-transparent z-10"></div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group relative bg-[#3C2A21]/30 backdrop-blur-sm border border-[#D5CEA3]/20 rounded-lg p-6 hover:border-[#D5CEA3]/50 transition-all duration-300 hover:transform hover:scale-105">
      <div className="absolute inset-0 bg-gradient-to-b from-[#D5CEA3]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
      <div className="relative">
        <div className="text-[#D5CEA3] mb-3 flex justify-center">{icon}</div>
        <h3 className="text-[#E5E5CB] mb-2">{title}</h3>
        <p className="text-sm text-[#E5E5CB]/60">{description}</p>
      </div>
    </div>
  );
}
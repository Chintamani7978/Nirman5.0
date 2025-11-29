import { Shield, Search, AlertTriangle, Lock, LayoutDashboard, LogOut, Video } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import logo from '../assets/logo.svg';

interface NavigationProps {
  onLogout: () => void;
}

export function Navigation({ onLogout }: NavigationProps) {
  const { pathname } = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/home') return pathname === '/' || pathname === '/home';
    return pathname.startsWith(path);
  };
  
  const navItems = [
    { path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
    { path: '/lab', icon: <Video className="w-5 h-5" />, label: 'Virtual Lab' },
    { path: '/scanner', icon: <Search className="w-5 h-5" />, label: 'Scanner' },
    { path: '/threats', icon: <AlertTriangle className="w-5 h-5" />, label: 'Threats' },
    { path: '/hardening', icon: <Lock className="w-5 h-5" />, label: 'Hardening' },
  ];
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1A120B]/90 backdrop-blur-lg border-b border-[#D5CEA3]/20">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <NavLink 
            to="/home"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <img 
              src={logo} 
              alt="Cyber Sentinel Logo" 
              className="w-8 h-8"
              style={{ filter: 'brightness(0) saturate(100%) invert(84%) sepia(9%) saturate(1034%) hue-rotate(16deg) brightness(95%) contrast(92%)' }}
            />
            <span className="text-xl">
              <span className="text-[#D5CEA3]">Cyber</span>{' '}
              <span className="text-[#E5E5CB]">Sentinel</span>
            </span>
          </NavLink>

          <div className="flex items-center gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive(item.path)
                    ? 'bg-[#D5CEA3] text-[#1A120B]'
                    : 'text-[#E5E5CB] hover:bg-[#3C2A21] hover:text-[#D5CEA3]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 ml-4 rounded-lg text-[#E5E5CB] hover:bg-red-500/20 hover:text-red-400 transition-all duration-300"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

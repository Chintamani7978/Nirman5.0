import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthPage } from './components/AuthPage';
import { Hero } from './components/Hero';
import { Dashboard } from './components/Dashboard';
import { SecurityScanner } from './components/SecurityScanner';
import { ThreatDetection } from './components/ThreatDetection';
import { HardeningPlatform } from './components/HardeningPlatform';
import { VirtualCCTVLab } from './components/VirtualCCTVLab';
import { Navigation } from './components/Navigation';
import { AppProvider } from './context/AppContext';

const AppContent = ({ onLogout }: { onLogout: () => void }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    onLogout();
    navigate('/auth', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#1A120B] text-[#E5E5CB]">
      {location.pathname === '/home' ? (
        <Hero onLogout={handleLogout} />
      ) : (
        <>
          <Navigation onLogout={handleLogout} />
          <main className="pt-20">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/scanner" element={<SecurityScanner />} />
              <Route path="/threats" element={<ThreatDetection />} />
              <Route path="/hardening" element={<HardeningPlatform />} />
              <Route path="/lab" element={<VirtualCCTVLab />} />
              <Route path="/home" element={<Navigate to="/dashboard" replace />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </>
      )}
    </div>
  );
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    setIsAuthenticated(!!user);
  }, []);
  
  const handleLogin = (success: boolean) => {
    setIsAuthenticated(success);
    return success;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };


  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#1A120B] flex items-center justify-center">
        <div className="text-[#E5E5CB]">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <AppProvider>
        <Routes>
          <Route 
            path="/auth" 
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <AuthPage onLogin={handleLogin} />
              )
            } 
          />
          <Route 
            path="/*" 
            element={
              isAuthenticated ? (
                <AppContent onLogout={handleLogout} />
              ) : (
                <Navigate to="/auth" replace />
              )
            } 
          />
        </Routes>
      </AppProvider>
    </Router>
  );
}

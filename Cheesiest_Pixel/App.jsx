import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import About from './pages/About';
import Research from './pages/Research';
import PatientDashboard from './pages/dashboards/PatientDashboard';
import DoctorDashboard from './pages/dashboards/DoctorDashboard';
import ResearcherDashboard from './pages/dashboards/ResearcherDashboard';
import Loader from './components/Loader';
import ClinicoxChat from './components/ClinicoxChat';
import { login, logout } from './services/authService';
import { UserRole } from './types';
import { ThemeProvider } from './context/ThemeContext';

// --- Transition Loader Component ---
// Handles the visual entrance/exit of the loader overlay based on the parent's isLoading prop.
const TransitionLoader = ({ isLoading }) => {
    const [renderState, setRenderState] = useState('hidden');

    useEffect(() => {
        if (isLoading) {
            setRenderState('entering');
            // Double RAF to ensure the 'entering' class (opacity 0) is fully applied/painted 
            // before switching to 'active' (opacity 1). This eliminates jank.
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setRenderState('active');
                });
            });
        } else {
            setRenderState('exiting');
            // Match the CSS duration exactly + a tiny buffer
            const timer = setTimeout(() => {
                setRenderState('hidden');
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    if (renderState === 'hidden') return null;

    return (
        <div
            className={`fixed inset-0 z-[100] flex items-center justify-center bg-slate-50/90 dark:bg-slate-900/95 backdrop-blur-xl will-change-opacity
            transition-opacity duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)]
            ${renderState === 'entering' ? 'opacity-0' : ''}
            ${renderState === 'active' ? 'opacity-100' : ''}
            ${renderState === 'exiting' ? 'opacity-0 pointer-events-none' : ''}
        `}
        >
            <Loader />
        </div>
    );
};

// --- Main App Content ---
// Manages User State, Routing, and Transition Coordination
const AppContent = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [isLoading, setIsLoading] = useState(true); // Start true for initial load

    // Handle Route Changes to trigger animation
    useEffect(() => {
        setIsLoading(true);
        window.scrollTo(0, 0); // Reset scroll on nav

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500); // Wait for loader animation

        return () => clearTimeout(timer);
    }, [location.pathname]);

    const handleLogin = async (role) => {
        try {
            setIsLoading(true); // Trigger load on login action
            const loggedInUser = await login(role);
            setUser(loggedInUser);
            // Explicitly navigate to dashboard after login to ensure correct route rendering
            navigate('/dashboard');
        } catch (error) {
            console.error("Login failed", error);
            alert("Login failed. Please try again.");
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        setIsLoading(true);
        logout();
        setUser(null);
        setCurrentPage('dashboard');
        navigate('/'); // Ensure navigation back to landing on logout
    };

    const renderDashboard = () => {
        if (!user) return <Navigate to="/" />;

        switch (user.role) {
            case UserRole.PATIENT:
                return <PatientDashboard user={user} />;
            case UserRole.DOCTOR:
                return <DoctorDashboard user={user} />;
            case UserRole.RESEARCHER:
                return <ResearcherDashboard user={user} />;
            case UserRole.ADMIN:
                return <div className="p-10 text-center dark:text-dark-text">Admin Dashboard Placeholder</div>;
            default:
                return <div>Unknown Role</div>;
        }
    };

    return (
        <>
            <TransitionLoader isLoading={isLoading} />

            {/* 
         Main Content Wrapper 
         - Hides content when loading (Loader First)
         - Reveals content with animation when loading finishes (Then Page)
         - Removed scale transform to improve IntersectionObserver reliability
      */}
            <div
                className={`min-h-screen transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-opacity
          ${isLoading
                        ? 'opacity-0 blur-sm'
                        : 'opacity-100 blur-0'
                    }
        `}
            >
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing onLoginClick={handleLogin} />} />
                    <Route path="/about" element={<About onLoginClick={handleLogin} />} />
                    <Route path="/pricing" element={<Pricing onLoginClick={handleLogin} />} />
                    <Route path="/contact" element={<Contact onLoginClick={handleLogin} />} />
                    <Route path="/research" element={<Research onLoginClick={handleLogin} />} />

                    {/* Protected Dashboard Routes */}
                    <Route path="/dashboard" element={
                        user ? (
                            <Layout user={user} onLogout={handleLogout} onNavigate={setCurrentPage} currentPage={currentPage}>
                                {renderDashboard()}
                            </Layout>
                        ) : (
                            <Navigate to="/" />
                        )
                    } />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>

            {/* Global Chatbot - Placed outside the transformed div to ensure fixed positioning works correctly */}
            <ClinicoxChat />
        </>
    );
};

// --- Root App ---
const App = () => {
    return (
        <ThemeProvider>
            <HashRouter>
                <AppContent />
            </HashRouter>
        </ThemeProvider>
    );
};

export default App;

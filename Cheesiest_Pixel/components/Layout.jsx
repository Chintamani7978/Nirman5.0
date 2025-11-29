import React, { useState } from 'react';
import { UserRole } from '../types';
import {
    Menu, X, Home, FileText, User as UserIcon,
    Settings, LogOut, Activity, FlaskConical,
    Stethoscope, ShieldAlert, Video
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Layout = ({ children, user, onLogout, onNavigate, currentPage }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (!user) {
        return <>{children}</>; // Render plain content for login/landing pages
    }

    const getNavItems = (role) => {
        const common = [
            { id: 'dashboard', label: 'Dashboard', icon: Home },
            { id: 'profile', label: 'Profile', icon: UserIcon },
        ];

        switch (role) {
            case UserRole.PATIENT:
                return [
                    ...common,
                    { id: 'records', label: 'My Records', icon: FileText },
                    { id: 'telemedicine', label: 'Telemedicine', icon: Video },
                ];
            case UserRole.DOCTOR:
                return [
                    ...common,
                    { id: 'patients', label: 'My Patients', icon: UserIcon },
                    { id: 'diagnosis', label: 'AI Diagnosis', icon: Activity },
                    { id: 'telemedicine', label: 'Telemedicine', icon: Video },
                ];
            case UserRole.RESEARCHER:
                return [
                    ...common,
                    { id: 'analytics', label: 'Comparative Analytics', icon: FlaskConical },
                    { id: 'cohorts', label: 'Cohorts', icon: UserIcon },
                ];
            case UserRole.ADMIN:
                return [
                    ...common,
                    { id: 'users', label: 'User Management', icon: UserIcon },
                    { id: 'compliance', label: 'Compliance', icon: ShieldAlert },
                ];
            default:
                return common;
        }
    };

    const navItems = getNavItems(user.role);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex flex-col md:flex-row transition-colors duration-300">
            {/* Mobile Header */}
            <div className="md:hidden bg-white dark:bg-dark-surface shadow-sm p-4 flex justify-between items-center sticky top-0 z-20 border-b border-gray-100 dark:border-dark-border">
                <div className="flex items-center space-x-2 text-primary dark:text-dark-primary font-bold text-xl">
                    <Activity size={24} />
                    <span>SamhitaFusion</span>
                </div>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-700 dark:text-dark-text">
                        {isSidebarOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Sidebar */}
            <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 dark:bg-dark-surface text-white transform transition-transform duration-300 ease-in-out border-r border-transparent dark:border-dark-border
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="p-6 flex items-center space-x-2 border-b border-slate-700 dark:border-dark-border">
                    <div className="bg-gradient-to-tr from-blue-500 to-red-500 dark:from-dark-primary dark:to-dark-secondary p-2 rounded-lg">
                        <Activity size={24} className="text-white" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-white dark:text-dark-text">SamhitaFusion</span>
                </div>

                <div className="p-4">
                    <div className="flex items-center space-x-3 mb-8 p-3 bg-slate-800 dark:bg-dark-bg rounded-lg">
                        <img src={user.avatar} alt="User" className="w-10 h-10 rounded-full border-2 border-primary dark:border-dark-primary" />
                        <div>
                            <p className="font-medium text-sm text-white dark:text-dark-text">{user.name}</p>
                            <p className="text-xs text-slate-400 dark:text-dark-muted capitalize">{user.role.toLowerCase()}</p>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    onNavigate(item.id);
                                    setIsSidebarOpen(false);
                                }}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${currentPage === item.id
                                        ? 'bg-primary dark:bg-dark-primary text-white'
                                        : 'text-slate-300 dark:text-dark-muted hover:bg-slate-800 dark:hover:bg-dark-bg hover:text-white dark:hover:text-dark-text'
                                    }`}
                            >
                                <item.icon size={20} />
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700 dark:border-dark-border space-y-4">
                    {/* Desktop Toggle location */}
                    <div className="flex justify-between items-center px-4">
                        <span className="text-xs text-slate-400 dark:text-dark-muted">Theme</span>
                        <ThemeToggle />
                    </div>

                    <button
                        onClick={onLogout}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-red-400 dark:text-dark-accent hover:text-red-300 dark:hover:text-red-300 transition-colors"
                    >
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)] md:h-screen p-4 md:p-8 bg-gray-50 dark:bg-dark-bg text-slate-900 dark:text-dark-text transition-colors duration-300">
                {children}
            </main>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default Layout;

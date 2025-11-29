import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, Menu, X, ArrowRight, User } from 'lucide-react';
import { UserRole } from '../types';
import ThemeToggle from './ThemeToggle';

const PublicNavbar = ({ onLoginClick }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="absolute top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4">
            {/* Floating Container - Transparent and borderless for seamless merge */}
            <div className="w-full max-w-7xl bg-transparent rounded-2xl border-none shadow-none transition-all duration-300">
                <div className="px-4 md:px-6">
                    <div className="flex justify-between items-center h-20">

                        {/* Logo Section */}
                        <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/40 dark:bg-dark-primary/40 rounded-full blur-md animate-pulse-slow"></div>
                                <div className="relative bg-gradient-to-tr from-primary to-secondary dark:from-dark-primary dark:to-dark-detail p-2.5 rounded-xl border border-white/20 text-white group-hover:rotate-180 transition-transform duration-700 ease-out">
                                    <Activity size={22} strokeWidth={2.5} />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-display font-bold text-2xl tracking-tight text-slate-800 dark:text-white leading-none">
                                    Samhita<span className="text-secondary dark:text-dark-primary">Fusion</span>
                                </span>
                                <span className="text-[10px] font-mono tracking-widest text-slate-500 dark:text-dark-muted uppercase">Integrated Healthcare</span>
                            </div>
                        </div>

                        {/* Desktop Menu - Enhanced pill to stand out slightly more against background */}
                        <div className="hidden md:flex space-x-1 items-center bg-white/40 dark:bg-black/30 p-1.5 rounded-full border border-white/20 dark:border-white/10 backdrop-blur-xl shadow-sm">
                            {['Home', 'About', 'Pricing', 'Contact'].map((item) => (
                                <NavLink
                                    key={item}
                                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                    className={({ isActive }) =>
                                        `px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${isActive
                                            ? 'bg-white dark:bg-white/10 text-secondary dark:text-dark-primary shadow-sm'
                                            : 'text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
                                        }`
                                    }
                                >
                                    {item}
                                </NavLink>
                            ))}
                        </div>

                        {/* Right Side Actions */}
                        <div className="hidden md:flex items-center gap-4">
                            <ThemeToggle />

                            <button
                                onClick={() => onLoginClick(UserRole.PATIENT)}
                                className="group relative overflow-hidden bg-slate-900 dark:bg-dark-primary text-white dark:text-dark-bg px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-sky-900/20 dark:shadow-sky-500/20 transition-all hover:scale-[1.02] hover:shadow-xl"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                                <span className="flex items-center gap-2">
                                    <User size={16} /> Patient Portal
                                </span>
                            </button>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <div className="md:hidden flex items-center gap-4">
                            <ThemeToggle />
                            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-800 dark:text-white p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                                {isOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="md:hidden absolute top-28 left-4 right-4 glass dark:bg-dark-surface rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 animate-fade-in-up z-40 overflow-hidden">
                    <div className="p-2 space-y-1">
                        {['Home', 'About', 'Pricing', 'Contact'].map((item) => (
                            <NavLink
                                key={item}
                                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    `block px-4 py-3 rounded-xl text-lg font-medium transition-colors ${isActive
                                        ? 'bg-primary/10 dark:bg-dark-primary/10 text-primary dark:text-dark-primary'
                                        : 'text-slate-700 dark:text-dark-text hover:bg-slate-50 dark:hover:bg-white/5'
                                    }`
                                }
                            >
                                {item}
                            </NavLink>
                        ))}
                        <div className="h-px bg-gray-200 dark:bg-gray-700 my-2 mx-4"></div>
                        <button
                            onClick={() => {
                                onLoginClick(UserRole.PATIENT);
                                setIsOpen(false);
                            }}
                            className="w-full flex justify-center items-center gap-2 bg-secondary dark:bg-dark-primary text-white dark:text-dark-bg px-6 py-3 rounded-xl font-bold shadow-md"
                        >
                            <User size={18} /> Access Patient Portal
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default PublicNavbar;

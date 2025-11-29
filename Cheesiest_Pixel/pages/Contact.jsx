import React from 'react';
import PublicNavbar from '../components/PublicNavbar';
import ParticleBackground from '../components/ParticleBackground';
import { UserRole } from '../types';
import { Mail, MapPin, Phone, Send, MessageSquare } from 'lucide-react';

const Contact = ({ onLoginClick }) => {
    return (
        <div className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-dark-bg font-sans transition-colors duration-300">
            <ParticleBackground />
            <PublicNavbar onLoginClick={onLoginClick} />

            <div className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left Side: Info */}
                    <div className="animate-fade-in-up space-y-8">
                        <div>
                            <h2 className="text-secondary dark:text-dark-secondary font-bold tracking-wide uppercase text-sm mb-3">Get in Touch</h2>
                            <h1 className="text-4xl md:text-6xl font-display font-bold text-slate-800 dark:text-dark-text mb-6 leading-tight">
                                Let's Build the <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary dark:from-dark-primary dark:to-dark-secondary">Future of Health</span>
                            </h1>
                            <p className="text-lg text-slate-500 dark:text-dark-muted leading-relaxed">
                                Have questions about our AI diagnostics or integrated medicine approach? Our team of researchers and doctors is here to help.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {[
                                { icon: Mail, title: 'Email Us', desc: 'support@samhitafusion.com', color: 'text-primary dark:text-dark-primary' },
                                { icon: Phone, title: 'Call Us', desc: '+1 (555) 123-4567', color: 'text-secondary dark:text-dark-secondary' },
                                { icon: MapPin, title: 'Visit HQ', desc: '12 Science Park, Innovation City', color: 'text-orange-500 dark:text-orange-400' }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center space-x-4 bg-white/60 dark:bg-dark-surface/60 p-4 rounded-2xl backdrop-blur-sm border border-white dark:border-dark-border hover:border-primary/30 dark:hover:border-dark-primary/30 transition-colors shadow-sm">
                                    <div className={`p-3 rounded-xl bg-white dark:bg-dark-bg shadow-sm ${item.color}`}>
                                        <item.icon size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 dark:text-dark-text">{item.title}</h4>
                                        <p className="text-slate-500 dark:text-dark-muted text-sm">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Form */}
                    <div className="animate-fade-in-up delay-200">
                        <div className="bg-white/80 dark:bg-dark-surface/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white dark:border-dark-border relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-peach/30 dark:bg-dark-primary/20 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-peach/50 dark:group-hover:bg-dark-primary/40 transition-all duration-700"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/20 dark:bg-dark-secondary/20 rounded-full filter blur-3xl translate-y-1/2 -translate-x-1/2 group-hover:bg-primary/40 dark:group-hover:bg-dark-secondary/40 transition-all duration-700"></div>

                            <h3 className="text-2xl font-bold text-slate-800 dark:text-dark-text mb-6 flex items-center gap-2 relative z-10">
                                <MessageSquare className="text-secondary dark:text-dark-secondary" /> Send a Message
                            </h3>

                            <form className="space-y-5 relative z-10">
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 dark:text-dark-muted uppercase tracking-wider">First Name</label>
                                        <input type="text" className="w-full bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-dark-text border-none rounded-xl p-3 focus:ring-2 focus:ring-primary/50 dark:focus:ring-dark-primary/50 outline-none transition-all" placeholder="John" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 dark:text-dark-muted uppercase tracking-wider">Last Name</label>
                                        <input type="text" className="w-full bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-dark-text border-none rounded-xl p-3 focus:ring-2 focus:ring-primary/50 dark:focus:ring-dark-primary/50 outline-none transition-all" placeholder="Doe" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 dark:text-dark-muted uppercase tracking-wider">Email Address</label>
                                    <input type="email" className="w-full bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-dark-text border-none rounded-xl p-3 focus:ring-2 focus:ring-primary/50 dark:focus:ring-dark-primary/50 outline-none transition-all" placeholder="john@example.com" />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 dark:text-dark-muted uppercase tracking-wider">Message</label>
                                    <textarea rows={4} className="w-full bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-dark-text border-none rounded-xl p-3 focus:ring-2 focus:ring-primary/50 dark:focus:ring-dark-primary/50 outline-none transition-all resize-none" placeholder="How can we help you today?"></textarea>
                                </div>

                                <button type="button" className="w-full bg-secondary dark:bg-dark-primary hover:bg-teal-700 dark:hover:bg-dark-secondary text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-teal-500/20 dark:shadow-green-900/30 transition-all hover:-translate-y-1 flex justify-center items-center gap-2">
                                    <Send size={20} /> Send Message
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Contact;

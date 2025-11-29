import React, { useRef, useEffect } from 'react';
import { UserRole } from '../types';
import PublicNavbar from '../components/PublicNavbar';
import HolographicBackground from '../components/HolographicBackground';
import KnowledgeGraph from '../components/KnowledgeGraph';
import Footer from '../components/Footer';
import ScrollReveal from '../components/ScrollReveal';
import { Link } from 'react-router-dom';
import {
    FileText, UploadCloud, Search, Siren,
    ArrowRight, ChevronDown, Sparkles, Database,
    Stethoscope, Users, FlaskConical, ShieldCheck
} from 'lucide-react';

// --- Helper Components ---

const SpotlightCard = ({ children, onClick, className = "", glowColor = "rgba(135, 206, 235, 0.15)" }) => {
    const divRef = useRef(null);
    const glowRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!divRef.current || !glowRef.current) return;
            const rect = divRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Direct DOM manipulation for zero-lag
            glowRef.current.style.opacity = '1';
            glowRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, ${glowColor}, transparent 40%)`;
        };

        const handleMouseLeave = () => {
            if (glowRef.current) glowRef.current.style.opacity = '0';
        };

        const el = divRef.current;
        if (el) {
            el.addEventListener('mousemove', handleMouseMove);
            el.addEventListener('mouseleave', handleMouseLeave);
        }

        return () => {
            if (el) {
                el.removeEventListener('mousemove', handleMouseMove);
                el.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, [glowColor]);

    return (
        <div
            ref={divRef}
            onClick={onClick}
            className={`relative overflow-hidden rounded-2xl border border-slate-200/50 dark:border-white/10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:shadow-2xl hover:border-slate-300 dark:hover:border-white/20 hover:-translate-y-1 ${className} will-change-transform`}
        >
            <div
                ref={glowRef}
                className="pointer-events-none absolute -inset-px transition-opacity duration-300 opacity-0 will-change-[background,opacity]"
            />
            <div className="relative h-full z-10">{children}</div>
        </div>
    );
};

const ResearchWidget = () => {
    return (
        <div className="w-full max-w-4xl mx-auto mt-20 p-1 bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent rounded-2xl">
            <div className="bg-white/50 dark:bg-slate-900/60 backdrop-blur-xl rounded-xl border border-white/20 p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">

                {/* Animated Background Elements inside widget */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 animate-pulse-slow"></div>

                <div className="flex items-start gap-4 z-10">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg shadow-inner">
                        <Database size={28} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                            Research & Development <span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span>
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md">
                            Access real-time clinical data streams, whitepapers on integrated medicine, and global contributor metrics.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-6 z-10">
                    <div className="hidden md:block text-right">
                        <div className="text-2xl font-mono font-bold text-slate-800 dark:text-white">14.2k</div>
                        <div className="text-[10px] uppercase tracking-wider text-slate-500">Papers Indexed</div>
                    </div>

                    <Link to="/research">
                        <button className="group relative px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-black rounded-lg font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 overflow-hidden">
                            <span className="relative z-10 flex items-center gap-2">
                                LIVE DATA <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-teal-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

const RoleCard = ({ title, description, icon: Icon, role, colorClass, onClick }) => (
    <button
        onClick={onClick}
        className="group relative flex flex-col items-start text-left p-6 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 hover:border-transparent transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-2 w-full h-full will-change-transform"
    >
        {/* Hover Gradient Border */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${colorClass} opacity-0 group-hover:opacity-100 -z-10 transition-opacity duration-500`} />
        <div className="absolute inset-[1px] rounded-2xl bg-slate-50 dark:bg-slate-900 -z-10" />

        <div className={`p-3 rounded-xl bg-slate-100 dark:bg-slate-800 mb-4 group-hover:scale-110 transition-transform duration-500 ease-out ${colorClass.split(' ')[0].replace('from-', 'text-')}`}>
            <Icon size={28} />
        </div>

        <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">{description}</p>

        <div className="mt-auto flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-300">
            <span>Access Portal</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </div>
    </button>
);


const Landing = ({ onLoginClick }) => {
    const heroContentRef = useRef(null);

    // Optimized Parallax Effect using requestAnimationFrame
    useEffect(() => {
        let animationFrameId;
        let targetX = 0;
        let targetY = 0;
        let currentX = 0;
        let currentY = 0;

        const handleMouseMove = (e) => {
            // Normalize mouse position (-1 to 1)
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = (e.clientY / window.innerHeight) * 2 - 1;

            targetX = x * -20; // Reduced range for tighter feel
            targetY = y * -20;
        };

        const animate = () => {
            // Smoother lerp factor
            currentX += (targetX - currentX) * 0.05;
            currentY += (targetY - currentY) * 0.05;

            if (heroContentRef.current) {
                heroContentRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('mousemove', handleMouseMove);
        animationFrameId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="min-h-screen relative overflow-x-hidden font-sans text-slate-900 dark:text-dark-text transition-colors duration-700 bg-transparent selection:bg-primary/20">

            {/* 3D Reactive Background */}
            <HolographicBackground />

            <PublicNavbar onLoginClick={onLoginClick} />

            {/* Hero Section */}
            <header className="relative z-10 min-h-screen flex flex-col justify-center items-center px-6 pt-20 perspective-1000">

                {/* Subtle HUD Elements */}
                <div className="absolute top-32 left-10 hidden lg:block opacity-20 dark:opacity-40 pointer-events-none">
                    <div className="flex flex-col gap-3 font-mono text-[9px] text-slate-500 dark:text-slate-400 tracking-[0.3em]">
                        <span className="flex items-center gap-2"><div className="w-1 h-1 bg-primary rounded-full animate-pulse" /> SYS.DIAGNOSTIC</span>
                        <span className="flex items-center gap-2"><div className="w-1 h-1 bg-primary rounded-full animate-pulse delay-75" /> NET.SECURE</span>
                        <span className="flex items-center gap-2"><div className="w-1 h-1 bg-primary rounded-full animate-pulse delay-150" /> AI.ACTIVE</span>
                    </div>
                </div>

                {/* Parallax Content Wrapper */}
                <div
                    ref={heroContentRef}
                    className="text-center max-w-6xl mx-auto mb-16 relative will-change-transform"
                >

                    {/* Status Badge */}
                    <ScrollReveal>
                        <div className="inline-flex items-center space-x-3 bg-white/30 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full pl-3 pr-6 py-1.5 mb-10 backdrop-blur-md transition-all hover:bg-white/50 dark:hover:bg-white/10 mx-auto">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-[10px] font-mono font-medium text-slate-600 dark:text-slate-300 tracking-[0.2em] uppercase">System Operational</span>
                        </div>
                    </ScrollReveal>

                    {/* Title */}
                    <ScrollReveal delay={200}>
                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold mb-8 tracking-tight leading-[0.95] drop-shadow-sm">
                            <div className="overflow-hidden">
                                <span className="block bg-clip-text text-transparent bg-gradient-to-b from-slate-700 to-slate-500 dark:from-white dark:to-slate-500 pb-2">
                                    PRECISION
                                </span>
                            </div>
                            <div className="overflow-hidden relative">
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-teal-400 to-secondary dark:from-sky-300 dark:via-teal-200 dark:to-emerald-300 pb-4 filter drop-shadow-[0_0_25px_rgba(135,206,235,0.3)]">
                                    MEDICINE
                                </span>
                                <Sparkles className="absolute top-0 right-[15%] text-teal-400 w-8 h-8 animate-pulse-slow opacity-60 hidden md:block" />
                            </div>
                        </h1>
                    </ScrollReveal>

                    <ScrollReveal delay={400}>
                        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 leading-relaxed max-w-2xl mx-auto font-light">
                            Merging <span className="text-slate-900 dark:text-white font-medium">Ayurvedic Wisdom</span> with <span className="text-slate-900 dark:text-white font-medium">AI Diagnostics</span>.
                            <br className="hidden md:block" /> An intelligent ecosystem for the future of care.
                        </p>
                    </ScrollReveal>

                    {/* Modern Buttons */}
                    <ScrollReveal delay={600}>
                        <div className="flex flex-col sm:flex-row justify-center gap-6">
                            <button
                                onClick={() => onLoginClick(UserRole.DOCTOR)}
                                className="group relative px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full hover:shadow-[0_0_30px_rgba(135,206,235,0.4)] transition-all duration-500 ease-out overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out"></div>
                                <span className="relative z-10 flex items-center gap-3 text-sm font-bold tracking-widest uppercase">
                                    Doctor Access <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>

                            <button
                                onClick={() => onLoginClick(UserRole.RESEARCHER)}
                                className="group px-8 py-4 bg-transparent border border-slate-300 dark:border-white/20 text-slate-800 dark:text-white rounded-full hover:bg-slate-50 dark:hover:bg-white/5 transition-all duration-300 backdrop-blur-sm"
                            >
                                <span className="block text-sm font-bold tracking-widest uppercase">
                                    Research Hub
                                </span>
                            </button>
                        </div>
                    </ScrollReveal>
                </div>

                {/* Floating HUD Panels Grid - Interactive Spotlight */}
                <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-20 perspective-1000">

                    <ScrollReveal delay={700} direction="up" className="h-full">
                        <SpotlightCard className="cursor-pointer group h-full" onClick={() => { }}>
                            <div className="h-full p-8 flex flex-col items-start justify-between min-h-[220px]">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-300 mb-4 ring-1 ring-blue-500/10 transition-transform group-hover:scale-110 duration-300">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2 block">Database</span>
                                    <h3 className="text-xl font-display font-semibold text-slate-800 dark:text-white mb-2 group-hover:text-primary transition-colors">Global Research</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Comparative analytics engine merging clinical trials with traditional studies.</p>
                                </div>
                            </div>
                        </SpotlightCard>
                    </ScrollReveal>

                    <ScrollReveal delay={800} direction="up" className="h-full">
                        <SpotlightCard className="cursor-pointer group h-full" onClick={() => { }} glowColor="rgba(168, 85, 247, 0.15)">
                            <div className="h-full p-8 flex flex-col items-start justify-between min-h-[220px]">
                                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-purple-600 dark:text-purple-300 mb-4 ring-1 ring-purple-500/10 transition-transform group-hover:scale-110 duration-300">
                                    <UploadCloud size={24} />
                                </div>
                                <div>
                                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2 block">Secure Transfer</span>
                                    <h3 className="text-xl font-display font-semibold text-slate-800 dark:text-white mb-2 group-hover:text-purple-400 transition-colors">Upload Case</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Encryption-grade patient history upload for instant AI differential diagnosis.</p>
                                </div>
                            </div>
                        </SpotlightCard>
                    </ScrollReveal>

                    <ScrollReveal delay={900} direction="up" className="h-full">
                        <SpotlightCard className="cursor-pointer group h-full" onClick={() => { }} glowColor="rgba(20, 184, 166, 0.15)">
                            <div className="h-full p-8 flex flex-col items-start justify-between min-h-[220px]">
                                <div className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-xl text-teal-600 dark:text-teal-300 mb-4 ring-1 ring-teal-500/10 transition-transform group-hover:scale-110 duration-300">
                                    <Search size={24} />
                                </div>
                                <div>
                                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2 block">Geo-Locate</span>
                                    <h3 className="text-xl font-display font-semibold text-slate-800 dark:text-white mb-2 group-hover:text-teal-400 transition-colors">Find Specialists</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Locate verified practitioners in Allopathy, Ayurveda, and Homeopathy.</p>
                                </div>
                            </div>
                        </SpotlightCard>
                    </ScrollReveal>

                    <ScrollReveal delay={1000} direction="up" className="h-full">
                        <SpotlightCard className="cursor-pointer group border-red-100 dark:border-red-900/30 bg-red-50/30 dark:bg-red-900/10 h-full" onClick={() => { }} glowColor="rgba(239, 68, 68, 0.15)">
                            <div className="h-full p-8 flex flex-col items-start justify-between min-h-[220px]">
                                {/* Pulse Effect */}
                                <div className="absolute top-6 right-6">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                    </span>
                                </div>
                                <div className="p-3 bg-red-100 dark:bg-red-900/40 rounded-xl text-red-600 dark:text-red-400 mb-4 ring-1 ring-red-500/10 transition-transform group-hover:scale-110 duration-300">
                                    <Siren size={24} />
                                </div>
                                <div>
                                    <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest mb-2 block">Priority 1</span>
                                    <h3 className="text-xl font-display font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-red-500 transition-colors">Emergency SOS</h3>
                                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">Rapid response protocol. Immediate connection to nearest emergency services.</p>
                                </div>
                            </div>
                        </SpotlightCard>
                    </ScrollReveal>

                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 animate-bounce text-slate-300 dark:text-slate-600 transition-colors">
                    <ChevronDown size={28} />
                </div>
            </header>

            {/* Knowledge Graph Section */}
            <section className="relative z-10 pt-32 pb-20 px-6 border-t border-slate-200/50 dark:border-white/5 bg-white/30 dark:bg-slate-900/30 backdrop-blur-3xl">
                <div className="max-w-7xl mx-auto">
                    <ScrollReveal>
                        <div className="text-center mb-20">
                            <h2 className="text-primary dark:text-primary font-bold tracking-[0.2em] uppercase text-xs mb-4">Interconnected Ecosystem</h2>
                            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-800 dark:text-white mb-6">
                                Bridging <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-400">Wisdom</span> & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">Science</span>
                            </h2>
                            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                                Explore the neural network below to understand how SamhitaFusion connects ancient holistic practices with modern medical technology.
                            </p>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal delay={200}>
                        <KnowledgeGraph />
                    </ScrollReveal>

                    {/* NEW RESEARCH WIDGET */}
                    <ScrollReveal delay={400}>
                        <ResearchWidget />
                    </ScrollReveal>

                </div>
            </section>

            {/* NEW SECTION: Role Based Features */}
            <section className="relative z-10 py-32 px-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800/50">
                <div className="max-w-7xl mx-auto">
                    <ScrollReveal>
                        <div className="mb-20">
                            <span className="text-teal-500 font-mono text-xs font-bold tracking-widest uppercase mb-2 block">Unified Architecture</span>
                            <h2 className="text-4xl md:text-6xl font-display font-bold text-slate-900 dark:text-white mb-6 max-w-2xl">
                                Designed for Every <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">Healthcare Role</span>
                            </h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl">
                                A seamless digital infrastructure connecting patients, healers, scientists, and administrators in a single loop.
                            </p>
                        </div>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <ScrollReveal delay={0} direction="up" className="h-full">
                            <RoleCard
                                title="Patients"
                                description="Securely own your health history. Integrated dashboards for tracking vitals, prescriptions, and tele-consults."
                                icon={Users}
                                role={UserRole.PATIENT}
                                colorClass="from-teal-400 to-cyan-500"
                                onClick={() => onLoginClick(UserRole.PATIENT)}
                            />
                        </ScrollReveal>

                        <ScrollReveal delay={150} direction="up" className="h-full">
                            <RoleCard
                                title="Doctors"
                                description="AI-assisted differential diagnosis. Merge Allopathic data with Ayurvedic markers for holistic treatment."
                                icon={Stethoscope}
                                role={UserRole.DOCTOR}
                                colorClass="from-blue-500 to-indigo-500"
                                onClick={() => onLoginClick(UserRole.DOCTOR)}
                            />
                        </ScrollReveal>

                        <ScrollReveal delay={300} direction="up" className="h-full">
                            <RoleCard
                                title="Researchers"
                                description="Access global anonymized cohorts. Conduct comparative efficacy studies between medical systems."
                                icon={FlaskConical}
                                role={UserRole.RESEARCHER}
                                colorClass="from-purple-500 to-fuchsia-500"
                                onClick={() => onLoginClick(UserRole.RESEARCHER)}
                            />
                        </ScrollReveal>

                        <ScrollReveal delay={450} direction="up" className="h-full">
                            <RoleCard
                                title="Admins"
                                description="Hospital operations oversight. Compliance management and resource allocation for clinics."
                                icon={ShieldCheck}
                                role={UserRole.ADMIN}
                                colorClass="from-orange-400 to-amber-500"
                                onClick={() => onLoginClick(UserRole.ADMIN)}
                            />
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* Footer Section */}
            <Footer />

        </div>
    );
};

export default Landing;

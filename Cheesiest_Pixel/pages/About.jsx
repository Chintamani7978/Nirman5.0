import React, { useRef, useState } from 'react';
import PublicNavbar from '../components/PublicNavbar';
import ParticleBackground from '../components/ParticleBackground';
import MissionCard from '../components/MissionCard';
import Footer from '../components/Footer';
import { UserRole } from '../types';
import { Globe, Leaf, Users, Dna, Activity, Scale, Fingerprint } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

// 3D Tilt Card Component for Hyperrealism
const TiltCard = ({ children, className }) => {
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5; // Subtle tilt max 5deg
        const rotateY = ((x - centerX) / centerX) * 5;

        setRotation({ x: rotateX, y: rotateY });
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setRotation({ x: 0, y: 0 });
        setOpacity(0);
    };

    return (
        <div
            className={`relative transition-transform duration-200 ease-out transform preserve-3d ${className} will-change-transform`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1, 1, 1)`,
            }}
        >
            {/* Glossy Overlay for sheen effect */}
            <div
                className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-500 rounded-3xl mix-blend-overlay"
                style={{ opacity: opacity * 0.5 }}
            />
            {children}
        </div>
    );
};

const About = ({ onLoginClick }) => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-dark-bg font-sans selection:bg-primary/30 transition-colors duration-700">
            <ParticleBackground />
            <PublicNavbar onLoginClick={onLoginClick} />

            {/* Hero Section: The Renaissance */}
            {/* Changed layout to use gap-16 and py-32 to prevent overlap of the system badge */}
            <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 py-32 gap-16 lg:gap-24">

                {/* Dynamic Background Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 dark:bg-primary/10 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" />

                <div className="z-10 text-center max-w-5xl mx-auto animate-fade-in-up flex flex-col items-center gap-8">
                    <span className="inline-block px-5 py-2 rounded-full border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md text-xs font-mono tracking-[0.3em] uppercase text-slate-600 dark:text-slate-400 shadow-sm">
                        System V 2.4 // Philosophy
                    </span>
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold leading-[0.9] tracking-tighter">
                        <span className="block text-slate-300 dark:text-slate-700 opacity-50 text-4xl md:text-6xl mb-4 font-light tracking-normal">
                            Orchestrating
                        </span>
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-300 dark:to-white animate-gradient-x drop-shadow-2xl pb-2">
                            THE RENAISSANCE
                        </span>
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-secondary via-primary to-purple-500 animate-gradient-x text-5xl md:text-7xl lg:text-8xl mt-2 pb-4">
                            OF HEALING
                        </span>
                    </h1>
                    <p className="text-lg md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
                        Where the algorithmic precision of <span className="font-semibold text-primary dark:text-dark-primary">Artificial Intelligence</span> meets the intuitive depth of <span className="font-semibold text-secondary dark:text-dark-secondary">Ayurvedic Wisdom</span>.
                    </p>
                </div>

                {/* Dynamic Mission Card - Added top margin for safety */}
                <div className="z-20 w-full flex justify-center animate-fade-in-up delay-300">
                    <MissionCard />
                </div>
            </div>

            {/* The Trinity Section (3D Tilt Cards) */}
            <section className="py-32 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <ScrollReveal>
                        <div className="flex items-end justify-between mb-16 px-4 border-b border-slate-200 dark:border-slate-800 pb-8">
                            <div>
                                <h2 className="text-4xl font-display font-bold text-slate-800 dark:text-dark-text">The Trinity of Care</h2>
                                <p className="text-slate-500 dark:text-dark-muted mt-2">Our foundational pillars for a new healthcare paradigm.</p>
                            </div>
                            <div className="hidden md:block text-right">
                                <span className="block text-3xl font-mono font-bold text-slate-200 dark:text-slate-800">01</span>
                            </div>
                        </div>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Wisdom Card */}
                        <ScrollReveal delay={100} className="h-full">
                            <TiltCard className="group h-[500px]">
                                <div className="h-full bg-white/60 dark:bg-slate-800/40 backdrop-blur-2xl rounded-[2rem] border border-white/60 dark:border-white/5 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col justify-between transition-colors group-hover:bg-white/80 dark:group-hover:bg-slate-800/60">
                                    <div>
                                        <div className="w-16 h-16 rounded-2xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center mb-8 shadow-inner transition-transform group-hover:scale-110 duration-500">
                                            <Leaf className="w-8 h-8 text-green-600 dark:text-green-400" />
                                        </div>
                                        <h3 className="text-3xl font-display font-bold text-slate-800 dark:text-white mb-4">Ancestral Wisdom</h3>
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                            We digitize the <i>Samhitas</i>, extracting structured data from millennia of observation. By validating traditional protocols with modern metrics, we preserve heritage not as history, but as living science.
                                        </p>
                                    </div>
                                    <div className="w-full h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 w-3/4 rounded-full" />
                                    </div>
                                </div>
                            </TiltCard>
                        </ScrollReveal>

                        {/* Intelligence Card */}
                        <ScrollReveal delay={200} className="h-full">
                            <TiltCard className="group h-[500px]">
                                <div className="h-full bg-white/60 dark:bg-slate-800/40 backdrop-blur-2xl rounded-[2rem] border border-white/60 dark:border-white/5 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col justify-between transition-colors group-hover:bg-white/80 dark:group-hover:bg-slate-800/60">
                                    <div>
                                        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-8 shadow-inner transition-transform group-hover:scale-110 duration-500">
                                            <Activity className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <h3 className="text-3xl font-display font-bold text-slate-800 dark:text-white mb-4">Adaptive Intelligence</h3>
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                            Our neural networks don't just diagnose; they learn. By correlating genomic markers with <i>Prakriti</i> (constitution), our AI tailors interventions that are mathematically precise and biologically innate.
                                        </p>
                                    </div>
                                    <div className="w-full h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 w-full rounded-full" />
                                    </div>
                                </div>
                            </TiltCard>
                        </ScrollReveal>

                        {/* Empathy Card */}
                        <ScrollReveal delay={300} className="h-full">
                            <TiltCard className="group h-[500px]">
                                <div className="h-full bg-white/60 dark:bg-slate-800/40 backdrop-blur-2xl rounded-[2rem] border border-white/60 dark:border-white/5 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col justify-between transition-colors group-hover:bg-white/80 dark:group-hover:bg-slate-800/60">
                                    <div>
                                        <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center mb-8 shadow-inner transition-transform group-hover:scale-110 duration-500">
                                            <Globe className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <h3 className="text-3xl font-display font-bold text-slate-800 dark:text-white mb-4">Universal Access</h3>
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                            Technology is void without reach. Our low-bandwidth telemedicine infrastructure ensures that world-class integrated care reaches the remotest villages, democratizing health for all.
                                        </p>
                                    </div>
                                    <div className="w-full h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-500 w-4/5 rounded-full" />
                                    </div>
                                </div>
                            </TiltCard>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* The Fusion Engine Section - Dark Mode Contrast */}
            <section className="py-32 relative overflow-hidden bg-slate-900 dark:bg-black text-white">
                {/* Background Visuals */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

                    {/* Visual Metaphor */}
                    <ScrollReveal direction="right">
                        <div className="relative order-2 lg:order-1 h-[500px] flex items-center justify-center">
                            {/* Outer Ring */}
                            <div className="absolute w-96 h-96 border border-slate-700/50 rounded-full animate-[spin_20s_linear_infinite]" />
                            <div className="absolute w-96 h-96 border-t border-b border-primary/50 rounded-full animate-[spin_10s_linear_infinite]" />

                            {/* Inner Ring */}
                            <div className="absolute w-64 h-64 border border-slate-700/50 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                            <div className="absolute w-64 h-64 border-l border-r border-secondary/50 rounded-full animate-[spin_8s_linear_infinite_reverse]" />

                            {/* Core */}
                            <div className="relative z-10 w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-full shadow-[0_0_50px_rgba(135,206,235,0.5)] animate-pulse-slow flex items-center justify-center backdrop-blur-md">
                                <Dna size={48} className="text-white" />
                            </div>

                            {/* Floating Particles */}
                            <div className="absolute inset-0">
                                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-ping" />
                                <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-secondary rounded-full animate-ping delay-700" />
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Content */}
                    <div className="order-1 lg:order-2">
                        <ScrollReveal delay={100}>
                            <span className="text-primary font-mono tracking-widest uppercase text-sm mb-4 block">The Symbiotic Engine</span>
                            <h2 className="text-5xl md:text-6xl font-display font-bold mb-8 leading-tight">
                                More Than Integration.<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Evolution.</span>
                            </h2>
                            <div className="space-y-6 text-lg text-slate-300 font-light leading-relaxed">
                                <p>
                                    We don't simply place two medical systems side by side. We create a dialogue between them.
                                </p>
                                <p>
                                    Our platform acts as a high-fidelity translation layer, interpreting subjective pulse readings (<i>Nadi Pariksha</i>) through the lens of cardiovascular analytics, and viewing genetic sequencing through the holistic framework of the <i>Tridosha</i>.
                                </p>
                                <p>
                                    The result is a new language of health—one that speaks to the molecular reality of your body and the lived reality of your being.
                                </p>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal delay={200}>
                            <div className="mt-12 flex items-center gap-6">
                                <div className="flex -space-x-4">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-12 h-12 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-xs text-slate-400">
                                            <Users size={16} />
                                        </div>
                                    ))}
                                </div>
                                <span className="text-sm font-mono text-slate-400">JOINING 50+ RESEARCH INSTITUTES</span>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* Impact Stats Section */}
            <section className="py-24 px-6 relative bg-slate-50 dark:bg-dark-bg border-t border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { label: 'Patient Outcomes', value: '40%', sub: 'Improvement in Chronic Care', icon: Activity },
                            { label: 'Research Data', value: '2.5TB', sub: 'Structured Ayurvedic Knowledge', icon: Fingerprint },
                            { label: 'Global Reach', value: '120+', sub: 'Partner Clinics Worldwide', icon: Globe },
                            { label: 'Cost Reduction', value: '60%', sub: 'In Rural Deployments', icon: Scale },
                        ].map((stat, idx) => (
                            <ScrollReveal key={idx} delay={idx * 100}>
                                <div className="p-6 rounded-2xl bg-white dark:bg-dark-surface border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-shadow duration-300 group">
                                    <stat.icon className="w-6 h-6 text-primary mb-4 group-hover:scale-110 transition-transform" />
                                    <h4 className="text-4xl font-bold text-slate-900 dark:text-white mb-2 font-display">{stat.value}</h4>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">{stat.label}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{stat.sub}</p>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Footer */}
            <section className="py-32 text-center px-6 relative overflow-hidden">
                <div className="max-w-4xl mx-auto relative z-10">
                    <ScrollReveal>
                        <h2 className="text-5xl md:text-7xl font-display font-bold text-slate-800 dark:text-white mb-8">
                            Be Part of the Future
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
                            Whether you are a patient seeking answers, a doctor seeking tools, or a researcher seeking truth.
                        </p>
                        <button
                            onClick={() => onLoginClick(UserRole.PATIENT)}
                            className="group relative inline-flex items-center gap-3 px-12 py-5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full text-lg font-bold tracking-wide overflow-hidden transition-transform hover:scale-105"
                        >
                            <span className="relative z-10">BEGIN JOURNEY</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                    </ScrollReveal>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default About;

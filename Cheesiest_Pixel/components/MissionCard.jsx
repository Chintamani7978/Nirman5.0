import React, { useState, useRef, useEffect } from 'react';
import { Activity, User, PenTool, Megaphone, Share2, Terminal, Sparkles, Fingerprint } from 'lucide-react';

const MissionCard = () => {
    const [isActive, setIsActive] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const cardRef = useRef(null);

    // Animation Frame Ref
    const requestRef = useRef(0);
    const mousePosition = useRef({ x: 0, y: 0 });
    const cardBounds = useRef({ width: 0, height: 0, left: 0, top: 0 });

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;

        // Cache bounds on mouse enter or use cached
        if (cardBounds.current.width === 0) {
            const rect = cardRef.current.getBoundingClientRect();
            cardBounds.current = rect;
        }

        // Store raw mouse position
        mousePosition.current = { x: e.clientX, y: e.clientY };

        // Trigger animation frame if not already running
        if (!requestRef.current) {
            requestRef.current = requestAnimationFrame(animate);
        }
    };

    const animate = () => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect(); // Get fresh bounds if scrolling happened
        const x = mousePosition.current.x - rect.left;
        const y = mousePosition.current.y - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calculate rotation (max 3 degrees for very subtle, smooth feel)
        const rotateX = ((y - centerY) / centerY) * -3;
        const rotateY = ((x - centerX) / centerX) * 3;

        cardRef.current.style.setProperty('--mouse-x', `${x}px`);
        cardRef.current.style.setProperty('--mouse-y', `${y}px`);
        cardRef.current.style.setProperty('--rotate-x', `${rotateX}deg`);
        cardRef.current.style.setProperty('--rotate-y', `${rotateY}deg`);

        requestRef.current = 0; // Reset
    };

    const handleMouseEnter = () => {
        setIsActive(true);
        setIsHovering(true);
        // Recalculate bounds
        if (cardRef.current) {
            cardBounds.current = cardRef.current.getBoundingClientRect();
        }
    };

    const handleMouseLeave = () => {
        setIsHovering(false);

        if (cardRef.current) {
            cardRef.current.style.setProperty('--rotate-x', '0deg');
            cardRef.current.style.setProperty('--rotate-y', '0deg');
            cardRef.current.style.setProperty('--mouse-x', '50%');
            cardRef.current.style.setProperty('--mouse-y', '50%');
        }

        if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
            requestRef.current = 0;
        }

        setTimeout(() => {
            setIsActive(false);
        }, 250);
    };

    // Cleanup
    useEffect(() => {
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        }
    }, []);

    const team = [
        { name: 'Orosmit Mishra', role: 'Project Manager', icon: User, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
        { name: 'Abhinab Jena', role: 'Backend Developer', icon: Terminal, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
        { name: 'Dhrubjyoti Mahapatra', role: 'UI/UX Developer', icon: PenTool, color: 'text-violet-400', bg: 'bg-violet-400/10' },
        { name: 'Smruti Shikha Nag', role: 'Promotional Lead', icon: Megaphone, color: 'text-amber-400', bg: 'bg-amber-400/10' },
        { name: 'Alankrita', role: 'Social Media Lead', icon: Share2, color: 'text-rose-400', bg: 'bg-rose-400/10' },
    ];

    return (
        <div className="flex justify-center items-center py-20 w-full perspective-1000">
            <style>{`
         .mission-card {
            --mouse-x: 50%;
            --mouse-y: 50%;
            --rotate-x: 0deg;
            --rotate-y: 0deg;
            
            transform: rotateX(var(--rotate-x)) rotateY(var(--rotate-y));
            
            /* Fluid cubic-bezier for size */
            transition: width 1s cubic-bezier(0.25, 0.1, 0.25, 1.0), 
                        height 1s cubic-bezier(0.25, 0.1, 0.25, 1.0),
                        transform var(--transform-duration, 0.4s) cubic-bezier(0.25, 0.1, 0.25, 1.0);
            will-change: transform, width, height;
         }
         
         .sheen {
            background: radial-gradient(
                circle at var(--mouse-x) var(--mouse-y), 
                rgba(255, 255, 255, 0.08), 
                transparent 50%
            );
            pointer-events: none;
            will-change: background;
         }
       `}</style>

            <div
                ref={cardRef}
                style={{ '--transform-duration': isHovering ? '0.1s' : '1.2s' }}
                className={`mission-card relative bg-slate-900/80 dark:bg-slate-900/90 backdrop-blur-3xl border border-white/10 dark:border-white/5 rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center 
             ${isActive ? 'w-[90vw] max-w-4xl min-h-[550px] p-8' : 'w-[320px] h-[420px] p-6 hover:shadow-cyan-500/20 hover:border-cyan-500/30'}`}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {/* Reactive Background Layers */}
                <div className="absolute inset-0 sheen transition-opacity duration-500" />
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.07] pointer-events-none mix-blend-overlay" />

                {/* Header / Collapsed View */}
                <div className={`relative z-10 flex flex-col items-center justify-center w-full transition-all duration-1000 cubic-bezier(0.25, 0.1, 0.25, 1.0) ${isActive ? 'h-auto mt-0 mb-6 scale-90 md:flex-row md:justify-between md:scale-100 md:mb-8 md:border-b md:border-white/5 md:pb-6' : 'h-full'}`}>

                    <div className={`flex items-center gap-4 transition-all duration-1000 ${isActive ? 'flex-row' : 'flex-col'}`}>
                        <div className={`relative transition-all duration-1000 cubic-bezier(0.25, 0.1, 0.25, 1.0) ${isActive ? 'w-12 h-12' : 'w-20 h-20 mb-4'}`}>
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse-slow"></div>
                            <div className="relative w-full h-full bg-slate-800 rounded-full flex items-center justify-center border border-primary/30 shadow-[0_0_20px_rgba(14,165,233,0.2)]">
                                <Activity size={isActive ? 24 : 40} className="text-primary" />
                            </div>
                        </div>

                        <div className={`${isActive ? 'text-left' : 'text-center'}`}>
                            <h3 className={`font-display font-bold text-white transition-all duration-1000 cubic-bezier(0.25, 0.1, 0.25, 1.0) ${isActive ? 'text-2xl' : 'text-3xl'}`}>
                                Samhita<span className="text-primary">Fusion</span>
                            </h3>
                            <p className={`text-slate-400 font-mono text-xs tracking-[0.3em] uppercase transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-80'}`}>
                                {isActive ? 'System Architecture' : 'Hover to Initialize'}
                            </p>
                        </div>
                    </div>

                    <div className={`hidden md:flex items-center gap-2 transition-opacity duration-1000 ${isActive ? 'opacity-100 delay-300' : 'opacity-0'}`}>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-mono text-green-500">ONLINE</span>
                    </div>

                    <div className={`absolute bottom-10 flex flex-col items-center gap-2 animate-bounce opacity-40 transition-opacity duration-500 ${isActive ? 'opacity-0 pointer-events-none' : 'opacity-40'}`}>
                        <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                        <div className="w-1 h-8 bg-gradient-to-b from-slate-400 to-transparent rounded-full"></div>
                    </div>
                </div>

                {/* Expanded Content */}
                <div className={`relative z-10 w-full flex-1 flex flex-col transition-all duration-1000 cubic-bezier(0.25, 0.1, 0.25, 1.0) ${isActive ? 'opacity-100 translate-y-0 delay-200' : 'opacity-0 translate-y-10 absolute pointer-events-none'}`}>

                    <div className="grid md:grid-cols-2 gap-8 h-full">
                        {/* Left: Mission Statement */}
                        <div className="flex flex-col space-y-6">
                            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 p-6 rounded-2xl border border-white/5 backdrop-blur-md relative overflow-hidden group hover:border-white/10 transition-colors">
                                <div className="absolute -top-4 -right-4 text-white opacity-[0.02] group-hover:opacity-[0.05] transition-opacity transform rotate-12 scale-150">
                                    <Fingerprint size={120} />
                                </div>

                                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Sparkles className="text-amber-400 animate-pulse-slow" size={16} />
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Core Directive</span>
                                </h4>

                                <p className="text-slate-300 leading-relaxed font-light text-sm md:text-base">
                                    To synthesize <strong className="text-secondary font-medium">Ayurvedic Wisdom</strong> with <strong className="text-primary font-medium">AI Precision</strong>.
                                    <br /><br />
                                    We are architecting the digital nervous system for integrated healthcare, ensuring that ancient knowledge is preserved through modern validation, and no patient is left behind.
                                </p>
                            </div>

                            <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                                <span>Origin: Bhubaneswar, OD</span>
                                <span>Est. 2024</span>
                            </div>
                        </div>

                        {/* Right: Team Grid */}
                        <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Neural Team</h4>

                            <div className="space-y-2 h-[250px] md:h-auto overflow-y-auto pr-1 custom-scrollbar">
                                {team.map((member, idx) => (
                                    <div
                                        key={idx}
                                        className="group flex items-center gap-4 p-3 rounded-xl bg-white/0 hover:bg-white/5 border border-transparent hover:border-white/5 transition-all duration-300 cursor-default"
                                        style={{ transitionDelay: `${idx * 50}ms` }}
                                    >
                                        <div className={`w-10 h-10 rounded-lg ${member.bg} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                            <member.icon size={18} className={member.color} />
                                        </div>
                                        <div className="flex-1">
                                            <h5 className="text-slate-200 font-bold text-sm group-hover:text-white transition-colors">{member.name}</h5>
                                            <p className={`text-[10px] font-mono uppercase tracking-wide opacity-70 group-hover:opacity-100 transition-opacity ${member.color.replace('text-', 'text-')}`}>{member.role}</p>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                            <div className={`w-1.5 h-1.5 rounded-full ${member.bg.replace('/10', '')} shadow-[0_0_8px_currentColor]`}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MissionCard;

import React from 'react';

const Loader = () => {
    return (
        <div className="relative flex flex-col justify-center items-center w-full h-full">
            <style>{`
        .loading svg polyline {
          fill: none;
          stroke-width: 4;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .loading svg polyline#back {
          fill: none;
          stroke: rgba(20, 184, 166, 0.15); /* Teal-500 with very low opacity */
        }

        .loading svg polyline#front {
          fill: none;
          stroke: #14b8a6; /* Teal-500 */
          stroke-dasharray: 48, 144;
          stroke-dashoffset: 192;
          /* Premium fluid easing for organic heartbeat feel */
          animation: dash_682 1.6s cubic-bezier(0.4, 0.0, 0.2, 1) infinite;
          filter: drop-shadow(0 0 6px rgba(45, 212, 191, 0.5));
          will-change: stroke-dashoffset, opacity;
        }

        @keyframes dash_682 {
          0% {
            stroke-dashoffset: 192;
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          72.5% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 0;
          }
        }

        @keyframes scan {
            0% { transform: translateY(-100%); opacity: 0; }
            15% { opacity: 1; }
            85% { opacity: 1; }
            100% { transform: translateY(100%); opacity: 0; }
        }

        @keyframes progress {
            0% { width: 0%; margin-left: 0; }
            50% { width: 100%; margin-left: 0; }
            100% { width: 0%; margin-left: 100%; }
        }
        
        .smooth-progress {
           animation: progress 2.2s cubic-bezier(0.65, 0, 0.35, 1) infinite;
           will-change: width, margin-left;
        }
      `}</style>

            {/* Ambient Glow Background - Optimized blur radius */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-80 h-80 bg-teal-500/10 rounded-full blur-[80px] animate-pulse-slow"></div>
            </div>

            {/* Main Glass Container - GPU Accelerated */}
            <div className="relative z-10 p-12 rounded-[2rem] bg-white/5 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/20 dark:border-teal-500/10 shadow-2xl flex flex-col items-center transform transition-transform duration-500 will-change-transform">

                {/* Scanner Line Effect */}
                <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none opacity-20">
                    <div className="w-full h-1/2 bg-gradient-to-b from-transparent to-teal-400/30 blur-md animate-[scan_3s_linear_infinite]"></div>
                </div>

                {/* Heartbeat SVG */}
                <div className="loading scale-125 mb-8">
                    <svg width="64px" height="48px" style={{ overflow: 'visible' }}>
                        <polyline points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" id="back" />
                        <polyline points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" id="front" />
                    </svg>
                </div>

                {/* Text & Progress */}
                <div className="flex flex-col items-center gap-5 w-full">
                    <div className="text-teal-600 dark:text-teal-400 font-mono text-[10px] font-bold tracking-[0.3em] uppercase opacity-80">
                        System Initializing
                    </div>

                    {/* Progress Bar */}
                    <div className="h-0.5 w-36 bg-slate-200/50 dark:bg-slate-700/50 rounded-full overflow-hidden backdrop-blur-sm">
                        <div className="h-full bg-gradient-to-r from-teal-400 via-blue-500 to-teal-400 w-full smooth-progress"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Loader;

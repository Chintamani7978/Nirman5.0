"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeroParallax } from "./ui/hero-parallax";

// 1. Accept language and setLanguage as props
export function HeroParallaxDemo({ onEnter, lt, language, setLanguage }) {
  
  // State for the new blooming animation
  const [isBlooming, setIsBlooming] = useState(false);

  const handleTreeClick = () => {
    setIsBlooming(true);
    // Wait for the bloom animation to finish before navigating
    setTimeout(() => {
      onEnter();
    }, 800);
  };

  // Generate random particles for the new effect
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 3 + Math.random() * 5,
    delay: Math.random() * 2
  }));

  const TreeHeader = () => (
    <div className="flex flex-col items-center justify-center relative w-full">
      
      {/* --- LANGUAGE SWITCHER --- */}
      {/* <div className="absolute top-0 right-0 z-50 flex gap-2">
        {['en', 'hi', 'or'].map((lang) => (
          <button
            key={lang}
            onClick={(e) => {
              e.stopPropagation();
              setLanguage(lang);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all border ${
              language === lang 
                ? 'bg-lime-400 text-emerald-950 border-lime-400 shadow-[0_0_15px_rgba(163,230,53,0.3)]' 
                : 'bg-white/5 text-emerald-100/60 border-white/5 hover:bg-white/10 hover:text-white'
            }`}
          >
            {lang}
          </button>
        ))}
      </div> */}

      {/* --- NEW DIGITAL CIRCUIT TREE ANIMATION --- */}
     <div 
        className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 mb-6 mt-4 md:mt-0 flex items-center justify-center perspective-1000 group cursor-pointer" 
        onClick={handleTreeClick}
      >
          
          {/* Floating Data Particles */}
          <div className="absolute inset-0 pointer-events-none">
             {particles.map((p) => (
               <motion.div
                 key={p.id}
                 className="absolute w-1 h-1 bg-lime-400 rounded-full shadow-[0_0_5px_rgba(163,230,53,0.8)]"
                 style={{ left: `${p.x}%`, top: `${p.y}%` }}
                 animate={{ 
                   y: [0, -20, 0], 
                   opacity: [0, 0.8, 0],
                   scale: [0, 1.5, 0]
                 }}
                 transition={{ 
                   duration: p.duration, 
                   repeat: Infinity, 
                   delay: p.delay, 
                   ease: "linear" 
                 }}
               />
             ))}
          </div>

          {/* Tree SVG Container with 3D Rotation & Bloom */}
          <motion.div
            className="w-full h-full relative preserve-3d"
            animate={isBlooming ? { 
              scale: 50, 
              opacity: 0,
              filter: "brightness(2)"
            } : { 
              rotateY: [-10, 10, -10],
              scale: [1, 1.05, 1],
            }}
            transition={isBlooming ? {
              duration: 0.8,
              ease: "easeInOut"
            } : { 
              rotateY: { duration: 8, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
          >
              {/* Glow Effect Behind */}
              <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-400/20 transition-colors duration-500"></div>

              {/* The Circuit Tree SVG */}
              <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
                 <defs>
                    <linearGradient id="treeGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                       <stop offset="0%" stopColor="#065f46" stopOpacity="0.5" />
                       <stop offset="50%" stopColor="#10b981" />
                       <stop offset="100%" stopColor="#a3e635" />
                    </linearGradient>
                    <filter id="glow">
                       <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                       <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                       </feMerge>
                    </filter>
                 </defs>

                 {/* Trunk */}
                 <path 
                   d="M100 180 L100 130" 
                   stroke="url(#treeGrad)" 
                   strokeWidth="4" 
                   fill="none" 
                   className="transition-all duration-500 group-hover:stroke-emerald-300"
                 />

                 {/* Main Branches */}
                 <g className="transition-all duration-500 group-hover:stroke-emerald-300" stroke="url(#treeGrad)" strokeWidth="2" fill="none">
                    <path d="M100 130 Q70 110 60 80 T40 40" />
                    <path d="M60 80 L30 90" />
                    <path d="M100 130 Q130 110 140 80 T160 40" />
                    <path d="M140 80 L170 90" />
                    <path d="M100 130 L100 60 L100 20" />
                    <path d="M100 90 L130 50" />
                    <path d="M100 90 L70 50" />
                 </g>

                 {/* Nodes (Leaves) */}
                 <g className="transition-all duration-300 group-hover:fill-lime-300" fill="#10b981">
                    <circle cx="100" cy="130" r="3" />
                    <circle cx="60" cy="80" r="3" />
                    <circle cx="140" cy="80" r="3" />
                    <circle cx="40" cy="40" r="4" className="animate-pulse" />
                    <circle cx="160" cy="40" r="4" className="animate-pulse" />
                    <circle cx="100" cy="20" r="5" filter="url(#glow)" className="animate-pulse" />
                    <circle cx="30" cy="90" r="2" />
                    <circle cx="170" cy="90" r="2" />
                    <circle cx="130" cy="50" r="3" />
                    <circle cx="70" cy="50" r="3" />
                 </g>
              </svg>
          </motion.div>

          {/* Click CTA */}
          <AnimatePresence>
            {!isBlooming && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-center w-full  pb-10"
              >
                 <span className="text-lime-400 text-xs font-bold tracking-[0.3em] uppercase opacity-70 group-hover:opacity-100 transition-opacity whitespace-nowrap pb-10">
                   {lt?.clickToInit || "CLICK TO INITIALIZE"}
                 </span>
                 {/* <div className="h-px w-0 group-hover:w-full bg-gradient-to-r from-transparent via-lime-400 to-transparent transition-all duration-700 mx-auto mt-2"></div> */}
              </motion.div>
            )}
          </AnimatePresence>
      </div>
      
      <h1 className="text-4xl md:text-6xl font-bold text-center tracking-tighter mb-4 text-white">
          Agri-Sentry <span className="text-lime-400">.AI</span>
      </h1>
      <p className="text-slate-400 text-center max-w-md text-lg leading-relaxed">
          {lt?.subtitle || "Protecting Your ଅମଳ with AI"}
      </p>
    </div>
  );

  return (
    <HeroParallax products={products} headerContent={<TreeHeader />} />
  );
}

// ... existing products array ...
export const products = [
  {
    title: "Moonbeam",
    link: "#",
    thumbnail: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YWdyaWN1bHR1cmV8ZW58MHx8MHx8fDA%3D",
  },
  {
    title: "Cursor",
    link: "#",
    thumbnail: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YWdyaWN1bHR1cmV8ZW58MHx8MHx8fDA%3D",
  },
  {
    title: "Rogue",
    link: "#",
    thumbnail: "https://images.unsplash.com/photo-1492496913980-501348b61469?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGFncmljdWx0dXJlfGVufDB8fDB8fHww",
  },
  {
    title: "Editorially",
    link: "#",
    thumbnail: "https://plus.unsplash.com/premium_photo-1661907005604-cec7ffb6a042?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGFncmljdWx0dXJlfGVufDB8fDB8fHww",
  },
  {
    title: "Editrix AI",
    link: "#",
    thumbnail: "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGFncmljdWx0dXJlfGVufDB8fDB8fHww",
  },
  {
    title: "Pixel Perfect",
    link: "#",
    thumbnail: "https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGFncmljdWx0dXJlfGVufDB8fDB8fHww",
  },
  {
    title: "Algochurn",
    link: "#",
    thumbnail: "https://images.unsplash.com/photo-1529313780224-1a12b68bed16?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fGFncmljdWx0dXJlfGVufDB8fDB8fHww",
  },
  {
    title: "Aceternity UI",
    link: "#",
    thumbnail: "https://plus.unsplash.com/premium_photo-1661819722771-73787dd2bdf2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODh8fGFncmljdWx0dXJlfGVufDB8fDB8fHww",
  },
  {
    title: "Tailwind Master Kit",
    link: "#",
    thumbnail: "https://images.unsplash.com/photo-1656365300229-1d91394b42fd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzF8fGluc2VjdHMlMjBvbiUyMGNyb3BzfGVufDB8fDB8fHww",
  },
  {
    title: "SmartBridge",
    link: "#",
    thumbnail: "https://images.unsplash.com/photo-1720108355690-5b2eb3b08e07?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGluc2VjdHMlMjBvbiUyMGNyb3BzfGVufDB8fDB8fHww",
  },
  {
    title: "Renderwork Studio",
    link: "#",
    thumbnail: "https://images.unsplash.com/photo-1689118410091-cddcaedf4288?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aW5zZWN0cyUyMG9uJTIwY3JvcHN8ZW58MHx8MHx8fDA%3D",
  },
  {
    title: "Creme Digital",
    link: "#",
    thumbnail: "https://plus.unsplash.com/premium_photo-1679840374351-760c47378ac3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW5zZWN0c3xlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    title: "Golden Bells Academy",
    link: "#",
    thumbnail: "https://images.unsplash.com/uploads/141247613151541c06062/c15fb37d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTczfHxhZ3JpY3VsdHVyZXxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    title: "Invoker Labs",
    link: "#",
    thumbnail: "https://images.unsplash.com/photo-1635174815612-fd9636f70146?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTY0fHxhZ3JpY3VsdHVyZXxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    title: "E Free Invoice",
    link: "#",
    thumbnail: "https://images.unsplash.com/photo-1704613278892-0056895dd46a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTA4fHxhZ3JpY3VsdHVyZXxlbnwwfHwwfHx8MA%3D%3D",
  },
];
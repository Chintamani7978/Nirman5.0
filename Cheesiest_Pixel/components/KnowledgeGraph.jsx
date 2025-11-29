import React, { useState } from 'react';
import { Leaf, Activity, GitMerge, Cpu, HeartPulse, Microscope } from 'lucide-react';

const nodes = [
    // Traditional Cluster (Left)
    { id: 'ayurveda', x: 20, y: 30, label: 'Ayurveda', type: 'traditional', icon: Leaf, description: 'Utilizes Dosha analysis (Vata, Pitta, Kapha) to identify root causes of ailments before they manifest physically.' },
    { id: 'herbs', x: 15, y: 60, label: 'Herbal Medicine', type: 'traditional', icon: Leaf, description: 'Plant-based pharmacopeia providing the biochemical foundation for many modern synthetic drugs.' },
    { id: 'yoga', x: 25, y: 80, label: 'Yoga & Mind', type: 'traditional', icon: HeartPulse, description: 'Stress reduction and somatic practices that directly improve cardiovascular health and immune response.' },

    // Modern Cluster (Right)
    { id: 'allopathy', x: 80, y: 30, label: 'Modern Allopathy', type: 'modern', icon: Activity, description: 'Evidence-based acute care, surgery, and fast-acting pharmacological interventions.' },
    { id: 'genetics', x: 85, y: 60, label: 'Genomics', type: 'modern', icon: Microscope, description: 'DNA sequencing to identify predispositions, often correlating with Ayurvedic Prakriti.' },
    { id: 'ai', x: 75, y: 80, label: 'AI Diagnostics', type: 'modern', icon: Cpu, description: 'Machine learning algorithms that process vast medical datasets to predict outcomes.' },

    // Integrated Core (Center)
    { id: 'fusion', x: 50, y: 55, label: 'Samhita Engine', type: 'integrated', icon: GitMerge, description: 'The central intelligence merging subjective patient narratives with objective clinical data for holistic treatment.' },
];

const links = [
    { source: 'ayurveda', target: 'fusion', label: 'Dosha Data' },
    { source: 'herbs', target: 'fusion', label: 'Bio-actives' },
    { source: 'yoga', target: 'fusion', label: 'Lifestyle Metrics' },
    { source: 'allopathy', target: 'fusion', label: 'Clinical Vitals' },
    { source: 'genetics', target: 'fusion', label: 'Genetic Markers' },
    { source: 'ai', target: 'fusion', label: 'Predictive Models' },
    { source: 'herbs', target: 'allopathy', label: 'Pharmacology' }, // Cross link
    { source: 'genetics', target: 'ayurveda', label: 'Prakriti Correlation' }, // Cross link
];

const KnowledgeGraph = () => {
    const [activeNode, setActiveNode] = useState(null);

    const handleMouseEnter = (id) => setActiveNode(id);
    const handleMouseLeave = () => setActiveNode(null);

    // Helper to find node coordinates
    const getNode = (id) => nodes.find(n => n.id === id);

    const getConnectorColor = (type) => {
        switch (type) {
            case 'traditional': return '#10b981'; // Green
            case 'modern': return '#0ea5e9'; // Blue
            default: return '#f59e0b'; // Amber/Orange
        }
    };

    const activeNodeData = activeNode ? nodes.find(n => n.id === activeNode) : null;

    return (
        <div className="w-full h-[600px] flex flex-col md:flex-row bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-white dark:border-slate-800 shadow-2xl backdrop-blur-md overflow-hidden fluid-transition hover:shadow-primary/10">

            {/* Visualization Area */}
            <div className="relative flex-1 h-[400px] md:h-full bg-grid-pattern overflow-hidden group">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Defs for gradients and filters */}
                    <defs>
                        <linearGradient id="grad-line" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.4" />
                        </linearGradient>

                        <filter id="glow-node" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <filter id="glow-line" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="0.5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Links */}
                    {links.map((link, i) => {
                        const source = getNode(link.source);
                        const target = getNode(link.target);
                        if (!source || !target) return null;

                        const isConnected = activeNode === link.source || activeNode === link.target;
                        const isDimmed = activeNode && !isConnected;

                        const mx = (source.x + target.x) / 2;
                        const my = (source.y + target.y) / 2;
                        const cx = mx * 0.8 + 50 * 0.2;
                        const cy = my * 0.8 + 50 * 0.2;

                        const pathD = `M ${source.x} ${source.y} Q ${cx} ${cy} ${target.x} ${target.y}`;

                        return (
                            <g key={i} className={`fluid-transition will-change-opacity ${isDimmed ? 'opacity-5 blur-[0.5px]' : 'opacity-100'}`} style={{ transitionDuration: '0.4s' }}>
                                {/* Base Line */}
                                <path
                                    d={pathD}
                                    fill="none"
                                    stroke={activeNode === 'fusion' || link.target === 'fusion' ? "url(#grad-line)" : "currentColor"}
                                    strokeWidth="0.2"
                                    className="text-slate-300 dark:text-slate-700"
                                />
                                {/* Animated Flow Line */}
                                <path
                                    d={pathD}
                                    fill="none"
                                    stroke={isConnected ? getConnectorColor(source.type) : "transparent"}
                                    strokeWidth={isConnected ? "0.6" : "0"}
                                    strokeDasharray="2 1"
                                    strokeLinecap="round"
                                    filter={isConnected ? "url(#glow-line)" : ""}
                                    className={`fluid-transition will-change-opacity ${isConnected ? 'path-flow opacity-100' : 'opacity-0'}`}
                                />
                            </g>
                        );
                    })}

                    {/* Nodes */}
                    {nodes.map((node, idx) => {
                        const isActive = activeNode === node.id;
                        const isDimmed = activeNode && !isActive && !links.some(l => (l.source === node.id && l.target === activeNode) || (l.target === node.id && l.source === activeNode));

                        // Staggered animation delay based on index
                        const animDelay = `${idx * 0.5}s`;

                        return (
                            <g
                                key={node.id}
                                className={`cursor-pointer fluid-transition will-change-transform ${isDimmed ? 'opacity-20 blur-[1px]' : 'opacity-100'}`}
                                onMouseEnter={() => handleMouseEnter(node.id)}
                                onMouseLeave={handleMouseLeave}
                                style={{ transformOrigin: `${node.x}% ${node.y}%`, transitionDuration: '0.4s' }}
                            >
                                {/* Breathing Group - Only Circles */}
                                <g className={!activeNode ? "node-breathe" : ""} style={{ animationDelay: animDelay }}>

                                    {/* Pulse Effect for Active */}
                                    {isActive && (
                                        <circle cx={node.x} cy={node.y} r="8" fill={getConnectorColor(node.type)} opacity="0.2" className="animate-ping" />
                                    )}

                                    {/* Outer Ring */}
                                    <circle
                                        cx={node.x}
                                        cy={node.y}
                                        r={isActive ? 4.5 : 3}
                                        fill={activeNode ? '#1e293b' : 'white'}
                                        stroke={getConnectorColor(node.type)}
                                        strokeWidth={isActive ? 1 : 0.5}
                                        className="fluid-transition dark:fill-slate-800"
                                        filter={isActive ? "url(#glow-node)" : ""}
                                    />

                                    {/* Core Dot */}
                                    <circle cx={node.x} cy={node.y} r={isActive ? 2 : 1.5} fill={getConnectorColor(node.type)} />
                                </g>

                                {/* Label - Static */}
                                <text
                                    x={node.x}
                                    y={node.y + 7}
                                    textAnchor="middle"
                                    className={`text-[3px] font-sans font-medium uppercase tracking-wider fill-slate-600 dark:fill-slate-300 fluid-transition ${isActive ? 'font-bold text-[3.5px]' : ''}`}
                                >
                                    {node.label}
                                </text>
                            </g>
                        );
                    })}
                </svg>

                {/* Floating Instructions */}
                <div className="absolute top-4 left-4 text-xs text-slate-400 pointer-events-none bg-white/80 dark:bg-slate-900/80 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 backdrop-blur-sm">
                    Hover nodes to trace data flow
                </div>
            </div>

            {/* Info Panel */}
            <div className="w-full md:w-1/3 bg-slate-50/80 dark:bg-slate-900/90 border-l border-white dark:border-slate-800 p-6 flex flex-col justify-center relative overflow-hidden fluid-transition will-change-transform">

                {/* Background Scanline */}
                <div className="absolute inset-0 scanline-overlay opacity-50"></div>

                {activeNodeData ? (
                    <div className="relative z-10 animate-fade-in-up">
                        <div className={`inline-flex p-3 rounded-2xl mb-4 transition-colors duration-500 ${activeNodeData.type === 'traditional' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                activeNodeData.type === 'modern' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                    'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                            }`}>
                            <activeNodeData.icon size={32} className="animate-pulse-slow" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 font-display">
                            {activeNodeData.label}
                        </h3>
                        <span className="inline-block px-2 py-1 rounded text-xs font-mono uppercase tracking-widest mb-4 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {activeNodeData.type.toUpperCase()} NODE
                        </span>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                            {activeNodeData.description}
                        </p>

                        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Connected Ecosystem</h4>
                            <div className="flex flex-wrap gap-2">
                                {links.filter(l => l.source === activeNodeData.id || l.target === activeNodeData.id).map((l, i) => {
                                    const isSource = l.source === activeNodeData.id;
                                    const otherId = isSource ? l.target : l.source;
                                    const otherNode = nodes.find(n => n.id === otherId);
                                    return (
                                        <span key={i} className="text-xs px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 flex items-center gap-1 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                                            {otherNode?.label}
                                        </span>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="relative z-10 text-center opacity-60">
                        <div className="w-16 h-16 mx-auto bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 animate-float">
                            <Activity className="text-slate-400" />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 font-mono text-sm">Waiting for input...</p>
                        <p className="text-slate-400 dark:text-slate-500 text-xs mt-2">Hover over the neural network</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default KnowledgeGraph;

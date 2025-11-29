import React, { useState } from 'react';
import { getTrendAnalysis } from '../../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Search, Download, Share2, Sparkles } from 'lucide-react';

const treatmentData = [
    { name: 'Diabetes T2', Allopathy: 85, Ayurveda: 65, Integrated: 92 },
    { name: 'Hypertension', Allopathy: 80, Ayurveda: 70, Integrated: 88 },
    { name: 'Migraine', Allopathy: 75, Ayurveda: 85, Integrated: 90 },
    { name: 'Arthritis', Allopathy: 60, Ayurveda: 80, Integrated: 85 },
];

const efficacyData = [
    { subject: 'Speed of Relief', A: 120, B: 80, fullMark: 150 },
    { subject: 'Side Effects', A: 98, B: 130, fullMark: 150 },
    { subject: 'Cost', A: 86, B: 130, fullMark: 150 },
    { subject: 'Long-term Cure', A: 99, B: 100, fullMark: 150 },
    { subject: 'Accessibility', A: 85, B: 90, fullMark: 150 },
    { subject: 'Patient Satisfaction', A: 65, B: 85, fullMark: 150 },
];

const ResearcherDashboard = ({ user }) => {
    const [topic, setTopic] = useState('');
    const [trendResult, setTrendResult] = useState('');
    const [loading, setLoading] = useState(false);

    const handleTrendSearch = async () => {
        if (!topic) return;
        setLoading(true);
        const res = await getTrendAnalysis(topic);
        setTrendResult(res);
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-dark-text">Research Portal</h1>
                <div className="flex gap-2">
                    <button className="flex items-center space-x-2 bg-white dark:bg-dark-surface border border-gray-300 dark:border-dark-border text-gray-700 dark:text-dark-text px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg">
                        <Download size={18} />
                        <span>Export Data</span>
                    </button>
                    <button className="flex items-center space-x-2 bg-primary dark:bg-dark-primary text-white px-4 py-2 rounded-lg hover:bg-sky-600 dark:hover:bg-dark-secondary">
                        <Share2 size={18} />
                        <span>Publish Findings</span>
                    </button>
                </div>
            </div>

            {/* AI Trend Detection */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-800 dark:to-indigo-900 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center space-x-2 mb-4">
                    <Sparkles className="text-yellow-300" />
                    <h2 className="text-xl font-bold">AI Trend Detector</h2>
                </div>
                <div className="flex gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Enter disease or treatment topic (e.g., 'Post-COVID Fatigue')"
                        className="flex-1 rounded-lg px-4 py-2 text-gray-900 focus:outline-none"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                    />
                    <button
                        onClick={handleTrendSearch}
                        disabled={loading}
                        className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-lg font-semibold transition-colors"
                    >
                        {loading ? 'Analyzing...' : 'Detect Trends'}
                    </button>
                </div>
                {trendResult && (
                    <div className="bg-white/10 p-4 rounded-lg text-sm leading-relaxed backdrop-blur-sm">
                        {trendResult}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Comparative Chart */}
                <div className="bg-white dark:bg-dark-surface p-6 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
                    <h3 className="font-semibold text-gray-800 dark:text-dark-text mb-6">Treatment Efficacy Comparison</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={treatmentData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                                <XAxis dataKey="name" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.1)' }} contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }} />
                                <Legend />
                                <Bar dataKey="Allopathy" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Ayurveda" fill="#10b981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Integrated" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-dark-muted mt-4 text-center">
                        *Normalized Outcome Scores (0-100) based on patient recovery rates.
                    </p>
                </div>

                {/* Radar Chart */}
                <div className="bg-white dark:bg-dark-surface p-6 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
                    <h3 className="font-semibold text-gray-800 dark:text-dark-text mb-6">Modality Profile: Chronic Pain</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart outerRadius={90} data={efficacyData}>
                                <PolarGrid stroke="#374151" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF' }} />
                                <PolarRadiusAxis angle={30} domain={[0, 150]} stroke="#374151" />
                                <Radar name="Modern Medicine" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                                <Radar name="Traditional Medicine" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                                <Legend />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResearcherDashboard;

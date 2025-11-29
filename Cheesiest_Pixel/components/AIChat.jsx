import React, { useState } from 'react';
import { Send, Bot, Loader2 } from 'lucide-react';
import { getDifferentialDiagnosis } from '../services/geminiService';
// Gemini API is disabled

const AIChat = () => {
    const [symptoms, setSymptoms] = useState('');
    const [history, setHistory] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    // Modular helper: Validate input
    const isValidInput = () => symptoms.trim().length > 0;

    // Modular helper: Prepare state for analysis
    const startAnalysis = () => {
        setLoading(true);
        setResult(null);
    };

    // Modular helper: Process API call
    const fetchDiagnosis = async (currentSymptoms, currentHistory) => {
        return await getDifferentialDiagnosis(currentSymptoms, currentHistory);
    };

    // Modular helper: Update state with results
    const completeAnalysis = (data) => {
        setResult(data);
        setLoading(false);
    };

    // Main handler orchestrating the flow
    const handleAnalyze = async () => {
        if (!isValidInput()) return;

        startAnalysis();

        try {
            const response = await fetchDiagnosis(symptoms, history);
            completeAnalysis(response);
        } catch (error) {
            // Fallback in case the service layer error handling misses something
            console.error("Analysis execution failed:", error);
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 bg-indigo-600 text-white flex items-center space-x-2">
                <Bot size={20} />
                <h3 className="font-semibold">AI Differential Diagnosis Assistant</h3>
            </div>

            <div className="p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Patient Symptoms</label>
                    <textarea
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        rows={3}
                        placeholder="e.g., severe headache, nausea, sensitivity to light..."
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brief Medical History</label>
                    <textarea
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        rows={2}
                        placeholder="e.g., history of migraines, hypertension..."
                        value={history}
                        onChange={(e) => setHistory(e.target.value)}
                    />
                </div>

                <button
                    onClick={handleAnalyze}
                    disabled={loading || !symptoms}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium flex justify-center items-center space-x-2 transition-colors disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                    <span>Run Analysis</span>
                </button>

                {result && (
                    <div className="mt-6 bg-slate-50 rounded-lg p-4 border border-slate-200 animate-fade-in">
                        <h4 className="font-semibold text-gray-900 mb-3">AI Analysis Result</h4>

                        <div className="space-y-3 text-sm">
                            <div>
                                <span className="font-bold text-gray-700">Differential Diagnosis:</span>
                                <ul className="list-disc ml-5 text-gray-600">
                                    {result.differentialDiagnosis?.map((d, i) => (
                                        <li key={i}>{d}</li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <span className="font-bold text-gray-700">Suggested Tests:</span>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {result.suggestedTests?.map((t, i) => (
                                        <span key={i} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">{t}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-green-50 p-3 rounded border border-green-100">
                                <span className="font-bold text-green-800 block mb-1">Integrated Approach (Modern + Traditional):</span>
                                <p className="text-green-700">{result.integratedApproach}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIChat;

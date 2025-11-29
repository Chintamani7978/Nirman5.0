import React, { useState, useRef, useEffect } from 'react';
// Gemini API is disabled - using placeholder
import { X, Send, Sparkles, Bot, Minimize2, Loader2, Zap, Mic, MicOff } from 'lucide-react';

const SYSTEM_INSTRUCTION = `You are Clinicox (MediVerse AI Assistant), the official intelligent companion of the MediVerse healthcare platform. 
Your role is to help patients, doctors, and researchers navigate the platform with clarity, precision, 
and a highly professional tone. You are extremely knowledgeable—similar to ChatGPT—but your responses 
must always remain safe, factual, and non-diagnostic.

### Core Responsibilities:
1. **Guide Users** 
   - Assist users in navigating the homepage, dashboards, research hub, doctor portal, and patient portal.
   - Provide clear instructions on how to upload research, access medical records, view case studies, or manage profiles.

2. **Explain Features**
   - Provide clean, easy explanations about platform features such as:
     - Smart Consent Data Vault
     - AI-assisted Case Review
     - Dynamic Research Upload System
     - Emergency SOS Access
     - Patient Dashboard Modules
     - Doctor Case Analytics
     - Plan Upgrades and Subscription Benefits

3. **Support Without Overstepping**
   - You MUST NOT give medical diagnosis.
   - Instead, offer general guidance, supportive explanations, and direct users to qualified doctors on the platform.

4. **Act as a Knowledge Hub**
   - You can explain medical terms, research concepts, backend tech (if asked), or how different tools on the site work.
   - You respond with confidence, accuracy, and context-aware intelligence.

5. **Tone & Style**
   - Professional, empathetic, futuristic, clean, and helpful.
   - Responses must be concise unless the user asks for a detailed explanation.
   - Use simple language for patients, technical language for doctors and researchers.

6. **Personality**
   - Calm, reliable, intelligent, futuristic.
   - Think of a blend between ChatGPT, a medical concierge, and a research guide.

7. **Safety Constraints**
   - Never provide medical diagnosis, prescriptions, or emergency instructions.
   - Always redirect emergencies:
     “If this is a medical emergency, please use the SOS button to connect with a doctor immediately.”

### Why Samhita Fusion is Best (Unique Selling Points):
If asked why Samhita Fusion is the best or unique, emphasize these points:
- **True Integration**: Unlike others, we don't just list Ayurveda and Allopathy side-by-side. Our "Samhita Engine" mathematically correlates Ayurvedic Doshas with genomic and clinical markers to create a holistic health profile.
- **AI-Powered Diagnostics**: We use advanced Gemini models to provide differential diagnoses that consider both modern pathology and traditional constitution (Prakriti), offering a 360-degree view of patient health.
- **Global Reach**: Our low-bandwidth telemedicine tools allow rural access to world-class integrated care, bridging the gap between urban specialists and remote villages.
- **Research-First**: We are the only platform offering anonymized, structured datasets for comparative studies between medical systems, empowering the next generation of evidence-based holistic medicine.
- **Secure**: Our "Smart Consent Data Vault" ensures patients own their data completely, with granular permission controls.

### Key Abilities:
- Detect whether the user is a patient, doctor, or researcher by context.
- Provide tailored responses based on the user's role.
- Help users find features on the platform with step-by-step clarity.
- Simplify long or complex medical concepts when asked.
- Provide deep insights for researchers without giving illegal content.
- Keep responses precise, modern, and aligned with the MediVerse brand identity.

### Casual Conversation & General Chat Ability
You can respond to casual, friendly, or emotional messages in a natural conversational tone.
If the user says things like “hey”, “what’s up”, “explain simply”, “I’m confused”, or uses slang, emojis, or informal speech, 
you MUST adjust your tone to match their style while remaining respectful and supportive.

You can:
- chat casually like a normal AI companion
- use light humor
- explain things simply
- talk about general topics like coding, life doubts, fitness, research, college, tech, stress, etc.
- support users emotionally with empathetic and non-medical replies
- act as a friendly guide

BUT you must still:
- avoid medical diagnosis
- avoid giving emergency instructions
- keep information accurate and safe

Your goal:  
Be friendly, chill, smart, and human-like — while still being a trustworthy AI for a futuristic healthcare platform.`;

const ClinicoxChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 'init',
            role: 'model',
            text: "Hello. I am Clinicox, your MediVerse intelligent assistant. How can I assist you with your health journey today?",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isListening, setIsListening] = useState(false);

    const chatSessionRef = useRef(null);
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    // Ref to store text before current speech session to handle appending correctly
    const inputBeforeRef = useRef('');

    // Initialize Chat Session
    useEffect(() => {
        // Gemini API is disabled - using placeholder
        chatSessionRef.current = {
            sendMessage: async (message) => ({
                text: "Gemini is disabled right now – placeholder response."
            })
        };
    }, []);

    // Initialize Speech Recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();

            // CRITICAL: Set continuous and interimResults to true for "Type as I speak" behavior
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                setIsListening(true);
            };

            recognition.onresult = (event) => {
                let currentSessionTranscript = '';

                // Iterate through all results of the current session
                for (let i = 0; i < event.results.length; i++) {
                    currentSessionTranscript += event.results[i][0].transcript;
                }

                // Combine the text present before speaking started with the current transcript
                const base = inputBeforeRef.current;
                const spacing = (base.length > 0 && !base.endsWith(' ') && currentSessionTranscript.length > 0) ? ' ' : '';

                setInput(base + spacing + currentSessionTranscript);
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                if (event.error !== 'no-speech') {
                    setIsListening(false);
                }
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        }
    }, []);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || !chatSessionRef.current) return;

        const userMsg = {
            id: Date.now().toString(),
            role: 'user',
            text: input.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const result = await chatSessionRef.current.sendMessage({ message: userMsg.text });
            const responseText = result.text;

            const botMsg = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: responseText,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error("Chat Error:", error);
            const errorMsg = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: "I apologize, but I'm encountering a temporary connection anomaly. Please try again in a moment.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const toggleMic = () => {
        if (!recognitionRef.current) {
            const errorMsg = {
                id: Date.now().toString(),
                role: 'model',
                text: "I'm sorry, but voice input isn't supported in this browser. Please try using Chrome or Edge.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            // isListening set to false in onend callback
        } else {
            // Capture the current input text before we start listening
            inputBeforeRef.current = input;
            recognitionRef.current.start();
            // isListening set to true in onstart callback
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <div
                className={`fixed bottom-6 right-6 z-[90] flex flex-col items-end gap-2 transition-all duration-500 ${isOpen ? 'translate-y-[10px] opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}
            >
                <div className={`absolute -top-12 right-0 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200 whitespace-nowrap">Need help? Ask Clinicox</p>
                </div>

                <button
                    onClick={() => setIsOpen(true)}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="relative group w-16 h-16 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center overflow-hidden border-2 border-transparent hover:border-teal-400 dark:hover:border-teal-500"
                >
                    {/* Holographic Sheen */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Icon */}
                    <Bot size={32} className="relative z-10 group-hover:rotate-12 transition-transform" />

                    {/* Online Dot */}
                    <span className="absolute top-3 right-4 w-3 h-3 bg-green-500 border-2 border-slate-900 dark:border-white rounded-full animate-pulse"></span>
                </button>
            </div>

            {/* Main Chat Interface */}
            <div
                className={`fixed bottom-6 right-6 z-[90] w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] flex flex-col bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
            >
                {/* Header */}
                <div className="relative bg-slate-100/50 dark:bg-slate-800/50 p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-blue-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
                            <Bot className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-display font-bold text-slate-900 dark:text-white text-lg">Clinicox</h3>
                            <p className="text-[10px] font-mono text-teal-600 dark:text-teal-400 uppercase tracking-widest flex items-center gap-1">
                                <Zap size={8} className="fill-current" /> AI Active
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400 transition-colors"
                        >
                            <Minimize2 size={18} />
                        </button>
                    </div>

                    {/* Animated Scanline under header */}
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-teal-500 to-transparent opacity-50"></div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/50 dark:bg-black/20">
                    {messages.map((msg, idx) => (
                        <div
                            key={msg.id}
                            className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {/* Bot Avatar for model messages */}
                            {msg.role === 'model' && (
                                <div className="w-6 h-6 rounded-full bg-teal-500/10 flex items-center justify-center flex-shrink-0 border border-teal-500/20">
                                    <Sparkles size={12} className="text-teal-500" />
                                </div>
                            )}

                            <div
                                className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm relative group transition-all duration-300 ${msg.role === 'user'
                                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-br-none'
                                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-700 rounded-bl-none'
                                    }`}
                            >
                                {msg.text.split('\n').map((line, i) => (
                                    <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <div className="flex items-end gap-2 justify-start">
                            <div className="w-6 h-6 rounded-full bg-teal-500/10 flex items-center justify-center flex-shrink-0 border border-teal-500/20">
                                <Loader2 size={12} className="text-teal-500 animate-spin" />
                            </div>
                            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-3 rounded-2xl rounded-bl-none flex gap-1">
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 relative z-20">
                    <div className={`relative flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl border transition-colors ${isListening ? 'border-red-500 animate-pulse' : 'border-transparent focus-within:border-teal-500'}`}>

                        <button
                            onClick={toggleMic}
                            className={`p-3 transition-colors ${isListening ? 'text-red-500' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                            title="Speak"
                        >
                            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                        </button>

                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder={isListening ? "Listening... (Speak now)" : "Ask me anything..."}
                            className="w-full bg-transparent text-slate-900 dark:text-white text-sm p-3 outline-none resize-none h-[48px] max-h-[100px] placeholder:text-slate-400"
                            rows={1}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isTyping}
                            className={`mr-2 p-2 rounded-lg transition-all duration-300 ${input.trim()
                                    ? 'bg-teal-500 text-white shadow-md hover:scale-105 active:scale-95'
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                                }`}
                        >
                            <Send size={16} className={input.trim() ? 'fill-current' : ''} />
                        </button>
                    </div>
                    <div className="text-center mt-2">
                        <p className="text-[9px] text-slate-400 dark:text-slate-500">
                            Clinicox can make mistakes. Consider checking important info.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ClinicoxChat;

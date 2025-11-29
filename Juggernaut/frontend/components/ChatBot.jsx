import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MessageCircle, X, Send, Loader2, Bot, User as UserIcon, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { translations } from '../translations'; // Assuming you might need translations later, kept import style

export const ChatBot = ({ language }) => {
  // NOTE: Keeping the default state as 'false' so it appears as a floating button
  const [isOpen, setIsOpen] = useState(false); 
  const [messages, setMessages] = useState([
    { id: 'welcome', role: 'model', text: 'Hello! I am your Agri-Sentry AI assistant. How can I help you with your crops today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const chatSessionRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const initializeChat = () => {
    if (!chatSessionRef.current) {
      // NOTE: Using a placeholder for API_KEY access, ensure this is handled correctly in your environment (.env.local)
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      chatSessionRef.current = ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: {
          systemInstruction: `You are an expert agricultural AI assistant for the Agri-Sentry platform. Current user language is ${language}. You are helpful, concise, and knowledgeable about farming, crop diseases, supply verification, and weather patterns. Keep responses professional yet friendly.`,
        },
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      chatSessionRef.current = null;
      initializeChat();
    }
  }, [isOpen, language]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      if (!chatSessionRef.current) {
         initializeChat();
      }
      
      if (chatSessionRef.current) {
        const result = await chatSessionRef.current.sendMessage({ message: userMessage.text });
        const text = result.text;
        
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: text || "I didn't get a response."
        }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I'm sorry, I'm having trouble connecting to the satellite network right now. Please try again later."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Calculate the offset needed to clear the bottom navigation bar (if it's 60px tall)
  // We'll use a larger bottom margin for the button to lift it above the nav bar.
  const bottomOffsetClass = 'bottom-[75px]'; // 75px should place it nicely above the bottom nav

  return (
    <>
      {/* Floating Toggle Button - POSITIONED IN THE BOTTOM-RIGHT CORNER */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        // POSITION ADJUSTMENT: Using right-4 and a custom bottom offset to clear the bottom navigation bar.
        className={`fixed ${bottomOffsetClass} right-4 md:bottom-6 md:right-6 z-50 p-3 md:p-4 rounded-full shadow-[0_0_30px_rgba(163,230,53,0.3)] transition-all duration-300 ${
          isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'bg-lime-400 text-emerald-950 hover:bg-lime-300'
        }`}
      >
        <MessageCircle size={28} className='md:size-8' strokeWidth={2.5} />
      </motion.button>

      {/* Chat Window - POSITIONED IN THE BOTTOM-RIGHT CORNER */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            // POSITION ADJUSTMENT: Fullscreen on mobile, floating in the bottom-right on desktop.
            className={`fixed inset-0 md:inset-auto md:bottom-6 md:right-6 
                        w-full h-full max-h-none 
                        md:w-[400px] md:h-[600px] md:max-h-[80vh] 
                        bg-slate-900/90 backdrop-blur-2xl rounded-none md:rounded-[2rem] shadow-2xl 
                        flex flex-col overflow-hidden z-50 border border-white/10 font-sans`}
          >
            {/* Header */}
            <div className="p-4 bg-emerald-950/50 border-b border-white/5 flex justify-between items-center shrink-0 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-lime-400/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
              
              <div className="flex items-center gap-3 relative z-10">
                <div className="p-2 bg-lime-400/20 rounded-xl backdrop-blur-md border border-lime-400/20">
                  <Bot size={24} className="text-lime-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight text-white">Agri-Sentry AI</h3>
                  <p className="text-[10px] text-emerald-200/70 flex items-center gap-1 font-medium tracking-wide">
                    <span className="w-1.5 h-1.5 bg-lime-400 rounded-full animate-pulse"></span>
                    ONLINE
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors relative z-10 text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20 custom-scrollbar">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/5 ${
                    msg.role === 'user' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-lime-500/20 text-lime-400'
                  }`}>
                    {msg.role === 'user' ? <UserIcon size={16} /> : <Sparkles size={16} />}
                  </div>
                  <div
                    className={`max-w-[80%] max-w-xs p-3.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-emerald-600 text-white rounded-br-none shadow-lg'
                        : 'bg-white/5 text-slate-200 border border-white/5 rounded-bl-none shadow-md backdrop-blur-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-end gap-2">
                   <div className="w-8 h-8 rounded-full bg-lime-500/20 text-lime-400 border border-white/5 flex items-center justify-center shrink-0">
                    <Sparkles size={16} />
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl rounded-bl-none border border-white/5 shadow-sm">
                    <Loader2 size={18} className="animate-spin text-lime-400" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-slate-950/50 border-t border-white/5 shrink-0">
              <div className="relative flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask about crops..."
                  disabled={isLoading}
                  className="w-full pl-4 pr-12 py-3.5 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:border-lime-400/50 focus:ring-1 focus:ring-lime-400/20 transition-all text-sm text-white placeholder:text-slate-500"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading}
                  className="absolute right-2 p-2 bg-lime-400 text-emerald-950 rounded-lg hover:bg-lime-300 disabled:opacity-50 disabled:hover:bg-lime-400 transition-colors shadow-[0_0_10px_rgba(163,230,53,0.3)]"
                >
                  <Send size={16} strokeWidth={2.5} />
                </button>
              </div>
              <div className="text-center mt-2">
                 <p className="text-[10px] text-slate-500 font-medium">Powered by Gemini 3 Pro</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
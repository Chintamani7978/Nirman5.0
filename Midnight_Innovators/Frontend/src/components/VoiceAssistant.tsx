import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, MessageCircle, X, Volume2, VolumeX } from 'lucide-react';

interface Message {
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface SpeechRecognitionEvent {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionStatic {
  new (): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionStatic;
    webkitSpeechRecognition: SpeechRecognitionStatic;
  }
}

const VoiceAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('hi');
  
  const apiKey = 'AIzaSyDLkpZsJLm0FmbMYYCxLgx_6oRIj0Y9HFU';

  const languages = {
    'hi': { name: 'हिंदी (Hindi)', code: 'hi-IN', flag: '🇮🇳' },
    'or': { name: 'ଓଡ଼ିଆ (Odia)', code: 'or-IN', flag: '🇮🇳' },
    'en': { name: 'English', code: 'en-US', flag: '🇺🇸' }
  };
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = languages[selectedLanguage as keyof typeof languages].code;
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    const getWelcomeMessage = () => {
      if (selectedLanguage === 'hi') {
        return 'नमस्ते! मैं आपका कृषि विशेषज्ञ हूँ। मुझसे फसल, मिट्टी, सिंचाई, या सब्सिडी के बारे में पूछिए।';
      } else if (selectedLanguage === 'or') {
        return 'ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କ କୃଷି ବିଶେଷଜ୍ଞ। ମୋତେ ଫସଲ, ମାଟି, ସିଙ୍ଚନ ବିଷୟରେ ପ୍ରଶ୍ନ କରନ୍ତୁ।';
      } else {
        return 'Hello! I\'m your Agricultural Expert. Ask me about crops, soil, irrigation, or subsidies.';
      }
    };
    
    const welcomeMessage: Message = {
      type: 'ai',
      content: getWelcomeMessage(),
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = languages[selectedLanguage as keyof typeof languages].code;
    }
  }, [selectedLanguage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startListening = (): void => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = (): void => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speakText = (text: string): void => {
    if (!text || !window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.3;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      utterance.lang = languages[selectedLanguage as keyof typeof languages].code;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }, 100);
  };

  const stopSpeaking = (): void => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const sendMessage = async (text: string): Promise<void> => {
    if (!text.trim()) return;
    
    const userMessage: Message = { type: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const languageName = selectedLanguage === 'hi' ? 'Hindi' : 
                           selectedLanguage === 'or' ? 'Odia' : 'English';
      
      const prompt = `You are an Agricultural Expert. Respond ONLY in ${languageName} language. Maximum 150 words. Provide practical farming advice about: ${text}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 150 }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || getFallbackResponse(text);
        setMessages(prev => [...prev, { type: 'ai', content: aiResponse, timestamp: new Date() }]);
      } else {
        setMessages(prev => [...prev, { type: 'ai', content: getFallbackResponse(text), timestamp: new Date() }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { type: 'ai', content: getFallbackResponse(text), timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const getFallbackResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (selectedLanguage === 'hi') {
      if (lowerQuestion.includes('crop') || lowerQuestion.includes('fasal')) {
        return 'फसल चुनाव: मिट्टी के प्रकार और जलवायु के अनुसार किस्म चुनें। टमाटर, प्याज, आलू नए किसानों के लिए अच्छे हैं।';
      }
      return 'मैं आपका कृषि विशेषज्ञ हूँ। मुझसे फसल, मिट्टी, सिंचाई या सब्सिडी के बारे में पूछिए।';
    } else if (selectedLanguage === 'or') {
      return 'ମୁଁ ଆପଣଙ୍କ କୃଷି ବିଶେଷଜ୍ଞ। ମୋତେ ଫସଲ, ମାଟି ବିଷୟରେ ପ୍ରଶ୍ନ କରନ୍ତୁ।';
    }
    return 'I\'m your Agricultural Expert. Ask about crops, soil, irrigation, or farming techniques.';
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage(inputText);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {isOpen && (
        <div className="bg-white rounded-lg shadow-2xl border w-full max-w-[450px] h-[500px] flex flex-col">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-medium">KrishiShayak</span>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="text-xs bg-white/20 text-white border border-white/30 rounded px-2 py-1"
              >
                {Object.entries(languages).map(([code, lang]) => (
                  <option key={code} value={code} className="text-gray-800">
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
              {isSpeaking && (
                <button onClick={stopSpeaking} className="p-1 hover:bg-white/20 rounded">
                  <VolumeX size={16} />
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded">
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 border'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  {message.type === 'ai' && (
                    <button
                      onClick={() => speakText(message.content)}
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1 mt-2"
                    >
                      <Volume2 size={12} />
                      <span>Speak</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t bg-white rounded-b-lg">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message or use voice..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              <button
                onClick={isListening ? stopListening : startListening}
                className={`p-2 rounded-full transition-colors ${
                  isListening ? 'bg-red-600 text-white animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
              
              <button
                onClick={() => sendMessage(inputText)}
                disabled={!inputText.trim()}
                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </div>
            
            {isListening && (
              <p className="text-xs text-red-600 mt-2 text-center animate-pulse">
                🎤 Listening... Speak now
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;

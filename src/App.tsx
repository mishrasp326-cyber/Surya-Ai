import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Sparkles, Command, Sun, Cpu, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getSuryaResponse } from './services/geminiService';

// Type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface Message {
  role: 'user' | 'model';
  content: string;
}

const MOODS = [
  { name: 'solar', primary: '#f59e0b', secondary: '#ea580c', accent: '#fbbf24' },
  { name: 'cosmic', primary: '#8b5cf6', secondary: '#6d28d9', accent: '#a78bfa' },
  { name: 'emerald', primary: '#10b981', secondary: '#059669', accent: '#34d399' },
  { name: 'lunar', primary: '#06b6d4', secondary: '#0891b2', accent: '#22d3ee' },
  { name: 'nebula', primary: '#f43f5e', secondary: '#e11d48', accent: '#fb7185' },
];

const SuryaAvatar = ({ isThinking, isSpeaking, isListening, mood }: { isThinking: boolean, isSpeaking: boolean, isListening: boolean, mood: typeof MOODS[0] }) => {
  const activePrimary = isListening ? '#3b82f6' : mood.primary;
  const activeSecondary = isListening ? '#4f46e5' : mood.secondary;
  const activeAccent = isListening ? '#60a5fa' : mood.accent;

  return (
    <div className="relative flex items-center justify-center h-64 md:h-[400px]">
      {/* Atmosphere Glow */}
      <motion.div
        animate={{
          scale: (isThinking || isSpeaking || isListening) ? [1, 1.2, 1] : [1, 1.1, 1],
          opacity: (isThinking || isSpeaking || isListening) ? [0.2, 0.4, 0.2] : [0.1, 0.2, 0.1],
          backgroundColor: activePrimary
        }}
        transition={{ duration: isListening ? 1 : 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none transition-colors duration-1000 opacity-20"
      />

      {/* Main Orb Container with Hover interactivity */}
      <motion.div 
        className="relative w-64 h-64 md:w-80 md:h-80 group cursor-pointer"
        whileHover="hover"
      >
        {/* Outer Glow */}
        <motion.div 
          animate={{
            scale: isListening ? 1.15 : 1,
            opacity: isListening ? 0.8 : 0.6,
            background: `linear-gradient(to bottom, ${activeAccent}33, ${activeSecondary}1a)`
          }}
          variants={{
            hover: { scale: 1.1, opacity: 0.4 }
          }}
          className="absolute inset-0 rounded-full blur-xl transition-all duration-1000"
        />
        
        {/* Main Metallic Body */}
        <motion.div 
          animate={{ 
            y: isListening ? [0, -20, 0] : [0, -10, 0],
            scale: isSpeaking ? [1, 1.05, 1] : 1
          }}
          variants={{
            hover: { y: -15, scale: 1.02 }
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ boxShadow: isListening ? '0 0 50px rgba(59, 130, 246, 0.3)' : `0 0 50px ${activePrimary}33` }}
          className="absolute inset-0 rounded-full bg-zinc-900 border border-white/10 overflow-hidden flex items-center justify-center transition-all duration-1000 group-hover:shadow-[0_0_70px_rgba(245,158,11,0.3)]"
        >
          {/* Surface Reflections */}
          <div className="absolute top-0 left-1/4 w-1/2 h-1/4 bg-white/5 blur-md rounded-full transition-opacity duration-500 group-hover:bg-white/10"></div>
          
          {/* Crystalline Core */}
          <div className="absolute inset-[20%] rounded-full bg-[#111] flex items-center justify-center shadow-inner overflow-hidden border border-white/5">
            {/* Core Light Pulse */}
            <motion.div
              animate={{
                opacity: (isThinking || isSpeaking) ? [0.6, 1, 0.6] : isListening ? [0.8, 1, 0.8] : [0.4, 0.7, 0.4],
                scale: (isThinking || isSpeaking) ? [1, 1.1, 1] : isListening ? [1.1, 1.3, 1.1] : [0.95, 1.05, 0.95],
                rotate: isListening ? [45, 135, 45] : 45,
                background: `linear-gradient(to top right, ${activeSecondary}, ${activePrimary}, #fff)`
              }}
              variants={{
                hover: { scale: 1.2, opacity: 0.9 }
              }}
              transition={{ duration: (isThinking || isSpeaking || isListening) ? 1.5 : 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-full h-full blur-sm flex items-center justify-center transition-all duration-1000"
            >
               <div className="w-16 h-16 bg-white/30 rounded-full blur-xl"></div>
            </motion.div>
            
            {/* Geometric Accents */}
            <div className="absolute inset-0 border-[0.5px] border-white/20 rounded-full scale-90"></div>
            <div className="absolute inset-0 border-[0.5px] border-white/10 rounded-full scale-75"></div>
            
            <Sun className="w-10 h-10 relative z-10 transition-colors duration-1000" style={{ color: `${activeAccent}80` }} />
          </div>
        </motion.div>

        {/* Floating Satellite Orbs */}
        <motion.div 
          animate={{ x: [0, 5, 0], y: [0, -5, 0] }}
          variants={{
            hover: { x: 10, y: -10, scale: 1.2 }
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ borderColor: `${activePrimary}4d` }}
          className="absolute -top-4 -right-2 w-4 h-4 bg-zinc-800 border rounded-full shadow-lg transition-colors duration-1000" 
        />
        <motion.div 
          animate={{ x: [0, -8, 0], y: [0, 8, 0] }}
          variants={{
            hover: { x: -15, y: 15, scale: 1.1 }
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{ borderColor: `${activePrimary}4d` }}
          className="absolute bottom-12 -left-8 w-6 h-6 bg-zinc-800 border rounded-full shadow-lg transition-colors duration-1000" 
        />
      </motion.div>
    </div>
  );
};


export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: 'Greetings. I am Surya. How can I assist you in your journey of knowledge today?' }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [moodIndex, setMoodIndex] = useState(0);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const currentMood = MOODS[moodIndex];

  // PWA Install Logic
  useEffect(() => {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(registration => {
        console.log('SW registered: ', registration);
      }).catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setDeferredPrompt(null);
    }
  };

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        handleSend(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        
        // Handle network error specifically
        if (event.error === 'network') {
          setVoiceError('Network connection failed');
          // Clear error after a few seconds
          setTimeout(() => setVoiceError(null), 3000);
        } else if (event.error === 'not-allowed') {
          setVoiceError('Microphone access denied');
          setTimeout(() => setVoiceError(null), 3000);
        }
        
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  // TTS implementation
  const speak = useCallback((text: string) => {
    if (!ttsEnabled || !window.speechSynthesis) return;

    // Stop any current speaking
    window.speechSynthesis.cancel();

    // Clean markdown for better speech
    const cleanText = text.replace(/[*#_`]/g, '').replace(/\[(.*?)\]\(.*?\)/g, '$1');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.1;
    utterance.pitch = 0.9; // Slightly deeper for "sophisticated" feel
    
    // Try to find a good voice
    const voices = window.speechSynthesis.getVoices();
    const premiumVoice = voices.find(v => v.name.includes('Google') && v.lang.startsWith('en')) || 
                        voices.find(v => v.name.includes('Samantha')) ||
                        voices[0];
    
    if (premiumVoice) utterance.voice = premiumVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [ttsEnabled]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      // Cancel any current speaking
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleSend = async (textOverride?: string) => {
    const messageToSend = textOverride || input;
    if (!messageToSend.trim() || isThinking) return;

    if (!textOverride) setInput('');
    setMessages(prev => [...prev, { role: 'user', content: messageToSend }]);
    setIsThinking(true);

    const history = messages.map(m => ({ role: m.role, content: m.content }));
    const response = await getSuryaResponse(messageToSend, history);

    setMessages(prev => [...prev, { role: 'model', content: response }]);
    setIsThinking(false);
    
    // Change mood on response
    setMoodIndex((prev) => (prev + 1) % MOODS.length);
    
    // Speak response
    speak(response);
  };

  return (
    <div className="min-h-screen relative flex flex-col font-sans selection:bg-white/20">
      {/* Background Aesthetic Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ backgroundColor: currentMood.secondary }}
          transition={{ duration: 2 }}
          className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] blur-[120px] rounded-full opacity-5" 
        />
        <motion.div 
          animate={{ backgroundColor: currentMood.primary }}
          transition={{ duration: 2 }}
          className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] blur-[120px] rounded-full opacity-5" 
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* Header */}
      <nav className="absolute top-0 w-full px-6 sm:px-12 py-8 flex justify-between items-center z-20">
        <div className="flex items-center gap-3">
          <motion.div 
            animate={{ background: `linear-gradient(to top right, ${currentMood.secondary}, ${currentMood.primary})` }}
            transition={{ duration: 2 }}
            className="w-8 h-8 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          />
          <span className="text-xl font-light tracking-[0.2em] uppercase font-display">Surya</span>
        </div>
        <div className="hidden md:flex gap-8 text-[10px] font-medium tracking-[0.2em] text-zinc-500 uppercase items-center">
          <AnimatePresence>
            {deferredPrompt && (
              <motion.button 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={handleInstall}
                className="px-4 py-1.5 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                Install Surya AI
              </motion.button>
            )}
          </AnimatePresence>
          <motion.span animate={{ color: currentMood.primary }} transition={{ duration: 2 }} className="cursor-pointer">Assistant</motion.span>
          <span className="hover:text-white transition-colors cursor-pointer">Knowledge</span>
          
          <button 
            onClick={() => setTtsEnabled(!ttsEnabled)}
            className={`flex items-center gap-2 transition-colors hover:text-white ${ttsEnabled ? 'text-zinc-300' : 'text-zinc-500'}`}
          >
            {ttsEnabled ? <Volume2 style={{ color: currentMood.primary }} className="w-4 h-4 transition-colors duration-1000" /> : <VolumeX className="w-4 h-4" />}
            <span>{ttsEnabled ? 'Voice ON' : 'Voice OFF'}</span>
          </button>
          
          <span className="hover:text-white transition-colors cursor-pointer">Settings</span>
        </div>
      </nav>

      <main className="flex-1 relative z-10 flex flex-col max-w-4xl mx-auto w-full px-4 sm:px-6">
        <div className="flex-1 flex flex-col pt-8">
          {/* Avatar Section */}
          <SuryaAvatar isThinking={isThinking} isSpeaking={isSpeaking} isListening={isListening} mood={currentMood} />

          {/* Chat History */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto space-y-8 pb-32 pt-8 scroll-smooth no-scrollbar"
          >
            <AnimatePresence initial={false}>
              {messages.map((message, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] sm:max-w-[75%] flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.role === 'user' ? 'bg-white/10' : 'bg-white/5 border border-white/10'}`}>
                      {message.role === 'user' ? <User className="w-4 h-4" /> : 
                        <motion.div animate={{ color: currentMood.primary }} transition={{ duration: 2 }}>
                          <Sparkles className="w-4 h-4" />
                        </motion.div>
                      }
                    </div>
                    <div className={`space-y-1`}>
                      <div className={`text-[10px] uppercase tracking-widest opacity-30 font-medium ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                        {message.role === 'user' ? 'Directive' : 'Surya'}
                      </div>
                      <div className={`px-4 py-3 rounded-2xl glass ${message.role === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'}`}>
                        <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-black/50 overflow-hidden">
                          <ReactMarkdown components={{
                            strong: ({node, ...props}) => <strong style={{ color: currentMood.accent }} className="transition-colors duration-1000" {...props} />,
                            code: ({node, ...props}) => <code style={{ color: currentMood.accent }} className="transition-colors duration-1000" {...props} />
                          }}>
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              {isThinking && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex gap-3">
                    <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                      <motion.div animate={{ color: currentMood.primary }} transition={{ duration: 2 }}>
                        <Sparkles className="w-4 h-4 animate-pulse" />
                      </motion.div>
                    </div>
                    <div className="space-y-2">
                       <div className="text-[10px] uppercase tracking-widest opacity-30 font-medium">Synthesizing</div>
                       <div className="flex gap-1 items-center px-4 py-3 h-10 glass rounded-2xl rounded-tl-none">
                        <motion.div style={{ backgroundColor: currentMood.primary }} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 rounded-full" />
                        <motion.div style={{ backgroundColor: currentMood.primary }} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full" />
                        <motion.div style={{ backgroundColor: currentMood.primary }} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full" />
                       </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Input Area / Footer Area */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 sm:p-12 z-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-end justify-between gap-8 md:gap-0">
          {/* System Stats */}
          <div className="hidden lg:flex gap-12">
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Neural Sync</p>
              <motion.p animate={{ color: currentMood.primary }} className="text-xs font-mono transition-colors duration-1000">98.4% ACTIVE</motion.p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Core Temp</p>
              <p className="text-xs font-mono text-zinc-300">24.0°C</p>
            </div>
          </div>

          <div className="flex-1 max-w-2xl w-full flex flex-col md:flex-row items-center gap-8 px-4 md:px-0">
             {/* Waveform Placeholder - Now animated by speech/thinking */}
             <div className="hidden md:flex items-center gap-1 h-8">
               {[...Array(8)].map((_, i) => (
                 <motion.div 
                   key={i}
                   animate={{ 
                     height: (isSpeaking || isListening || isThinking) ? 
                        [8, 24, 12, 32, 8][(i + (isListening ? 2 : 0)) % 5] : 8,
                     backgroundColor: isListening ? '#3b82f6' : (isSpeaking || isThinking) ? currentMood.primary : '#3f3f46'
                   }}
                   transition={{ 
                     duration: isListening ? 0.5 : (isSpeaking || isThinking) ? 0.8 : 2, 
                     repeat: Infinity, 
                     delay: i * 0.1 
                   }}
                   className={`w-[2.5px] rounded-full transition-colors duration-1000`} 
                 />
               ))}
             </div>

             {/* Input Bar */}
             <div className="flex-1 w-full relative group">
               <motion.div 
                 animate={{ backgroundColor: currentMood.primary }}
                 className={`absolute -inset-1 rounded-full blur opacity-5 group-focus-within:opacity-20 transition duration-1000`} 
               />
               <div className={`relative flex items-center gap-2 p-1.5 bg-zinc-900/60 backdrop-blur-xl border rounded-full transition-all duration-500 ${isListening ? 'border-blue-500/50' : 'border-white/10 group-focus-within:border-white/20'}`}>
                 <input
                   type="text"
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                   placeholder={voiceError ? voiceError : isListening ? "Listening..." : "Message Surya..."}
                   className={`flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-zinc-500 px-6 py-2 text-sm font-light ${voiceError ? 'placeholder-red-400' : ''}`}
                 />
                 
                 <div className="flex items-center gap-1 pr-1">
                    <button
                      onClick={toggleListening}
                      className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${voiceError ? 'border-red-500 text-red-500 bg-red-500/10' : isListening ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'border-white/10 hover:border-white/30 text-zinc-500 hover:text-white'}`}
                      title={isListening ? "Stop listening" : "Start voice input"}
                    >
                      {isListening ? <MicOff className="w-5 h-5 animate-pulse" /> : <Mic className="w-5 h-5" />}
                    </button>

                    <button
                      onClick={() => handleSend()}
                      disabled={isThinking || !input.trim() || isListening}
                      className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors disabled:opacity-30 group-focus-within:border-white/30"
                    >
                      <motion.div 
                        animate={{ backgroundColor: currentMood.primary }}
                        style={{ boxShadow: `0 0 8px ${currentMood.primary}` }}
                        className="w-1.5 h-1.5 rounded-full transition-colors duration-1000" 
                      />
                    </button>
                 </div>
               </div>
             </div>
          </div>

          {/* Context Stat (Right Side) */}
          <div className="hidden lg:block space-y-1 text-right">
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Contextual Depth</p>
            <p className="text-xs font-mono text-zinc-300">1.2M Tokens</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

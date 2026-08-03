import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { generateResponse } from '../engine/chatbot';
import type { ChatContext } from '../engine/chatbot';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

export default function ChatWidget() {
  const { user } = useAuth();
  const { profile, spending, recommendations, multiCardResults } = useData();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      const greeting: Message = {
        id: 'greeting',
        role: 'assistant',
        text: profile
          ? `Welcome back! I see you have an income of Rs.${(profile.annual_income / 100000).toFixed(1)}L and a credit score of ${profile.credit_score}. How can I help optimize your credit card strategy today?`
          : "Hello! I'm your FinOptima AI financial advisor. Complete your profile first, and I'll provide personalized credit card recommendations and financial insights.",
        timestamp: new Date(),
      };
      setMessages([greeting]);
    }
  }, [open, profile]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input.trim(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    await new Promise(r => setTimeout(r, 800 + Math.random() * 600));

    const ctx: ChatContext = { profile, spending, recommendations, multiCardResults };
    const responseText = generateResponse(userMsg.text, ctx);

    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      text: responseText,
      timestamp: new Date(),
    };
    setTyping(false);
    setMessages(prev => [...prev, assistantMsg]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!user) return null;

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-4 md:right-6 w-[calc(100vw-2rem)] md:w-[400px] h-[500px] z-50 flex flex-col glass-card overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between bg-gradient-to-r from-fin-emerald/10 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-fin-emerald/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-fin-emerald" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">FinOptima AI</h3>
                  <p className="text-xs text-gray-500">Financial Advisor</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === 'assistant' ? 'bg-fin-emerald/20' : 'bg-white/10'
                  }`}>
                    {msg.role === 'assistant'
                      ? <Bot className="w-3.5 h-3.5 text-fin-emerald" />
                      : <User className="w-3.5 h-3.5 text-gray-400" />
                    }
                  </div>
                  <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === 'assistant'
                      ? 'bg-white/[0.04] text-gray-200 rounded-tl-sm'
                      : 'bg-fin-emerald/15 text-white rounded-tr-sm'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2.5"
                >
                  <div className="w-7 h-7 rounded-full bg-fin-emerald/20 flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-fin-emerald" />
                  </div>
                  <div className="bg-white/[0.04] px-4 py-3 rounded-2xl rounded-tl-sm">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 bg-fin-emerald rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="px-4 py-3 border-t border-white/[0.06]">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about your finances..."
                  className="flex-1 px-3.5 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-fin-emerald/40"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || typing}
                  className="w-10 h-10 rounded-xl bg-fin-emerald/20 text-fin-emerald flex items-center justify-center hover:bg-fin-emerald/30 transition-colors disabled:opacity-40"
                >
                  {typing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => { setOpen(!open); setTimeout(() => inputRef.current?.focus(), 200); }}
        className="fixed bottom-6 right-4 md:right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-fin-emerald to-fin-emerald-dark text-white shadow-lg shadow-fin-emerald/25 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
            <span className="absolute w-full h-full bg-amber-500 rounded-full animate-ping opacity-75" />
            <span className="relative w-2 h-2 bg-amber-400 rounded-full" />
          </span>
        )}
      </motion.button>
    </>
  );
}

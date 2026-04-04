import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, ArrowRight, RefreshCw, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const SupportChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();
  const { theme } = useTheme();
  const chatEndRef = useRef(null);
  
  const isDark = theme === 'dark';
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  useEffect(() => {
    if (isOpen && user) {
      fetchHistory();
    }
  }, [isOpen, user]);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_URL}/support`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChatHistory(res.data.data);
    } catch (err) {
      console.error('Failed to fetch support history');
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || !user) return;

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/support`, 
        { message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setChatHistory([...chatHistory, res.data.data]);
      setMessage('');
      fetchHistory(); // Refresh to ensure we have any new admin replies
    } catch (err) {
      console.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-32 md:bottom-8 right-8 z-[150]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`absolute bottom-20 right-0 w-[350px] md:w-[400px] h-[500px] rounded-[2rem] border shadow-2xl flex flex-col overflow-hidden ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`}
          >
            {/* Header */}
            <div className="p-6 bg-primary text-white flex justify-between items-center shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">BN</div>
                <div>
                   <h4 className="font-bold">Support Chat</h4>
                   <p className="text-[10px] opacity-70 font-bold uppercase tracking-widest">Online 🟢</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <X size={24} />
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 no-scrollbar">
               {chatHistory.length > 0 ? (
                 chatHistory.map((m, i) => (
                   <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium ${m.sender === 'user' ? 'bg-primary text-white rounded-tr-none' : `${isDark ? 'bg-white/10 text-slate-200' : 'bg-slate-100 text-slate-800'} rounded-tl-none`}`}>
                         {m.message}
                         <p className="text-[8px] mt-1 opacity-50 uppercase font-bold text-right">{new Date(m.createdAt).toLocaleTimeString()}</p>
                      </div>
                   </div>
                 ))
               ) : (
                 <div className="h-full flex flex-col items-center justify-center opacity-20 text-center">
                    <MessageCircle size={60} className="mb-4" />
                    <p className="font-bold">Need help? Send us a message!</p>
                 </div>
               )}
               <div ref={chatEndRef} />
            </div>

            {/* Form */}
            <form onSubmit={handleSend} className="p-6 border-t border-white/5">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Ask anything..."
                  className={`w-full rounded-xl py-4 pl-6 pr-12 outline-none border transition-all font-bold text-sm ${isDark ? 'bg-white/5 border-white/10 text-white focus:border-primary' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-primary'}`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={loading}
                />
                <button 
                  type="submit" 
                  disabled={loading || !message.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:scale-110 transition-transform disabled:opacity-30"
                >
                  {loading ? <RefreshCw className="animate-spin" size={20} /> : <Send size={20} />}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-5 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 flex items-center justify-center text-white ${isOpen ? 'bg-red-500 bg-none' : 'bg-primary shadow-primary/40'}`}
      >
        {isOpen ? <X size={32} /> : <MessageCircle size={32} />}
      </button>
    </div>
  );
};

export default SupportChatWidget;

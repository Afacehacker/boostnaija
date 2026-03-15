import React from 'react';
import { Send } from 'lucide-react';

const TelegramWidget = () => {
  return (
    <a 
      href="https://t.me/boostnaija1" // Admin Telegram Channel
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-32 md:bottom-8 right-8 z-[100] bg-[#0088cc] text-white p-4 rounded-full shadow-2xl telegram-pulse hover:scale-110 transition-transform flex items-center justify-center border-4 border-white/10"
    >
      <Send size={32} fill="currentColor" />
    </a>
  );
};

export default TelegramWidget;

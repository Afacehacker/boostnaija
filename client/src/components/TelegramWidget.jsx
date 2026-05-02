import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import axios from 'axios';

const TelegramWidget = () => {
  const [telegramLink, setTelegramLink] = useState('https://t.me/boostnaija1');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${API_URL}/settings`);
        if (res.data && res.data.telegramLink) {
          setTelegramLink(res.data.telegramLink);
        }
      } catch (err) {
        console.error('Failed to fetch settings');
      }
    };
    fetchSettings();
  }, [API_URL]);

  return (
    <a 
      href={telegramLink}
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-32 md:bottom-8 right-8 z-[100] bg-[#0088cc] text-white p-4 rounded-full shadow-2xl telegram-pulse hover:scale-110 transition-transform flex items-center justify-center border-4 border-white/10"
    >
      <Send size={32} fill="currentColor" />
    </a>
  );
};

export default TelegramWidget;

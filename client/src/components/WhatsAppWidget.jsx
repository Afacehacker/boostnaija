import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppWidget = () => {
  return (
    <a 
      href="https://wa.me/2348000000000" // Replace with real support number
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-[100] bg-[#25D366] text-white p-4 rounded-full shadow-2xl whatsapp-pulse hover:scale-110 transition-transform flex items-center justify-center"
    >
      <MessageCircle size={32} />
    </a>
  );
};

export default WhatsAppWidget;

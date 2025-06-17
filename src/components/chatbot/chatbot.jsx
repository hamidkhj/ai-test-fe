// src/components/ChatbotWidget.jsx
import React, { useState } from 'react';
import { MessageSquareText } from 'lucide-react'; 

// ChatbotWidget Component
const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false); // State to control widget visibility

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="font-sans">

      <button
        onClick={toggleChat}
        className="fixed bottom-4 left-4 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 z-50"
        aria-label="Toggle Chatbot"
      >
        <MessageSquareText size={24} />
      </button>

    </div>
  );
};

export default ChatbotWidget;
import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageSquare, Loader } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface AIConciergeProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

export const AIConcierge: React.FC<AIConciergeProps> = ({
  isOpen,
  onClose,
  userId,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        'Welcome to M&M Auto Performance! 🏎️ I\'m your AI Sky Concierge. How can I help you today? I can assist with bookings, fleet information, or answer any questions about our services.',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: { [key: string]: string } = {
        book: 'I can help you book a vehicle! What dates are you looking for, and what type of car interests you?',
        fleet:
          'We have an exclusive fleet of 500+ premium vehicles including Lamborghinis, Ferraris, Porsches, and more. Which category interests you?',
        price:
          'Pricing varies by vehicle type. Luxury sedans start at £150/day, sports cars from £250/day, and exotic supercars from £500+. Would you like to explore options?',
        documents:
          'Our AI verification system processes documents instantly. You\'ll need a valid driving license, insurance, and ID verification.',
        location:
          'We operate across London and Hertfordshire with pickup points in Mayfair, St Albans, Watford, and Radlett. Where would you like to pick up?',
        default:
          'Great question! To provide the best assistance, could you tell me more about what you\'re looking for? Are you interested in booking a vehicle, learning about our fleet, or something else?',
      };

      const key = Object.keys(responses).find((k) =>
        inputValue.toLowerCase().includes(k)
      );

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responses[key || 'default'],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => {
          // Toggle would be handled by parent
        }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-performance-babyblue to-performance-turquoise rounded-full shadow-lg hover:shadow-2xl transition-all transform hover:scale-110 flex items-center justify-center text-performance-grey"
      >
        <MessageSquare size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-performance-grey border border-performance-turquoise/30 rounded-2xl shadow-2xl shadow-performance-turquoise/30 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-performance-babyblue/20 to-performance-turquoise/20 border-b border-performance-turquoise/30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          <div>
            <h3 className="font-bold text-white">Sky Concierge</h3>
            <p className="text-xs text-gray-400">Always available</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-performance-turquoise/20 rounded-lg transition-colors"
        >
          <X size={20} className="text-gray-400" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-performance-grey/50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-performance-turquoise text-performance-grey'
                  : 'bg-performance-babyblue/20 text-gray-100 border border-performance-babyblue/30'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p
                className={`text-xs mt-1 ${
                  message.role === 'user'
                    ? 'text-performance-grey/70'
                    : 'text-gray-400'
                }`}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-performance-babyblue/20 text-gray-100 border border-performance-babyblue/30 px-4 py-2 rounded-lg flex items-center gap-2">
              <Loader size={16} className="animate-spin" />
              <p className="text-sm">Thinking...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 border-t border-performance-turquoise/20">
        <div className="grid grid-cols-2 gap-2">
          {['📅 Book', '🚗 Fleet', '💰 Pricing', '📋 Docs'].map((action) => (
            <button
              key={action}
              onClick={() => {
                setInputValue(action.split(' ')[1].toLowerCase());
              }}
              className="text-xs px-3 py-2 bg-performance-turquoise/10 hover:bg-performance-turquoise/20 text-performance-turquoise rounded border border-performance-turquoise/20 transition-all"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-performance-turquoise/20 px-4 py-3 flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask me anything..."
          className="flex-1 px-4 py-2 bg-performance-turquoise/10 border border-performance-turquoise/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-performance-turquoise focus:ring-2 focus:ring-performance-turquoise/20"
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !inputValue.trim()}
          className="p-2 bg-performance-turquoise hover:bg-performance-turquoise/90 text-performance-grey rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default AIConcierge;

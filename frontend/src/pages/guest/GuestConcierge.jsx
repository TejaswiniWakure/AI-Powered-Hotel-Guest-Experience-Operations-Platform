import React, { useState } from 'react';
import { Send, Paperclip, Mic } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function GuestConcierge() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your StayFlow Concierge. How can I assist you today?", sender: 'bot', time: '18:30' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages([...messages, { id: Date.now(), text: input, sender: 'user', time: '18:32' }]);
    setInput('');
    
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: "I've understood your request. I will notify the staff right away.", 
        sender: 'bot', 
        time: '18:32' 
      }]);
    }, 1000);
  };

  const suggestions = [
    "What time is breakfast?",
    "Request room cleaning",
    "Where is the pool?",
    "Order room service",
    "What time is checkout?"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] md:h-screen max-w-2xl mx-auto bg-background">
      {/* Header */}
      <div className="bg-primary text-white p-4 shadow-md z-10 flex-shrink-0">
        <h1 className="text-xl font-bold">StayFlow Concierge</h1>
        <p className="text-sm text-white/70">Here to help during your stay</p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-white border border-border text-primary rounded-bl-none'}`}>
              <p>{msg.text}</p>
              <p className={`text-[10px] mt-1 text-right ${msg.sender === 'user' ? 'text-white/70' : 'text-text-muted'}`}>{msg.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Suggestions */}
      <div className="px-4 pb-2 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide flex-shrink-0">
        {suggestions.map((sug, i) => (
          <button 
            key={i} 
            onClick={() => setInput(sug)}
            className="px-3 py-1.5 bg-white border border-border rounded-full text-sm text-primary whitespace-nowrap hover:bg-secondary-bg flex-shrink-0"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-border flex-shrink-0">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <button type="button" className="p-2 text-text-muted hover:text-primary transition-colors">
            <Paperclip size={20} />
          </button>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..." 
            className="flex-1 bg-secondary-bg border-none rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {input.trim() ? (
            <button type="submit" className="p-2 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors">
              <Send size={18} />
            </button>
          ) : (
            <button type="button" className="p-2 text-text-muted hover:text-primary transition-colors">
              <Mic size={20} />
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

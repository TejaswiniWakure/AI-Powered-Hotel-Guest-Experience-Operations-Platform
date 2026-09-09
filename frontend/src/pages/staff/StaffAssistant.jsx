import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Send, Sparkles } from 'lucide-react';

export default function StaffAssistant() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello Rahul. I'm your StayFlow Assistant. Need help with a task or SOP?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages([...messages, { id: Date.now(), text: input, sender: 'user' }]);
    setInput('');
    
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: "Based on the hotel's Maintenance SOP, you should check the AC compressor relay and fan motor. Make sure to log the part number if a replacement is needed. \n\nSource: **Maintenance SOP v2.1**", 
        sender: 'bot'
      }]);
    }, 1000);
  };

  const suggestions = [
    "What should I check before closing this AC task?",
    "What is the hotel procedure for water leaks?",
    "Show me the Maintenance SOP"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-3xl mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent text-primary flex items-center justify-center">
          <Sparkles size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-primary">Staff Assistant</h1>
          <p className="text-text-muted text-sm">Ask me about procedures, tasks, or hotel information.</p>
        </div>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-secondary-bg text-primary rounded-bl-none'}`}>
                {msg.text.split('\n').map((line, i) => <p key={i} className="mb-1">{line}</p>)}
              </div>
            </div>
          ))}
        </div>

        {/* Suggestions */}
        <div className="px-6 pb-4 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {suggestions.map((sug, i) => (
            <button 
              key={i} 
              onClick={() => setInput(sug)}
              className="px-4 py-2 bg-white border border-border rounded-full text-xs text-primary whitespace-nowrap hover:bg-secondary-bg transition-colors flex-shrink-0"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border bg-white">
          <form onSubmit={handleSend} className="flex items-center gap-3">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the assistant..." 
              className="flex-1 bg-secondary-bg border-none rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            />
            <button type="submit" disabled={!input.trim()} className="p-3 bg-primary text-accent rounded-lg hover:bg-primary-hover disabled:opacity-50 transition-colors">
              <Send size={20} />
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
}

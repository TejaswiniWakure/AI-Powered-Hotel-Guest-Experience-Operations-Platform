import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, BookOpen, Bot, User, Clock } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function GuestConcierge() {
  const { hotelName } = useAuth();
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: `Hello! I am your StayFlow AI Concierge at ${hotelName}. How may I assist your stay today?`,
      sources: []
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const [suggestedQuestions, setSuggestedQuestions] = useState([]);

  useEffect(() => {
    api.get('/guest/concierge/suggestions')
      .then(res => {
        if (Array.isArray(res)) setSuggestedQuestions(res);
      })
      .catch(() => {});
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (questionText) => {
    const query = (questionText || input).trim();
    if (!query || loading) return;

    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: query }]);
    setLoading(true);

    try {
      const res = await api.post('/guest/concierge/chat', { message: query });
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: res.answer,
          sources: res.sources || [],
          sourceLabel: res.sourceLabel
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: "I’m unable to access the hotel knowledge assistant right now. Please contact the front desk directly.",
          sources: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-xl mx-auto p-4">
      {/* Header Info */}
      <div className="mb-3 px-1">
        <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
          <Sparkles size={14} className="text-accent" />
          <span>Grounded Hotel Knowledge Assistant</span>
        </div>
        <p className="text-[11px] text-text-muted">Answers verified directly from {hotelName} directory & policies.</p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-primary text-accent flex items-center justify-center shrink-0 shadow-xs">
                <Bot size={18} />
              </div>
            )}

            <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
              m.sender === 'user'
                ? 'bg-primary text-white rounded-tr-xs'
                : 'bg-white border border-border text-primary shadow-xs rounded-tl-xs'
            }`}>
              <div className="whitespace-pre-line">{m.text}</div>

              {m.sourceLabel && (
                <div className="mt-2.5 pt-2 border-t border-border/60 flex items-center gap-1.5 text-[10px] font-medium text-accent">
                  <BookOpen size={11} />
                  <span>{m.sourceLabel}</span>
                </div>
              )}
            </div>

            {m.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-secondary-bg text-primary flex items-center justify-center shrink-0">
                <User size={16} />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary text-accent flex items-center justify-center shrink-0">
              <Bot size={18} />
            </div>
            <div className="bg-white border border-border rounded-2xl p-3.5 rounded-tl-xs text-xs text-text-muted flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce [animation-delay:0.4s]" />
              <span>Consulting hotel knowledge base...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="py-2 flex gap-1.5 overflow-x-auto no-scrollbar">
        {suggestedQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSend(q)}
            disabled={loading}
            className="whitespace-nowrap text-[11px] font-medium px-3 py-1.5 rounded-full bg-secondary-bg hover:bg-accent/20 hover:text-primary transition-colors border border-border text-text-muted"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2 pt-1">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about breakfast, pool, late checkout..."
          className="flex-1 bg-white border-border text-xs sm:text-sm py-2"
          disabled={loading}
        />
        <Button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-primary text-accent hover:bg-primary-hover px-4 shrink-0"
        >
          <Send size={16} />
        </Button>
      </form>
    </div>
  );
}

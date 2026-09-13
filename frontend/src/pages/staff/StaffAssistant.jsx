import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, BookOpen, Bot, User, Wrench, Shield } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { api } from '../../services/api';

export default function StaffAssistant() {
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: 'Hello! I am your StayFlow Staff Assistant. I can assist you with hotel SOPs, technical checklists, safety protocols, and repair guidelines. What operational query can I help you troubleshoot?',
      sources: []
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedQueries = [
    'What should I check when an AC is not cooling?',
    'What are the SOP steps for a bathroom pipe leak?',
    'Emergency gas leak inspection protocol',
    'How do I test fire extinguisher pressure?'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (queryText) => {
    const q = (queryText || input).trim();
    if (!q || loading) return;

    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: q }]);
    setLoading(true);

    try {
      const res = await api.post('/staff/assistant', { query: q });
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
          text: 'Unable to query SOP database at this moment. Please check with your Duty Engineer.',
          sources: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-10rem)]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-primary font-serif">Staff Operational Assistant</h1>
            <span className="text-xs bg-accent/20 text-primary font-bold px-2 py-0.5 rounded-full">
              SOP Engine
            </span>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Instant troubleshooting procedures and standard engineering checklists grounded in hotel operations documents.
          </p>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <Card className="flex-1 p-5 overflow-y-auto space-y-4 mb-4 bg-white">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-primary text-accent flex items-center justify-center shrink-0 shadow-xs">
                <Wrench size={16} />
              </div>
            )}

            <div className={`max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
              m.sender === 'user'
                ? 'bg-primary text-white rounded-tr-xs'
                : 'bg-secondary-bg/40 border border-border text-primary rounded-tl-xs'
            }`}>
              <div className="whitespace-pre-line">{m.text}</div>

              {m.sourceLabel && (
                <div className="mt-3 pt-2.5 border-t border-border flex items-center gap-1.5 text-[11px] font-semibold text-accent">
                  <BookOpen size={13} />
                  <span>{m.sourceLabel}</span>
                </div>
              )}
            </div>

            {m.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-secondary text-white flex items-center justify-center shrink-0">
                <User size={16} />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary text-accent flex items-center justify-center shrink-0">
              <Wrench size={16} />
            </div>
            <div className="bg-secondary-bg/50 border border-border rounded-2xl p-4 rounded-tl-xs text-xs text-text-muted flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-accent animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-accent animate-bounce [animation-delay:0.4s]" />
              <span>Retrieving hotel standard operating procedures...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </Card>

      {/* Suggested Quick Buttons */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3">
        {suggestedQueries.map((sq, i) => (
          <button
            key={i}
            onClick={() => handleSend(sq)}
            className="text-xs font-medium px-3.5 py-1.5 rounded-full bg-white border border-border text-text-muted hover:border-primary hover:text-primary transition-colors shrink-0 shadow-xs"
          >
            {sq}
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask procedural questions (e.g. AC cooling steps, elevator safety, pipe leak isolation)..."
          className="flex-1 bg-white text-xs sm:text-sm py-2.5"
          disabled={loading}
        />
        <Button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-primary text-accent hover:bg-primary-hover px-5 shrink-0 font-bold"
        >
          <Send size={16} />
        </Button>
      </form>
    </div>
  );
}

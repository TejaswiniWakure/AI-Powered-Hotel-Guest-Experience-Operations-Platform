import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Sparkles, BookOpen, Bot, User, Clock, 
  Search, ChevronDown, ChevronUp, MessageSquare, HelpCircle, X 
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function GuestConcierge() {
  const { hotelName } = useAuth();
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'faq'
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
  const [faqItems, setFaqItems] = useState([]);
  const [faqLoading, setFaqLoading] = useState(false);
  const [faqSearch, setFaqSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedFaqId, setExpandedFaqId] = useState(null);

  // Load suggested questions and FAQ items
  useEffect(() => {
    api.get('/guest/concierge/suggestions')
      .then(res => {
        if (Array.isArray(res)) setSuggestedQuestions(res);
      })
      .catch(() => {});

    setFaqLoading(true);
    api.get('/guest/concierge/faq')
      .then(res => {
        if (res && res.items) setFaqItems(res.items);
      })
      .catch(() => {})
      .finally(() => setFaqLoading(false));
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeTab === 'chat') {
      scrollToBottom();
    }
  }, [messages, loading, activeTab]);

  const handleSend = async (questionText) => {
    const query = (questionText || input).trim();
    if (!query || loading) return;

    setActiveTab('chat');
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

  const categories = ['All', ...new Set(faqItems.map(i => i.category || 'General'))];

  const filteredFaq = faqItems.filter(item => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = !faqSearch || 
      item.question.toLowerCase().includes(faqSearch.toLowerCase()) || 
      item.answer.toLowerCase().includes(faqSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-xl mx-auto p-4">
      {/* Header Info & Tab Bar */}
      <div className="mb-3 px-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
            <Sparkles size={14} className="text-accent" />
            <span>Grounded Hotel Knowledge Assistant</span>
          </div>
          <p className="text-[11px] text-text-muted">Answers verified directly from {hotelName} directory & policies.</p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-secondary-bg p-1 rounded-xl border border-border self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'chat' ? 'bg-primary text-accent shadow-2xs' : 'text-text-muted hover:text-primary'
            }`}
          >
            <Bot size={13} /> Chat AI
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'faq' ? 'bg-primary text-accent shadow-2xs' : 'text-text-muted hover:text-primary'
            }`}
          >
            <BookOpen size={13} /> Browse 30 FAQs
          </button>
        </div>
      </div>

      {/* TAB 1: CHAT INTERFACE */}
      {activeTab === 'chat' && (
        <>
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

                  {/* Initial greeting CTA to browse FAQs */}
                  {idx === 0 && faqItems.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-border/60">
                      <button
                        onClick={() => setActiveTab('faq')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary-bg hover:bg-accent/20 text-primary text-[11px] font-bold transition-colors"
                      >
                        <BookOpen size={13} className="text-accent" />
                        Browse all 30 Hotel Answers & Timings →
                      </button>
                    </div>
                  )}

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
        </>
      )}

      {/* TAB 2: BROWSE ALL 30 HOTEL FAQS DIRECTORY */}
      {activeTab === 'faq' && (
        <div className="flex-1 flex flex-col overflow-hidden bg-white rounded-2xl border border-border p-3.5 shadow-2xs">
          {/* FAQ Search */}
          <div className="mb-2.5 relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              placeholder="Search 30 answers (e.g. pool, breakfast, wifi, checkout)..."
              className="w-full text-xs pl-9 pr-8 py-2 rounded-xl border border-border bg-secondary-bg/30 text-primary focus:outline-none focus:border-primary"
            />
            {faqSearch && (
              <button 
                onClick={() => setFaqSearch('')} 
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex gap-1 overflow-x-auto no-scrollbar pb-2.5 mb-2 border-b border-border">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${
                  selectedCategory === cat 
                    ? 'bg-primary text-accent' 
                    : 'bg-secondary-bg text-text-muted hover:text-primary'
                }`}
              >
                {cat} ({cat === 'All' ? faqItems.length : faqItems.filter(i => i.category === cat).length})
              </button>
            ))}
          </div>

          {/* FAQ Accordion List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {faqLoading ? (
              <div className="py-12 text-center text-xs text-text-muted">
                <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                Loading {hotelName} FAQ directory...
              </div>
            ) : filteredFaq.length === 0 ? (
              <div className="py-12 text-center text-xs text-text-muted">
                <HelpCircle size={24} className="mx-auto mb-1.5 opacity-40" />
                No matching questions found. Try a different search word.
              </div>
            ) : (
              filteredFaq.map(item => {
                const isExpanded = expandedFaqId === item.id;
                return (
                  <div 
                    key={item.id}
                    className="border border-border/80 rounded-xl overflow-hidden bg-secondary-bg/20 transition-colors"
                  >
                    <button
                      onClick={() => setExpandedFaqId(isExpanded ? null : item.id)}
                      className="w-full text-left p-3 flex items-start justify-between gap-2 hover:bg-secondary-bg/40 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-secondary-bg text-text-muted border border-border">
                            {item.category}
                          </span>
                          <span className="text-[10px] font-mono text-text-muted">#{item.id}</span>
                        </div>
                        <p className="text-xs font-bold text-primary leading-snug">
                          {item.question}
                        </p>
                      </div>
                      <div className="text-text-muted shrink-0 mt-1">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-3 pb-3 pt-1 border-t border-border/50 text-xs text-primary leading-relaxed bg-white">
                        <p className="text-text-muted mb-2.5 whitespace-pre-line">{item.answer}</p>
                        <button
                          onClick={() => handleSend(item.question)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary text-accent text-[11px] font-semibold hover:bg-primary-hover transition-colors"
                        >
                          <Send size={11} /> Ask this in Chat
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}


import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Sparkles, Search, Edit3, CheckCircle2, RotateCcw, 
  Save, X, HelpCircle, Bot, ArrowRight 
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/shared/Modal';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function ManagerFAQ() {
  const { hotelName } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [editingItem, setEditingItem] = useState(null);
  const [editedAnswer, setEditedAnswer] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchFAQ = async () => {
    setLoading(true);
    try {
      const res = await api.get('/manager/faq');
      if (res && res.items) {
        setItems(res.items);
      }
    } catch (err) {
      console.error('Failed to load FAQ:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQ();
  }, []);

  const categories = ['All', ...new Set(items.map(item => item.category || 'General'))];

  const filteredItems = items.filter(item => {
    const matchesCat = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = !search || 
      item.question.toLowerCase().includes(search.toLowerCase()) || 
      item.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleEditClick = (item) => {
    setEditingItem(item);
    setEditedAnswer(item.answer);
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    setSaving(true);
    try {
      const updatedList = items.map(i => 
        i.id === editingItem.id ? { ...i, answer: editedAnswer } : i
      );
      await api.put('/manager/faq', { items: updatedList });
      setItems(updatedList);
      setEditingItem(null);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      alert('Failed to save FAQ update: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    if (!window.confirm('Reset all 30 questions to standard hotel defaults? Your custom modifications will be replaced.')) {
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/manager/faq/reset');
      if (res && res.items) {
        setItems(res.items);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3500);
      }
    } catch (err) {
      alert('Failed to reset: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-bold text-accent uppercase tracking-wider flex items-center gap-1.5">
              <Bot size={14} /> AI Concierge Knowledge Base
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary font-serif">
            Hotel Knowledge & Concierge FAQ
          </h1>
          <p className="text-text-muted text-xs sm:text-sm mt-0.5 max-w-2xl">
            Customise the 30 core answers for <strong>{hotelName}</strong>. Whenever guests ask questions in the Guest App Concierge, the AI answers directly using these property-specific policies and timings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleResetDefaults}
            variant="outline"
            size="sm"
            className="text-xs font-semibold gap-1.5 bg-white text-text-muted hover:text-primary"
          >
            <RotateCcw size={14} /> Reset Defaults
          </Button>
        </div>
      </div>

      {/* Success Notification */}
      {saveSuccess && (
        <div className="p-3.5 bg-success/10 border border-success/30 rounded-xl text-success text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 size={16} />
          Successfully saved and re-indexed into AI Concierge! Your guests will now receive these updated answers.
        </div>
      )}

      {/* Search and Category Filter */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search questions or keywords (e.g. pool, breakfast, wifi, checkout)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-primary focus:outline-none focus:border-primary shadow-2xs"
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-primary text-accent shadow-xs'
                  : 'bg-white text-text-muted hover:bg-secondary-bg hover:text-primary border border-border'
              }`}
            >
              {cat}
              <span className="ml-1.5 text-[10px] opacity-75">
                ({cat === 'All' ? items.length : items.filter(i => i.category === cat).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Questions Grid */}
      {loading ? (
        <div className="text-center py-16 text-text-muted text-xs">
          <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin mx-auto mb-3" />
          Loading hotel knowledge questions...
        </div>
      ) : filteredItems.length === 0 ? (
        <Card className="p-8 text-center bg-white">
          <HelpCircle size={32} className="mx-auto text-text-muted mb-2" />
          <p className="text-sm font-semibold text-primary">No questions found</p>
          <p className="text-xs text-text-muted mt-1">Try adjusting your search or category filter.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <Card 
              key={item.id} 
              className="p-5 bg-white flex flex-col justify-between hover:border-accent/40 transition-colors shadow-2xs"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-secondary-bg text-text-muted border border-border">
                    {item.category || 'General'}
                  </span>
                  <span className="text-[11px] font-mono text-text-muted font-semibold">
                    #{item.id}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-primary mb-2 leading-snug">
                  {item.question}
                </h3>

                <p className="text-xs text-text-muted leading-relaxed line-clamp-4 bg-secondary-bg/30 p-3 rounded-lg border border-border/50">
                  {item.answer}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                <span className="text-[11px] text-text-muted flex items-center gap-1">
                  <Sparkles size={12} className="text-accent" /> AI Ready
                </span>
                <Button
                  onClick={() => handleEditClick(item)}
                  size="sm"
                  variant="outline"
                  className="text-xs font-semibold gap-1.5 h-8 px-3 border-border hover:border-primary"
                >
                  <Edit3 size={12} /> Edit Answer
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        title={editingItem ? `Edit Answer for Q${editingItem.id}` : 'Edit Answer'}
      >
        {editingItem && (
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-bold text-accent uppercase tracking-wider block mb-1">
                {editingItem.category}
              </span>
              <h2 className="text-sm font-bold text-primary mb-2">
                {editingItem.question}
              </h2>
            </div>

            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-1.5">
                Hotel Answer (Visible to Guests via AI Concierge)
              </label>
              <textarea
                value={editedAnswer}
                onChange={(e) => setEditedAnswer(e.target.value)}
                rows={5}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-border bg-white text-primary focus:outline-none focus:border-primary resize-y leading-relaxed"
                placeholder="Enter accurate details, specific timings, locations, or policies for your property..."
              />
              <p className="text-[11px] text-text-muted mt-1.5">
                Tip: Keep timings, locations, and phone extensions clear and specific for your guests.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingItem(null)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveEdit}
                disabled={saving || !editedAnswer.trim()}
                className="bg-primary text-accent hover:bg-primary-hover gap-1.5"
              >
                <Save size={14} />
                {saving ? 'Saving & Indexing...' : 'Save & Update AI'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UtensilsCrossed, Plus, Search, Filter, MoreVertical, Edit2, Copy,
  Archive, Trash2, CheckCircle2, XCircle, Clock, Settings, FileText,
  AlertCircle, ChefHat, ToggleLeft, ToggleRight, Sparkles, RefreshCw
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const CATEGORIES = [
  'All Categories',
  'Breakfast',
  'Soups & Salads',
  'Starters',
  'Indian Mains',
  'Continental',
  'Sandwiches & Snacks',
  'Desserts',
  'Beverages',
  'Late Night'
];

export default function ManagerMenu() {
  const navigate = useNavigate();
  const { hotelName } = useAuth();

  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({ total: 0, published: 0, available: 0, unavailable: 0, draft: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedAvailability, setSelectedAvailability] = useState('All');
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  useEffect(() => {
    fetchMenu();
  }, [selectedCategory, selectedStatus, selectedAvailability]);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== 'All Categories') params.category = selectedCategory;
      if (selectedStatus !== 'All') params.status = selectedStatus;
      if (selectedAvailability !== 'All') params.availability = selectedAvailability;
      if (search.trim()) params.search = search.trim();

      const res = await api.get('/manager/menu', params);
      if (res) {
        setItems(res.items || []);
        if (res.summary) setSummary(res.summary);
      }
    } catch (err) {
      console.error('Failed to fetch menu:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (id, e) => {
    e.stopPropagation();
    try {
      await api.patch(`/manager/menu/${id}/availability`);
      showNotice('Item availability updated');
      fetchMenu();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDuplicate = async (id) => {
    try {
      await api.post(`/manager/menu/${id}/duplicate`);
      showNotice('Item duplicated to Draft mode');
      setActionMenuOpen(null);
      fetchMenu();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/manager/menu/${id}/status`, { status });
      showNotice(`Item status changed to ${status}`);
      setActionMenuOpen(null);
      fetchMenu();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this dish?')) return;
    try {
      await api.delete(`/manager/menu/${id}`);
      showNotice('Item deleted permanently');
      setActionMenuOpen(null);
      fetchMenu();
    } catch (err) {
      console.error(err);
    }
  };

  const showNotice = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-serif text-primary">In-Room Dining Menu</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
              {hotelName}
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Manage food items, prices, dish availability, and kitchen service hours.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            onClick={() => navigate('/manager/services/menu/settings')}
            className="flex items-center gap-2 text-xs"
          >
            <Settings size={14} /> Menu Settings
          </Button>

          <Button
            onClick={() => navigate('/manager/services/menu/add')}
            className="bg-primary text-accent hover:bg-primary-hover flex items-center gap-2 text-xs font-bold shadow-xs"
          >
            <Plus size={15} /> Add Menu Item
          </Button>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4.5 border-border shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Total Menu Items</span>
          <div className="text-2xl font-bold font-serif text-primary mt-1">{summary.total}</div>
          <span className="text-[11px] text-emerald-600 font-medium mt-0.5 block">{summary.published} published</span>
        </Card>

        <Card className="p-4.5 border-border shadow-xs bg-emerald-50/40">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900">Available Now</span>
          <div className="text-2xl font-bold font-serif text-emerald-900 mt-1">{summary.available}</div>
          <span className="text-[11px] text-emerald-700 font-medium mt-0.5 block">Kitchen is active</span>
        </Card>

        <Card className="p-4.5 border-border shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Unavailable Items</span>
          <div className="text-2xl font-bold font-serif text-primary mt-1">{summary.unavailable}</div>
          <span className="text-[11px] text-amber-600 font-medium mt-0.5 block">Temporarily paused</span>
        </Card>

        <Card className="p-4.5 border-border shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Draft Items</span>
          <div className="text-2xl font-bold font-serif text-primary mt-1">{summary.draft}</div>
          <span className="text-[11px] text-text-muted font-medium mt-0.5 block">Not visible to guests</span>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card className="p-4 border-border shadow-xs">
        <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
          <div className="relative w-full lg:w-96">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search food items, categories, tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchMenu()}
              className="w-full text-xs bg-secondary-bg/50 border border-border rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-primary focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs p-2.5 border border-border rounded-xl bg-white focus:outline-none focus:border-primary"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs p-2.5 border border-border rounded-xl bg-white focus:outline-none focus:border-primary"
            >
              <option value="All">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>

            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="text-xs p-2.5 border border-border rounded-xl bg-white focus:outline-none focus:border-primary"
            >
              <option value="All">All Availability</option>
              <option value="available">Available Now</option>
              <option value="unavailable">Unavailable</option>
            </select>

            <button
              onClick={fetchMenu}
              className="p-2.5 rounded-xl border border-border bg-white text-text-muted hover:text-primary hover:bg-secondary-bg transition-colors"
              title="Refresh Menu"
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </div>
      </Card>

      {/* Menu Item Management Table */}
      <Card className="border-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-secondary-bg/80 border-b border-border text-[11px] font-bold text-text-muted uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Dish</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Dietary</th>
                <th className="py-3.5 px-4">Service Hours</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Availability</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-text-muted">
                    Loading menu items...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-text-muted">
                    No menu items found. Click <strong>+ Add Menu Item</strong> to create your first dish.
                  </td>
                </tr>
              ) : (
                items.map(item => (
                  <tr key={item._id} className="hover:bg-secondary-bg/30 transition-colors">
                    {/* Dish Name & Thumbnail */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-secondary-bg shrink-0 overflow-hidden border border-border/60 flex items-center justify-center">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <ChefHat size={18} className="text-text-muted/40" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-primary">{item.name}</span>
                            {item.isPopular && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold">
                                Popular
                              </span>
                            )}
                            {item.isChefSpecial && (
                              <span className="px-1.5 py-0.2 rounded bg-primary/10 text-primary text-[9px] font-bold">
                                Chef's Pick
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-text-muted line-clamp-1 mt-0.5 max-w-xs">{item.description}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-secondary-bg border border-border text-[11px] font-medium text-text">
                        {item.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 font-serif font-bold text-primary text-sm">
                      ₹{item.price}
                    </td>

                    {/* Dietary Type */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-xs flex items-center justify-center border ${
                          item.foodType === 'vegetarian'
                            ? 'border-emerald-600 text-emerald-600'
                            : 'border-red-600 text-red-600'
                        }`}>
                          <span className={`w-1 h-1 rounded-full ${item.foodType === 'vegetarian' ? 'bg-emerald-600' : 'bg-red-600'}`}></span>
                        </span>
                        <span className="capitalize text-[11px] text-text-muted font-medium">{item.foodType}</span>
                      </div>
                    </td>

                    {/* Service Hours */}
                    <td className="py-3.5 px-4 text-[11px] text-text-muted">
                      {item.availableHours?.start || '00:00'} – {item.availableHours?.end || '23:59'}
                    </td>

                    {/* Status (Draft/Published) */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'draft'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-red-100 text-red-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>

                    {/* Availability Toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={(e) => handleToggleAvailability(item._id, e)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                          item.availability === 'available'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${item.availability === 'available' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        <span className="capitalize">{item.availability}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right relative">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => navigate(`/manager/services/menu/${item._id}/edit`)}
                          className="p-1.5 text-text-muted hover:text-primary rounded-lg hover:bg-secondary-bg transition-colors"
                          title="Edit Item"
                        >
                          <Edit2 size={15} />
                        </button>

                        <button
                          onClick={() => setActionMenuOpen(actionMenuOpen === item._id ? null : item._id)}
                          className="p-1.5 text-text-muted hover:text-primary rounded-lg hover:bg-secondary-bg transition-colors"
                        >
                          <MoreVertical size={15} />
                        </button>
                      </div>

                      {/* Dropdown Menu */}
                      {actionMenuOpen === item._id && (
                        <div className="absolute right-4 top-12 z-30 w-48 bg-white rounded-xl shadow-xl border border-border py-1 text-left animate-in fade-in zoom-in-95">
                          <button
                            onClick={() => navigate(`/manager/services/menu/${item._id}/edit`)}
                            className="w-full px-3.5 py-2 text-xs text-text hover:bg-secondary-bg flex items-center gap-2"
                          >
                            <Edit2 size={13} /> Edit Item
                          </button>
                          <button
                            onClick={() => handleToggleAvailability(item._id, { stopPropagation: ()=>{} })}
                            className="w-full px-3.5 py-2 text-xs text-text hover:bg-secondary-bg flex items-center gap-2"
                          >
                            {item.availability === 'available' ? <XCircle size={13} className="text-amber-600" /> : <CheckCircle2 size={13} className="text-emerald-600" />}
                            {item.availability === 'available' ? 'Mark Unavailable' : 'Mark Available'}
                          </button>
                          <button
                            onClick={() => handleDuplicate(item._id)}
                            className="w-full px-3.5 py-2 text-xs text-text hover:bg-secondary-bg flex items-center gap-2"
                          >
                            <Copy size={13} /> Duplicate Item
                          </button>
                          {item.status !== 'draft' && (
                            <button
                              onClick={() => handleStatusChange(item._id, 'draft')}
                              className="w-full px-3.5 py-2 text-xs text-text hover:bg-secondary-bg flex items-center gap-2"
                            >
                              <FileText size={13} /> Move to Draft
                            </button>
                          )}
                          {item.status !== 'published' && (
                            <button
                              onClick={() => handleStatusChange(item._id, 'published')}
                              className="w-full px-3.5 py-2 text-xs text-text hover:bg-secondary-bg flex items-center gap-2"
                            >
                              <CheckCircle2 size={13} /> Publish Item
                            </button>
                          )}
                          <button
                            onClick={() => handleStatusChange(item._id, 'archived')}
                            className="w-full px-3.5 py-2 text-xs text-text hover:bg-secondary-bg flex items-center gap-2"
                          >
                            <Archive size={13} /> Archive Item
                          </button>
                          <div className="border-t border-border my-1"></div>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="w-full px-3.5 py-2 text-xs text-critical hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 size={13} /> Delete Permanently
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

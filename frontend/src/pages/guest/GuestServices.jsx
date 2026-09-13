import React, { useState, useEffect } from 'react';
import { Search, Info, Plus, MapPin, ChefHat, Bed, Wrench, Luggage, Bath, Coffee, Droplets, Tv, UtensilsCrossed, Cookie, ShoppingCart, Minus, X } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const CATEGORIES = [
  { id: 'All', icon: <Plus size={16} /> },
  { id: 'Housekeeping', icon: <Bed size={16} /> },
  { id: 'Room Service', icon: <ChefHat size={16} /> },
  { id: 'Front Desk', icon: <Luggage size={16} /> },
  { id: 'Maintenance', icon: <Wrench size={16} /> }
];

export default function GuestServices() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const { cartItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await api.get('/guest/services');
      setServices(res);
    } catch (err) {
      console.error(err);
    }
  };

  const getFilteredServices = () => {
    let filtered = services;
    if (activeCategory !== 'All') {
      filtered = filtered.filter(s => s.departmentId?.name?.includes(activeCategory) || s.category?.includes(activeCategory));
    }
    if (search) {
      filtered = filtered.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase()));
    }
    return filtered.filter(s => !s.departmentId?.name?.includes('Room Service'));
  };

  return (
    <div className="max-w-md mx-auto h-[100dvh] flex flex-col bg-bg">
      <div className="sticky top-0 z-20 bg-bg/80 backdrop-blur-md border-b border-border/50 px-4 pt-12 pb-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-serif text-text tracking-tight">Services</h1>
          {cartItems.length > 0 && (
            <button onClick={() => navigate('/guest/services/room-service/cart')} className="relative p-2 bg-white rounded-full shadow-sm border border-border text-text">
              <ShoppingCart size={20} />
              <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-accent text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">{cartItems.length}</span>
            </button>
          )}
        </div>

        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search for towels, water, extra pillows..."
            className="w-full bg-white border border-border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/20 placeholder:text-text-muted/60 shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24 px-4 pt-4">
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-full text-[13px] font-medium transition-all ${activeCategory === cat.id ? 'bg-primary text-accent shadow-md shadow-primary/20' : 'bg-white text-text-muted border border-border hover:bg-secondary-bg'}`}>
              {cat.icon} {cat.id}
            </button>
          ))}
        </div>

        {(activeCategory === 'All' || activeCategory === 'Room Service') && !search && (
          <div className="mb-8">
            <h2 className="text-[11px] font-bold tracking-wider text-text-muted uppercase mb-3 px-1">Dining</h2>
            <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-0"></div>
              <div className="p-5 relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><ChefHat size={20} /></div>
                  <h3 className="text-lg font-serif text-text">In-Room Dining</h3>
                </div>
                <p className="text-sm text-text-muted mb-4 leading-relaxed">Breakfast, meals, snacks, beverages and late-night options delivered directly to your room.</p>
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 mb-5 bg-emerald-50 w-fit px-2.5 py-1 rounded-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Available now • Est. 25–35 min
                </div>
                <Button onClick={() => navigate('/guest/services/room-service')} className="w-full bg-primary text-accent hover:bg-primary-hover shadow-md shadow-primary/20">Browse Menu</Button>
              </div>
            </div>
          </div>
        )}

        <h2 className="text-[11px] font-bold tracking-wider text-text-muted uppercase mb-3 px-1">Other Requests</h2>
        <div className="grid grid-cols-2 gap-3">
          {getFilteredServices().map(service => (
            <div key={service._id} onClick={() => setSelectedService(service)} className="bg-white rounded-xl border border-border p-3 cursor-pointer hover:border-primary/30 transition-all group">
              <div className="w-8 h-8 rounded-full bg-secondary-bg flex items-center justify-center text-primary mb-2 group-hover:scale-110 transition-transform"><Plus size={16} /></div>
              <h3 className="text-sm font-medium text-text mb-0.5 line-clamp-1">{service.name}</h3>
              <p className="text-[11px] text-text-muted line-clamp-1">{service.departmentId?.name || 'Housekeeping'}</p>
            </div>
          ))}
          
          <div onClick={() => navigate('/guest/report')} className="bg-red-50/50 rounded-xl border border-red-100 p-3 cursor-pointer hover:bg-red-50 transition-all flex flex-col justify-center items-center text-center">
             <Wrench size={24} className="text-red-500 mb-2" />
             <h3 className="text-sm font-medium text-red-900">Report Issue</h3>
             <p className="text-[10px] text-red-700/80 mt-1">AC, Plumbing, Wi-Fi</p>
          </div>
        </div>
      </div>
      
      {selectedService && <ServiceRequestModal service={selectedService} onClose={() => setSelectedService(null)} />}
    </div>
  );
}

function ServiceRequestModal({ service, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post('/guest/requests/service', {
        serviceId: service._id,
        serviceName: service.name,
        quantity,
        notes
      });
      onClose();
      navigate('/guest/requests');
    } catch(err) {
      console.error(err);
      alert('Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl pb-4">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h2 className="text-lg font-serif font-medium text-text">{service.name}</h2>
          <button onClick={onClose} className="p-2 text-text-muted"><X size={20}/></button>
        </div>
        <div className="p-4 space-y-6">
          <p className="text-sm text-text-muted">{service.description || 'Request this item to your room.'}</p>
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase text-text-muted">Quantity</h4>
            <div className="flex items-center gap-4 bg-secondary-bg border border-border rounded-lg p-1">
              <button onClick={() => setQuantity(Math.max(1, quantity-1))} className="w-8 h-8 flex items-center justify-center bg-white rounded-md"><Minus size={14}/></button>
              <span className="text-sm font-bold w-4 text-center">{quantity}</span>
              <button onClick={() => setQuantity(quantity+1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-md"><Plus size={14}/></button>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase text-text-muted mb-3">Notes</h4>
            <input type="text" placeholder="Any special instructions..." value={notes} onChange={e=>setNotes(e.target.value)} className="w-full border border-border rounded-lg p-3 text-sm" />
          </div>
        </div>
        <div className="p-4 border-t border-border">
          <button onClick={handleSubmit} disabled={loading} className="w-full bg-primary text-accent font-medium py-3 rounded-xl shadow-md">
            {loading ? 'Submitting...' : 'Request Now'}
          </button>
        </div>
      </div>
    </div>
  );
}

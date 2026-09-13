import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, ShoppingCart, Plus, Minus, X, Clock, Sparkles, AlertCircle, ChefHat, Check, Flame } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../services/api';

const CATEGORIES = [
  'All',
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

export default function GuestRoomService() {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { roomNumber, hotelName } = useAuth();

  const [menuItems, setMenuItems] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchMenu();
  }, [activeCategory]);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const params = {};
      if (activeCategory !== 'All') params.category = activeCategory;
      if (search.trim()) params.search = search.trim();

      const res = await api.get('/guest/menu', params);
      if (res) {
        setMenuItems(res.items || []);
        if (res.settings) setSettings(res.settings);
      }
    } catch (err) {
      console.error('Failed to load menu:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = menuItems.filter(item => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return item.name.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q);
  });

  const totalCartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <div className="max-w-md mx-auto min-h-[100dvh] flex flex-col bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md px-4 pt-10 pb-3 border-b border-border shadow-xs">
        <div className="flex justify-between items-center mb-3">
          <button
            onClick={() => navigate('/guest/services')}
            className="p-2 -ml-2 text-text-muted hover:text-primary transition-colors flex items-center gap-1 text-xs font-medium"
          >
            <ArrowLeft size={18} />
            <span>Services</span>
          </button>
          <div className="text-center">
            <h1 className="text-base font-serif font-bold text-primary tracking-tight">In-Room Dining</h1>
            <p className="text-[11px] text-text-muted">Delivered to Room <span className="font-semibold text-primary">{roomNumber}</span></p>
          </div>
          <button
            onClick={() => navigate('/guest/services/room-service/cart')}
            className="relative p-2 text-primary hover:text-accent transition-colors"
          >
            <ShoppingCart size={22} />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-accent text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-background shadow-xs">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>

        {/* Kitchen Status Banner */}
        <div className={`rounded-xl p-2.5 flex items-center gap-2.5 mb-3 border text-xs ${
          settings?.kitchenStatus === 'closed'
            ? 'bg-amber-50 border-amber-200 text-amber-900'
            : 'bg-emerald-50/80 border-emerald-200/80 text-emerald-900'
        }`}>
          <span className={`w-2 h-2 rounded-full shrink-0 ${
            settings?.kitchenStatus === 'closed' ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'
          }`}></span>
          <div className="flex-1">
            <span className="font-bold block text-[11px]">
              {settings?.kitchenStatus === 'closed' ? 'Kitchen temporarily closed' : '● Kitchen open now'}
            </span>
            <span className="text-[10px] text-text-muted">
              Estimated delivery: {settings?.defaultDeliveryMin || 25}–{settings?.defaultDeliveryMax || 35} minutes
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-2.5">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search dishes, beverages, snacks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-border rounded-xl py-2 pl-9 pr-4 text-xs placeholder:text-text-muted/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 shadow-xs"
          />
        </div>

        {/* Categories Horizontal Scroll */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-primary text-accent shadow-xs'
                  : 'bg-white border border-border text-text-muted hover:bg-secondary-bg'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notice */}
      {settings?.guestNotice && (
        <div className="px-4 py-2 bg-secondary-bg/50 border-b border-border/50 text-[10px] text-text-muted flex items-center gap-1.5">
          <AlertCircle size={12} className="shrink-0 text-accent" />
          <span>{settings.guestNotice}</span>
        </div>
      )}

      {/* Menu Item Cards */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-28">
        {loading ? (
          <div className="text-center py-16 text-text-muted text-xs">Loading {hotelName} menu...</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 text-text-muted text-xs">No dishes found in this category.</div>
        ) : (
          filteredItems.map(item => {
            const isUnavailable = item.availability === 'unavailable' || settings?.kitchenStatus === 'closed';

            return (
              <div
                key={item._id}
                className={`bg-white p-3.5 rounded-2xl border border-border shadow-xs flex gap-3.5 transition-all ${
                  isUnavailable ? 'opacity-60 bg-gray-50/70' : 'hover:border-primary/40'
                }`}
              >
                {/* Image */}
                <div className="w-20 h-20 bg-secondary-bg rounded-xl shrink-0 overflow-hidden relative flex items-center justify-center border border-border/40">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <ChefHat size={24} className="text-text-muted/40" />
                  )}
                  {item.isPopular && (
                    <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-amber-500 text-white text-[8px] font-bold shadow-xs">
                      Popular
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-xs shrink-0 flex items-center justify-center border ${
                          item.foodType === 'vegetarian'
                            ? 'border-emerald-600 text-emerald-600'
                            : 'border-red-600 text-red-600'
                        }`}>
                          <span className={`w-1 h-1 rounded-full ${item.foodType === 'vegetarian' ? 'bg-emerald-600' : 'bg-red-600'}`}></span>
                        </span>
                        <h3 className="text-xs font-bold text-primary leading-snug">{item.name}</h3>
                      </div>
                      <span className="text-xs font-bold text-primary font-serif">₹{item.price}</span>
                    </div>

                    <p className="text-[10px] text-text-muted mt-1 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-border/40 text-[10px] text-text-muted">
                    <div className="flex items-center gap-2">
                      <span>⏱ {item.preparationMinutes || 25} min</span>
                      {item.allergens && item.allergens.length > 0 && (
                        <span className="text-text-muted/80 capitalize truncate max-w-[90px]">
                          {item.allergens[0]}
                        </span>
                      )}
                    </div>

                    {isUnavailable ? (
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-[10px] font-semibold rounded-lg">
                        Unavailable
                      </span>
                    ) : (
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="px-3 py-1 bg-primary text-accent text-[11px] font-bold rounded-lg shadow-xs hover:bg-primary-hover active:scale-95 transition-all flex items-center gap-1"
                      >
                        <Plus size={12} /> ADD
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Cart Button */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-3 left-4 right-4 max-w-md mx-auto z-20">
          <button
            onClick={() => navigate('/guest/services/room-service/cart')}
            className="w-full bg-primary text-accent py-3.5 px-5 rounded-2xl shadow-lg font-bold text-xs flex justify-between items-center hover:bg-primary-hover active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-accent text-primary text-[11px] font-extrabold flex items-center justify-center">
                {totalCartCount}
              </span>
              <span>View Order Cart</span>
            </div>
            <span className="font-serif text-sm">Proceed to Checkout →</span>
          </button>
        </div>
      )}

      {/* Dish Detail Drawer */}
      {selectedItem && (
        <DishDetailDrawer
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}

function DishDetailDrawer({ item, onClose }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [spiceLevel, setSpiceLevel] = useState(item.spiceOptions?.[1] || item.spiceOptions?.[0] || 'medium');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [addedNotice, setAddedNotice] = useState(false);

  const toggleOption = (groupName, opt) => {
    setSelectedOptions(prev => {
      const filtered = prev.filter(o => o.groupName !== groupName);
      return [...filtered, { groupName, optionName: opt.name, additionalPrice: opt.additionalPrice || 0 }];
    });
  };

  const toggleAddOn = (addOn) => {
    setSelectedAddOns(prev => {
      const exists = prev.some(a => a.name === addOn.name);
      if (exists) return prev.filter(a => a.name !== addOn.name);
      return [...prev, { name: addOn.name, additionalPrice: addOn.additionalPrice || 0 }];
    });
  };

  const extraOptionsTotal = selectedOptions.reduce((s, o) => s + o.additionalPrice, 0);
  const extraAddOnsTotal = selectedAddOns.reduce((s, a) => s + a.additionalPrice, 0);
  const unitPrice = item.price + extraOptionsTotal + extraAddOnsTotal;
  const itemTotal = unitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(
      item,
      quantity,
      {
        spiceLevel: item.spiceOptions?.length ? spiceLevel : null,
        selectedOptions,
        selectedAddOns,
        specialInstructions
      },
      item.price
    );
    setAddedNotice(true);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl animate-in slide-in-from-bottom-6">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white p-4 border-b border-border flex justify-between items-center z-10">
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-xs flex items-center justify-center border ${
              item.foodType === 'vegetarian' ? 'border-emerald-600' : 'border-red-600'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${item.foodType === 'vegetarian' ? 'bg-emerald-600' : 'bg-red-600'}`}></span>
            </span>
            <h2 className="text-sm font-bold text-primary font-serif">{item.name}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-text-muted hover:bg-secondary-bg rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 space-y-5 flex-1">
          {item.image && (
            <div className="h-44 rounded-2xl overflow-hidden border border-border">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
          )}

          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-base font-bold text-primary font-serif">₹{item.price}</span>
              <span className="text-[11px] text-text-muted">⏱ {item.preparationMinutes || 25} min prep</span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">{item.description}</p>
          </div>

          {/* Spice Preference */}
          {item.spiceOptions && item.spiceOptions.length > 0 && (
            <div>
              <div className="flex items-center gap-1 text-xs font-bold text-primary uppercase tracking-wider mb-2">
                <Flame size={13} className="text-accent" />
                <span>Spice Level</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {item.spiceOptions.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSpiceLevel(s)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold capitalize border transition-all ${
                      spiceLevel === s
                        ? 'bg-primary text-accent border-primary shadow-xs'
                        : 'bg-white border-border text-text hover:bg-secondary-bg'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Option Groups (e.g. Choose Accompaniment) */}
          {item.optionGroups && item.optionGroups.map((grp, gIdx) => (
            <div key={gIdx}>
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
                {grp.name} {grp.required && <span className="text-critical">*</span>}
              </h4>
              <div className="space-y-1.5">
                {grp.options.map((opt, oIdx) => {
                  const isSelected = selectedOptions.some(o => o.groupName === grp.name && o.optionName === opt.name);
                  return (
                    <label
                      key={oIdx}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        isSelected ? 'bg-primary/5 border-primary text-primary font-semibold' : 'bg-white border-border text-text hover:bg-secondary-bg'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name={`grp-${gIdx}`}
                          checked={isSelected}
                          onChange={() => toggleOption(grp.name, opt)}
                          className="text-primary focus:ring-primary"
                        />
                        <span>{opt.name}</span>
                      </div>
                      {opt.additionalPrice > 0 && (
                        <span className="text-text-muted font-medium">+₹{opt.additionalPrice}</span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Add-ons */}
          {item.addOns && item.addOns.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Add-ons</h4>
              <div className="space-y-1.5">
                {item.addOns.map((addOn, aIdx) => {
                  const isSelected = selectedAddOns.some(a => a.name === addOn.name);
                  return (
                    <label
                      key={aIdx}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        isSelected ? 'bg-primary/5 border-primary text-primary font-semibold' : 'bg-white border-border text-text hover:bg-secondary-bg'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleAddOn(addOn)}
                          className="rounded text-primary focus:ring-primary"
                        />
                        <span>{addOn.name}</span>
                      </div>
                      {addOn.additionalPrice > 0 && (
                        <span className="text-text-muted font-medium">+₹{addOn.additionalPrice}</span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          {item.allowSpecialInstructions !== false && (
            <div>
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-1.5">Special Instructions</h4>
              <input
                type="text"
                placeholder="Less oil, no onion, extra gravy..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-border bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Quantity</span>
            <div className="flex items-center gap-3 bg-secondary-bg border border-border rounded-xl p-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-primary shadow-xs hover:bg-gray-50 active:scale-95 transition-all"
              >
                <Minus size={14} />
              </button>
              <span className="text-xs font-bold w-5 text-center text-primary">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-primary shadow-xs hover:bg-gray-50 active:scale-95 transition-all"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 p-4 bg-white border-t border-border">
          <button
            onClick={handleAddToCart}
            className="w-full bg-primary text-accent font-bold py-3.5 rounded-2xl shadow-md hover:bg-primary-hover active:scale-[0.99] transition-all flex justify-between items-center px-5 text-xs"
          >
            <span>{addedNotice ? '✓ Added to Cart' : 'Add to Cart'}</span>
            <span className="font-serif text-sm">₹{itemTotal}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

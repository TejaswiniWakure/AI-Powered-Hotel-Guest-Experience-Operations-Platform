import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Upload, Sparkles, Check, AlertCircle, ChefHat, Flame, Clock } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { api } from '../../services/api';

const CATEGORIES = [
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

const ALLERGEN_OPTIONS = ['dairy', 'gluten', 'nuts', 'egg', 'soy', 'seafood', 'shellfish'];
const TAG_OPTIONS = [
  { id: 'popular', label: 'Popular' },
  { id: 'chef_special', label: "Chef's Special" },
  { id: 'new', label: 'New Dish' },
  { id: 'gluten_free', label: 'Gluten-Free' },
  { id: 'dairy_free', label: 'Dairy-Free' },
  { id: 'jain', label: 'Jain-Friendly' },
  { id: 'halal', label: 'Halal' },
  { id: 'spicy', label: 'Spicy' }
];

export default function ManagerMenuForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [error, setError] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Indian Mains');
  const [image, setImage] = useState('');
  const [price, setPrice] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [preparationMinutes, setPreparationMinutes] = useState(25);
  const [startTime, setStartTime] = useState('12:00');
  const [endTime, setEndTime] = useState('23:00');
  const [foodType, setFoodType] = useState('vegetarian');
  const [allergens, setAllergens] = useState([]);
  const [dietaryTags, setDietaryTags] = useState([]);
  const [allowSpice, setAllowSpice] = useState(true);
  const [spiceOptions, setSpiceOptions] = useState(['mild', 'medium', 'spicy']);
  const [allowQuantity, setAllowQuantity] = useState(true);
  const [allowSpecialInstructions, setAllowSpecialInstructions] = useState(true);
  const [addOns, setAddOns] = useState([]);
  const [optionGroups, setOptionGroups] = useState([]);
  const [status, setStatus] = useState('published');
  const [availability, setAvailability] = useState('available');
  const [isPopular, setIsPopular] = useState(false);
  const [isChefSpecial, setIsChefSpecial] = useState(false);

  useEffect(() => {
    if (isEditing) {
      api.get(`/manager/menu/${id}`)
        .then(res => {
          if (res) {
            setName(res.name || '');
            setDescription(res.description || '');
            setCategory(res.category || 'Indian Mains');
            setImage(res.image || '');
            setPrice(res.price || '');
            setDiscountedPrice(res.discountedPrice || '');
            setPreparationMinutes(res.preparationMinutes || 25);
            setStartTime(res.availableHours?.start || '12:00');
            setEndTime(res.availableHours?.end || '23:00');
            setFoodType(res.foodType || 'vegetarian');
            setAllergens(res.allergens || []);
            setDietaryTags(res.dietaryTags || []);
            setSpiceOptions(res.spiceOptions || []);
            setAllowSpice((res.spiceOptions || []).length > 0);
            setAllowQuantity(res.allowQuantity !== false);
            setAllowSpecialInstructions(res.allowSpecialInstructions !== false);
            setAddOns(res.addOns || []);
            setOptionGroups(res.optionGroups || []);
            setStatus(res.status || 'published');
            setAvailability(res.availability || 'available');
            setIsPopular(Boolean(res.isPopular));
            setIsChefSpecial(Boolean(res.isChefSpecial));
          }
        })
        .catch(err => setError(err.message || 'Failed to load item'))
        .finally(() => setFetching(false));
    }
  }, [id, isEditing]);

  const toggleAllergen = (item) => {
    setAllergens(prev => prev.includes(item) ? prev.filter(a => a !== item) : [...prev, item]);
  };

  const toggleTag = (item) => {
    setDietaryTags(prev => prev.includes(item) ? prev.filter(t => t !== item) : [...prev, item]);
  };

  const addAddOnRow = () => {
    setAddOns([...addOns, { name: '', additionalPrice: 50, available: true }]);
  };

  const updateAddOn = (index, field, value) => {
    setAddOns(addOns.map((a, i) => i === index ? { ...a, [field]: value } : a));
  };

  const removeAddOn = (index) => {
    setAddOns(addOns.filter((_, i) => i !== index));
  };

  const addOptionGroup = () => {
    setOptionGroups([
      ...optionGroups,
      {
        name: 'Choose Accompaniment',
        selectionType: 'single',
        required: false,
        options: [
          { name: 'Butter Naan', additionalPrice: 89, available: true },
          { name: 'Jeera Rice', additionalPrice: 199, available: true }
        ]
      }
    ]);
  };

  const updateOptionGroupName = (gIdx, newName) => {
    setOptionGroups(optionGroups.map((g, i) => i === gIdx ? { ...g, name: newName } : g));
  };

  const addOptionToGroup = (gIdx) => {
    setOptionGroups(optionGroups.map((g, i) => i === gIdx ? {
      ...g,
      options: [...g.options, { name: '', additionalPrice: 0, available: true }]
    } : g));
  };

  const updateOptionInGroup = (gIdx, oIdx, field, val) => {
    setOptionGroups(optionGroups.map((g, i) => {
      if (i !== gIdx) return g;
      const newOpts = g.options.map((o, j) => j === oIdx ? { ...o, [field]: val } : o);
      return { ...g, options: newOpts };
    }));
  };

  const removeOptionGroup = (gIdx) => {
    setOptionGroups(optionGroups.filter((_, i) => i !== gIdx));
  };

  const handleSubmit = async (targetStatus = status) => {
    if (!name.trim() || !description.trim() || !price) {
      setError('Please fill in Dish Name, Description, and Price.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        category,
        image,
        price: Number(price),
        discountedPrice: discountedPrice ? Number(discountedPrice) : null,
        preparationMinutes: Number(preparationMinutes) || 25,
        availableHours: { start: startTime, end: endTime },
        foodType,
        allergens,
        dietaryTags,
        spiceOptions: allowSpice ? spiceOptions : [],
        allowQuantity,
        allowSpecialInstructions,
        addOns: addOns.filter(a => a.name.trim()),
        optionGroups: optionGroups.filter(g => g.name.trim()),
        status: targetStatus,
        availability,
        isPopular,
        isChefSpecial
      };

      if (isEditing) {
        await api.put(`/manager/menu/${id}`, payload);
      } else {
        await api.post('/manager/menu', payload);
      }

      navigate('/manager/services/menu');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to save menu item');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="p-8 text-center text-text-muted text-xs">Loading item details...</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/manager/services/menu')}
          className="text-xs text-text-muted hover:text-primary flex items-center gap-1.5 font-medium transition-colors"
        >
          <ArrowLeft size={16} /> Back to Menu
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => handleSubmit('draft')}
            disabled={loading}
            className="text-xs"
          >
            Save as Draft
          </Button>
          <Button
            onClick={() => handleSubmit('published')}
            disabled={loading}
            className="bg-primary text-accent hover:bg-primary-hover text-xs font-bold shadow-xs"
          >
            {loading ? 'Saving...' : isEditing ? 'Update & Publish' : 'Publish Dish'}
          </Button>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold font-serif text-primary">
          {isEditing ? `Edit: ${name || 'Menu Item'}` : 'Add New Menu Item'}
        </h1>
        <p className="text-xs text-text-muted mt-0.5">
          Create a dish that guests can browse, customize, and order through In-Room Dining.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* 2-Column Form Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Dish & Food Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section A: Basic Information */}
          <Card className="p-5 border-border shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-primary uppercase tracking-wider">Basic Information</h2>

            <div>
              <label className="block text-xs font-semibold text-primary mb-1">Dish Name *</label>
              <Input
                type="text"
                placeholder="e.g. Paneer Butter Masala"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary mb-1">Short Description *</label>
              <textarea
                placeholder="Cottage cheese in a rich tomato-butter gravy, served hot."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-border bg-white focus:outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-primary mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-border bg-white focus:outline-none focus:border-primary"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-1">Dish Image URL</label>
                <Input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>
          </Card>

          {/* Section C: Dietary & Food Details */}
          <Card className="p-5 border-border shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-primary uppercase tracking-wider">Food & Dietary Details</h2>

            <div>
              <label className="block text-xs font-semibold text-primary mb-2">Food Type *</label>
              <div className="flex gap-4">
                {[
                  { id: 'vegetarian', label: 'Vegetarian' },
                  { id: 'non-vegetarian', label: 'Non-Vegetarian' },
                  { id: 'vegan', label: 'Vegan' }
                ].map(ft => (
                  <label key={ft.id} className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="foodType"
                      checked={foodType === ft.id}
                      onChange={() => setFoodType(ft.id)}
                      className="text-primary"
                    />
                    <span>{ft.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary mb-2">Allergens</label>
              <div className="flex flex-wrap gap-2">
                {ALLERGEN_OPTIONS.map(a => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => toggleAllergen(a)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize border transition-all ${
                      allergens.includes(a) ? 'bg-primary text-accent border-primary' : 'bg-white border-border text-text'
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary mb-2">Dietary & Menu Tags</label>
              <div className="flex flex-wrap gap-2">
                {TAG_OPTIONS.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => toggleTag(t.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      dietaryTags.includes(t.id) ? 'bg-accent/20 text-primary border-accent font-bold' : 'bg-white border-border text-text'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Spice Options */}
            <div className="pt-2 border-t border-border">
              <label className="flex items-center gap-2 text-xs font-semibold text-primary cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={allowSpice}
                  onChange={(e) => setAllowSpice(e.target.checked)}
                  className="rounded text-primary"
                />
                <span>Allow Guests to Choose Spice Level</span>
              </label>

              {allowSpice && (
                <div className="flex gap-2 pl-5">
                  {['mild', 'medium', 'spicy'].map(s => (
                    <span key={s} className="px-2.5 py-1 bg-secondary-bg rounded-lg text-xs capitalize text-text font-medium border border-border">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Section D: Guest Customisations (Add-ons & Accompaniment Options) */}
          <Card className="p-5 border-border shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-primary uppercase tracking-wider">Add-ons & Accompaniments</h2>
              <button
                type="button"
                onClick={addAddOnRow}
                className="text-xs text-accent hover:underline font-bold flex items-center gap-1"
              >
                <Plus size={13} /> Add Add-on
              </button>
            </div>

            {/* Add-ons List */}
            {addOns.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-text-muted uppercase">Extra Add-ons</span>
                {addOns.map((addOn, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-secondary-bg/50 p-2.5 rounded-xl border border-border">
                    <input
                      type="text"
                      placeholder="Add-on Name (e.g. Extra Paneer)"
                      value={addOn.name}
                      onChange={(e) => updateAddOn(idx, 'name', e.target.value)}
                      className="flex-1 text-xs p-1.5 bg-white border border-border rounded-lg"
                    />
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-text-muted">₹</span>
                      <input
                        type="number"
                        placeholder="Price"
                        value={addOn.additionalPrice}
                        onChange={(e) => updateAddOn(idx, 'additionalPrice', Number(e.target.value))}
                        className="w-20 text-xs p-1.5 bg-white border border-border rounded-lg"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAddOn(idx)}
                      className="p-1.5 text-critical hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Accompaniment Choice Groups */}
            <div className="pt-3 border-t border-border">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-text-muted uppercase">Option Groups (e.g. Accompaniment)</span>
                <button
                  type="button"
                  onClick={addOptionGroup}
                  className="text-xs text-primary hover:underline font-bold flex items-center gap-1"
                >
                  <Plus size={13} /> Add Choice Group
                </button>
              </div>

              {optionGroups.map((grp, gIdx) => (
                <div key={gIdx} className="bg-secondary-bg/40 p-3.5 rounded-xl border border-border space-y-3 mb-3">
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      value={grp.name}
                      onChange={(e) => updateOptionGroupName(gIdx, e.target.value)}
                      className="text-xs font-bold text-primary bg-white border border-border rounded-lg px-2.5 py-1.5"
                    />
                    <button
                      type="button"
                      onClick={() => removeOptionGroup(gIdx)}
                      className="text-critical text-xs hover:underline flex items-center gap-1"
                    >
                      <Trash2 size={12} /> Remove Group
                    </button>
                  </div>

                  <div className="space-y-1.5 pl-2 border-l-2 border-primary/30">
                    {grp.options.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Choice (e.g. Butter Naan)"
                          value={opt.name}
                          onChange={(e) => updateOptionInGroup(gIdx, oIdx, 'name', e.target.value)}
                          className="flex-1 text-xs p-1.5 bg-white border border-border rounded-lg"
                        />
                        <span className="text-xs text-text-muted">+₹</span>
                        <input
                          type="number"
                          placeholder="Extra Price"
                          value={opt.additionalPrice}
                          onChange={(e) => updateOptionInGroup(gIdx, oIdx, 'additionalPrice', Number(e.target.value))}
                          className="w-16 text-xs p-1.5 bg-white border border-border rounded-lg"
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addOptionToGroup(gIdx)}
                      className="text-[11px] text-accent font-bold hover:underline mt-1"
                    >
                      + Add Option
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Pricing, Service Hours & Publishing */}
        <div className="space-y-6">
          {/* Section B: Pricing & Timing */}
          <Card className="p-5 border-border shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-primary uppercase tracking-wider">Pricing & Timing</h2>

            <div>
              <label className="block text-xs font-semibold text-primary mb-1">Base Price (₹) *</label>
              <Input
                type="number"
                placeholder="459"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary mb-1">Preparation Time (Minutes)</label>
              <Input
                type="number"
                value={preparationMinutes}
                onChange={(e) => setPreparationMinutes(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-primary mb-1">Available From</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-border bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-primary mb-1">Available Until</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-border bg-white"
                />
              </div>
            </div>
          </Card>

          {/* Section E: Publishing & Availability */}
          <Card className="p-5 border-border shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-primary uppercase tracking-wider">Visibility & Publishing</h2>

            <div>
              <label className="block text-xs font-semibold text-primary mb-2">Menu Status *</label>
              <div className="space-y-2">
                <label className={`p-3 border rounded-xl flex items-start gap-2.5 text-xs cursor-pointer transition-all ${
                  status === 'published' ? 'bg-primary/5 border-primary text-primary font-semibold' : 'bg-white border-border text-text'
                }`}>
                  <input
                    type="radio"
                    name="status"
                    checked={status === 'published'}
                    onChange={() => setStatus('published')}
                    className="text-primary mt-0.5"
                  />
                  <div>
                    <span className="font-bold block">Published</span>
                    <span className="text-[10px] text-text-muted font-normal">Visible to guests staying in your hotel.</span>
                  </div>
                </label>

                <label className={`p-3 border rounded-xl flex items-start gap-2.5 text-xs cursor-pointer transition-all ${
                  status === 'draft' ? 'bg-primary/5 border-primary text-primary font-semibold' : 'bg-white border-border text-text'
                }`}>
                  <input
                    type="radio"
                    name="status"
                    checked={status === 'draft'}
                    onChange={() => setStatus('draft')}
                    className="text-primary mt-0.5"
                  />
                  <div>
                    <span className="font-bold block">Draft</span>
                    <span className="text-[10px] text-text-muted font-normal">Hidden from guests until ready.</span>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary mb-2">Current Availability *</label>
              <div className="space-y-2">
                <label className={`p-3 border rounded-xl flex items-center gap-2.5 text-xs cursor-pointer ${
                  availability === 'available' ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 font-bold' : 'border-border bg-white text-text'
                }`}>
                  <input
                    type="radio"
                    name="availability"
                    checked={availability === 'available'}
                    onChange={() => setAvailability('available')}
                    className="text-emerald-600"
                  />
                  <span>Available Now</span>
                </label>

                <label className={`p-3 border rounded-xl flex items-center gap-2.5 text-xs cursor-pointer ${
                  availability === 'unavailable' ? 'border-amber-500 bg-amber-50/50 text-amber-900 font-bold' : 'border-border bg-white text-text'
                }`}>
                  <input
                    type="radio"
                    name="availability"
                    checked={availability === 'unavailable'}
                    onChange={() => setAvailability('unavailable')}
                    className="text-amber-600"
                  />
                  <span>Temporarily Unavailable</span>
                </label>
              </div>
            </div>

            <div className="pt-2 border-t border-border space-y-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-primary cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPopular}
                  onChange={(e) => setIsPopular(e.target.checked)}
                  className="rounded text-primary"
                />
                <span>Highlight as "Popular"</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-primary cursor-pointer">
                <input
                  type="checkbox"
                  checked={isChefSpecial}
                  onChange={(e) => setIsChefSpecial(e.target.checked)}
                  className="rounded text-primary"
                />
                <span>Highlight as "Chef's Pick"</span>
              </label>
            </div>

            <div className="pt-4 border-t border-border space-y-2">
              <Button
                onClick={() => handleSubmit('published')}
                disabled={loading}
                className="w-full bg-primary text-accent hover:bg-primary-hover font-bold text-xs py-3"
              >
                {loading ? 'Saving...' : isEditing ? 'Update Dish' : 'Publish Dish'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

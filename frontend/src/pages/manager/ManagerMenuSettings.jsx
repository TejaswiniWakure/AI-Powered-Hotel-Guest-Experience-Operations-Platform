import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, Clock, Percent, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export default function ManagerMenuSettings() {
  const navigate = useNavigate();
  const { hotelName } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const [menuTitle, setMenuTitle] = useState('In-Room Dining');
  const [menuDescription, setMenuDescription] = useState('Freshly prepared meals delivered directly to your room.');
  const [currency, setCurrency] = useState('INR');
  const [defaultDeliveryMin, setDefaultDeliveryMin] = useState(25);
  const [defaultDeliveryMax, setDefaultDeliveryMax] = useState(35);
  const [breakfastStart, setBreakfastStart] = useState('06:30');
  const [breakfastEnd, setBreakfastEnd] = useState('11:00');
  const [allDayStart, setAllDayStart] = useState('11:00');
  const [allDayEnd, setAllDayEnd] = useState('23:00');
  const [lateNightStart, setLateNightStart] = useState('23:00');
  const [lateNightEnd, setLateNightEnd] = useState('06:30');
  const [kitchenStatus, setKitchenStatus] = useState('open');
  const [taxPercent, setTaxPercent] = useState(5);
  const [serviceChargePercent, setServiceChargePercent] = useState(10);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [minimumOrderValue, setMinimumOrderValue] = useState(0);
  const [guestNotice, setGuestNotice] = useState('Please inform us of any food allergies or dietary requirements before ordering.');

  useEffect(() => {
    api.get('/manager/menu/settings')
      .then(res => {
        if (res) {
          setMenuTitle(res.menuTitle || `${hotelName} In-Room Dining`);
          setMenuDescription(res.menuDescription || 'Freshly prepared meals delivered directly to your room.');
          setCurrency(res.currency || 'INR');
          setDefaultDeliveryMin(res.defaultDeliveryMin || 25);
          setDefaultDeliveryMax(res.defaultDeliveryMax || 35);
          setBreakfastStart(res.kitchenHours?.breakfast?.start || '06:30');
          setBreakfastEnd(res.kitchenHours?.breakfast?.end || '11:00');
          setAllDayStart(res.kitchenHours?.allDayDining?.start || '11:00');
          setAllDayEnd(res.kitchenHours?.allDayDining?.end || '23:00');
          setLateNightStart(res.kitchenHours?.lateNight?.start || '23:00');
          setLateNightEnd(res.kitchenHours?.lateNight?.end || '06:30');
          setKitchenStatus(res.kitchenStatus || 'open');
          setTaxPercent(res.taxPercent ?? 5);
          setServiceChargePercent(res.serviceChargePercent ?? 10);
          setDeliveryFee(res.deliveryFee || 0);
          setMinimumOrderValue(res.minimumOrderValue || 0);
          setGuestNotice(res.guestNotice || '');
        }
      })
      .catch(err => setError(err.message || 'Failed to load settings'))
      .finally(() => setLoading(false));
  }, [hotelName]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const payload = {
        menuTitle,
        menuDescription,
        currency,
        defaultDeliveryMin: Number(defaultDeliveryMin),
        defaultDeliveryMax: Number(defaultDeliveryMax),
        kitchenHours: {
          breakfast: { start: breakfastStart, end: breakfastEnd },
          allDayDining: { start: allDayStart, end: allDayEnd },
          lateNight: { start: lateNightStart, end: lateNightEnd }
        },
        kitchenStatus,
        taxPercent: Number(taxPercent),
        serviceChargePercent: Number(serviceChargePercent),
        deliveryFee: Number(deliveryFee),
        minimumOrderValue: Number(minimumOrderValue),
        guestNotice
      };

      await api.put('/manager/menu/settings', payload);
      setNotice('In-room dining settings saved successfully.');
      setTimeout(() => setNotice(''), 3000);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-text-muted text-xs">Loading kitchen settings...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/manager/services/menu')}
          className="text-xs text-text-muted hover:text-primary flex items-center gap-1.5 font-medium transition-colors"
        >
          <ArrowLeft size={16} /> Back to Menu
        </button>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-accent hover:bg-primary-hover text-xs font-bold shadow-xs"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold font-serif text-primary">In-Room Dining Settings</h1>
        <p className="text-xs text-text-muted mt-0.5">
          Configure kitchen operations, delivery rules, and tax rates for {hotelName}.
        </p>
      </div>

      {notice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{notice}</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Settings */}
        <Card className="p-5 border-border shadow-xs space-y-4">
          <h2 className="text-xs font-bold text-primary uppercase tracking-wider">General Settings</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-primary mb-1">Menu Title</label>
              <Input
                type="text"
                value={menuTitle}
                onChange={(e) => setMenuTitle(e.target.value)}
                className="text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary mb-1">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-border bg-white"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-primary mb-1">Min Delivery Time (Mins)</label>
              <Input
                type="number"
                value={defaultDeliveryMin}
                onChange={(e) => setDefaultDeliveryMin(e.target.value)}
                className="text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-primary mb-1">Max Delivery Time (Mins)</label>
              <Input
                type="number"
                value={defaultDeliveryMax}
                onChange={(e) => setDefaultDeliveryMax(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>
        </Card>

        {/* Kitchen Status & Hours */}
        <Card className="p-5 border-border shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-primary uppercase tracking-wider">Kitchen Status & Hours</h2>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs font-bold text-primary cursor-pointer">
                <input
                  type="radio"
                  name="kitchenStatus"
                  checked={kitchenStatus === 'open'}
                  onChange={() => setKitchenStatus('open')}
                  className="text-emerald-600"
                />
                <span className="text-emerald-700">● Kitchen Open</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-primary cursor-pointer">
                <input
                  type="radio"
                  name="kitchenStatus"
                  checked={kitchenStatus === 'closed'}
                  onChange={() => setKitchenStatus('closed')}
                  className="text-amber-600"
                />
                <span className="text-amber-700">○ Closed Temporarily</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-3 bg-secondary-bg/50 rounded-xl border border-border">
              <span className="text-xs font-bold text-primary block mb-2">Breakfast Hours</span>
              <div className="space-y-1.5 text-xs">
                <input type="time" value={breakfastStart} onChange={e=>setBreakfastStart(e.target.value)} className="w-full p-1.5 bg-white border border-border rounded-lg text-xs" />
                <span className="text-[10px] text-text-muted text-center block">to</span>
                <input type="time" value={breakfastEnd} onChange={e=>setBreakfastEnd(e.target.value)} className="w-full p-1.5 bg-white border border-border rounded-lg text-xs" />
              </div>
            </div>

            <div className="p-3 bg-secondary-bg/50 rounded-xl border border-border">
              <span className="text-xs font-bold text-primary block mb-2">All-Day Dining</span>
              <div className="space-y-1.5 text-xs">
                <input type="time" value={allDayStart} onChange={e=>setAllDayStart(e.target.value)} className="w-full p-1.5 bg-white border border-border rounded-lg text-xs" />
                <span className="text-[10px] text-text-muted text-center block">to</span>
                <input type="time" value={allDayEnd} onChange={e=>setAllDayEnd(e.target.value)} className="w-full p-1.5 bg-white border border-border rounded-lg text-xs" />
              </div>
            </div>

            <div className="p-3 bg-secondary-bg/50 rounded-xl border border-border">
              <span className="text-xs font-bold text-primary block mb-2">Late Night</span>
              <div className="space-y-1.5 text-xs">
                <input type="time" value={lateNightStart} onChange={e=>setLateNightStart(e.target.value)} className="w-full p-1.5 bg-white border border-border rounded-lg text-xs" />
                <span className="text-[10px] text-text-muted text-center block">to</span>
                <input type="time" value={lateNightEnd} onChange={e=>setLateNightEnd(e.target.value)} className="w-full p-1.5 bg-white border border-border rounded-lg text-xs" />
              </div>
            </div>
          </div>
        </Card>

        {/* Taxes & Charges */}
        <Card className="p-5 border-border shadow-xs space-y-4">
          <h2 className="text-xs font-bold text-primary uppercase tracking-wider">Taxes & Service Charges</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-primary mb-1">GST / Tax Rate (%)</label>
              <Input
                type="number"
                value={taxPercent}
                onChange={(e) => setTaxPercent(e.target.value)}
                className="text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary mb-1">Hotel Service Charge (%)</label>
              <Input
                type="number"
                value={serviceChargePercent}
                onChange={(e) => setServiceChargePercent(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>
        </Card>

        {/* Guest Notice */}
        <Card className="p-5 border-border shadow-xs space-y-4">
          <h2 className="text-xs font-bold text-primary uppercase tracking-wider">Guest Notice Banner</h2>
          <textarea
            value={guestNotice}
            onChange={(e) => setGuestNotice(e.target.value)}
            rows={2}
            className="w-full text-xs p-3 rounded-xl border border-border bg-white focus:outline-none focus:border-primary"
            placeholder="Please inform us of any food allergies or dietary requirements before ordering."
          />
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={saving}
            className="bg-primary text-accent hover:bg-primary-hover font-bold text-xs px-8 py-3"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, Trash2, CheckCircle2, Clock, MapPin, ChefHat, Sparkles } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../services/api';

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const { roomNumber, hotelName } = useAuth();

  const [scheduleType, setScheduleType] = useState('asap');
  const [scheduledTime, setScheduledTime] = useState('');
  const [deliveryPreference, setDeliveryPreference] = useState('knock');
  const [orderNotes, setOrderNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [error, setError] = useState('');

  // Calculate pricing
  const subtotal = cartItems.reduce((sum, item) => {
    const extraOpts = (item.customizations?.selectedOptions || []).reduce((s, o) => s + (o.additionalPrice || 0), 0);
    const extraAddOns = (item.customizations?.selectedAddOns || []).reduce((s, a) => s + (a.additionalPrice || 0), 0);
    const unitP = (item.unitPrice || item.basePrice || 0) + extraOpts + extraAddOns;
    return sum + (unitP * (item.quantity || 1));
  }, 0);

  const tax = Math.round(subtotal * 0.05);
  const serviceCharge = Math.round(subtotal * 0.10);
  const total = subtotal + tax + serviceCharge;

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;
    setError('');
    setLoading(true);

    try {
      const payload = {
        items: cartItems.map(item => ({
          menuItemId: item.menuItemId || item._id,
          name: item.name,
          quantity: item.quantity,
          basePrice: item.unitPrice || item.basePrice || 0,
          selectedOptions: item.customizations?.selectedOptions || [],
          selectedAddOns: item.customizations?.selectedAddOns || [],
          spiceLevel: item.customizations?.spiceLevel || null,
          specialInstructions: item.customizations?.specialInstructions || ''
        })),
        scheduleType,
        scheduledAt: scheduleType === 'scheduled' && scheduledTime ? new Date(scheduledTime) : null,
        deliveryPreference,
        orderNotes
      };

      const res = await api.post('/guest/requests/food', payload);
      clearCart();
      setPlacedOrder(res);
    } catch (err) {
      console.error('Order placement failed:', err);
      setError(err.message || 'Failed to place in-room dining order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If order was just placed, display the confirmation screen!
  if (placedOrder) {
    return (
      <div className="max-w-md mx-auto min-h-[100dvh] bg-background flex flex-col justify-center items-center p-6 text-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-5 shadow-sm">
          <CheckCircle2 size={36} />
        </div>

        <h1 className="text-2xl font-serif font-bold text-primary mb-1">Order Placed Successfully</h1>
        <p className="text-xs text-text-muted mb-6">
          Order <strong className="text-primary">{placedOrder.orderNo}</strong> · {hotelName}
        </p>

        <div className="bg-white rounded-2xl border border-border p-5 w-full text-left space-y-3.5 mb-6 shadow-xs">
          <div className="flex justify-between items-center pb-3 border-b border-border text-xs">
            <span className="text-text-muted">Delivering to</span>
            <span className="font-bold text-primary">Room {roomNumber}</span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-border text-xs">
            <span className="text-text-muted">Estimated Delivery</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <Clock size={13} /> 25–35 minutes
            </span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-border text-xs">
            <span className="text-text-muted">Payment Method</span>
            <span className="font-bold text-primary">Charge to Room</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-text-muted">Total Charged</span>
            <span className="font-serif font-bold text-primary text-sm">₹{placedOrder.total || total}</span>
          </div>
        </div>

        <div className="w-full space-y-2.5">
          <button
            onClick={() => navigate('/guest/requests')}
            className="w-full bg-primary text-accent py-3.5 rounded-2xl shadow-md font-bold text-xs hover:bg-primary-hover transition-all"
          >
            Track Order Status
          </button>
          <button
            onClick={() => navigate('/guest/services')}
            className="w-full bg-secondary-bg text-primary py-3 rounded-2xl font-semibold text-xs hover:bg-secondary-bg/80 transition-all border border-border"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-[100dvh] flex flex-col bg-background">
      {/* Header */}
      <div className="bg-background/95 backdrop-blur-md px-4 pt-10 pb-3 border-b border-border sticky top-0 z-10 flex items-center gap-3">
        <button
          onClick={() => navigate('/guest/services/room-service')}
          className="p-2 -ml-2 text-text-muted hover:text-primary transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-base font-serif font-bold text-primary">Your Order Cart</h1>
          <p className="text-[11px] text-text-muted">Delivering to Room <strong className="text-primary">{roomNumber}</strong></p>
        </div>
      </div>

      {/* Cart Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-28">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-secondary-bg text-text-muted rounded-full flex items-center justify-center mx-auto mb-3">
              <ChefHat size={28} />
            </div>
            <h3 className="text-sm font-bold text-primary font-serif">Your cart is empty</h3>
            <p className="text-xs text-text-muted mt-1 mb-5">Explore our in-room dining menu and add your favorite dishes.</p>
            <button
              onClick={() => navigate('/guest/services/room-service')}
              className="px-5 py-2.5 bg-primary text-accent rounded-xl text-xs font-bold shadow-xs hover:bg-primary-hover"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <>
            {/* Selected Items */}
            <div className="bg-white rounded-2xl border border-border p-4 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider">Ordered Items ({cartItems.length})</h3>

              {cartItems.map((item, i) => {
                const extraOpts = (item.customizations?.selectedOptions || []).reduce((s, o) => s + (o.additionalPrice || 0), 0);
                const extraAddOns = (item.customizations?.selectedAddOns || []).reduce((s, a) => s + (a.additionalPrice || 0), 0);
                const itemUnitPrice = (item.unitPrice || item.basePrice || 0) + extraOpts + extraAddOns;

                return (
                  <div key={i} className="flex justify-between items-start border-b border-border/60 pb-3.5 last:border-0 last:pb-0">
                    <div className="flex-1 pr-3">
                      <h4 className="text-xs font-bold text-primary">{item.name}</h4>

                      {item.customizations?.spiceLevel && (
                        <p className="text-[10px] text-text-muted mt-0.5 capitalize">
                          Spice: <strong className="text-primary">{item.customizations.spiceLevel}</strong>
                        </p>
                      )}

                      {item.customizations?.selectedOptions && item.customizations.selectedOptions.map((opt, oIdx) => (
                        <p key={oIdx} className="text-[10px] text-text-muted mt-0.5">
                          {opt.groupName}: <strong className="text-primary">{opt.optionName}</strong> {opt.additionalPrice > 0 && `(+₹${opt.additionalPrice})`}
                        </p>
                      ))}

                      {item.customizations?.selectedAddOns && item.customizations.selectedAddOns.map((addOn, aIdx) => (
                        <p key={aIdx} className="text-[10px] text-text-muted mt-0.5">
                          Add-on: <strong className="text-primary">{addOn.name}</strong> (+₹{addOn.additionalPrice})
                        </p>
                      ))}

                      {item.customizations?.specialInstructions && (
                        <p className="text-[10px] text-accent mt-1 italic">
                          Note: "{item.customizations.specialInstructions}"
                        </p>
                      )}

                      <div className="flex items-center gap-3 mt-2.5">
                        <div className="flex items-center gap-2 bg-secondary-bg border border-border rounded-lg p-0.5">
                          <button
                            onClick={() => updateQuantity(i, -1)}
                            className="w-6 h-6 flex items-center justify-center bg-white rounded text-primary shadow-2xs hover:bg-gray-50"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="text-xs font-bold w-4 text-center text-primary">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(i, 1)}
                            className="w-6 h-6 flex items-center justify-center bg-white rounded text-primary shadow-2xs hover:bg-gray-50"
                          >
                            <Plus size={11} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(i)}
                          className="text-[10px] text-critical hover:underline font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-primary font-serif">
                        ₹{itemUnitPrice * item.quantity}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bill Summary */}
            <div className="bg-white p-4 rounded-2xl border border-border shadow-xs text-xs space-y-2.5">
              <div className="flex justify-between text-text-muted">
                <span>Subtotal</span>
                <span className="font-semibold text-primary font-serif">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>GST / Taxes (5%)</span>
                <span className="font-semibold text-primary font-serif">₹{tax}</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>Hotel Service Charge (10%)</span>
                <span className="font-semibold text-primary font-serif">₹{serviceCharge}</span>
              </div>
              <div className="flex justify-between font-bold text-primary pt-2.5 border-t border-border text-sm">
                <span>Total Amount</span>
                <span className="font-serif">₹{total}</span>
              </div>
            </div>

            {/* Delivery Time Preference */}
            <div>
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2.5">When would you like delivery?</h4>
              <div className="grid grid-cols-2 gap-2">
                <label className={`p-3 border rounded-xl flex items-center gap-2 text-xs cursor-pointer transition-all ${
                  scheduleType === 'asap' ? 'bg-primary/5 border-primary text-primary font-bold' : 'bg-white border-border text-text'
                }`}>
                  <input
                    type="radio"
                    checked={scheduleType === 'asap'}
                    onChange={() => setScheduleType('asap')}
                    className="text-primary"
                  />
                  <span>As soon as possible (25–35m)</span>
                </label>

                <label className={`p-3 border rounded-xl flex items-center gap-2 text-xs cursor-pointer transition-all ${
                  scheduleType === 'scheduled' ? 'bg-primary/5 border-primary text-primary font-bold' : 'bg-white border-border text-text'
                }`}>
                  <input
                    type="radio"
                    checked={scheduleType === 'scheduled'}
                    onChange={() => setScheduleType('scheduled')}
                    className="text-primary"
                  />
                  <span>Schedule for later</span>
                </label>
              </div>

              {scheduleType === 'scheduled' && (
                <div className="mt-2">
                  <input
                    type="datetime-local"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-border bg-white"
                  />
                </div>
              )}
            </div>

            {/* Delivery Preference */}
            <div>
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2.5">Room Delivery Preference</h4>
              <div className="space-y-2">
                {[
                  { id: 'knock', label: 'Please knock before entering' },
                  { id: 'leave', label: 'Leave outside the room door' },
                  { id: 'call', label: 'Call phone before delivery' }
                ].map(p => (
                  <label
                    key={p.id}
                    className={`flex items-center gap-2.5 p-3 border rounded-xl text-xs cursor-pointer bg-white transition-all ${
                      deliveryPreference === p.id ? 'border-primary bg-primary/5 font-semibold text-primary' : 'border-border text-text'
                    }`}
                  >
                    <input
                      type="radio"
                      checked={deliveryPreference === p.id}
                      onChange={() => setDeliveryPreference(p.id)}
                      className="text-primary"
                    />
                    <span>{p.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Order Notes */}
            <div>
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Order Notes</h4>
              <textarea
                placeholder="Example: Please provide extra cutlery and napkins."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                rows={2}
                className="w-full text-xs p-3 rounded-xl border border-border bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>

            {/* Payment Method */}
            <div>
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Payment Method</h4>
              <div className="p-3.5 border border-primary bg-primary/5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                  <div>
                    <span className="text-xs font-bold text-primary block">Charge to Room Bill</span>
                    <span className="text-[10px] text-text-muted">Settled upon checkout from Room {roomNumber}</span>
                  </div>
                </div>
                <span className="text-xs font-serif font-bold text-primary">₹{total}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Place Order Bar */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-border z-20 max-w-md mx-auto shadow-lg">
          <div className="flex gap-2.5">
            <button
              onClick={() => navigate('/guest/services/room-service')}
              className="px-4 py-3 border border-border rounded-xl text-xs font-bold text-text-muted hover:bg-secondary-bg transition-colors"
            >
              Add More
            </button>
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="flex-1 bg-primary text-accent font-bold py-3 px-5 rounded-xl shadow-md hover:bg-primary-hover active:scale-[0.99] transition-all flex justify-between items-center text-xs"
            >
              <span>{loading ? 'Submitting Order...' : 'Place Order'}</span>
              <span className="font-serif text-sm">₹{total}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

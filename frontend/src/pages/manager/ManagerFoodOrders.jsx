import React, { useState, useEffect } from 'react';
import { ChefHat, Clock, CheckCircle2, XCircle, AlertCircle, Phone, ArrowRight, User, RefreshCw, Send } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const STATUS_TABS = ['All', 'placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];

export default function ManagerFoodOrders() {
  const { hotelName } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [rejectingOrderId, setRejectingOrderId] = useState(null);
  const [rejectReason, setRejectReason] = useState('Item unavailable');

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedStatus !== 'All') params.status = selectedStatus;
      const res = await api.get('/manager/food-orders', params);
      if (res) setOrders(res);
    } catch (err) {
      console.error('Failed to load food orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus, reason = '') => {
    try {
      await api.patch(`/manager/food-orders/${orderId}/status`, { status: newStatus, rejectionReason: reason });
      setRejectingOrderId(null);
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert('Failed to update order status');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-serif text-primary">In-Room Dining Orders</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
              {hotelName}
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Real-time kitchen order dispatch and room service delivery lifecycle.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="p-2.5 rounded-xl border border-border bg-white text-text-muted hover:text-primary hover:bg-secondary-bg transition-colors self-start sm:self-auto flex items-center gap-1.5 text-xs font-semibold"
        >
          <RefreshCw size={14} /> Refresh Queue
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {STATUS_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setSelectedStatus(tab)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
              selectedStatus === tab
                ? 'bg-primary text-accent shadow-xs'
                : 'bg-white border border-border text-text-muted hover:bg-secondary-bg'
            }`}
          >
            {tab.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-20 text-text-muted text-xs">
            Loading room service orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <div className="w-14 h-14 bg-secondary-bg text-text-muted rounded-full flex items-center justify-center mx-auto mb-3">
              <ChefHat size={24} />
            </div>
            <h3 className="text-sm font-bold text-primary font-serif">No orders in this status</h3>
            <p className="text-xs text-text-muted mt-0.5">New guest orders will appear here automatically.</p>
          </div>
        ) : (
          orders.map(order => (
            <Card key={order._id} className="p-4 border-border shadow-xs flex flex-col justify-between space-y-4">
              {/* Card Header */}
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                      {order.orderNo}
                    </span>
                    <h3 className="text-base font-bold text-primary font-serif mt-0.5">
                      Room {order.roomNumber}
                    </h3>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    order.status === 'placed'
                      ? 'bg-amber-100 text-amber-800 animate-pulse'
                      : order.status === 'confirmed'
                        ? 'bg-blue-100 text-blue-800'
                        : order.status === 'preparing'
                          ? 'bg-purple-100 text-purple-800'
                          : order.status === 'out_for_delivery'
                            ? 'bg-indigo-100 text-indigo-800'
                            : order.status === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                  }`}>
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-text-muted mt-1">
                  <span>Guest: <strong className="text-primary">{order.guestName || 'Guest'}</strong></span>
                  <span>•</span>
                  <span>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="bg-secondary-bg/50 p-3 rounded-xl border border-border/60 text-xs space-y-2">
                <span className="text-[10px] font-bold text-text-muted uppercase block">Ordered Items</span>
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-baseline text-[11px]">
                    <span className="font-semibold text-primary">
                      {item.quantity}× {item.name}
                      {item.spiceLevel && <span className="text-text-muted text-[10px] ml-1 capitalize font-normal">({item.spiceLevel})</span>}
                    </span>
                    <span className="font-serif font-bold text-primary">₹{item.itemTotal || (item.basePrice * item.quantity)}</span>
                  </div>
                ))}

                {order.orderNotes && (
                  <div className="pt-2 border-t border-border/60 text-[10px] text-accent italic">
                    Note: "{order.orderNotes}"
                  </div>
                )}
              </div>

              {/* Bill & Preference */}
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="text-[10px] text-text-muted block">Delivery Preference</span>
                  <span className="font-semibold text-primary capitalize text-[11px]">
                    {order.deliveryPreference === 'knock' ? 'Knock before entering' : order.deliveryPreference === 'leave' ? 'Leave outside' : 'Call before delivery'}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-text-muted block">Charge to Room</span>
                  <span className="text-sm font-bold font-serif text-primary">₹{order.total}</span>
                </div>
              </div>

              {/* Action Buttons based on Status */}
              <div className="pt-2 border-t border-border flex gap-2">
                {order.status === 'placed' && (
                  <>
                    <button
                      onClick={() => setRejectingOrderId(order._id)}
                      className="px-3 py-2 border border-critical text-critical rounded-xl text-xs font-semibold hover:bg-red-50 transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(order._id, 'confirmed')}
                      className="flex-1 bg-primary text-accent py-2 rounded-xl text-xs font-bold hover:bg-primary-hover shadow-xs transition-all"
                    >
                      Confirm Order
                    </button>
                  </>
                )}

                {order.status === 'confirmed' && (
                  <button
                    onClick={() => handleUpdateStatus(order._id, 'preparing')}
                    className="w-full bg-purple-700 text-white py-2 rounded-xl text-xs font-bold hover:bg-purple-800 shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <ChefHat size={14} /> Start Preparing
                  </button>
                )}

                {order.status === 'preparing' && (
                  <button
                    onClick={() => handleUpdateStatus(order._id, 'out_for_delivery')}
                    className="w-full bg-indigo-700 text-white py-2 rounded-xl text-xs font-bold hover:bg-indigo-800 shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <Send size={14} /> Out for Delivery
                  </button>
                )}

                {order.status === 'out_for_delivery' && (
                  <button
                    onClick={() => handleUpdateStatus(order._id, 'delivered')}
                    className="w-full bg-emerald-600 text-white py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 size={14} /> Mark Delivered
                  </button>
                )}

                {order.status === 'delivered' && (
                  <div className="w-full text-center text-xs font-bold text-emerald-700 py-1 flex items-center justify-center gap-1">
                    <CheckCircle2 size={14} /> Order Fulfilled
                  </div>
                )}
              </div>

              {/* Reject Dialog */}
              {rejectingOrderId === order._id && (
                <div className="p-3 bg-red-50 rounded-xl border border-red-200 space-y-2 text-xs">
                  <span className="font-bold text-red-900 block">Reason for Rejection</span>
                  <select
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full p-2 bg-white border border-red-300 rounded-lg text-xs"
                  >
                    <option value="Item unavailable">Item unavailable</option>
                    <option value="Kitchen closed">Kitchen closed</option>
                    <option value="Outside delivery hours">Outside delivery hours</option>
                    <option value="Unable to fulfill dietary request">Unable to fulfill dietary request</option>
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setRejectingOrderId(null)}
                      className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(order._id, 'rejected', rejectReason)}
                      className="flex-1 bg-critical text-white py-1.5 rounded-lg text-xs font-bold"
                    >
                      Confirm Reject
                    </button>
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

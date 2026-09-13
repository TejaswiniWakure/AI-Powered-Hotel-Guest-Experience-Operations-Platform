import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, Clock, AlertTriangle, RefreshCw, ArrowRight, ShieldCheck } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';

export default function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/platform/subscriptions');
      if (res) setSubscriptions(res);
    } catch (err) {
      console.error('Failed to load subscriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExtend = async (hotelId) => {
    try {
      await api.patch(`/admin/platform/hotels/${hotelId}/extend-trial`, { days: 30 });
      setNotice('Subscription renewal/trial extended by 30 days');
      setTimeout(() => setNotice(''), 3000);
      fetchSubscriptions();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleMarkActive = async (hotelId) => {
    try {
      await api.patch(`/admin/platform/hotels/${hotelId}/reactivate`);
      setNotice('Payment recorded & account marked Active');
      setTimeout(() => setNotice(''), 3000);
      fetchSubscriptions();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-primary">Subscription & Access Control</h1>
          <p className="text-xs text-text-muted mt-0.5">
            Monitor SaaS plan tiers, trial expiry, renewal billing dates, and payment statuses.
          </p>
        </div>

        <button
          onClick={fetchSubscriptions}
          className="p-2.5 rounded-xl border border-border bg-white text-text-muted hover:text-primary hover:bg-secondary-bg transition-colors flex items-center gap-1.5 text-xs font-semibold self-start sm:self-auto"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {notice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-semibold">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{notice}</span>
        </div>
      )}

      {/* Subscription Plans Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 border-border shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Essential Plan</span>
          <div className="text-xl font-bold font-serif text-primary mt-1">₹4,999 / mo</div>
          <p className="text-[11px] text-text-muted mt-1">Up to 50 Rooms • Core Guest Services & Issue Reporting</p>
        </Card>

        <Card className="p-5 border-border shadow-xs bg-primary/5 border-primary/30">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Professional Plan</span>
            <span className="px-1.5 py-0.5 rounded bg-accent text-primary text-[9px] font-bold">Popular</span>
          </div>
          <div className="text-xl font-bold font-serif text-primary mt-1">₹9,999 / mo</div>
          <p className="text-[11px] text-text-muted mt-1">Up to 150 Rooms • In-Room Dining & AI Concierge</p>
        </Card>

        <Card className="p-5 border-border shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Enterprise Plan</span>
          <div className="text-xl font-bold font-serif text-primary mt-1">Custom Tier</div>
          <p className="text-[11px] text-text-muted mt-1">Unlimited Rooms • Multi-property Cluster Management</p>
        </Card>
      </div>

      {/* Subscriptions Table */}
      <Card className="border-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-secondary-bg/80 border-b border-border text-[11px] font-bold text-text-muted uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Hotel Name</th>
                <th className="py-3.5 px-4">Code</th>
                <th className="py-3.5 px-4">Current Plan</th>
                <th className="py-3.5 px-4">Subscription Status</th>
                <th className="py-3.5 px-4">Monthly Value</th>
                <th className="py-3.5 px-4">Renewal / Trial End</th>
                <th className="py-3.5 px-4 text-right">Access Controls</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-text-muted">
                    Loading subscription accounts...
                  </td>
                </tr>
              ) : subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-text-muted">
                    No subscriptions found.
                  </td>
                </tr>
              ) : (
                subscriptions.map(s => (
                  <tr key={s._id} className="hover:bg-secondary-bg/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-primary">
                      {s.hotelName}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-semibold text-text-muted">
                      {s.hotelCode}
                    </td>

                    <td className="py-3.5 px-4 capitalize font-semibold text-primary">
                      {s.plan}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        s.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : s.status === 'trial'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {s.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-serif font-bold text-primary">
                      ₹{s.price?.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-text-muted">
                      {new Date(s.renewalDate).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleExtend(s._id)}
                        className="px-2.5 py-1 bg-secondary-bg hover:bg-secondary-bg/80 text-primary rounded-lg font-semibold text-[11px] border border-border"
                      >
                        Extend (+30d)
                      </button>

                      {s.status !== 'active' && (
                        <button
                          onClick={() => handleMarkActive(s._id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-[11px]"
                        >
                          Mark Paid
                        </button>
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

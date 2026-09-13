import React, { useState, useEffect } from 'react';
import { 
  Building2, Plus, Search, MoreVertical, ShieldAlert, ShieldCheck, 
  Key, RefreshCw, Clock, CheckCircle2, XCircle, AlertCircle, X 
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { api } from '../../services/api';

export default function AdminHotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  const [resetCreds, setResetCreds] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Add Hotel Form State
  const [newHotelName, setNewHotelName] = useState('');
  const [newManagerName, setNewManagerName] = useState('');
  const [newManagerEmail, setNewManagerEmail] = useState('');
  const [newPassword, setNewPassword] = useState('StayFlow@2026');
  const [newPlan, setNewPlan] = useState('professional');
  const [addingHotel, setAddingHotel] = useState(false);

  useEffect(() => {
    fetchHotels();
  }, [statusFilter]);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      if (search.trim()) params.search = search.trim();

      const res = await api.get('/admin/platform/hotels', params);
      if (res) setHotels(res);
    } catch (err) {
      console.error('Failed to load hotel accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHotel = async (e) => {
    e.preventDefault();
    if (!newHotelName.trim() || !newManagerEmail.trim() || !newPassword.trim()) {
      alert('Please provide hotel name, manager email, and password.');
      return;
    }

    setAddingHotel(true);
    try {
      await api.post('/admin/platform/hotels', {
        hotelName: newHotelName.trim(),
        managerName: newManagerName.trim(),
        managerEmail: newManagerEmail.trim(),
        password: newPassword.trim(),
        plan: newPlan
      });
      setIsAddModalOpen(false);
      setNewHotelName('');
      setNewManagerName('');
      setNewManagerEmail('');
      showNotice('New hotel onboarded successfully!');
      fetchHotels();
    } catch (err) {
      alert(err.message || 'Failed to create hotel');
    } finally {
      setAddingHotel(false);
    }
  };

  const handleSuspend = async (hotelId) => {
    if (!window.confirm('Suspend this hotel account? Their staff and guests will lose access.')) return;
    try {
      await api.patch(`/admin/platform/hotels/${hotelId}/suspend`);
      showNotice('Hotel account suspended');
      setActionMenuOpen(null);
      fetchHotels();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReactivate = async (hotelId) => {
    try {
      await api.patch(`/admin/platform/hotels/${hotelId}/reactivate`);
      showNotice('Hotel account reactivated to Active');
      setActionMenuOpen(null);
      fetchHotels();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleExtendTrial = async (hotelId) => {
    try {
      await api.patch(`/admin/platform/hotels/${hotelId}/extend-trial`, { days: 14 });
      showNotice('Trial extended by 14 days');
      setActionMenuOpen(null);
      fetchHotels();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleResetPassword = async (hotelId) => {
    try {
      const res = await api.post(`/admin/platform/hotels/${hotelId}/reset-password`);
      setResetCreds(res);
      setActionMenuOpen(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const showNotice = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 3500);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-primary">Hotel Accounts</h1>
          <p className="text-xs text-text-muted mt-0.5">
            Manage customer hotel tenants, subscription access, manager credentials, and account statuses.
          </p>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary text-accent hover:bg-primary-hover flex items-center gap-2 text-xs font-bold shadow-xs"
        >
          <Plus size={15} /> + Add Hotel Account
        </Button>
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-semibold">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <Card className="p-4 border-border shadow-xs">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search hotel, manager email, code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchHotels()}
              className="w-full text-xs bg-secondary-bg/50 border border-border rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-primary focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs p-2.5 border border-border rounded-xl bg-white focus:outline-none focus:border-primary"
            >
              <option value="All">All Statuses</option>
              <option value="active">Active</option>
              <option value="trial">Trial</option>
              <option value="suspended">Suspended</option>
            </select>

            <button
              onClick={fetchHotels}
              className="p-2.5 rounded-xl border border-border bg-white text-text-muted hover:text-primary hover:bg-secondary-bg transition-colors"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>
      </Card>

      {/* Hotels Table */}
      <Card className="border-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-secondary-bg/80 border-b border-border text-[11px] font-bold text-text-muted uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Hotel Property</th>
                <th className="py-3.5 px-4">Hotel Code</th>
                <th className="py-3.5 px-4">Primary Manager</th>
                <th className="py-3.5 px-4">Plan Tier</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4">Rooms / Staff</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-text-muted">
                    Loading hotel accounts...
                  </td>
                </tr>
              ) : hotels.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-text-muted">
                    No hotel accounts found.
                  </td>
                </tr>
              ) : (
                hotels.map(h => (
                  <tr key={h._id} className="hover:bg-secondary-bg/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-primary text-accent flex items-center justify-center font-bold text-xs shrink-0">
                          {h.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-primary block">{h.name}</span>
                          <span className="text-[10px] text-text-muted">{h.subdomain}.stayflow.io</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-primary text-xs">
                      {h.hotelCode}
                    </td>

                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-semibold text-primary block">{h.manager?.name || 'Manager'}</span>
                        <span className="text-[10px] text-text-muted">{h.manager?.email || h.contactEmail}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 capitalize font-semibold text-primary">
                      {h.subscription?.plan || 'Professional'}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        h.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : h.status === 'trial'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {h.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-text-muted">
                      {h.usageStats?.rooms || 0} rooms • {h.usageStats?.staff || 0} staff
                    </td>

                    <td className="py-3.5 px-4 text-right relative">
                      <button
                        onClick={() => setActionMenuOpen(actionMenuOpen === h._id ? null : h._id)}
                        className="p-1.5 text-text-muted hover:text-primary rounded-lg hover:bg-secondary-bg transition-colors"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {actionMenuOpen === h._id && (
                        <div className="absolute right-4 top-12 z-30 w-52 bg-white rounded-xl shadow-xl border border-border py-1 text-left animate-in fade-in zoom-in-95">
                          <button
                            onClick={() => handleExtendTrial(h._id)}
                            className="w-full px-3.5 py-2 text-xs text-text hover:bg-secondary-bg flex items-center gap-2"
                          >
                            <Clock size={13} /> Extend Trial (+14 Days)
                          </button>
                          <button
                            onClick={() => handleResetPassword(h._id)}
                            className="w-full px-3.5 py-2 text-xs text-text hover:bg-secondary-bg flex items-center gap-2"
                          >
                            <Key size={13} /> Reset Manager Password
                          </button>
                          <div className="border-t border-border my-1"></div>
                          {h.status === 'suspended' ? (
                            <button
                              onClick={() => handleReactivate(h._id)}
                              className="w-full px-3.5 py-2 text-xs text-emerald-700 hover:bg-emerald-50 flex items-center gap-2 font-semibold"
                            >
                              <CheckCircle2 size={13} /> Reactivate Account
                            </button>
                          ) : (
                            <button
                              onClick={() => handleSuspend(h._id)}
                              className="w-full px-3.5 py-2 text-xs text-critical hover:bg-red-50 flex items-center gap-2 font-semibold"
                            >
                              <ShieldAlert size={13} /> Suspend Access
                            </button>
                          )}
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

      {/* Password Reset Modal Notification */}
      {resetCreds && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-primary font-serif">Manager Password Reset</h3>
              <button onClick={() => setResetCreds(null)}><X size={18} /></button>
            </div>
            <p className="text-xs text-text-muted">
              Credentials reset for <strong className="text-primary">{resetCreds.email}</strong>
            </p>
            <div className="p-3 bg-secondary-bg rounded-xl text-xs font-mono font-bold text-primary">
              Temporary Password: {resetCreds.temporaryPassword}
            </div>
            <Button onClick={() => setResetCreds(null)} className="w-full text-xs">Done</Button>
          </div>
        </div>
      )}

      {/* Add Hotel Account Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold font-serif text-primary">Onboard New Hotel</h3>
                <p className="text-xs text-text-muted">Create hotel workspace & manager account.</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1.5 rounded-full hover:bg-secondary-bg text-text-muted">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddHotel} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-primary mb-1">Hotel Property Name *</label>
                <Input
                  type="text"
                  placeholder="e.g. Silver Jubilee Palace"
                  value={newHotelName}
                  onChange={(e) => setNewHotelName(e.target.value)}
                  className="text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-primary mb-1">Primary Manager Name</label>
                <Input
                  type="text"
                  placeholder="e.g. Ananya Shah"
                  value={newManagerName}
                  onChange={(e) => setNewManagerName(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-primary mb-1">Manager Login Email *</label>
                <Input
                  type="email"
                  placeholder="manager@silverjubilee.com"
                  value={newManagerEmail}
                  onChange={(e) => setNewManagerEmail(e.target.value)}
                  className="text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-primary mb-1">Initial Password *</label>
                <Input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-primary mb-1">Subscription Plan</label>
                <select
                  value={newPlan}
                  onChange={(e) => setNewPlan(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-border bg-white"
                >
                  <option value="essential">Essential (₹4,999/mo)</option>
                  <option value="professional">Professional (₹9,999/mo)</option>
                  <option value="enterprise">Enterprise (Custom)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-border flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={addingHotel}
                  className="flex-1 bg-primary text-accent hover:bg-primary-hover font-bold text-xs"
                >
                  {addingHotel ? 'Creating...' : 'Create Hotel Account'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

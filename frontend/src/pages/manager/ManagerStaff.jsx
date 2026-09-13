import React, { useState, useEffect } from 'react';
import { Users, Mail, Plus, X, Trash2, Check, AlertCircle, Phone, Award, Clock } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { api } from '../../services/api';

export default function ManagerStaff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', department: '', password: '' });
  const [deletingId, setDeletingId] = useState(null);
  const [feedbackNotice, setFeedbackNotice] = useState('');

  const fetchStaff = () => {
    api.get('/manager/staff')
      .then(data => { if (Array.isArray(data)) setStaff(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setInviteError('Name, email and password are required.');
      return;
    }
    setInviteError('');
    setInviteLoading(true);
    try {
      await api.post('/manager/staff/invite', form);
      setInviteSuccess(`✓ ${form.name} has been added. They can sign in with their email and password.`);
      setForm({ name: '', email: '', phone: '', department: '', password: '' });
      fetchStaff();
      setTimeout(() => { setInviteSuccess(''); setShowInvite(false); }, 3000);
    } catch (err) {
      setInviteError(err.message || 'Failed to invite staff.');
    } finally {
      setInviteLoading(false);
    }
  };

  const handleRemoveStaff = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove staff member "${name}" from this hotel property?`)) return;
    setDeletingId(id);
    try {
      await api.delete(`/manager/staff/${id}`);
      setFeedbackNotice(`✓ Staff member ${name} removed successfully.`);
      setTimeout(() => setFeedbackNotice(''), 3500);
      fetchStaff();
    } catch (err) {
      alert(err.message || 'Failed to remove staff member.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-serif">Staff Workload & Performance</h1>
          <p className="text-text-muted text-sm mt-1">Live shift workload, SLA performance metrics, and staff team management.</p>
        </div>
        <Button
          onClick={() => setShowInvite(true)}
          className="bg-primary text-accent hover:bg-primary-hover gap-2 text-sm font-bold shadow-xs"
        >
          <Plus size={16} /> Add Staff Member
        </Button>
      </div>

      {feedbackNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-semibold flex items-center gap-2 animate-in fade-in">
          <Check size={16} className="text-emerald-600" />
          <span>{feedbackNotice}</span>
        </div>
      )}

      {/* Invite Staff Modal */}
      {showInvite && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6 bg-white rounded-2xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-primary font-serif">Add New Staff Member</h2>
              <button onClick={() => { setShowInvite(false); setInviteError(''); setInviteSuccess(''); }} className="text-text-muted hover:text-primary p-1">
                <X size={18} />
              </button>
            </div>

            {inviteSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold">
                {inviteSuccess}
              </div>
            )}
            {inviteError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold">
                {inviteError}
              </div>
            )}

            <form onSubmit={handleInvite} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-primary mb-1 uppercase tracking-wider">Full Name *</label>
                <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Ravi Kumar" className="text-xs" required />
              </div>
              <div>
                <label className="block font-bold text-primary mb-1 uppercase tracking-wider">Work Email or Staff Login ID *</label>
                <Input type="text" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="e.g. rahul.staff.com or rahul@staff.com" className="text-xs" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-primary mb-1 uppercase tracking-wider">Phone</label>
                  <Input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+91 98200..." className="text-xs" />
                </div>
                <div>
                  <label className="block font-bold text-primary mb-1 uppercase tracking-wider">Department</label>
                  <select
                    className="w-full h-10 rounded-xl border border-input bg-white px-3 py-2 text-xs focus:outline-none focus:border-primary"
                    value={form.department}
                    onChange={e => setForm({...form, department: e.target.value})}
                  >
                    <option value="">Select Dept.</option>
                    <option>Housekeeping</option>
                    <option>Maintenance</option>
                    <option>Front Desk</option>
                    <option>Room Service</option>
                    <option>Security</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-bold text-primary mb-1 uppercase tracking-wider">Temporary Password *</label>
                <Input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Login password" className="text-xs" required />
              </div>
              <div className="pt-2 flex gap-2">
                <Button type="button" variant="outline" onClick={() => setShowInvite(false)} className="flex-1 text-xs">Cancel</Button>
                <Button type="submit" disabled={inviteLoading} className="flex-1 bg-primary text-accent hover:bg-primary-hover font-bold text-xs">
                  {inviteLoading ? 'Adding...' : 'Add Staff Member'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-xs text-text-muted bg-white rounded-2xl border border-border">
          Loading staff telemetry & workloads...
        </div>
      ) : staff.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-border bg-secondary-bg/30 rounded-2xl">
          <Users size={36} className="mx-auto text-text-muted mb-3 opacity-60" />
          <h3 className="font-bold text-sm text-primary mb-1">No Staff Members Yet</h3>
          <p className="text-xs text-text-muted mb-4">Add your hotel staff to start assigning tasks and tracking SLA performance.</p>
          <Button onClick={() => setShowInvite(true)} className="bg-primary text-accent hover:bg-primary-hover text-xs font-bold gap-2">
            <Plus size={14} /> Add First Staff Member
          </Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {staff.map(member => (
            <Card key={member._id} className="p-5 bg-white rounded-2xl border border-border hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center text-sm font-serif">
                      {member.name?.[0] || 'S'}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-primary">{member.name}</h3>
                      <p className="text-[11px] text-text-muted">{member.department || 'Hotel Operations'}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    member.workloadLevel === 'High' ? 'bg-red-100 text-red-800' :
                    member.workloadLevel === 'Moderate' ? 'bg-amber-100 text-amber-800' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    {member.workloadLevel} Load
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 my-3 p-3 bg-secondary-bg/40 rounded-xl text-xs border border-border/60">
                  <div>
                    <span className="text-text-muted block text-[10px] uppercase font-bold tracking-wider">Active Tasks</span>
                    <span className="text-base font-bold text-primary">{member.activeTasksCount}</span>
                  </div>
                  <div>
                    <span className="text-text-muted block text-[10px] uppercase font-bold tracking-wider">Completed</span>
                    <span className="text-base font-bold text-emerald-700">{member.completedTasksCount}</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-text-muted block text-[10px] uppercase font-bold tracking-wider">SLA Adherence</span>
                    <span className="text-xs font-bold text-primary">{member.slaCompliance}</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-text-muted block text-[10px] uppercase font-bold tracking-wider">Avg Speed</span>
                    <span className="text-xs font-bold text-primary">{member.avgResolution}</span>
                  </div>
                </div>

                {member.skills && member.skills.length > 0 && (
                  <div className="mb-3">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Skills:</span>
                    <div className="flex flex-wrap gap-1">
                      {member.skills.map((sk, i) => (
                        <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-secondary-bg text-primary border border-border">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between text-[11px]">
                <span className="text-text-muted flex items-center gap-1 truncate max-w-[170px]">
                  <Mail size={12} /> {member.email}
                </span>

                <button
                  onClick={() => handleRemoveStaff(member._id, member.name)}
                  disabled={deletingId === member._id}
                  className="text-critical hover:bg-red-50 p-1.5 rounded-lg transition-colors flex items-center gap-1 font-semibold text-[11px]"
                  title="Remove staff member"
                >
                  <Trash2 size={13} /> Remove
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

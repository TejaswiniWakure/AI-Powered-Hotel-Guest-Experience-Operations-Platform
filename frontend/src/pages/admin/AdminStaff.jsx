import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Shield, Wrench, Mail, CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/shared/Modal';
import { api } from '../../services/api';

export default function AdminStaff() {
  const [staff, setStaff] = useState([]);
  const [depts, setDepts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create Staff Modal
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('staff');
  const [department, setDepartment] = useState('Maintenance');
  const [skills, setSkills] = useState('HVAC, Plumbing, Electrical');
  const [saving, setSaving] = useState(false);

  const fetchStaff = () => {
    setLoading(true);
    api.get('/admin/staff')
      .then(data => {
        if (Array.isArray(data)) setStaff(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStaff();
    api.get('/admin/departments')
      .then(data => {
        if (Array.isArray(data)) setDepts(data);
      })
      .catch(() => {});
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/admin/staff', {
        name,
        email,
        role,
        department,
        skills: skills.split(',').map(s => s.trim())
      });
      setShowModal(false);
      setName('');
      setEmail('');
      fetchStaff();
    } catch (err) {
      alert('Failed to register staff: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this staff member?')) return;
    try {
      await api.delete(`/admin/staff/${id}`);
      fetchStaff();
    } catch (err) {
      alert('Action failed: ' + err.message);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-serif">Staff Directory & Role Assignments</h1>
          <p className="text-text-muted text-sm mt-1">Configure user accounts, operational roles, and skill authorizations.</p>
        </div>

        <Button
          onClick={() => setShowModal(true)}
          className="bg-primary text-accent hover:bg-primary-hover font-bold text-xs gap-1.5"
        >
          <Plus size={16} /> Register Staff
        </Button>
      </div>

      {/* Staff Table */}
      <Card className="overflow-hidden bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary-bg/30 text-[11px] font-bold text-text-muted uppercase tracking-wider">
                <th className="p-4">Staff Member</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Department</th>
                <th className="p-4">Specialized Skills</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan="7" className="p-8 text-center text-text-muted">Loading staff directory...</td></tr>
              ) : staff.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-text-muted">No staff found.</td></tr>
              ) : (
                staff.map(s => (
                  <tr key={s._id} className="hover:bg-secondary-bg/20 transition-colors">
                    <td className="p-4 font-bold text-primary text-sm flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                        {s.name?.[0] || 'U'}
                      </div>
                      {s.name}
                    </td>
                    <td className="p-4 text-text-muted">{s.email}</td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        s.role === 'admin' ? 'bg-accent/20 text-primary' :
                        s.role === 'manager' ? 'bg-primary/15 text-primary' :
                        'bg-secondary-bg text-text-muted'
                      }`}>
                        {s.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-primary">{s.department || s.departmentId?.name || 'General'}</td>
                    <td className="p-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {(s.skills || []).map((sk, i) => (
                          <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary-bg border border-border">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] font-bold text-success bg-success/15 px-2 py-0.5 rounded-full">
                        ACTIVE
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {s.role !== 'admin' && (
                        <button
                          onClick={() => handleDelete(s._id)}
                          className="p-1.5 text-text-muted hover:text-critical transition-colors rounded"
                          title="Remove Staff"
                        >
                          <Trash2 size={15} />
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

      {/* Register Staff Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Register New Staff Member"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">
              Full Name *
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">
              Email Address *
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="rahul@stayflow.demo"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">
                System Role *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-border bg-white text-primary focus:outline-none focus:border-primary"
              >
                <option value="staff">Staff (Technician)</option>
                <option value="manager">Manager (Ops Lead)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">
                Department *
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-border bg-white text-primary focus:outline-none focus:border-primary"
              >
                <option value="Maintenance">Maintenance</option>
                <option value="Housekeeping">Housekeeping</option>
                <option value="Front Desk">Front Desk</option>
                <option value="Room Service">Room Service</option>
                <option value="Security">Security</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">
              Skills (Comma Separated)
            </label>
            <Input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="HVAC, Plumbing, Electrical, Wi-Fi"
            />
          </div>

          <Button
            type="submit"
            disabled={saving}
            className="w-full bg-primary text-accent hover:bg-primary-hover font-bold text-xs uppercase tracking-wider py-2.5"
          >
            {saving ? 'Creating Account...' : 'Register User'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}

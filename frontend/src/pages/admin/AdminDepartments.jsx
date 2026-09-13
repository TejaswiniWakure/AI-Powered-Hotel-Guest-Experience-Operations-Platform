import React, { useState, useEffect } from 'react';
import { Layers, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/shared/Modal';
import { api } from '../../services/api';

export default function AdminDepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchDepts = () => {
    setLoading(true);
    api.get('/admin/departments')
      .then(data => {
        if (Array.isArray(data)) setDepartments(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDepts();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name) return;
    setSaving(true);
    try {
      await api.post('/admin/departments', { name, description });
      setShowModal(false);
      setName('');
      setDescription('');
      fetchDepts();
    } catch (err) {
      alert('Failed to create department: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this department?')) return;
    try {
      await api.delete(`/admin/departments/${id}`);
      fetchDepts();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-serif">Hotel Operational Departments</h1>
          <p className="text-text-muted text-sm mt-1">Manage departmental routing categories and shift management teams.</p>
        </div>

        <Button
          onClick={() => setShowModal(true)}
          className="bg-primary text-accent hover:bg-primary-hover font-bold text-xs gap-1.5"
        >
          <Plus size={16} /> Add Department
        </Button>
      </div>

      <Card className="overflow-hidden bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary-bg/30 text-[11px] font-bold text-text-muted uppercase tracking-wider">
                <th className="p-4">Department Name</th>
                <th className="p-4">Operational Scope</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan="4" className="p-8 text-center text-text-muted">Loading departments...</td></tr>
              ) : departments.length === 0 ? (
                <tr><td colSpan="4" className="p-8 text-center text-text-muted">No departments configured.</td></tr>
              ) : (
                departments.map(d => (
                  <tr key={d._id} className="hover:bg-secondary-bg/20 transition-colors">
                    <td className="p-4 font-bold text-primary text-sm">{d.name}</td>
                    <td className="p-4 text-text-muted">{d.description || 'Standard hotel operations team'}</td>
                    <td className="p-4">
                      <span className="text-[10px] font-bold text-success bg-success/15 px-2 py-0.5 rounded-full">
                        ACTIVE
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(d._id)}
                        className="p-1.5 text-text-muted hover:text-critical transition-colors rounded"
                        title="Delete Department"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add Department"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">
              Department Name *
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Concierge & Valet"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">
              Operational Scope / Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe tasks routed to this department..."
              rows={3}
              className="w-full text-xs p-2.5 rounded-xl border border-border bg-white focus:outline-none focus:border-primary"
            />
          </div>

          <Button
            type="submit"
            disabled={saving}
            className="w-full bg-primary text-accent hover:bg-primary-hover font-bold text-xs uppercase tracking-wider py-2.5"
          >
            {saving ? 'Creating...' : 'Save Department'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}

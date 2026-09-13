import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Settings, Star, EyeOff, Wrench
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/shared/Modal';
import { api } from '../../services/api';

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create Modal
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Housekeeping');
  const [departmentId, setDepartmentId] = useState('');
  const [defaultPriority, setDefaultPriority] = useState('Medium');
  const [slaMinutes, setSlaMinutes] = useState('30');
  const [estimatedMinutes, setEstimatedMinutes] = useState('20');
  const [price, setPrice] = useState('0');
  const [currency, setCurrency] = useState('INR');
  const [icon, setIcon] = useState('default');
  const [displayOrder, setDisplayOrder] = useState('0');
  
  // Toggles
  const [requiresQuantity, setRequiresQuantity] = useState(false);
  const [requiresSchedule, setRequiresSchedule] = useState(false);
  const [guestVisible, setGuestVisible] = useState(true);
  const [popular, setPopular] = useState(false);

  useEffect(() => {
    fetchDepartments();
    fetchServices();
  }, []);

  const fetchDepartments = async () => {
    try {
      const data = await api.get('/admin/departments');
      if (Array.isArray(data)) {
        setDepartments(data);
        if (data.length > 0) setDepartmentId(data[0]._id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await api.get('/admin/services');
      if (Array.isArray(data)) setServices(data.sort((a,b) => a.displayOrder - b.displayOrder));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim() || !departmentId) return;

    setSaving(true);
    try {
      await api.post('/admin/services', {
        name,
        category,
        departmentId,
        defaultPriority,
        slaMinutes: Number(slaMinutes),
        estimatedMinutes: Number(estimatedMinutes),
        price: Number(price),
        currency,
        description,
        icon,
        displayOrder: Number(displayOrder),
        requiresQuantity,
        requiresSchedule,
        guestVisible,
        popular
      });
      setShowModal(false);
      
      // Reset form
      setName(''); setDescription(''); setPrice('0'); setIcon('default'); setDisplayOrder('0');
      setRequiresQuantity(false); setRequiresSchedule(false);
      setGuestVisible(true); setPopular(false);
      
      fetchServices();
    } catch (err) {
      alert('Failed to register service: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this service?')) return;
    try {
      await api.delete(`/admin/services/${id}`);
      fetchServices();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-serif">Guest Services Catalog</h1>
          <p className="text-text-muted text-sm mt-1">Configure service items, automatic department dispatch, and pricing.</p>
        </div>

        <Button
          onClick={() => setShowModal(true)}
          className="bg-primary text-accent hover:bg-primary-hover font-bold text-xs gap-1.5"
        >
          <Plus size={16} /> Add Catalog Service
        </Button>
      </div>

      <Card className="overflow-hidden bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary-bg/30 text-[11px] font-bold text-text-muted uppercase tracking-wider">
                <th className="p-4">Service Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Assigned Dept</th>
                <th className="p-4">Est. Time / SLA</th>
                <th className="p-4">Price</th>
                <th className="p-4 text-center">Flags</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan="7" className="p-8 text-center text-text-muted">Loading services...</td></tr>
              ) : services.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-text-muted">No catalog services configured.</td></tr>
              ) : (
                services.map(s => (
                  <tr key={s._id} className="hover:bg-secondary-bg/20 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-primary text-sm flex items-center gap-1.5">
                        {s.name}
                        {s.popular && <Star size={12} className="text-accent" />}
                        {!s.guestVisible && <EyeOff size={12} className="text-text-muted" />}
                      </span>
                      <span className="text-[11px] text-text-muted line-clamp-1 mt-0.5">{s.description}</span>
                    </td>
                    <td className="p-4 font-semibold text-text-muted">{s.category}</td>
                    <td className="p-4 font-medium text-primary">{s.departmentId?.name || s.category}</td>
                    <td className="p-4">
                      <div className="font-semibold text-primary">{s.estimatedMinutes || 20}m</div>
                      <div className="text-[10px] text-text-muted">SLA: {s.slaMinutes || s.defaultSLAMinutes || 30}m</div>
                    </td>
                    <td className="p-4 font-semibold text-primary">
                      {s.price > 0 ? `${s.currency || '₹'} ${s.price}` : 'Complimentary'}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-1 flex-wrap">
                        {s.requiresQuantity && <span className="bg-secondary-bg px-1.5 py-0.5 rounded text-[10px] text-primary" title="Requires Quantity">Qty</span>}
                        {s.requiresSchedule && <span className="bg-secondary-bg px-1.5 py-0.5 rounded text-[10px] text-primary" title="Requires Time Schedule">Sch</span>}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(s._id)}
                        className="p-1.5 text-text-muted hover:text-critical transition-colors rounded"
                        title="Delete Service"
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
        title="Add Service to Catalog"
      >
        <form onSubmit={handleCreate} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">
                Service Name *
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Extra Bath Towels"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">
                Icon Slug
              </label>
              <Input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="e.g. towel"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-border bg-white text-primary focus:outline-none focus:border-primary"
              >
                <option value="Housekeeping">Housekeeping</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Front Desk">Front Desk</option>
                <option value="Room Service">Room Service</option>
                <option value="Concierge">Concierge</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">
                Routing Department *
              </label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-border bg-white text-primary focus:outline-none focus:border-primary"
                required
              >
                {departments.map(d => (
                  <option key={d._id} value={d._id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">
                Est. Minutes
              </label>
              <Input
                type="number"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(e.target.value)}
                min="5"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">
                SLA Timeout
              </label>
              <Input
                type="number"
                value={slaMinutes}
                onChange={(e) => setSlaMinutes(e.target.value)}
                min="5"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">
                Sort Order
              </label>
              <Input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                min="0"
              />
            </div>
          </div>

          <div>
              <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">
                Price (Optional)
              </label>
              <div className="flex gap-2 w-1/2">
                <select 
                  value={currency} 
                  onChange={e => setCurrency(e.target.value)}
                  className="w-16 text-xs p-2.5 rounded-xl border border-border bg-white"
                >
                  <option value="₹">₹</option>
                  <option value="$">$</option>
                </select>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                />
              </div>
          </div>
          
          <div className="p-3 bg-secondary-bg/50 rounded-xl space-y-3 border border-border">
            <h4 className="text-xs font-bold text-primary mb-2 uppercase tracking-wider">Form Behavior</h4>
            <label className="flex items-center gap-2 text-xs font-semibold text-primary cursor-pointer">
              <input type="checkbox" checked={requiresQuantity} onChange={e => setRequiresQuantity(e.target.checked)} className="rounded" />
              Ask guest for quantity (e.g. towels, bottles)
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-primary cursor-pointer">
              <input type="checkbox" checked={requiresSchedule} onChange={e => setRequiresSchedule(e.target.checked)} className="rounded" />
              Ask guest for requested time (e.g. wake-up call, cleaning)
            </label>
          </div>

          <div className="p-3 bg-secondary-bg/50 rounded-xl space-y-3 border border-border">
            <h4 className="text-xs font-bold text-primary mb-2 uppercase tracking-wider">Display Flags</h4>
            <label className="flex items-center gap-2 text-xs font-semibold text-primary cursor-pointer">
              <input type="checkbox" checked={guestVisible} onChange={e => setGuestVisible(e.target.checked)} className="rounded" />
              Visible to Guests in Catalog
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-primary cursor-pointer">
              <input type="checkbox" checked={popular} onChange={e => setPopular(e.target.checked)} className="rounded" />
              Mark as 'Popular' (Shows at top of guest portal)
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Guest-facing description of amenity..."
              rows={2}
              className="w-full text-xs p-2.5 rounded-xl border border-border bg-white focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <Button
            type="submit"
            disabled={saving}
            className="w-full bg-primary text-accent hover:bg-primary-hover font-bold text-xs uppercase tracking-wider py-3 mt-4"
          >
            {saving ? 'Creating...' : 'Save Catalog Service'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}

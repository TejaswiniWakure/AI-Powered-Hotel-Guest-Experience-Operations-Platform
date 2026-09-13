import React, { useState, useEffect } from 'react';
import { Clock, Save, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { api } from '../../services/api';

export default function AdminSLA() {
  const [sla, setSla] = useState({
    Critical: { response: 5, resolution: 15, escalation: 12 },
    High: { response: 10, resolution: 30, escalation: 25 },
    Medium: { response: 15, resolution: 60, escalation: 50 },
    Low: { response: 30, resolution: 120, escalation: 100 }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get('/admin/sla')
      .then(data => {
        if (data) setSla(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await api.patch('/admin/sla', sla);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert('Failed to save SLA rules: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateTier = (tier, field, val) => {
    setSla(prev => ({
      ...prev,
      [tier]: {
        ...prev[tier],
        [field]: Number(val)
      }
    }));
  };

  const tiers = [
    { key: 'Critical', label: 'Critical Tier', desc: 'Active safety hazard, fire risk, or major flooding', color: 'border-critical' },
    { key: 'High', label: 'High Priority', desc: 'AC complete failure, active pipe leak, VIP escalation', color: 'border-high' },
    { key: 'Medium', label: 'Medium Priority', desc: 'TV, Wi-Fi connectivity, room cleaning refresh', color: 'border-medium' },
    { key: 'Low', label: 'Low Priority', desc: 'Extra towels, pillow options, water bottles', color: 'border-border' }
  ];

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-serif">SLA Timing & Escalation Engine</h1>
          <p className="text-text-muted text-sm mt-1">
            Configure statutory resolution deadlines and automated manager alert thresholds by priority level.
          </p>
        </div>

        {saved && (
          <span className="text-xs font-semibold text-success bg-success/10 px-3 py-1.5 rounded-xl flex items-center gap-1">
            <CheckCircle2 size={16} /> SLA Rules Live
          </span>
        )}
      </div>

      <form onSubmit={handleSave}>
        <div className="grid md:grid-cols-2 gap-5 mb-6">
          {tiers.map(t => {
            const current = sla[t.key] || { response: 10, resolution: 30, escalation: 25 };
            return (
              <Card key={t.key} className={`p-5 bg-white border-l-4 ${t.color}`}>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-base text-primary">{t.label}</h3>
                  <Clock size={16} className="text-text-muted" />
                </div>
                <p className="text-xs text-text-muted mb-4">{t.desc}</p>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">
                      Ack. Time (min)
                    </label>
                    <Input
                      type="number"
                      value={current.response}
                      onChange={(e) => updateTier(t.key, 'response', e.target.value)}
                      min="1"
                      className="text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-primary uppercase mb-1">
                      Target SLA (min)
                    </label>
                    <Input
                      type="number"
                      value={current.resolution}
                      onChange={(e) => updateTier(t.key, 'resolution', e.target.value)}
                      min="5"
                      className="text-xs font-bold text-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-critical uppercase mb-1">
                      Escalate (min)
                    </label>
                    <Input
                      type="number"
                      value={current.escalation}
                      onChange={(e) => updateTier(t.key, 'escalation', e.target.value)}
                      min="3"
                      className="text-xs font-semibold text-critical"
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Button
          type="submit"
          disabled={saving}
          className="bg-primary text-accent hover:bg-primary-hover font-bold text-xs uppercase tracking-wider py-2.5 px-6 gap-2"
        >
          <Save size={16} /> {saving ? 'Applying...' : 'Save SLA Rules'}
        </Button>
      </form>
    </div>
  );
}

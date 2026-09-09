import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Clock, Save } from 'lucide-react';

export default function AdminSLA() {
  const [rules, setRules] = useState([
    { label: 'Critical', color: 'bg-critical', textColor: 'text-critical', minutes: 15 },
    { label: 'High', color: 'bg-high', textColor: 'text-high', minutes: 30 },
    { label: 'Medium', color: 'bg-medium', textColor: 'text-medium', minutes: 60 },
    { label: 'Low', color: 'bg-success', textColor: 'text-success', minutes: 120 },
  ]);
  const [saved, setSaved] = useState(false);

  const handleChange = (i, val) => {
    const updated = [...rules];
    updated[i].minutes = parseInt(val) || 0;
    setRules(updated);
    setSaved(false);
  };

  return (
    <div>
      <div className="mb-8 flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg"><Clock className="text-primary" size={24} /></div>
        <div>
          <h1 className="text-3xl font-bold text-primary">SLA Rules</h1>
          <p className="text-text-muted mt-1">Set response time targets for each priority level.</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <Card className="p-6">
          <h2 className="text-lg font-bold text-primary mb-6">Response Time Targets</h2>
          <div className="space-y-6">
            {rules.map((rule, i) => (
              <div key={i} className="flex items-center gap-6">
                <div className="flex items-center gap-3 w-32">
                  <div className={`w-3 h-3 rounded-full ${rule.color}`} />
                  <span className={`font-semibold text-sm ${rule.textColor}`}>{rule.label}</span>
                </div>
                <div className="flex-1 flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    value={rule.minutes}
                    onChange={(e) => handleChange(i, e.target.value)}
                    className="w-24 border border-border rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent bg-white"
                  />
                  <span className="text-sm text-text-muted">minutes</span>
                  <span className="text-sm text-text-muted">
                    ({rule.minutes >= 60 ? `${Math.floor(rule.minutes / 60)}h ${rule.minutes % 60 > 0 ? `${rule.minutes % 60}m` : ''}`.trim() : `${rule.minutes}m`})
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-end">
            <Button onClick={() => setSaved(true)} className="flex items-center gap-2">
              <Save size={16} /> {saved ? 'Saved!' : 'Save Rules'}
            </Button>
          </div>
        </Card>

        <div className="mt-6 p-4 bg-secondary-bg rounded-xl border border-border text-sm text-text-muted">
          <strong className="text-primary">Note:</strong> SLA timers start when a task is assigned to a staff member. Exceeding SLA automatically escalates the task to the manager.
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Sliders, Bell, Shield, Key, Save, CheckCircle, Smartphone, Wifi, Radio } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function AdminSettings() {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState({
    autoAssignment: true,
    slaWarningPercent: 75,
    defaultPriority: 'Medium',
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',
    feedbackPromptTiming: 'immediate',
    enableSMS: true,
    enableWhatsApp: true,
    enableEmail: true,
    operaPmsSync: true,
    digitalKeycardIntegration: true,
    posBillingSync: true
  });

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">System Settings</h1>
          <p className="text-text-muted text-sm mt-1">Configure property-wide automation rules, notifications, and operational parameters</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={loading}
          className="bg-primary text-accent hover:bg-primary-hover font-semibold flex items-center gap-2"
        >
          <Save size={16} />
          {loading ? 'Saving Changes...' : 'Save Settings'}
        </Button>
      </div>

      {saved && (
        <div className="p-3.5 bg-success/15 border border-success/30 rounded-xl text-success text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle size={16} />
          System operational settings successfully updated and broadcast to all nodes.
        </div>
      )}

      {/* Automation Rules */}
      <Card className="p-6 bg-white border-border">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
          <div className="p-2 rounded-xl bg-accent/15 text-primary">
            <Sliders size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-primary">Task Automation & SLA Rules</h3>
            <p className="text-xs text-text-muted">Configure how incoming requests are scheduled and flagged</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-border/50">
            <div>
              <p className="text-sm font-semibold text-primary">Smart 4-Factor Auto-Assignment</p>
              <p className="text-xs text-text-muted">Automatically assign tasks based on skill match, workload, availability, and floor proximity</p>
            </div>
            <button
              onClick={() => handleToggle('autoAssignment')}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings.autoAssignment ? 'bg-primary' : 'bg-gray-300'
              }`}
            >
              <div
                className={`bg-accent w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.autoAssignment ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">
                SLA Warning Threshold (%)
              </label>
              <Input
                type="number"
                min="50"
                max="95"
                value={settings.slaWarningPercent}
                onChange={(e) => setSettings({ ...settings, slaWarningPercent: Number(e.target.value) })}
              />
              <span className="text-[11px] text-text-muted">Flag tasks as "At Risk" when {settings.slaWarningPercent}% of SLA has elapsed</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">
                Default Unclassified Priority
              </label>
              <select
                value={settings.defaultPriority}
                onChange={(e) => setSettings({ ...settings, defaultPriority: e.target.value })}
                className="w-full h-10 px-3 text-xs rounded-xl border border-border bg-white text-primary focus:outline-none focus:border-accent"
              >
                <option value="Low">Low (120m SLA)</option>
                <option value="Medium">Medium (60m SLA)</option>
                <option value="High">High (45m SLA)</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Guest Channels */}
      <Card className="p-6 bg-white border-border">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
          <div className="p-2 rounded-xl bg-accent/15 text-primary">
            <Radio size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-primary">Guest Communication Channels</h3>
            <p className="text-xs text-text-muted">Control notification dispatch channels for guest updates</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { key: 'enableWhatsApp', title: 'WhatsApp Business', desc: 'Instant dispatch on request resolve' },
            { key: 'enableSMS', title: 'SMS Gateway', desc: 'Fallback text updates for priority issues' },
            { key: 'enableEmail', title: 'Transactional Email', desc: 'Booking receipts & feedback surveys' }
          ].map(ch => (
            <div
              key={ch.key}
              onClick={() => handleToggle(ch.key)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                settings[ch.key] ? 'border-accent bg-accent/5' : 'border-border bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-primary">{ch.title}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  settings[ch.key] ? 'bg-success/15 text-success' : 'bg-gray-100 text-text-muted'
                }`}>
                  {settings[ch.key] ? 'ACTIVE' : 'OFF'}
                </span>
              </div>
              <p className="text-[11px] text-text-muted">{ch.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Integrations */}
      <Card className="p-6 bg-white border-border">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
          <div className="p-2 rounded-xl bg-accent/15 text-primary">
            <Key size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-primary">Hotel Enterprise Integrations</h3>
            <p className="text-xs text-text-muted">Synchronize guest check-in/out and room states with external property systems</p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { key: 'operaPmsSync', title: 'Oracle Hospitality (Opera PMS) Webhook Sync', desc: 'Sync room occupancy and guest profiles in real time' },
            { key: 'digitalKeycardIntegration', title: 'Assa Abloy / VingCard Mobile Access', desc: 'Generate mobile digital room keys directly within the Guest Portal' },
            { key: 'posBillingSync', title: 'Micros / Symphony POS Room Billing', desc: 'Post room service catalog charges automatically to the guest hotel folio' }
          ].map(it => (
            <div key={it.key} className="flex items-center justify-between p-3 rounded-xl border border-border bg-secondary-bg/20">
              <div>
                <p className="text-xs font-bold text-primary">{it.title}</p>
                <p className="text-[11px] text-text-muted">{it.desc}</p>
              </div>
              <button
                onClick={() => handleToggle(it.key)}
                className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                  settings[it.key] ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`bg-accent w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    settings[it.key] ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

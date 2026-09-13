import React, { useState, useEffect } from 'react';
import { 
  Hotel, Save, CheckCircle2, QrCode, Copy, 
  ExternalLink, Printer, Check, Sparkles 
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { api } from '../../services/api';

export default function AdminHotel() {
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.get('/admin/hotel')
      .then(data => setHotel(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await api.patch('/admin/hotel', {
        name: hotel.name,
        contactEmail: hotel.contactEmail,
        contactPhone: hotel.contactPhone,
        address: hotel.address
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert('Failed to update hotel settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const hotelCode = hotel?.hotelCode || 'SFGP';
  const guestAccessUrl = `${window.location.origin}/guest-access?hotel=${hotelCode}`;

  const copyGuestUrl = () => {
    navigator.clipboard.writeText(guestAccessUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-text-muted">Loading hotel settings...</div>;
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary font-serif">Hotel Setup & Profile</h1>
        <p className="text-text-muted text-sm mt-1">Configure property metadata, physical address, and master guest QR access.</p>
      </div>

      {/* Property Master QR Code Section */}
      <Card className="p-6 bg-gradient-to-br from-primary via-primary-hover to-secondary text-white border-none shadow-md overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent text-xs font-bold uppercase tracking-wider">
              <Sparkles size={13} /> Single Hotel QR Architecture
            </div>
            <h2 className="text-2xl font-serif font-bold text-white">Property Guest Access QR Code</h2>
            <p className="text-white/80 text-xs leading-relaxed">
              This is the single master QR code for <strong>{hotel?.name || 'StayFlow Hotel'}</strong>.
              Print this code for in-room tents, keycard sleeves, and the front desk. Guests scan it once,
              enter their room number, and immediately access their personalized guest portal.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <div className="bg-black/30 border border-white/20 rounded-xl px-3.5 py-2 flex items-center gap-2 text-xs font-mono text-accent">
                <span className="truncate max-w-[280px] sm:max-w-md">{guestAccessUrl}</span>
                <button
                  type="button"
                  onClick={copyGuestUrl}
                  className="text-white/80 hover:text-white transition-colors ml-1 p-1 hover:bg-white/10 rounded"
                  title="Copy Guest URL"
                >
                  {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                </button>
              </div>

              <Button
                type="button"
                size="sm"
                onClick={copyGuestUrl}
                className="bg-accent text-primary hover:bg-accent-hover font-bold text-xs gap-1.5"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied Link!' : 'Copy Guest Link'}
              </Button>

              <a
                href={`/guest-access?hotel=${hotelCode}`}
                target="_blank"
                rel="noreferrer"
              >
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 font-bold text-xs gap-1.5"
                >
                  <ExternalLink size={14} /> Test Access Flow
                </Button>
              </a>
            </div>
          </div>

          {/* Master QR Presentation Card */}
          <div className="bg-white p-5 rounded-2xl shadow-xl flex flex-col items-center text-center text-primary shrink-0 mx-auto md:mx-0 border-2 border-accent/40">
            <div className="w-40 h-40 bg-secondary-bg/60 rounded-xl border border-border flex flex-col items-center justify-center p-3 relative">
              <QrCode size={120} className="text-primary" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 bg-accent text-primary font-serif font-black text-xs rounded-lg flex items-center justify-center shadow-md border border-white">
                  SF
                </div>
              </div>
            </div>
            <p className="font-bold text-xs text-primary mt-3 font-serif uppercase tracking-wider">{hotel?.name || 'StayFlow Grand'}</p>
            <span className="text-[10px] font-mono text-text-muted mt-0.5">HOTEL CODE: {hotelCode}</span>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-accent font-semibold">
              <Printer size={12} /> Master Property QR
            </div>
          </div>
        </div>
      </Card>

      {/* Hotel Settings Form */}
      <Card className="p-6 bg-white shadow-xs">
        {success && (
          <div className="mb-5 p-3.5 bg-success/10 border border-success/30 rounded-xl text-xs text-success font-semibold flex items-center gap-2">
            <CheckCircle2 size={16} /> Hotel details saved successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">
                Hotel Property Name *
              </label>
              <Input
                type="text"
                value={hotel?.name || ''}
                onChange={(e) => setHotel({ ...hotel, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">
                Hotel Code (Immutable)
              </label>
              <Input
                type="text"
                value={hotel?.hotelCode || ''}
                disabled
                className="bg-secondary-bg/50 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">
                Primary Contact Email *
              </label>
              <Input
                type="email"
                value={hotel?.contactEmail || ''}
                onChange={(e) => setHotel({ ...hotel, contactEmail: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">
                Concierge / Reception Phone
              </label>
              <Input
                type="tel"
                value={hotel?.contactPhone || ''}
                onChange={(e) => setHotel({ ...hotel, contactPhone: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-3 border-t border-border">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">Physical Address</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-text-muted mb-1">Street Address</label>
                <Input
                  type="text"
                  value={hotel?.address?.street || ''}
                  onChange={(e) => setHotel({ ...hotel, address: { ...hotel.address, street: e.target.value } })}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-text-muted mb-1">City</label>
                  <Input
                    type="text"
                    value={hotel?.address?.city || ''}
                    onChange={(e) => setHotel({ ...hotel, address: { ...hotel.address, city: e.target.value } })}
                  />
                </div>
                <div>
                  <label className="block text-xs text-text-muted mb-1">State</label>
                  <Input
                    type="text"
                    value={hotel?.address?.state || ''}
                    onChange={(e) => setHotel({ ...hotel, address: { ...hotel.address, state: e.target.value } })}
                  />
                </div>
                <div>
                  <label className="block text-xs text-text-muted mb-1">Postal Code</label>
                  <Input
                    type="text"
                    value={hotel?.address?.postalCode || ''}
                    onChange={(e) => setHotel({ ...hotel, address: { ...hotel.address, postalCode: e.target.value } })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={saving}
              className="bg-primary text-accent hover:bg-primary-hover font-bold text-xs uppercase tracking-wider py-2.5 px-6 gap-2"
            >
              <Save size={16} /> {saving ? 'Saving...' : 'Save Hotel Changes'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

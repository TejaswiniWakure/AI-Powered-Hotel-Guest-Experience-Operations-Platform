import React, { useState, useEffect } from 'react';
import { Heart, Globe, Moon, Clock, User, BedDouble } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { api } from '../../services/api';

export default function ManagerPreferences() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/manager/guest-preferences')
      .then(data => {
        if (Array.isArray(data)) setGuests(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary font-serif">Guest Personalization & Preferences</h1>
        <p className="text-text-muted text-sm mt-1">Non-sensitive service preferences to elevate guest delight and operational personalization.</p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-text-muted bg-white rounded-xl border border-border">
          Loading guest preference profiles...
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {guests.map(guest => {
            const p = guest.preferences || {};
            return (
              <Card key={guest._id} className="p-5 bg-white hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/20 text-primary font-bold flex items-center justify-center text-sm">
                      {guest.name?.[0] || 'G'}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-primary">{guest.name}</h3>
                      <p className="text-xs text-accent font-semibold">Room {guest.roomNumber || '312'}</p>
                    </div>
                  </div>
                  <Heart size={16} className="text-accent" />
                </div>

                <div className="space-y-2.5 text-xs py-3 border-y border-border my-2">
                  <div className="flex justify-between">
                    <span className="text-text-muted flex items-center gap-1.5"><Globe size={13} /> Language:</span>
                    <span className="font-semibold text-primary">{p.language || 'English'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted flex items-center gap-1.5"><Moon size={13} /> Pillow Selection:</span>
                    <span className="font-semibold text-primary">{p.pillowType || 'Soft Feather'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted flex items-center gap-1.5"><Clock size={13} /> Housekeeping:</span>
                    <span className="font-semibold text-primary">{p.housekeepingTime || 'Morning (10:00 AM)'}</span>
                  </div>
                </div>

                <div className="mt-2">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Frequently Requested:</span>
                  <div className="flex flex-wrap gap-1">
                    {(p.frequentlyRequested || ['Drinking Water', 'Extra Towels']).map((item, idx) => (
                      <span key={idx} className="text-[11px] font-medium px-2 py-0.5 rounded bg-secondary-bg text-primary border border-border">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

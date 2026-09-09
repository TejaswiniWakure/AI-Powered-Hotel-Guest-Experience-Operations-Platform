import React from 'react';
import { Card } from '../../components/ui/Card';
import { Heart, Sparkles } from 'lucide-react';

export default function ManagerPreferences() {
  return (
    <div>
      <div className="mb-8 flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg"><Heart className="text-primary" size={24} /></div>
        <div>
          <h1 className="text-3xl font-bold text-primary">Guest Preferences</h1>
          <p className="text-text-muted mt-1">Aggregated service preferences across all guests.</p>
        </div>
      </div>

      <Card className="p-16 flex flex-col items-center justify-center text-center border-dashed bg-secondary-bg/30">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-border">
          <Sparkles size={40} className="text-accent" />
        </div>
        <h2 className="text-2xl font-bold text-primary mb-3">No Preference Data Yet</h2>
        <p className="text-text-muted max-w-lg mx-auto">
          As guests interact with StayFlow — submitting requests, chatting with the Concierge, and setting up their profiles — their hotel-service preferences will be aggregated here to help you deliver a more personalised experience.
        </p>
      </Card>
    </div>
  );
}

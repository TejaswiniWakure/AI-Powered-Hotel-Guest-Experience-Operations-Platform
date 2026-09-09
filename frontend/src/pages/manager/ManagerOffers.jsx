import React from 'react';
import { Card } from '../../components/ui/Card';
import { Gift, Sparkles } from 'lucide-react';

export default function ManagerOffers() {
  return (
    <div>
      <div className="mb-8 flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg"><Gift className="text-primary" size={24} /></div>
        <div>
          <h1 className="text-3xl font-bold text-primary">Offers & Recommendations</h1>
          <p className="text-text-muted mt-1">Personalised offers suggested for your guests.</p>
        </div>
      </div>

      <Card className="p-16 flex flex-col items-center justify-center text-center border-dashed bg-secondary-bg/30">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-border">
          <Sparkles size={40} className="text-accent" />
        </div>
        <h2 className="text-2xl font-bold text-primary mb-3">No Offers Generated Yet</h2>
        <p className="text-text-muted max-w-lg mx-auto">
          Once StayFlow has enough data on guest behaviour and preferences, it will automatically generate personalised upsell and service offers here — such as late checkout, room upgrades, and dining recommendations.
        </p>
      </Card>
    </div>
  );
}

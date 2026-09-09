import React from 'react';
import { Card } from '../../components/ui/Card';
import { TrendingUp, Sparkles } from 'lucide-react';

export default function ManagerTrends() {
  return (
    <div>
      <div className="mb-8 flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg"><TrendingUp className="text-primary" size={24} /></div>
        <div>
          <h1 className="text-3xl font-bold text-primary">Issue Trends</h1>
          <p className="text-text-muted mt-1">StayFlow AI automatically identifies recurring operational patterns.</p>
        </div>
      </div>

      <Card className="p-16 flex flex-col items-center justify-center text-center bg-secondary-bg/30 border-dashed border-2">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-border">
          <Sparkles size={40} className="text-accent" />
        </div>
        <h2 className="text-2xl font-bold text-primary mb-3">No Trends Detected Yet</h2>
        <p className="text-text-muted max-w-lg mx-auto">
          As guests make requests and staff complete tasks, StayFlow AI will analyze the data to identify recurring issues, service spikes, and operational bottlenecks.
        </p>
      </Card>
    </div>
  );
}

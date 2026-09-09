import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ShieldCheck, Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function ManagerSafety() {
  const checks = [];

  return (
    <div>
      <div className="mb-8 flex justify-between items-end">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg"><ShieldCheck className="text-primary" size={24} /></div>
          <div>
            <h1 className="text-3xl font-bold text-primary">Safety & Compliance</h1>
            <p className="text-text-muted mt-1">Track safety checks and compliance status.</p>
          </div>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={16} /> Add Check
        </Button>
      </div>

      {checks.length === 0 ? (
        <Card className="p-16 flex flex-col items-center justify-center text-center border-dashed bg-secondary-bg/30">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-border">
            <ShieldCheck size={40} className="text-success" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-3">No Safety Checks Configured</h2>
          <p className="text-text-muted max-w-lg mx-auto">
            Safety checklists are configured by the Administrator. Once set up, daily compliance checks (fire exits, pool inspection, kitchen safety, etc.) will appear here.
          </p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {checks.map((check, i) => (
            <Card key={i} className={`p-5 border-l-4 ${check.status === 'Complete' ? 'border-l-success' : 'border-l-critical'}`}>
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-primary">{check.name}</h3>
                <Badge variant={check.status === 'Complete' ? 'success' : 'danger'}>{check.status}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

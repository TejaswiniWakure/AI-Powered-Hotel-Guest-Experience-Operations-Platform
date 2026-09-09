import React from 'react';
import { Card } from '../../components/ui/Card';
import { Activity, Users, CheckSquare } from 'lucide-react';

export default function ManagerOperations() {
  return (
    <div>
      <div className="mb-8 flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg"><Activity className="text-primary" size={24} /></div>
        <div>
          <h1 className="text-3xl font-bold text-primary">Live Operations</h1>
          <p className="text-text-muted mt-1">Real-time view of hotel activity.</p>
        </div>
        <div className="ml-auto flex items-center gap-2 text-success text-sm font-medium">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          Live
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'New Requests', value: '0', color: 'text-info' },
          { label: 'In Progress', value: '0', color: 'text-medium' },
          { label: 'Escalated', value: '0', color: 'text-critical' },
          { label: 'Completed Today', value: '0', color: 'text-success' },
        ].map((stat, i) => (
          <Card key={i} className="p-5 text-center">
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-sm text-text-muted font-medium mt-1">{stat.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-bold text-primary mb-4">Request Feed</h2>
          <Card className="p-10 text-center border-dashed bg-secondary-bg/30 h-80 flex flex-col items-center justify-center">
            <Activity size={40} className="text-text-muted opacity-30 mb-4" />
            <h3 className="font-bold text-primary mb-2">No active requests</h3>
            <p className="text-sm text-text-muted">Incoming guest requests will appear here in real time.</p>
          </Card>
        </div>
        <div>
          <h2 className="text-xl font-bold text-primary mb-4">Active Staff</h2>
          <Card className="p-10 text-center border-dashed bg-secondary-bg/30 h-80 flex flex-col items-center justify-center">
            <Users size={40} className="text-text-muted opacity-30 mb-4" />
            <h3 className="font-bold text-primary mb-2">No active staff</h3>
            <p className="text-sm text-text-muted">Staff currently handling tasks will appear here.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}

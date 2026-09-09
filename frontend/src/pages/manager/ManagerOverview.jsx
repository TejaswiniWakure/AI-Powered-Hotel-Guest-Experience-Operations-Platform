import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { CheckSquare, AlertTriangle, TrendingUp, Users, Star, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ManagerOverview() {
  const kpis = [
    { label: "Total Requests", value: "0", trend: "-", up: true, icon: <CheckSquare size={20} className="text-primary" />, color: "bg-primary/10" },
    { label: "Open Requests", value: "0", trend: "-", up: false, icon: <AlertTriangle size={20} className="text-medium" />, color: "bg-medium/10" },
    { label: "SLA Compliance", value: "100%", trend: "-", up: true, icon: <TrendingUp size={20} className="text-success" />, color: "bg-success/10" },
    { label: "Guest Rating", value: "-", trend: "-", up: true, icon: <Star size={20} className="text-accent" />, color: "bg-accent/20" },
  ];

  return (
    <div>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-primary">Hotel Overview</h1>
          <p className="text-text-muted mt-1">Today's operational metrics.</p>
        </div>
        <div className="text-sm font-medium text-text-muted">
          Updated just now
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {kpis.map((kpi, i) => (
          <Card key={i} className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg ${kpi.color}`}>
                {kpi.icon}
              </div>
              <div className="flex items-center text-xs font-semibold text-text-muted">
                {kpi.trend}
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">{kpi.value}</p>
              <p className="text-sm text-text-muted font-medium mt-1">{kpi.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Priority Alerts */}
        <div className="lg:col-span-1 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-primary mb-4">Priority Alerts</h2>
            <Card className="p-6 text-center border-dashed bg-secondary-bg/50">
              <Info size={32} className="mx-auto text-text-muted mb-3 opacity-50" />
              <p className="text-sm text-text-muted">No active alerts. Everything is running smoothly.</p>
            </Card>
          </div>
        </div>

        {/* Live Operations Snapshot */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-primary">Live Operations</h2>
          </div>
          <Card className="overflow-hidden p-8 text-center bg-secondary-bg/30 border-dashed">
            <CheckSquare size={48} className="mx-auto text-text-muted mb-4 opacity-50" />
            <h3 className="text-lg font-bold text-primary mb-2">No active operations</h3>
            <p className="text-text-muted">There are currently no active guest requests or tasks.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}

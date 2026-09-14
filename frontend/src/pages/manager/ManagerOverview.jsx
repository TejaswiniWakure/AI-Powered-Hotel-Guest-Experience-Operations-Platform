import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckSquare, AlertTriangle, TrendingUp, Star, 
  Clock, Activity, ArrowRight, Sparkles, ShieldCheck, Zap 
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';
import SLAIndicator from '../../components/shared/SLAIndicator';
import PriorityBadge from '../../components/shared/PriorityBadge';
import StatusBadge from '../../components/shared/StatusBadge';

export default function ManagerOverview() {
  const [dashboard, setDashboard] = useState(null);
  const [operations, setOperations] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    Promise.all([
      api.get('/manager/dashboard'),
      api.get('/manager/operations')
    ])
      .then(([dash, ops]) => {
        setDashboard(dash);
        setOperations(ops);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 8000);
    return () => clearInterval(interval);
  }, []);

  const kpis = dashboard?.kpis || {
    totalRequests: 0,
    openRequests: 0,
    slaCompliance: '0%',
    avgResolution: '0 min',
    guestRating: 0
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-bold text-accent uppercase tracking-wider">Real-Time Operational Feed</span>
          </div>
          <h1 className="text-3xl font-bold text-primary font-serif">Hotel Operations Command Center</h1>
          <p className="text-text-muted text-sm mt-0.5">End-to-end operational visibility, SLA risk monitoring, and guest satisfaction.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/manager/trends">
            <Button variant="outline" size="sm" className="bg-white gap-1.5 text-xs font-bold">
              <Sparkles size={14} className="text-accent" /> Issue Trends ({dashboard?.activeTrendsCount || 1})
            </Button>
          </Link>
          <Link to="/manager/operations">
            <Button size="sm" className="bg-primary text-accent hover:bg-primary-hover text-xs font-bold gap-1.5">
              Live Operations <ArrowRight size={14} />
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card className="p-5 bg-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Total Requests</span>
            <CheckSquare size={16} className="text-primary" />
          </div>
          <p className="text-3xl font-bold text-primary">{kpis.totalRequests}</p>
          <p className="text-[11px] text-text-muted mt-1">Logged across property</p>
        </Card>

        <Card className="p-5 bg-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-high uppercase tracking-wider">Open Requests</span>
            <Activity size={16} className="text-high" />
          </div>
          <p className="text-3xl font-bold text-high">{kpis.openRequests}</p>
          <p className="text-[11px] text-text-muted mt-1">Active staff workflow</p>
        </Card>

        <Card className="p-5 bg-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-success uppercase tracking-wider">SLA Compliance</span>
            <Clock size={16} className="text-success" />
          </div>
          <p className="text-3xl font-bold text-success">{kpis.slaCompliance}</p>
          <p className="text-[11px] text-text-muted mt-1">Within deadline target</p>
        </Card>

        <Card className="p-5 bg-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Avg Resolution</span>
            <TrendingUp size={16} className="text-accent" />
          </div>
          <p className="text-3xl font-bold text-primary">{kpis.avgResolution}</p>
          <p className="text-[11px] text-text-muted mt-1">Dispatch to closure</p>
        </Card>

        <Card className="p-5 bg-white col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-accent uppercase tracking-wider">Guest Rating</span>
            <Star size={16} className="text-accent fill-accent" />
          </div>
          <p className="text-3xl font-bold text-primary">{kpis.guestRating} <span className="text-xs font-normal text-text-muted">/ 5.0</span></p>
          <p className="text-[11px] text-text-muted mt-1">{dashboard?.kpis?.feedbackCount ? `${dashboard.kpis.feedbackCount} verified reviews` : 'Verified stay feedback'}</p>
        </Card>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column: Live Tasks Stream */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary flex items-center gap-2">
              <Activity size={18} className="text-accent" /> Active Work Orders & Timers
            </h2>
            <Link to="/manager/requests" className="text-xs font-semibold text-accent hover:underline">
              View All Requests Table →
            </Link>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-text-muted bg-white rounded-xl border border-border">
              Synchronizing operations...
            </div>
          ) : !operations?.activeTasks || operations.activeTasks.length === 0 ? (
            <Card className="p-8 text-center border-dashed bg-secondary-bg/30">
              <ShieldCheck size={36} className="mx-auto text-success mb-2 opacity-80" />
              <h3 className="font-bold text-sm text-primary mb-1">Zero Operational Backlog</h3>
              <p className="text-xs text-text-muted">All incoming guest service requests have been resolved.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {operations.activeTasks.map(task => (
                <Card key={task._id} className="p-4 hover:border-primary hover:shadow-md transition-all">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {task.roomNumber}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <h3 className="font-bold text-sm text-primary">{task.category}</h3>
                          <PriorityBadge priority={task.priority} />
                          <StatusBadge status={task.status} />
                        </div>
                        <p className="text-xs text-text-muted line-clamp-1">{task.description}</p>
                      </div>
                    </div>
                    <SLAIndicator slaDeadline={task.slaDeadline} slaMinutes={task.slaMinutes} status={task.status} />
                  </div>

                  <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-text-muted">
                    <span>Assigned: <strong className="text-primary">{task.assignedTo?.name || 'Smart Dispatch'}</strong> ({task.department})</span>
                    <Link to="/manager/requests" className="text-accent font-semibold hover:underline">
                      Manage →
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: SLA Alerts & Live Shift Roster */}
        <div className="lg:col-span-4 space-y-6">
          {/* Priority Alerts */}
          <Card className="p-5 bg-white">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <AlertTriangle size={15} className="text-high" /> Operational Alerts
            </h3>

            {!dashboard?.alerts || dashboard.alerts.length === 0 ? (
              <div className="p-4 rounded-xl bg-success/10 border border-success/20 text-xs text-success font-medium">
                ✓ All active tasks are tracking smoothly within SLA.
              </div>
            ) : (
              <div className="space-y-2.5">
                {dashboard.alerts.map((alert, i) => (
                  <div key={i} className="p-3 rounded-xl bg-critical/10 border border-critical/20 text-xs">
                    <p className="font-bold text-critical">{alert.title}</p>
                    <p className="text-text-muted mt-0.5 text-[11px] leading-relaxed">{alert.message}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Quick Shift Summary */}
          <Card className="p-5 bg-primary text-white border-primary shadow-sm">
            <h3 className="text-xs font-bold text-accent uppercase tracking-wider mb-2">Shift Overview</h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between pb-2 border-b border-white/10">
                <span className="text-white/70">Active On-Duty Staff:</span>
                <span className="font-bold text-white">{operations?.activeStaffCount || 3} technicians</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-white/10">
                <span className="text-white/70">Tasks at SLA Risk:</span>
                <span className="font-bold text-high">{operations?.slaRiskCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Issue Trend Clusters:</span>
                <span className="font-bold text-accent">{dashboard?.activeTrendsCount || 1} detected</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

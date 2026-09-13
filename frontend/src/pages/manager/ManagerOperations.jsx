import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, Users, Clock, AlertTriangle, 
  CheckCircle2, ArrowRight, Sparkles 
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';
import SLAIndicator from '../../components/shared/SLAIndicator';
import PriorityBadge from '../../components/shared/PriorityBadge';
import StatusBadge from '../../components/shared/StatusBadge';

export default function ManagerOperations() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOps = () => {
    api.get('/manager/operations')
      .then(res => setData(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOps();
    const interval = setInterval(fetchOps, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-serif">Live Operations Monitor</h1>
          <p className="text-text-muted text-sm mt-1">Real-time floor telemetry, active technician dispatch, and SLA risk watch.</p>
        </div>
        <Link to="/manager/requests">
          <Button size="sm" className="bg-primary text-accent hover:bg-primary-hover font-bold text-xs">
            Manage Requests Table →
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        {/* Left Column: Active Tasks Feed */}
        <div className="md:col-span-8 space-y-4">
          <h2 className="text-base font-bold text-primary flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            In-Flight Tasks ({data?.activeTasks?.length || 0})
          </h2>

          {loading ? (
            <div className="p-12 text-center text-xs text-text-muted bg-white rounded-xl border border-border">
              Connecting to live operations feed...
            </div>
          ) : !data?.activeTasks || data.activeTasks.length === 0 ? (
            <Card className="p-8 text-center border-dashed bg-secondary-bg/30">
              <CheckCircle2 size={36} className="text-success mx-auto mb-2 opacity-80" />
              <p className="text-xs text-text-muted">No pending tasks. Operational queue clear.</p>
            </Card>
          ) : (
            data.activeTasks.map(task => (
              <Card key={task._id} className="p-4 hover:border-primary transition-all">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {task.roomNumber}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-bold text-primary">{task.category}</span>
                        <PriorityBadge priority={task.priority} />
                        <StatusBadge status={task.status} />
                      </div>
                      <p className="text-xs text-text-muted leading-relaxed line-clamp-1">{task.description}</p>
                    </div>
                  </div>
                  <SLAIndicator slaDeadline={task.slaDeadline} slaMinutes={task.slaMinutes} status={task.status} />
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-text-muted">
                  <span>Assigned: <strong className="text-primary">{task.assignedTo?.name || 'Unassigned'}</strong> ({task.department})</span>
                  <Link to="/manager/requests" className="text-accent font-semibold hover:underline">
                    Reassign / Action →
                  </Link>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Right Column: Recently Closed Tasks */}
        <div className="md:col-span-4 space-y-4">
          <h2 className="text-base font-bold text-primary flex items-center gap-2">
            <CheckCircle2 size={16} className="text-success" />
            Recently Completed ({data?.recentCompleted?.length || 0})
          </h2>

          <div className="space-y-3">
            {!data?.recentCompleted || data.recentCompleted.length === 0 ? (
              <Card className="p-6 text-center text-xs text-text-muted border-dashed bg-secondary-bg/20">
                No recent closures
              </Card>
            ) : (
              data.recentCompleted.map(task => (
                <Card key={task._id} className="p-3.5 bg-white border-border text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-primary">Room {task.roomNumber} · {task.category}</span>
                    <span className="text-[10px] font-semibold text-success bg-success/15 px-2 py-0.5 rounded">
                      {task.resolutionTime || 15}m
                    </span>
                  </div>
                  <p className="text-[11px] text-text-muted line-clamp-1 mb-1.5">{task.resolutionNotes || 'Resolved satisfactorily.'}</p>
                  <div className="text-[10px] text-text-muted flex justify-between pt-1 border-t border-border/50">
                    <span>Tech: {task.assignedTo?.name || 'Staff'}</span>
                    <span>{new Date(task.completedAt || task.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckSquare, AlertTriangle, Clock, TrendingUp, 
  ChevronRight, ArrowRight, Wrench, ShieldAlert, Sparkles 
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import SLAIndicator from '../../components/shared/SLAIndicator';
import PriorityBadge from '../../components/shared/PriorityBadge';
import StatusBadge from '../../components/shared/StatusBadge';

export default function StaffOverview() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = () => {
    api.get('/staff/dashboard')
      .then(res => setData(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 10000);
    return () => clearInterval(interval);
  }, []);

  const kpis = data?.kpis || {
    myPendingCount: 0,
    highPriorityCount: 0,
    completedTodayCount: 0,
    slaRiskCount: 0
  };

  return (
    <div>
      {/* Top Banner */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-serif">Today's Work Orders</h1>
          <p className="text-text-muted text-sm mt-1">
            Welcome, <strong className="text-primary">{user?.name}</strong> · {user?.department || 'Engineering'} Specialist
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/staff/assistant">
            <Button variant="outline" size="sm" className="gap-2 bg-white">
              <Sparkles size={14} className="text-accent" /> SOP Assistant
            </Button>
          </Link>
          <Link to="/staff/tasks">
            <Button size="sm" className="bg-primary text-accent hover:bg-primary-hover gap-1.5">
              View All Tasks <ArrowRight size={14} />
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Pending Tasks</span>
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <CheckSquare size={18} />
            </div>
          </div>
          <p className="text-3xl font-bold text-primary">{kpis.myPendingCount}</p>
          <p className="text-xs text-text-muted mt-1">Assigned to your queue</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-high uppercase tracking-wider">High Priority</span>
            <div className="w-8 h-8 rounded-lg bg-high/15 text-high flex items-center justify-center">
              <AlertTriangle size={18} />
            </div>
          </div>
          <p className="text-3xl font-bold text-high">{kpis.highPriorityCount}</p>
          <p className="text-xs text-text-muted mt-1">Require immediate dispatch</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-critical uppercase tracking-wider">SLA Risk</span>
            <div className="w-8 h-8 rounded-lg bg-critical/15 text-critical flex items-center justify-center">
              <Clock size={18} />
            </div>
          </div>
          <p className="text-3xl font-bold text-critical">{kpis.slaRiskCount}</p>
          <p className="text-xs text-text-muted mt-1">Approaching or breached</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-success uppercase tracking-wider">Completed Today</span>
            <div className="w-8 h-8 rounded-lg bg-success/15 text-success flex items-center justify-center">
              <TrendingUp size={18} />
            </div>
          </div>
          <p className="text-3xl font-bold text-success">{kpis.completedTodayCount}</p>
          <p className="text-xs text-text-muted mt-1">Work orders closed</p>
        </Card>
      </div>

      {/* Urgent Tasks Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-primary">Priority Dispatch Queue</h2>
          <Link to="/staff/tasks" className="text-xs font-semibold text-accent hover:underline">
            Manage All Active Tasks →
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-text-muted bg-white rounded-xl border border-border">
            Loading urgent tasks...
          </div>
        ) : !data?.urgentTasks || data.urgentTasks.length === 0 ? (
          <Card className="p-8 text-center border-dashed bg-secondary-bg/30">
            <CheckSquare size={36} className="mx-auto text-success mb-2 opacity-80" />
            <h3 className="font-bold text-sm text-primary mb-1">Queue is Clear</h3>
            <p className="text-xs text-text-muted">No urgent tasks currently assigned to your shift.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {data.urgentTasks.map(task => (
              <Card key={task._id} className="p-5 hover:border-primary hover:shadow-md transition-all border-l-4 border-l-high">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {task.roomNumber}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-primary">{task.category}</h3>
                        <PriorityBadge priority={task.priority} />
                        <StatusBadge status={task.status} />
                      </div>
                      <p className="text-xs text-text-muted mt-0.5 line-clamp-1">{task.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <SLAIndicator slaDeadline={task.slaDeadline} slaMinutes={task.slaMinutes} status={task.status} />
                    <Link to={`/staff/tasks/${task._id}`}>
                      <Button size="sm" className="bg-primary text-accent hover:bg-primary-hover font-bold text-xs">
                        Open Work Order
                      </Button>
                    </Link>
                  </div>
                </div>

                {task.aiSummary && (
                  <div className="pt-2 border-t border-border/60 text-xs text-text-muted flex items-center gap-1.5">
                    <Sparkles size={12} className="text-accent shrink-0" />
                    <span><strong className="text-primary">AI Task Brief:</strong> {task.aiSummary}</span>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

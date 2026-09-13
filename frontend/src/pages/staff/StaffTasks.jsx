import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckSquare, Clock, Filter, Search, ChevronRight, 
  Play, CheckCircle2, AlertTriangle, ArrowUpRight 
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { api } from '../../services/api';
import SLAIndicator from '../../components/shared/SLAIndicator';
import PriorityBadge from '../../components/shared/PriorityBadge';
import StatusBadge from '../../components/shared/StatusBadge';
import EmptyState from '../../components/shared/EmptyState';

export default function StaffTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [scope, setScope] = useState('mine');

  const fetchTasks = () => {
    api.get('/staff/tasks', {
      status: statusFilter,
      priority: priorityFilter,
      scope
    })
      .then(data => {
        if (Array.isArray(data)) setTasks(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTasks();
  }, [statusFilter, priorityFilter, scope]);

  const handleQuickAction = async (taskId, action) => {
    try {
      await api.patch(`/staff/tasks/${taskId}/${action}`);
      fetchTasks();
    } catch (err) {
      alert(`Action ${action} failed: ` + err.message);
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (!search) return true;
    const term = search.toLowerCase();
    return t.roomNumber?.toLowerCase().includes(term) ||
           t.category?.toLowerCase().includes(term) ||
           t.description?.toLowerCase().includes(term);
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-serif">Task Management Workspace</h1>
          <p className="text-text-muted text-sm mt-1">Execute, update, and resolve assigned hotel work orders within SLA.</p>
        </div>

        {/* Scope Toggle */}
        <div className="flex bg-white p-1 rounded-xl border border-border shadow-xs">
          <button
            onClick={() => setScope('mine')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              scope === 'mine' ? 'bg-primary text-white' : 'text-text-muted hover:text-primary'
            }`}
          >
            My Assigned Tasks
          </button>
          <button
            onClick={() => setScope('all')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              scope === 'all' ? 'bg-primary text-white' : 'text-text-muted hover:text-primary'
            }`}
          >
            All Department Tasks
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 mb-6 bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by room, category, or keyword..."
            className="text-xs"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs p-2.5 rounded-xl border border-border bg-white text-primary focus:outline-none focus:border-primary"
          >
            <option value="all">All Statuses</option>
            <option value="assigned">Assigned</option>
            <option value="accepted">Accepted</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="escalated">Escalated</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs p-2.5 rounded-xl border border-border bg-white text-primary focus:outline-none focus:border-primary"
          >
            <option value="all">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </Card>

      {/* Tasks Table / Cards */}
      {loading ? (
        <div className="p-12 text-center text-xs text-text-muted bg-white rounded-xl border border-border">
          Loading tasks...
        </div>
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No tasks match criteria"
          description="There are no tasks matching your selected filters."
          actionLabel="Reset Filters"
          onAction={() => { setStatusFilter('all'); setPriorityFilter('all'); setSearch(''); }}
        />
      ) : (
        <div className="space-y-3.5">
          {filteredTasks.map(task => (
            <Card key={task._id} className="p-5 hover:border-primary hover:shadow-md transition-all">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-base shrink-0 shadow-xs">
                    {task.roomNumber}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-bold text-primary">{task.category}</span>
                      <PriorityBadge priority={task.priority} />
                      <StatusBadge status={task.status} />
                      <span className="text-[11px] text-text-muted">
                        Task #{task._id?.slice(-5).toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted leading-relaxed line-clamp-2">{task.description}</p>
                    
                    {task.assignmentReason && (
                      <p className="text-[11px] text-accent mt-1 font-medium">
                        ✦ {task.assignmentReason}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-border justify-between lg:justify-end">
                  <SLAIndicator slaDeadline={task.slaDeadline} slaMinutes={task.slaMinutes} status={task.status} />

                  {/* Workflow Quick Action Buttons */}
                  <div className="flex items-center gap-2">
                    {task.status === 'assigned' && (
                      <Button
                        size="sm"
                        onClick={() => handleQuickAction(task._id, 'accept')}
                        className="bg-accent text-primary hover:bg-accent-light font-bold text-xs"
                      >
                        Accept
                      </Button>
                    )}

                    {task.status === 'accepted' && (
                      <Button
                        size="sm"
                        onClick={() => handleQuickAction(task._id, 'start')}
                        className="bg-primary text-accent hover:bg-primary-hover font-bold text-xs"
                      >
                        <Play size={12} className="mr-1" /> Start Work
                      </Button>
                    )}

                    <Link to={`/staff/tasks/${task._id}`}>
                      <Button size="sm" variant="outline" className="text-xs font-bold gap-1">
                        Details <ArrowUpRight size={14} />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

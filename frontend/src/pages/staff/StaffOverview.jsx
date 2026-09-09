import React from 'react';
import { Card } from '../../components/ui/Card';
import { CheckSquare, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Link } from 'react-router-dom';

export default function StaffOverview() {
  const stats = [
    { label: "Today's Tasks", value: "0", icon: <CheckSquare size={24} className="text-primary" />, color: "bg-primary/10" },
    { label: "Pending", value: "0", icon: <Clock size={24} className="text-medium" />, color: "bg-medium/10" },
    { label: "High Priority", value: "0", icon: <AlertTriangle size={24} className="text-critical" />, color: "bg-critical/10" },
    { label: "Completed", value: "0", icon: <CheckCircle2 size={24} className="text-success" />, color: "bg-success/10" },
  ];

  const priorityTasks = [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Good Morning, Rahul</h1>
        <p className="text-text-muted mt-1">Here is your workload for today.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <Card key={i} className="p-4 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-text-muted font-medium">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-primary">Today's Priority Tasks</h2>
          <Link to="/staff/tasks" className="text-sm text-accent font-medium hover:underline">View All</Link>
        </div>
        
        {priorityTasks.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {priorityTasks.map((task) => (
              <Link key={task.id} to={`/staff/tasks/${task.id}`}>
                <Card className="p-5 border-l-4 border-l-critical hover:border-primary transition-colors cursor-pointer">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <Badge variant="danger" className="mb-2">Critical SLA</Badge>
                      <h3 className="font-bold text-primary text-lg">{task.issue}</h3>
                      <p className="text-text-muted text-sm flex items-center gap-2">
                        <span className="font-semibold text-primary">Room {task.room}</span> • {task.id}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-critical">{task.timeRemaining}</span>
                      <p className="text-xs text-text-muted font-medium">SLA Remaining</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center bg-secondary-bg/50 border-dashed">
            <CheckSquare size={48} className="mx-auto text-text-muted mb-4 opacity-50" />
            <h3 className="text-lg font-bold text-primary mb-2">No priority tasks</h3>
            <p className="text-text-muted">You're all caught up for now.</p>
          </Card>
        )}
      </div>
    </div>
  );
}

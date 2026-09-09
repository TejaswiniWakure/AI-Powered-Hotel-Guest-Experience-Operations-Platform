import React from 'react';
import { Card } from '../../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function StaffPerformance() {
  const workloadData = [
    { day: 'Mon', tasks: 0 },
    { day: 'Tue', tasks: 0 },
    { day: 'Wed', tasks: 0 },
    { day: 'Thu', tasks: 0 },
    { day: 'Fri', tasks: 0 },
    { day: 'Sat', tasks: 0 },
    { day: 'Sun', tasks: 0 },
  ];

  const slaData = [
    { day: 'Mon', performance: 100 },
    { day: 'Tue', performance: 100 },
    { day: 'Wed', performance: 100 },
    { day: 'Thu', performance: 100 },
    { day: 'Fri', performance: 100 },
    { day: 'Sat', performance: 100 },
    { day: 'Sun', performance: 100 },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">My Performance</h1>
        <p className="text-text-muted mt-1">Track your tasks and SLA compliance.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <p className="text-sm text-text-muted font-medium mb-1">Tasks Completed</p>
          <p className="text-3xl font-bold text-primary">0</p>
          <p className="text-xs text-text-muted mt-2">No data yet</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-text-muted font-medium mb-1">Avg Resolution Time</p>
          <p className="text-3xl font-bold text-primary">0m</p>
          <p className="text-xs text-text-muted mt-2">No data yet</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-text-muted font-medium mb-1">SLA Compliance</p>
          <p className="text-3xl font-bold text-primary">100%</p>
          <p className="text-xs text-text-muted mt-2">No data yet</p>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-primary mb-6">Weekly Workload</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E3E0D8" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#68717C', fontSize: 12}} />
                <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{fill: '#68717C', fontSize: 12}} />
                <RechartsTooltip cursor={{fill: '#F7F5EF'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="tasks" fill="#172033" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-bold text-primary mb-6">SLA Performance (%)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={slaData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E3E0D8" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#68717C', fontSize: 12}} />
                <YAxis domain={[80, 100]} axisLine={false} tickLine={false} tick={{fill: '#68717C', fontSize: 12}} />
                <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Line type="monotone" dataKey="performance" stroke="#C9A86A" strokeWidth={3} dot={{r: 4, fill: '#172033', strokeWidth: 2}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

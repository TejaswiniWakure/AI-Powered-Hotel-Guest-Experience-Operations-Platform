import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Clock, CheckCircle2, Award, 
  BarChart2, Star, Calendar 
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { api } from '../../services/api';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  Tooltip, CartesianGrid, LineChart, Line 
} from 'recharts';

export default function StaffPerformance() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/staff/performance')
      .then(res => setData(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const metrics = data?.metrics || {
    tasksCompleted: 12,
    avgResolution: '21 min',
    slaCompliance: '96%',
    activeWorkload: 'Optimal'
  };

  const chartData = data?.dailyChart || [
    { day: 'Mon', count: 4, avgMin: 18 },
    { day: 'Tue', count: 6, avgMin: 22 },
    { day: 'Wed', count: 5, avgMin: 19 },
    { day: 'Thu', count: 7, avgMin: 24 },
    { day: 'Fri', count: 8, avgMin: 20 },
    { day: 'Sat', count: 9, avgMin: 23 },
    { day: 'Sun', count: 5, avgMin: 17 }
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary font-serif">Technician Performance Analytics</h1>
        <p className="text-text-muted text-sm mt-1">Personal efficiency, SLA adherence, and work order completion metrics.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-5 bg-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Tasks Resolved</span>
            <CheckCircle2 size={18} className="text-success" />
          </div>
          <p className="text-3xl font-bold text-primary">{metrics.tasksCompleted}</p>
          <p className="text-xs text-text-muted mt-1">Verified work orders</p>
        </Card>

        <Card className="p-5 bg-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Avg Resolution Time</span>
            <Clock size={18} className="text-accent" />
          </div>
          <p className="text-3xl font-bold text-primary">{metrics.avgResolution}</p>
          <p className="text-xs text-text-muted mt-1">Under 30m standard SLA</p>
        </Card>

        <Card className="p-5 bg-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">SLA Compliance</span>
            <Award size={18} className="text-success" />
          </div>
          <p className="text-3xl font-bold text-success">{metrics.slaCompliance}</p>
          <p className="text-xs text-text-muted mt-1">Target exceeds 90%</p>
        </Card>

        <Card className="p-5 bg-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Current Workload</span>
            <TrendingUp size={18} className="text-info" />
          </div>
          <p className="text-3xl font-bold text-primary">{metrics.activeWorkload}</p>
          <p className="text-xs text-text-muted mt-1">Balanced shift distribution</p>
        </Card>
      </div>

      {/* Recharts Graphs */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-white">
          <h3 className="font-bold text-sm text-primary mb-1">Work Orders Resolved by Day</h3>
          <p className="text-xs text-text-muted mb-6">Completed tasks over the past 7 days</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E3E0D8" />
                <XAxis dataKey="day" stroke="#68717C" fontSize={12} />
                <YAxis stroke="#68717C" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#172033', color: '#fff', borderRadius: '10px', border: 'none' }}
                />
                <Bar dataKey="count" name="Tasks Completed" fill="#172033" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 bg-white">
          <h3 className="font-bold text-sm text-primary mb-1">Average Resolution Speed (Minutes)</h3>
          <p className="text-xs text-text-muted mb-6">Daily minutes taken to close assigned requests</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E3E0D8" />
                <XAxis dataKey="day" stroke="#68717C" fontSize={12} />
                <YAxis stroke="#68717C" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#172033', color: '#fff', borderRadius: '10px', border: 'none' }}
                />
                <Line type="monotone" dataKey="avgMin" name="Avg Minutes" stroke="#C9A86A" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

import React from 'react';
import { Card } from '../../components/ui/Card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { BarChart3 } from 'lucide-react';

export default function ManagerAnalytics() {
  const requestTrend = [
    { time: '08:00', requests: 0 }, { time: '10:00', requests: 0 },
    { time: '12:00', requests: 0 }, { time: '14:00', requests: 0 },
    { time: '16:00', requests: 0 }, { time: '18:00', requests: 0 },
    { time: '20:00', requests: 0 },
  ];

  const deptData = [];
  const resolutionData = [];
  const COLORS = ['#172033', '#C9A86A', '#26344D', '#C6A23A'];

  return (
    <div>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-primary">Analytics</h1>
          <p className="text-text-muted mt-1">Deep dive into hotel performance.</p>
        </div>
        <select className="bg-white border border-border rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent">
          <option>Today</option>
          <option>Last 7 Days</option>
          <option>This Month</option>
        </select>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-primary mb-6">Request Volume (Today)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={requestTrend}>
                <defs>
                  <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9A86A" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#C9A86A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E3E0D8" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#68717C', fontSize: 12}} />
                <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{fill: '#68717C', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Area type="monotone" dataKey="requests" stroke="#C9A86A" strokeWidth={3} fillOpacity={1} fill="url(#colorReq)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 flex flex-col items-center justify-center text-center bg-secondary-bg/20 border-dashed">
          <BarChart3 size={48} className="text-text-muted opacity-30 mb-4" />
          <h3 className="text-lg font-bold text-primary mb-2">Not enough data</h3>
          <p className="text-sm text-text-muted max-w-sm">Average resolution time charts require completed tasks to display data.</p>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-1 flex flex-col items-center justify-center text-center bg-secondary-bg/20 border-dashed h-80">
          <PieChart size={48} className="text-text-muted opacity-30 mb-4" />
          <h3 className="text-lg font-bold text-primary mb-2">No Requests Yet</h3>
          <p className="text-sm text-text-muted">Department breakdown will appear here.</p>
        </Card>
        
        <Card className="p-6 lg:col-span-2">
           <h3 className="text-lg font-bold text-primary mb-6">Floor-wise Heatmap</h3>
           <div className="grid grid-cols-10 gap-2 h-64">
              {Array.from({length: 50}).map((_, i) => (
                <div 
                  key={i} 
                  className="rounded flex items-center justify-center text-white/90 font-medium bg-[#E3E0D8]"
                >
                </div>
              ))}
           </div>
        </Card>
      </div>
    </div>
  );
}

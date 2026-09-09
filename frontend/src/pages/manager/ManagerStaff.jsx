import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Users, Search } from 'lucide-react';

export default function ManagerStaff() {
  const staff = [];

  return (
    <div>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-primary">Staff</h1>
          <p className="text-text-muted mt-1">Active staff and their current workload.</p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input type="text" placeholder="Search staff..." className="pl-9 pr-4 py-2 text-sm border border-border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </div>

      {staff.length === 0 ? (
        <Card className="p-16 flex flex-col items-center justify-center text-center border-dashed bg-secondary-bg/30">
          <Users size={56} className="text-text-muted opacity-30 mb-6" />
          <h3 className="text-xl font-bold text-primary mb-2">No staff added yet</h3>
          <p className="text-text-muted max-w-md">
            Staff members are configured by the Administrator. Once added, they will appear here with their workload and performance metrics.
          </p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-text-muted bg-secondary-bg uppercase border-b border-border">
              <tr>
                <th className="px-6 py-3 font-semibold">Name</th>
                <th className="px-6 py-3 font-semibold">Department</th>
                <th className="px-6 py-3 font-semibold">Active Tasks</th>
                <th className="px-6 py-3 font-semibold">SLA Compliance</th>
                <th className="px-6 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s, i) => (
                <tr key={i} className="border-b border-border hover:bg-secondary-bg/50">
                  <td className="px-6 py-4 font-medium text-primary">{s.name}</td>
                  <td className="px-6 py-4">{s.department}</td>
                  <td className="px-6 py-4">{s.activeTasks}</td>
                  <td className="px-6 py-4">{s.sla}%</td>
                  <td className="px-6 py-4"><Badge variant="success">{s.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

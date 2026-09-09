import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Search, Filter, InboxIcon } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function ManagerRequests() {
  const requests = [];

  return (
    <div>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-primary">All Requests</h1>
          <p className="text-text-muted mt-1">Complete history of guest requests.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input type="text" placeholder="Search requests..." className="pl-9 pr-4 py-2 text-sm border border-border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <Button variant="outline" size="icon"><Filter size={16} /></Button>
        </div>
      </div>

      {requests.length === 0 ? (
        <Card className="p-16 flex flex-col items-center justify-center text-center border-dashed bg-secondary-bg/30">
          <InboxIcon size={56} className="text-text-muted opacity-30 mb-6" />
          <h3 className="text-xl font-bold text-primary mb-2">No requests yet</h3>
          <p className="text-text-muted max-w-md">When guests submit requests, they will appear here. You can filter by date, department, priority, and status.</p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-text-muted bg-secondary-bg uppercase border-b border-border">
              <tr>
                <th className="px-6 py-3 font-semibold">Request</th>
                <th className="px-6 py-3 font-semibold">Room</th>
                <th className="px-6 py-3 font-semibold">Category</th>
                <th className="px-6 py-3 font-semibold">Priority</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Created</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, i) => (
                <tr key={i} className="border-b border-border hover:bg-secondary-bg/50">
                  <td className="px-6 py-4 font-medium text-primary">{req.issue}</td>
                  <td className="px-6 py-4">{req.room}</td>
                  <td className="px-6 py-4">{req.category}</td>
                  <td className="px-6 py-4"><Badge>{req.priority}</Badge></td>
                  <td className="px-6 py-4"><Badge variant="success">{req.status}</Badge></td>
                  <td className="px-6 py-4 text-text-muted">{req.created}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

import React from 'react';
import { Card } from '../../components/ui/Card';
import { ScrollText, Search } from 'lucide-react';

export default function AdminLogs() {
  const logs = [];

  return (
    <div>
      <div className="mb-8 flex justify-between items-end">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg"><ScrollText className="text-primary" size={24} /></div>
          <div>
            <h1 className="text-3xl font-bold text-primary">Activity Logs</h1>
            <p className="text-text-muted mt-1">Audit trail of all actions taken in StayFlow.</p>
          </div>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input type="text" placeholder="Search logs..." className="pl-9 pr-4 py-2 text-sm border border-border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </div>

      {logs.length === 0 ? (
        <Card className="p-16 flex flex-col items-center justify-center text-center border-dashed bg-secondary-bg/30">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-border">
            <ScrollText size={40} className="text-primary/40" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-3">No Activity Yet</h2>
          <p className="text-text-muted max-w-md">
            Every action taken in StayFlow — room additions, staff changes, task completions, and configuration updates — will be recorded here with a full audit trail.
          </p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-text-muted bg-secondary-bg uppercase border-b border-border">
              <tr>
                <th className="px-6 py-3 font-semibold">Timestamp</th>
                <th className="px-6 py-3 font-semibold">User</th>
                <th className="px-6 py-3 font-semibold">Action</th>
                <th className="px-6 py-3 font-semibold">Resource</th>
                <th className="px-6 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>{logs.map((log, i) => (
              <tr key={i} className="border-b border-border hover:bg-secondary-bg/50">
                <td className="px-6 py-4 text-text-muted font-mono text-xs">{log.timestamp}</td>
                <td className="px-6 py-4 font-medium text-primary">{log.user}</td>
                <td className="px-6 py-4">{log.action}</td>
                <td className="px-6 py-4 text-text-muted">{log.resource}</td>
                <td className="px-6 py-4 text-success font-medium">{log.status}</td>
              </tr>
            ))}</tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

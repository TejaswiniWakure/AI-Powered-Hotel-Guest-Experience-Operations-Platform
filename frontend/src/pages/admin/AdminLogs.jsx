import React, { useState, useEffect } from 'react';
import { History, Search, Shield, RefreshCw } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { api } from '../../services/api';

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');

  const fetchLogs = () => {
    setLoading(true);
    api.get('/admin/logs', { role: roleFilter })
      .then(data => {
        if (Array.isArray(data)) setLogs(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, [roleFilter]);

  const filteredLogs = logs.filter(l => {
    if (!search) return true;
    const term = search.toLowerCase();
    return l.userName?.toLowerCase().includes(term) ||
           l.action?.toLowerCase().includes(term) ||
           l.resource?.toLowerCase().includes(term);
  });

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-serif">System Audit & Activity Logs</h1>
          <p className="text-text-muted text-sm mt-1">Immutable security ledger recording logins, task completions, and configuration updates.</p>
        </div>

        <Button onClick={fetchLogs} variant="outline" size="sm" className="bg-white gap-1.5 text-xs font-bold">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh Ledger
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 mb-6 bg-white shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action, user, or resource..."
            className="text-xs sm:col-span-2"
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs p-2.5 rounded-xl border border-border bg-white text-primary focus:outline-none focus:border-primary"
          >
            <option value="">All Roles</option>
            <option value="admin">Administrator</option>
            <option value="manager">Manager</option>
            <option value="staff">Staff</option>
            <option value="guest">Guest</option>
          </select>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary-bg/30 text-[11px] font-bold text-text-muted uppercase tracking-wider">
                <th className="p-4">Timestamp</th>
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Action</th>
                <th className="p-4">Target Resource</th>
                <th className="p-4">Resource ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-text-muted">Loading audit entries...</td></tr>
              ) : filteredLogs.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-text-muted">No audit logs found.</td></tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log._id} className="hover:bg-secondary-bg/20 transition-colors">
                    <td className="p-4 text-text-muted font-mono">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="p-4 font-bold text-primary">{log.userName || 'System'}</td>
                    <td className="p-4">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-secondary-bg text-primary">
                        {log.role}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-semibold text-primary">{log.action}</td>
                    <td className="p-4 text-text-muted">{log.resource}</td>
                    <td className="p-4 font-mono text-text-muted text-[11px]">{log.resourceId || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

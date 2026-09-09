import React from 'react';
import { Card } from '../../components/ui/Card';
import { Shield, Check, X, Minus } from 'lucide-react';

export default function AdminPermissions() {
  const permissions = [
    { name: 'Submit Guest Requests', guest: 'own', staff: false, manager: false, admin: false },
    { name: 'View Requests', guest: 'own', staff: 'assigned', manager: 'all', admin: 'all' },
    { name: 'Manage Tasks', guest: false, staff: true, manager: true, admin: true },
    { name: 'View Analytics', guest: false, staff: 'own', manager: true, admin: true },
    { name: 'View Issue Trends', guest: false, staff: false, manager: true, admin: true },
    { name: 'Manage Staff', guest: false, staff: false, manager: 'view', admin: true },
    { name: 'Hotel Configuration', guest: false, staff: false, manager: false, admin: true },
    { name: 'Knowledge Center', guest: false, staff: 'read', manager: 'read', admin: true },
    { name: 'SLA Configuration', guest: false, staff: false, manager: false, admin: true },
    { name: 'Roles & Permissions', guest: false, staff: false, manager: false, admin: true },
  ];

  const renderCell = (val) => {
    if (val === true) return <div className="flex justify-center"><div className="w-6 h-6 rounded-full bg-success flex items-center justify-center"><Check size={12} className="text-white" /></div></div>;
    if (val === false) return <div className="flex justify-center"><div className="w-6 h-6 rounded-full bg-secondary-bg flex items-center justify-center"><X size={12} className="text-text-muted" /></div></div>;
    return <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full">{val}</span>;
  };

  return (
    <div>
      <div className="mb-8 flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg"><Shield className="text-primary" size={24} /></div>
        <div>
          <h1 className="text-3xl font-bold text-primary">Roles & Permissions</h1>
          <p className="text-text-muted mt-1">Access control matrix for all user roles.</p>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Permission</th>
                <th className="px-6 py-4 text-center font-semibold text-accent">Guest</th>
                <th className="px-6 py-4 text-center font-semibold text-accent">Staff</th>
                <th className="px-6 py-4 text-center font-semibold text-accent">Manager</th>
                <th className="px-6 py-4 text-center font-semibold text-accent">Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {permissions.map((perm, i) => (
                <tr key={i} className={`${i % 2 === 0 ? 'bg-white' : 'bg-secondary-bg/30'} hover:bg-accent/5 transition-colors`}>
                  <td className="px-6 py-4 font-medium text-primary">{perm.name}</td>
                  <td className="px-6 py-4 text-center">{renderCell(perm.guest)}</td>
                  <td className="px-6 py-4 text-center">{renderCell(perm.staff)}</td>
                  <td className="px-6 py-4 text-center">{renderCell(perm.manager)}</td>
                  <td className="px-6 py-4 text-center">{renderCell(perm.admin)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Users, Plus, Pencil, UserX } from 'lucide-react';

export default function AdminStaff() {
  const staff = [];

  return (
    <div>
      <div className="mb-8 flex justify-between items-end">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg"><Users className="text-primary" size={24} /></div>
          <div>
            <h1 className="text-3xl font-bold text-primary">Staff & Roles</h1>
            <p className="text-text-muted mt-1">Manage staff accounts, departments and permissions.</p>
          </div>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={16} /> Add Staff Member
        </Button>
      </div>

      {staff.length === 0 ? (
        <Card className="p-16 flex flex-col items-center justify-center text-center border-dashed bg-secondary-bg/30">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-border">
            <Users size={40} className="text-primary/40" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-3">No Staff Added Yet</h2>
          <p className="text-text-muted max-w-md mx-auto mb-6">
            Add staff members and assign them roles (Staff, Manager, Admin) and departments. They will receive login credentials to access their respective portals.
          </p>
          <Button className="flex items-center gap-2">
            <Plus size={16} /> Add First Staff Member
          </Button>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-text-muted bg-secondary-bg uppercase border-b border-border">
              <tr>
                <th className="px-6 py-3 font-semibold">Name</th>
                <th className="px-6 py-3 font-semibold">Email</th>
                <th className="px-6 py-3 font-semibold">Department</th>
                <th className="px-6 py-3 font-semibold">Role</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s, i) => (
                <tr key={i} className="border-b border-border hover:bg-secondary-bg/50">
                  <td className="px-6 py-4 font-medium text-primary">{s.name}</td>
                  <td className="px-6 py-4 text-text-muted">{s.email}</td>
                  <td className="px-6 py-4">{s.department}</td>
                  <td className="px-6 py-4"><Badge variant="default">{s.role}</Badge></td>
                  <td className="px-6 py-4"><Badge variant="success">{s.status}</Badge></td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-1 hover:text-primary text-text-muted"><Pencil size={16} /></button>
                      <button className="p-1 hover:text-critical text-text-muted"><UserX size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

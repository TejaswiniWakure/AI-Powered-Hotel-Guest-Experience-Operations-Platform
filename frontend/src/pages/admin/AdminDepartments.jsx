import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { GitBranch, Plus, Pencil, Trash2 } from 'lucide-react';

export default function AdminDepartments() {
  const departments = [];
  const defaultDepts = ['Maintenance', 'Housekeeping', 'Front Desk', 'Room Service', 'Security'];

  return (
    <div>
      <div className="mb-8 flex justify-between items-end">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg"><GitBranch className="text-primary" size={24} /></div>
          <div>
            <h1 className="text-3xl font-bold text-primary">Departments</h1>
            <p className="text-text-muted mt-1">Manage hotel departments. Tasks are routed to departments based on category.</p>
          </div>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={16} /> Add Department
        </Button>
      </div>

      {departments.length === 0 ? (
        <div className="space-y-6">
          <Card className="p-12 flex flex-col items-center justify-center text-center border-dashed bg-secondary-bg/30">
            <GitBranch size={48} className="text-text-muted opacity-30 mb-4" />
            <h3 className="text-xl font-bold text-primary mb-2">No Departments Configured</h3>
            <p className="text-text-muted max-w-md mb-6">
              Add your hotel's departments so that tasks can be properly routed. Typical departments include:
            </p>
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {defaultDepts.map(dept => (
                <span key={dept} className="px-3 py-1.5 bg-white border border-border rounded-lg text-sm font-medium text-primary">{dept}</span>
              ))}
            </div>
            <Button className="flex items-center gap-2">
              <Plus size={16} /> Add First Department
            </Button>
          </Card>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept, i) => (
            <Card key={i} className="p-5 group hover:border-primary transition-colors flex items-center justify-between">
              <div>
                <h3 className="font-bold text-primary">{dept.name}</h3>
                <p className="text-sm text-text-muted">{dept.staffCount} staff members</p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 hover:text-primary text-text-muted"><Pencil size={16} /></button>
                <button className="p-2 hover:text-critical text-text-muted"><Trash2 size={16} /></button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

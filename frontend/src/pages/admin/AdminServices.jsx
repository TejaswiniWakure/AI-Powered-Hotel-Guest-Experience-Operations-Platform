import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Tag, Plus, Pencil, Trash2 } from 'lucide-react';

export default function AdminServices() {
  const services = [];

  return (
    <div>
      <div className="mb-8 flex justify-between items-end">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg"><Tag className="text-primary" size={24} /></div>
          <div>
            <h1 className="text-3xl font-bold text-primary">Services</h1>
            <p className="text-text-muted mt-1">Configure what guests can request during their stay.</p>
          </div>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={16} /> Add Service
        </Button>
      </div>

      {services.length === 0 ? (
        <Card className="p-16 flex flex-col items-center justify-center text-center border-dashed bg-secondary-bg/30">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-border">
            <Tag size={40} className="text-primary/40" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-3">No Services Configured</h2>
          <p className="text-text-muted max-w-md mx-auto mb-6">
            Add services like Extra Towels, Room Cleaning, or Room Service. Each service is linked to a department and has a default SLA that staff must meet.
          </p>
          <Button className="flex items-center gap-2">
            <Plus size={16} /> Add First Service
          </Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, i) => (
            <Card key={i} className="p-5 group hover:border-primary transition-colors">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-primary">{service.name}</h3>
                <Badge variant={service.active ? 'success' : 'secondary'}>{service.active ? 'Active' : 'Inactive'}</Badge>
              </div>
              <p className="text-sm text-text-muted mb-4">{service.desc}</p>
              <div className="flex justify-between text-xs text-text-muted mb-4">
                <span>Dept: <strong className="text-primary">{service.department}</strong></span>
                <span>Default SLA: <strong className="text-primary">{service.sla}</strong></span>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="outline" size="sm" className="flex items-center gap-1"><Pencil size={12} /> Edit</Button>
                <Button variant="ghost" size="sm" className="text-critical hover:bg-critical/10 flex items-center gap-1"><Trash2 size={12} /> Delete</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

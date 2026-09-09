import React from 'react';
import { Card } from '../../components/ui/Card';
import { Settings, Building, Users, Tag, Clock, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminOverview() {
  const configs = [
    { label: "Rooms & Floors", value: "120 Rooms", desc: "4 Floors active", icon: <Building size={20} className="text-primary" />, link: "/admin/rooms" },
    { label: "Staff & Roles", value: "45 Staff", desc: "Across 5 departments", icon: <Users size={20} className="text-primary" />, link: "/admin/staff" },
    { label: "Services", value: "24 Services", desc: "Available for guests", icon: <Tag size={20} className="text-primary" />, link: "/admin/services" },
    { label: "SLA Rules", value: "4 Tiers", desc: "From 15m to 24h", icon: <Clock size={20} className="text-primary" />, link: "/admin/sla" },
    { label: "Knowledge Center", value: "12 Docs", desc: "SOPs and Policies", icon: <BookOpen size={20} className="text-primary" />, link: "/admin/knowledge" },
    { label: "System Status", value: "All Operational", desc: "API, AI, WebSockets", icon: <Settings size={20} className="text-success" />, link: "/admin/logs" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Workspace Administration</h1>
        <p className="text-text-muted mt-1">Configure your StayFlow environment.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {configs.map((config, i) => (
          <Link to={config.link} key={i}>
            <Card className="p-6 hover:border-primary transition-colors cursor-pointer group h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-secondary-bg rounded-lg group-hover:bg-primary/5 transition-colors">
                  {config.icon}
                </div>
              </div>
              <h3 className="text-lg font-bold text-primary mb-1">{config.label}</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-primary">{config.value}</span>
              </div>
              <p className="text-sm text-text-muted mt-2">{config.desc}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Settings, Building, Users, Tag, Clock, BookOpen, Shield, ScrollText, LogOut, Menu, Building2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function AdminLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const navItems = [
    { icon: <Settings size={18} />, label: 'Overview', path: '/admin' },
    { icon: <Building size={18} />, label: 'Hotel Setup', path: '/admin/hotel' },
    { icon: <Building2 size={18} />, label: 'Rooms & Floors', path: '/admin/rooms' },
    { icon: <Users size={18} />, label: 'Staff & Roles', path: '/admin/staff' },
    { icon: <Tag size={18} />, label: 'Services', path: '/admin/services' },
    { icon: <Clock size={18} />, label: 'SLA Rules', path: '/admin/sla' },
    { icon: <BookOpen size={18} />, label: 'Knowledge Center', path: '/admin/knowledge' },
    { icon: <Shield size={18} />, label: 'Permissions', path: '/admin/permissions' },
    { icon: <ScrollText size={18} />, label: 'Activity Logs', path: '/admin/logs' },
  ];

  return (
    <div className="flex h-screen bg-secondary-bg overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-primary text-white flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2 font-bold text-lg"><Settings className="text-accent" /> Admin Workspace</div>
        <button onClick={() => setMobileOpen(!mobileOpen)}><Menu /></button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 w-64 bg-primary text-white flex flex-col transition-transform z-40 overflow-y-auto custom-scrollbar shadow-xl",
        mobileOpen ? "translate-x-0 mt-16 lg:mt-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="h-16 hidden lg:flex items-center gap-2 px-6 font-bold text-xl border-b border-white/10 shrink-0">
          <Settings className="text-accent" /> Workspace Admin
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive ? "bg-accent/20 text-accent" : "text-white/70 hover:bg-white/5 hover:text-white"
                )}
              >
                {item.icon} {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 shrink-0">
          <Link to="/login" className="flex items-center gap-3 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            <LogOut size={18} /> Exit Admin
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-16 lg:pt-0">
        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, MessageSquare, BarChart2, Bell, Settings, Building2, LogOut, Menu } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function StaffLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Overview', path: '/staff' },
    { icon: <CheckSquare size={20} />, label: 'My Tasks', path: '/staff/tasks' },
    { icon: <MessageSquare size={20} />, label: 'Assistant', path: '/staff/assistant' },
    { icon: <BarChart2 size={20} />, label: 'Performance', path: '/staff/performance' },
    { icon: <Bell size={20} />, label: 'Notifications', path: '/staff/notifications' },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile Header & Menu Button */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-primary text-white flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2 font-bold text-lg"><Building2 className="text-accent" /> StayFlow Staff</div>
        <button onClick={() => setMobileOpen(!mobileOpen)}><Menu /></button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:static inset-y-0 left-0 w-64 bg-primary text-white flex flex-col transition-transform z-40",
        mobileOpen ? "translate-x-0 mt-16 md:mt-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="h-16 hidden md:flex items-center gap-2 px-6 font-bold text-xl border-b border-white/10">
          <Building2 className="text-accent" /> StayFlow
        </div>
        
        <div className="px-6 py-4 border-b border-white/10">
          <p className="text-sm text-white/70">Welcome back,</p>
          <p className="font-semibold text-accent">Rahul • Maintenance</p>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const isActive = location.pathname === item.path || (item.path !== '/staff' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive ? "bg-secondary text-accent border-l-4 border-accent" : "text-white/70 hover:bg-white/5 hover:text-white"
                )}
              >
                {item.icon} {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link to="/login" className="flex items-center gap-3 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            <LogOut size={20} /> Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-16 md:pt-0">
        <div className="p-6 md:p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

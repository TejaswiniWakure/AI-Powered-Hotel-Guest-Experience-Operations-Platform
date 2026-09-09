import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Activity, CheckSquare, Users, BarChart3, 
  TrendingUp, Heart, Gift, ShieldCheck, FileText, Bell, 
  Settings, Building2, LogOut, Menu 
} from 'lucide-react';
import { cn } from '../../lib/utils';

export default function ManagerLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const navGroups = [
    {
      title: 'Operations',
      items: [
        { icon: <LayoutDashboard size={18} />, label: 'Overview', path: '/manager' },
        { icon: <Activity size={18} />, label: 'Live Operations', path: '/manager/operations' },
        { icon: <CheckSquare size={18} />, label: 'Requests', path: '/manager/requests' },
        { icon: <Users size={18} />, label: 'Staff', path: '/manager/staff' },
      ]
    },
    {
      title: 'Insights',
      items: [
        { icon: <BarChart3 size={18} />, label: 'Analytics', path: '/manager/analytics' },
        { icon: <TrendingUp size={18} />, label: 'Issue Trends', path: '/manager/trends' },
        { icon: <Heart size={18} />, label: 'Guest Preferences', path: '/manager/guest-preferences' },
        { icon: <Gift size={18} />, label: 'Offers', path: '/manager/offers' },
      ]
    },
    {
      title: 'Management',
      items: [
        { icon: <ShieldCheck size={18} />, label: 'Safety & Compliance', path: '/manager/safety' },
        { icon: <FileText size={18} />, label: 'Reports', path: '/manager/reports' },
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-primary text-white flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2 font-bold text-lg"><Building2 className="text-accent" /> Manager</div>
        <button onClick={() => setMobileOpen(!mobileOpen)}><Menu /></button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 w-64 bg-primary text-white flex flex-col transition-transform z-40 overflow-y-auto custom-scrollbar",
        mobileOpen ? "translate-x-0 mt-16 lg:mt-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="h-16 hidden lg:flex items-center gap-2 px-6 font-bold text-xl border-b border-white/10 shrink-0">
          <Building2 className="text-accent" /> StayFlow
        </div>
        
        <div className="px-6 py-4 border-b border-white/10 shrink-0">
          <p className="text-sm text-white/70">Welcome back,</p>
          <p className="font-semibold text-accent">Sarah • General Manager</p>
        </div>

        <div className="flex-1 py-4 px-3 space-y-6">
          {navGroups.map((group, idx) => (
            <div key={idx}>
              <p className="px-3 text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">{group.title}</p>
              <nav className="space-y-1">
                {group.items.map(item => {
                  const isActive = location.pathname === item.path || (item.path !== '/manager' && location.pathname.startsWith(item.path));
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive ? "bg-secondary text-accent border-l-4 border-accent" : "text-white/70 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      {item.icon} {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-white/10 shrink-0">
          <Link to="/login" className="flex items-center gap-3 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            <LogOut size={18} /> Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-16 lg:pt-0">
        {/* Top bar for desktop */}
        <div className="hidden lg:flex h-16 border-b border-border bg-white items-center justify-end px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button className="p-2 text-text-muted hover:text-primary relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-critical rounded-full"></span>
            </button>
            <button className="p-2 text-text-muted hover:text-primary"><Settings size={20} /></button>
          </div>
        </div>
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

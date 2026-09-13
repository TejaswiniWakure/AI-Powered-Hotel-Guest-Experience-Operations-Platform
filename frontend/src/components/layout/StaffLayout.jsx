import React from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { 
  CheckSquare, MessageSquare, TrendingUp, Bell, 
  Settings, LogOut, Building2, Wrench, ShieldCheck, LayoutGrid
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../shared/NotificationBell';

export default function StaffLayout() {
  const { user, hotelName, hotelCode, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Overview', path: '/staff', icon: CheckSquare, end: true },
    { label: 'My Tasks', path: '/staff/tasks', icon: Wrench },
    { label: 'Staff Assistant (SOP)', path: '/staff/assistant', icon: MessageSquare },
    { label: 'Performance', path: '/staff/performance', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-primary text-white flex flex-col shrink-0 border-r border-secondary">
        <div className="p-6 border-b border-secondary flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-primary font-bold shadow-md">
              <Building2 size={22} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-white">StayFlow</span>
                <span className="text-[10px] bg-accent/20 text-accent font-bold px-1.5 py-0.5 rounded">STAFF</span>
              </div>
              <p className="text-xs text-white/50 truncate max-w-[130px]">{hotelName}</p>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className="p-4 mx-4 my-4 bg-secondary rounded-xl border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center text-sm">
              {user?.name?.[0] || 'S'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{user?.name || 'Staff Member'}</p>
              <p className="text-xs text-accent truncate">{user?.department || 'Maintenance Team'}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-2 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-secondary text-white font-semibold border-l-3 border-accent'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Icon size={18} className="text-accent shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-secondary">
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center gap-3 w-full px-3.5 py-2 rounded-xl text-sm text-white/60 hover:text-critical hover:bg-white/5 transition-colors"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-border px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-success/10 text-success flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Operational Network Live
            </span>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell role="staff" />
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-primary">{user?.name}</p>
              <p className="text-[11px] text-text-muted">{user?.email}</p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

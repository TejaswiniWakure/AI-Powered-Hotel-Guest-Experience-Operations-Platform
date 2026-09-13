import React from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { 
  BarChart3, Activity, ListOrdered, Users, TrendingUp, 
  Heart, Gift, ShieldAlert, FileText, LogOut, Building2, LayoutGrid,
  ChefHat, UtensilsCrossed, Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../shared/NotificationBell';

export default function ManagerLayout() {
  const { user, hotelName, hotelCode, logout } = useAuth();
  const navigate = useNavigate();

  const navSections = [
    {
      title: 'OPERATIONS',
      items: [
        { label: 'Overview', path: '/manager', icon: BarChart3, end: true },
        { label: 'Live Operations', path: '/manager/operations', icon: Activity },
        { label: 'Requests', path: '/manager/requests', icon: ListOrdered },
        { label: 'Food Orders', path: '/manager/food-orders', icon: ChefHat },
        { label: 'Staff Workload', path: '/manager/staff', icon: Users }
      ]
    },
    {
      title: 'IN-ROOM DINING',
      items: [
        { label: 'Menu Catalog', path: '/manager/services/menu', icon: UtensilsCrossed },
        { label: 'Kitchen & Settings', path: '/manager/services/menu/settings', icon: Settings }
      ]
    },
    {
      title: 'INTELLIGENCE',
      items: [
        { label: 'Analytics', path: '/manager/analytics', icon: BarChart3 },
        { label: 'Issue Trends', path: '/manager/trends', icon: TrendingUp }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-primary text-white flex flex-col shrink-0 border-r border-secondary">
        {/* Brand */}
        <div className="p-6 border-b border-secondary flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-primary font-bold shadow-md">
              <Building2 size={22} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-white">StayFlow</span>
                <span className="text-[10px] bg-accent/20 text-accent font-bold px-1.5 py-0.5 rounded">OPS</span>
              </div>
              <p className="text-xs text-white/50 truncate max-w-[130px]">{hotelName}</p>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {navSections.map((sec, idx) => (
            <div key={idx}>
              <p className="text-[11px] font-bold text-accent tracking-wider px-3 mb-2 uppercase">{sec.title}</p>
              <nav className="space-y-1">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.end}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
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
            </div>
          ))}
        </div>

        {/* Footer with logout */}
        <div className="p-4 border-t border-secondary bg-primary-hover/50">
          <div className="flex items-center justify-between mb-3 px-2">
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'Manager'}</p>
              <p className="text-[11px] text-white/50 truncate">Duty Operations Manager</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center gap-2.5 w-full px-3 py-1.5 rounded-lg text-xs text-white/60 hover:text-critical hover:bg-white/5 transition-colors"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-border px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/5 text-primary flex items-center gap-2 border border-border">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Live Operations Feed
            </span>
            <span className="text-xs text-text-muted hidden md:inline">
              Hotel ID: <strong className="text-primary">{hotelCode}</strong>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell role="manager" />
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-primary">{user?.name}</p>
              <p className="text-[11px] text-accent font-medium">Operations Command</p>
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

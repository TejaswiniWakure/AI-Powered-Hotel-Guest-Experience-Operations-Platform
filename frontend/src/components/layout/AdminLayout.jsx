import React from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Building2, CreditCard, LifeBuoy, LogOut, ShieldCheck, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Platform Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
    { label: 'Hotel Accounts', path: '/admin/hotels', icon: Building2 },
    { label: 'Subscriptions & Plans', path: '/admin/subscriptions', icon: CreditCard },
    { label: 'Support & Requests', path: '/admin/support', icon: LifeBuoy }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* SaaS Admin Sidebar */}
      <aside className="w-full md:w-64 bg-primary text-white flex flex-col shrink-0 border-r border-secondary">
        {/* Brand */}
        <div className="p-6 border-b border-secondary flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-primary font-bold shadow-md">
              <ShieldCheck size={22} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-white">StayFlow</span>
                <span className="text-[10px] bg-accent/20 text-accent font-bold px-1.5 py-0.5 rounded">SAAS</span>
              </div>
              <p className="text-xs text-white/50">Platform Owner Console</p>
            </div>
          </div>
        </div>

        {/* 4 Core Admin Navigation Links */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          <p className="text-[11px] font-bold text-accent tracking-wider px-3 mb-3 uppercase">
            Platform Management
          </p>
          <nav className="space-y-1.5">
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
                        ? 'bg-secondary text-white font-semibold border-l-3 border-accent shadow-xs'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Admin Footer & Logout */}
        <div className="p-4 border-t border-secondary bg-primary-hover">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-bold shrink-0">
                A
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'Platform Administrator'}</p>
                <p className="text-[10px] text-white/60 truncate">{user?.email || 'admin@stayflow.demo'}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2 text-white/60 hover:text-critical transition-colors rounded-lg hover:bg-white/5"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto min-h-screen pb-12">
        <Outlet />
      </main>
    </div>
  );
}

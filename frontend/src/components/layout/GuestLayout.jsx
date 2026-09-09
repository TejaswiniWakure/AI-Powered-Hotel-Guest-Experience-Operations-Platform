import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, MessageSquare, Bell, User, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function GuestLayout() {
  const location = useLocation();

  const navItems = [
    { icon: <Home size={24} />, label: 'Home', path: '/guest' },
    { icon: <MessageSquare size={24} />, label: 'Concierge', path: '/guest/concierge' },
    { icon: <Clock size={24} />, label: 'Requests', path: '/guest/requests' },
    { icon: <Bell size={24} />, label: 'Alerts', path: '/guest/notifications' },
    { icon: <User size={24} />, label: 'Profile', path: '/guest/profile' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background pb-16 md:pb-0">
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-border flex justify-between items-center px-6 py-3 z-50">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 transition-colors",
                isActive ? "text-primary" : "text-text-muted hover:text-primary"
              )}
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

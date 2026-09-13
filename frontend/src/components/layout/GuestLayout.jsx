import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  Home, MessageSquare, ConciergeBell, AlertTriangle, 
  ListOrdered, User, Building2, ChevronDown, LogOut, LayoutGrid
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../shared/NotificationBell';

export default function GuestLayout() {
  const { roomNumber, setGuestRoom, hotelName, hotelCode, logout } = useAuth();
  const [showRoomPicker, setShowRoomPicker] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Home', path: '/guest', icon: Home, end: true },
    { label: 'Concierge', path: '/guest/concierge', icon: MessageSquare },
    { label: 'Services', path: '/guest/services', icon: ConciergeBell },
    { label: 'Report', path: '/guest/report', icon: AlertTriangle },
    { label: 'Requests', path: '/guest/requests', icon: ListOrdered },
    { label: 'Profile', path: '/guest/profile', icon: User }
  ];

  const availableRooms = ['101', '102', '201', '204', '305', '308', '312', '401', '501'];

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20 md:pb-0">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-primary text-white border-b border-white/10 shadow-sm">
        <div className="max-w-xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent font-bold text-sm">
              <Building2 size={18} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-white">{hotelName}</span>
                <span className="text-[10px] bg-white/10 text-accent font-semibold px-1.5 py-0.2 rounded">{hotelCode}</span>
              </div>
              <button
                onClick={() => setShowRoomPicker(!showRoomPicker)}
                className="text-xs text-white/70 hover:text-accent flex items-center gap-1 mt-0.5 transition-colors"
              >
                <span>Room {roomNumber}</span>
                <ChevronDown size={12} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <NotificationBell role="guest" />
            <button
              onClick={() => { logout(); navigate('/guest-access'); }}
              title="Logout"
              className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* Room Switcher Modal / Dropdown */}
        {showRoomPicker && (
          <div className="bg-secondary p-4 border-t border-white/10 max-w-xl mx-auto animate-in slide-in-from-top-2 duration-150">
            <p className="text-xs font-semibold text-accent mb-2 uppercase tracking-wider">Select Room Number</p>
            <div className="grid grid-cols-5 gap-2">
              {availableRooms.map((rm) => (
                <button
                  key={rm}
                  onClick={() => {
                    setGuestRoom(rm);
                    setShowRoomPicker(false);
                  }}
                  className={`py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    roomNumber === rm
                      ? 'bg-accent text-primary font-bold shadow'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  Room {rm}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-xl w-full mx-auto">
        <Outlet />
      </main>

      {/* Bottom Navigation for Mobile / Guest Experience */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-border shadow-lg">
        <div className="max-w-xl mx-auto flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all ${
                    isActive
                      ? 'text-primary font-bold'
                      : 'text-text-muted hover:text-primary font-medium'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`p-1 rounded-lg ${isActive ? 'bg-accent/20 text-primary' : ''}`}>
                      <Icon size={20} className={isActive ? 'text-primary' : 'text-text-muted'} />
                    </div>
                    <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Clock, AlertTriangle, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { getSocket } from '../../services/socket';

export default function NotificationBell({ role = 'guest' }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifs = () => {
    api.get('/notifications')
      .then(data => {
        if (Array.isArray(data)) {
          setNotifications(data);
          setUnreadCount(data.filter(n => !n.read).length);
        }
      })
      .catch(() => {
        // Fallback for demo when no notifs in db
        setNotifications([]);
        setUnreadCount(0);
      });
  };

  useEffect(() => {
    fetchNotifs();
    const socket = getSocket();
    if (socket) {
      const handleNotif = (n) => {
        setNotifications(prev => [n, ...prev]);
        setUnreadCount(c => c + 1);
      };
      socket.on('notification_created', handleNotif);
      socket.on('request_created', fetchNotifs);
      socket.on('task_updated', fetchNotifs);

      return () => {
        socket.off('notification_created', handleNotif);
        socket.off('request_created', fetchNotifs);
        socket.off('task_updated', fetchNotifs);
      };
    }
  }, [role]);

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (e) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    }
  };

  const markRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(c => Math.max(0, c - 1));
    } catch (e) {}
  };

  const rolePath = role === 'admin' ? '/admin' : role === 'manager' ? '/manager' : role === 'staff' ? '/staff' : '/guest';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-text-muted hover:text-primary hover:bg-secondary-bg transition-colors"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-critical text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-card rounded-2xl shadow-xl border border-border z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-4 py-3 border-b border-border bg-secondary-bg/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-primary">Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-[10px] bg-accent/20 text-accent font-bold px-1.5 py-0.5 rounded">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-text-muted hover:text-primary flex items-center gap-1"
                >
                  <CheckCheck size={13} />
                  Mark read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto divide-y divide-border">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-text-muted text-xs">No active notifications</div>
              ) : (
                notifications.slice(0, 8).map((n) => (
                  <div
                    key={n._id || Math.random()}
                    onClick={() => n._id && markRead(n._id)}
                    className={`p-3.5 hover:bg-secondary-bg/40 transition-colors text-left cursor-pointer ${
                      !n.read ? 'bg-primary/5' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className={`text-xs ${!n.read ? 'font-bold text-primary' : 'font-medium text-text-muted'}`}>
                        {n.title}
                      </p>
                      {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1 shrink-0" />}
                    </div>
                    <p className="text-xs text-text-muted leading-relaxed">{n.message}</p>
                    {n.createdAt && (
                      <p className="text-[10px] text-text-muted/60 mt-1">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
            <div className="p-2 border-t border-border bg-secondary-bg/20 text-center">
              <Link
                to={`${rolePath}/notifications`}
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold text-accent hover:underline block py-1"
              >
                View all notifications &rarr;
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

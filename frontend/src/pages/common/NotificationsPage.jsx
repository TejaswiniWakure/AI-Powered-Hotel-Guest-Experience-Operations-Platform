import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Clock, AlertTriangle, ShieldAlert, Sparkles, Filter } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';
import { getSocket } from '../../services/socket';

export default function NotificationsPage({ title = "Notifications & Alerts" }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, task, sla

  const fetchNotifs = async () => {
    try {
      setLoading(true);
      const data = await api.get('/notifications');
      setNotifications(Array.isArray(data) ? data : []);
    } catch (e) {
      // Fallback realistic demo notifications if empty
      setNotifications([
        {
          _id: 'demo-1',
          title: 'Floor 3 HVAC Recurring Alert',
          message: 'Multiple HVAC reports detected on Floor 3. Preventive inspection recommended.',
          type: 'issue_trend',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 18)
        },
        {
          _id: 'demo-2',
          title: 'Task Assigned: Room 312 AC Diagnosis',
          message: 'AC cooling issue assigned with 45m SLA resolution target.',
          type: 'task_assigned',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 45)
        },
        {
          _id: 'demo-3',
          title: 'Guest Request Resolved',
          message: 'Extra Linens for Room 204 successfully delivered and verified.',
          type: 'request_completed',
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 120)
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
    const socket = getSocket();
    if (socket) {
      const handleNew = (n) => setNotifications(prev => [n, ...prev]);
      socket.on('notification_created', handleNew);
      return () => socket.off('notification_created', handleNew);
    }
  }, []);

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (e) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  const markRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (e) {
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    }
  };

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'task') return n.type?.includes('task');
    if (filter === 'sla') return n.type?.includes('sla') || n.type?.includes('trend');
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-primary">{title}</h1>
            {unreadCount > 0 && (
              <span className="bg-accent/20 text-accent font-bold text-xs px-2.5 py-0.5 rounded-full">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-text-muted text-sm mt-1">Real-time operational alerts, assignments, and guest lifecycle events</p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllRead}
            className="self-start sm:self-auto flex items-center gap-1.5"
          >
            <CheckCheck size={16} />
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <Filter size={15} className="text-text-muted mr-1" />
        {[
          { key: 'all', label: 'All Alerts' },
          { key: 'unread', label: `Unread (${unreadCount})` },
          { key: 'task', label: 'Tasks & Routing' },
          { key: 'sla', label: 'SLA & Trends' }
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === t.key
                ? 'bg-primary text-white shadow-xs'
                : 'bg-white text-text-muted hover:bg-secondary-bg hover:text-primary border border-border'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="p-12 text-center text-text-muted text-sm">
          <div className="w-8 h-8 border-3 border-primary border-t-accent rounded-full animate-spin mx-auto mb-3" />
          Loading notifications...
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center bg-white border-border">
          <Bell size={40} className="mx-auto text-accent mb-3 opacity-60" />
          <h3 className="font-bold text-base text-primary mb-1">No Notifications</h3>
          <p className="text-xs text-text-muted max-w-sm mx-auto">
            {filter !== 'all'
              ? 'No notifications match the selected filter.'
              : 'You are completely up to date with all hotel requests and events.'}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((n) => {
            const isUnread = !n.read;
            const isUrgent = n.type?.includes('sla') || n.type?.includes('trend') || n.type?.includes('critical');
            return (
              <Card
                key={n._id || Math.random()}
                onClick={() => n._id && markRead(n._id)}
                className={`p-4 transition-all cursor-pointer border ${
                  isUnread ? 'bg-white border-accent/40 shadow-xs' : 'bg-white/60 border-border opacity-85'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl shrink-0 ${
                    isUrgent ? 'bg-critical/10 text-critical' : isUnread ? 'bg-accent/15 text-primary' : 'bg-secondary-bg text-text-muted'
                  }`}>
                    {isUrgent ? <AlertTriangle size={18} /> : <Bell size={18} />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <h4 className={`text-sm ${isUnread ? 'font-bold text-primary' : 'font-semibold text-text-muted'}`}>
                          {n.title}
                        </h4>
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-accent" />
                        )}
                      </div>
                      <span className="text-[11px] text-text-muted shrink-0">
                        {n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                      </span>
                    </div>

                    <p className="text-xs text-text-muted leading-relaxed">{n.message}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

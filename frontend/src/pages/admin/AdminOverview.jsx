import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Building2, CreditCard, LifeBuoy, TrendingUp, AlertTriangle, 
  CheckCircle2, ArrowRight, ShieldCheck, Plus, RefreshCw, Users, Clock
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';

export default function AdminOverview() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/platform/overview');
      if (res) setData(res);
    } catch (err) {
      console.error('Failed to load platform overview:', err);
    } finally {
      setLoading(false);
    }
  };

  const kpis = data?.kpis || {
    totalHotels: 24,
    activeSubscriptions: 20,
    trialsEndingSoon: 3,
    suspendedHotels: 1,
    monthlyRevenue: 48000,
    openTickets: 4
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Platform Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-serif text-primary">Platform Dashboard</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-accent/20 text-primary font-bold">
              StayFlow Global
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Global multi-tenant metrics, subscription status, and tenant operations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            onClick={fetchOverview}
            className="flex items-center gap-2 text-xs"
          >
            <RefreshCw size={14} /> Refresh
          </Button>

          <Button
            onClick={() => navigate('/admin/hotels')}
            className="bg-primary text-accent hover:bg-primary-hover flex items-center gap-2 text-xs font-bold shadow-xs"
          >
            <Plus size={15} /> Add Hotel Account
          </Button>
        </div>
      </div>

      {/* 6 Core SaaS KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Hotels */}
        <Card className="p-5 border-border shadow-xs hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Total Hotels</span>
            <Building2 size={20} className="text-primary" />
          </div>
          <div className="text-3xl font-bold font-serif text-primary mt-2">{kpis.totalHotels}</div>
          <Link to="/admin/hotels" className="text-[11px] text-accent font-bold hover:underline mt-2 inline-flex items-center gap-1">
            View all hotel accounts <ArrowRight size={11} />
          </Link>
        </Card>

        {/* Active Subscriptions */}
        <Card className="p-5 border-border shadow-xs bg-emerald-50/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">Active Subscriptions</span>
            <CheckCircle2 size={20} className="text-emerald-600" />
          </div>
          <div className="text-3xl font-bold font-serif text-emerald-900 mt-2">{kpis.activeSubscriptions}</div>
          <Link to="/admin/subscriptions" className="text-[11px] text-emerald-700 font-bold hover:underline mt-2 inline-flex items-center gap-1">
            Manage plans & renewal <ArrowRight size={11} />
          </Link>
        </Card>

        {/* Trials Ending Soon */}
        <Card className="p-5 border-border shadow-xs bg-amber-50/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900">Trials Ending Soon</span>
            <Clock size={20} className="text-amber-600" />
          </div>
          <div className="text-3xl font-bold font-serif text-amber-900 mt-2">{kpis.trialsEndingSoon}</div>
          <Link to="/admin/hotels" className="text-[11px] text-amber-800 font-bold hover:underline mt-2 inline-flex items-center gap-1">
            Extend or convert trials <ArrowRight size={11} />
          </Link>
        </Card>

        {/* Suspended Hotels */}
        <Card className="p-5 border-border shadow-xs bg-red-50/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-red-900">Suspended Hotels</span>
            <AlertTriangle size={20} className="text-red-600" />
          </div>
          <div className="text-3xl font-bold font-serif text-red-900 mt-2">{kpis.suspendedHotels}</div>
          <span className="text-[11px] text-red-700 font-medium mt-2 block">Accounts requiring intervention</span>
        </Card>

        {/* Monthly Revenue */}
        <Card className="p-5 border-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">This Month Revenue</span>
            <CreditCard size={20} className="text-primary" />
          </div>
          <div className="text-3xl font-bold font-serif text-primary mt-2">₹{kpis.monthlyRevenue?.toLocaleString()}</div>
          <span className="text-[11px] text-emerald-600 font-medium mt-2 block">+14% vs previous month</span>
        </Card>

        {/* Open Support Tickets */}
        <Card className="p-5 border-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Open Support Tickets</span>
            <LifeBuoy size={20} className="text-primary" />
          </div>
          <div className="text-3xl font-bold font-serif text-primary mt-2">{kpis.openTickets}</div>
          <Link to="/admin/support" className="text-[11px] text-accent font-bold hover:underline mt-2 inline-flex items-center gap-1">
            Reply to managers <ArrowRight size={11} />
          </Link>
        </Card>
      </div>

      {/* Two Column Layout: Recent Hotels & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Hotels Table */}
        <Card className="lg:col-span-2 p-5 border-border shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-primary uppercase tracking-wider">Recently Onboarded Hotels</h2>
            <Link to="/admin/hotels" className="text-xs text-accent font-bold hover:underline flex items-center gap-1">
              View All <ArrowRight size={13} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] font-bold text-text-muted uppercase border-b border-border">
                <tr>
                  <th className="pb-2">Hotel</th>
                  <th className="pb-2">Code</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Plan</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(data?.recentHotels || []).slice(0, 5).map(h => (
                  <tr key={h._id} className="hover:bg-secondary-bg/30">
                    <td className="py-3 font-semibold text-primary">{h.name}</td>
                    <td className="py-3 text-text-muted font-mono">{h.hotelCode}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        h.status === 'active' ? 'bg-emerald-100 text-emerald-800' : h.status === 'trial' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {h.status}
                      </span>
                    </td>
                    <td className="py-3 capitalize text-text-muted">{h.subscription?.plan || 'Professional'}</td>
                    <td className="py-3 text-right">
                      <Link to="/admin/hotels" className="text-accent font-bold hover:underline">
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Recent Activity Log */}
        <Card className="p-5 border-border shadow-xs space-y-4">
          <h2 className="text-xs font-bold text-primary uppercase tracking-wider">Platform Activity</h2>
          <div className="space-y-3.5 text-xs">
            {(data?.recentActivity || []).map(act => (
              <div key={act.id} className="flex items-start gap-2.5 pb-3 border-b border-border/60 last:border-0 last:pb-0">
                <div className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0"></div>
                <div>
                  <span className="font-bold text-primary block">{act.title}</span>
                  <p className="text-[11px] text-text-muted mt-0.5">{act.desc}</p>
                  <span className="text-[10px] text-text-muted/60 mt-1 block">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

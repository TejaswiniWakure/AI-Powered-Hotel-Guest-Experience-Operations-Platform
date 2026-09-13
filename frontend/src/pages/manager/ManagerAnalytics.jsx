import React, { useState, useEffect } from 'react';
import { 
  Smile, Clock, RotateCcw, Activity, Info, RefreshCw, BarChart2
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function ManagerAnalytics() {
  const { hotelName } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('7d');

  const fetchAnalytics = () => {
    setLoading(true);
    api.get(`/manager/analytics?range=${range}`)
      .then(res => setData(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAnalytics();
  }, [range]);

  const maxActivity = data?.requestActivity ? Math.max(...data.requestActivity.map(d => d.value), 1) : 1;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-serif">Operational Analytics</h1>
          <p className="text-text-muted text-sm mt-1">Simple insights from your hotel's guest requests and operations.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={range} 
            onChange={(e) => setRange(e.target.value)}
            className="text-xs font-bold bg-white border border-border rounded-lg px-3 py-2 text-primary focus:outline-none"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="month">This Month</option>
          </select>
          <button 
            onClick={fetchAnalytics}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-border text-text-muted hover:text-primary transition-colors"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {loading && !data ? (
        <div className="p-12 text-center text-xs text-text-muted bg-white rounded-xl border border-border">
          Loading analytics...
        </div>
      ) : (
        <>
          {/* 4 Key Analytics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-5 bg-white flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Happy Guest %</span>
                <Smile size={16} className="text-success" />
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">
                  {data?.happyGuestPercentage !== null ? `${data.happyGuestPercentage}%` : 'N/A'}
                </p>
                <p className="text-[10px] text-text-muted mt-1 leading-tight">
                  {data?.happyGuestPercentage !== null 
                    ? "Guests who rated 4 or 5 stars." 
                    : "No guest feedback yet."}
                </p>
              </div>
            </Card>

            <Card className="p-5 bg-white flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">On-Time Completion</span>
                <Clock size={16} className="text-accent" />
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">
                  {data?.onTimeCompletionRate !== null ? `${data.onTimeCompletionRate}%` : 'N/A'}
                </p>
                <p className="text-[10px] text-text-muted mt-1 leading-tight">
                  {data?.onTimeCompletionRate !== null 
                    ? "Tasks completed before SLA deadline." 
                    : "No completed tasks yet."}
                </p>
              </div>
            </Card>

            <Card className="p-5 bg-white flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Repeat Problems</span>
                <RotateCcw size={16} className="text-high" />
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">
                  {data?.repeatProblemRate !== null ? `${data.repeatProblemRate}%` : 'N/A'}
                </p>
                <p className="text-[10px] text-text-muted mt-1 leading-tight">
                  {data?.repeatProblemRate !== null 
                    ? `${data.repeatCount} repeat issues reported.` 
                    : "No repeat problems detected."}
                </p>
              </div>
            </Card>

            <Card className="p-5 bg-white flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Busiest Hour</span>
                <Activity size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold text-primary truncate">
                  {data?.busiestHour || 'N/A'}
                </p>
                <p className="text-[10px] text-text-muted mt-1 leading-tight">
                  {data?.busiestHour 
                    ? `${data.busiestCount} requests received.` 
                    : "No request activity yet."}
                </p>
              </div>
            </Card>
          </div>

          {/* Main Graph */}
          <Card className="p-6 bg-white mb-4">
            <div className="mb-6">
              <h2 className="text-sm font-bold text-primary">Request Activity</h2>
              <p className="text-xs text-text-muted mt-0.5">Guest requests received over the selected period.</p>
            </div>
            
            {(!data?.requestActivity || data.requestActivity.length === 0 || !data.hasData) ? (
              <div className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl">
                <BarChart2 size={24} className="text-text-muted mb-2 opacity-50" />
                <p className="text-sm font-bold text-primary">No request activity yet</p>
                <p className="text-xs text-text-muted">Request trends will appear here when guests start submitting requests.</p>
              </div>
            ) : (
              <div className="h-56 flex items-end justify-between gap-2 pt-6">
                {data.requestActivity.map((day, i) => (
                  <div key={i} className="flex flex-col items-center flex-1 group">
                    <div className="relative w-full flex justify-center flex-1 items-end">
                      <div 
                        className="w-full max-w-[40px] bg-primary/10 rounded-t-sm group-hover:bg-primary transition-all relative"
                        style={{ height: `${(day.value / maxActivity) * 100}%`, minHeight: day.value > 0 ? '4px' : '0' }}
                      >
                        {day.value > 0 && (
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                            {day.value}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] text-text-muted font-medium mt-2 truncate w-full text-center">
                      {day.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Operational Insight */}
          <Card className="p-4 bg-secondary-bg/50 border-border">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/20 text-accent flex items-center justify-center shrink-0">
                <Info size={16} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-primary mb-0.5">Operational Insight</h3>
                <p className="text-xs text-text-muted">
                  {data?.operationalInsight || "No operational insights available yet."}
                </p>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

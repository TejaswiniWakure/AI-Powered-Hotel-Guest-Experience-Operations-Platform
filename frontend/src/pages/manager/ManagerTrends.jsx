import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, AlertTriangle, CheckCircle2, 
  Wrench, XCircle, Sparkles, Clock, Building2 
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';
import PriorityBadge from '../../components/shared/PriorityBadge';

export default function ManagerTrends() {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState(null);

  const fetchTrends = () => {
    api.get('/manager/trends')
      .then(data => {
        if (Array.isArray(data)) setTrends(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTrends();
  }, []);

  const handleTakeAction = async (trendId) => {
    setActingId(trendId);
    try {
      await api.post(`/manager/trends/${trendId}/action`);
      fetchTrends();
    } catch (err) {
      alert('Action failed: ' + err.message);
    } finally {
      setActingId(null);
    }
  };

  const handleDismiss = async (trendId) => {
    try {
      await api.patch(`/manager/trends/${trendId}/dismiss`);
      fetchTrends();
    } catch (err) {
      alert('Dismiss failed: ' + err.message);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1 text-accent font-bold text-xs uppercase tracking-wider">
          <Sparkles size={14} /> Pattern Intelligence
        </div>
        <h1 className="text-3xl font-bold text-primary font-serif">Issue Trend Detection</h1>
        <p className="text-text-muted text-sm mt-0.5">
          Deterministic clustering algorithms identifying recurring equipment and floor anomalies before guest escalations.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-text-muted bg-white rounded-xl border border-border">
          Scanning floor request clusters...
        </div>
      ) : trends.length === 0 ? (
        <Card className="p-12 text-center border-dashed bg-secondary-bg/20">
          <CheckCircle2 size={40} className="text-success mx-auto mb-2 opacity-80" />
          <h3 className="font-bold text-base text-primary mb-1">No Recurring Anomalies Detected</h3>
          <p className="text-xs text-text-muted max-w-md mx-auto">
            Operational requests across all floors are normal and distributed without localized hardware clustering.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {trends.map(trend => (
            <Card key={trend._id} className="p-6 bg-white hover:shadow-md transition-all border-l-4 border-l-accent">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-primary text-white">
                      Floor {trend.floor}
                    </span>
                    <h3 className="text-base font-bold text-primary">{trend.category} Pattern Detected</h3>
                    <PriorityBadge priority={trend.severity} />
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      trend.status === 'resolved' ? 'bg-success/15 text-success' :
                      trend.status === 'dismissed' ? 'bg-secondary-bg text-text-muted' :
                      'bg-high/15 text-high'
                    }`}>
                      {trend.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-primary mt-2">
                    Insight: <span className="text-text-muted font-normal">{trend.insight}</span>
                  </p>
                  <p className="text-xs text-accent font-semibold mt-1">
                    Recommendation: <span className="text-text-muted font-normal">{trend.recommendedAction}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {trend.status === 'active' && (
                    <>
                      <Button
                        size="sm"
                        disabled={actingId === trend._id}
                        onClick={() => handleTakeAction(trend._id)}
                        className="bg-primary text-accent hover:bg-primary-hover font-bold text-xs gap-1.5 shadow-xs"
                      >
                        <Wrench size={14} /> Schedule Preventive Inspection
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDismiss(trend._id)}
                        className="text-xs text-text-muted hover:text-primary"
                      >
                        Dismiss
                      </Button>
                    </>
                  )}

                  {trend.status === 'resolved' && (
                    <span className="text-xs font-semibold text-success bg-success/10 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                      <CheckCircle2 size={16} /> Preventive Maintenance Dispatched
                    </span>
                  )}
                </div>
              </div>

              {/* Affected Rooms Pill list */}
              <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-text-muted flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-primary">Affected Rooms:</span>
                  <div className="flex gap-1.5">
                    {trend.rooms.map(rm => (
                      <span key={rm} className="px-2 py-0.5 rounded bg-secondary-bg font-bold text-primary text-xs">
                        Room {rm}
                      </span>
                    ))}
                  </div>
                </div>
                <span>Analyzed window: {trend.timeRange} ({trend.count} total complaints)</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

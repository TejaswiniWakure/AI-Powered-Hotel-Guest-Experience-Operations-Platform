import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, CheckCircle2, Clock, AlertTriangle, 
  Check, FileCheck, MapPin, Calendar 
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';

export default function ManagerSafety() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSafety = () => {
    api.get('/manager/safety')
      .then(res => setData(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSafety();
  }, []);

  const handleCompleteCheck = async (checkId) => {
    try {
      await api.patch(`/manager/safety/${checkId}/complete`, {
        notes: 'Inspection verified and compliant with hotel safety standards.'
      });
      fetchSafety();
    } catch (err) {
      alert('Failed to update inspection: ' + err.message);
    }
  };

  const summary = data?.summary || {
    total: 0,
    completed: 0,
    dueSoon: 0,
    overdue: 0
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary font-serif">Safety & Compliance Governance</h1>
        <p className="text-text-muted text-sm mt-1">
          Statutory facility audits, life safety systems, and preventive hospitality compliance tracking.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-5 bg-white">
          <span className="text-xs font-bold text-text-muted uppercase tracking-wider block">Audits Tracked</span>
          <p className="text-3xl font-bold text-primary mt-1">{summary.total}</p>
        </Card>
        <Card className="p-5 bg-white">
          <span className="text-xs font-bold text-success uppercase tracking-wider block">Compliant / Closed</span>
          <p className="text-3xl font-bold text-success mt-1">{summary.completed}</p>
        </Card>
        <Card className="p-5 bg-white">
          <span className="text-xs font-bold text-high uppercase tracking-wider block">Due Soon</span>
          <p className="text-3xl font-bold text-high mt-1">{summary.dueSoon}</p>
        </Card>
        <Card className="p-5 bg-white">
          <span className="text-xs font-bold text-critical uppercase tracking-wider block">Overdue Action</span>
          <p className="text-3xl font-bold text-critical mt-1">{summary.overdue}</p>
        </Card>
      </div>

      {/* Overdue Alert Banner if any */}
      {summary.overdue > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-critical/10 border border-critical/30 flex items-start gap-3 text-xs text-critical">
          <AlertTriangle size={18} className="shrink-0 mt-0.5 text-critical" />
          <div>
            <strong className="font-bold text-sm block">Safety Inspection Overdue</strong>
            <span>One or more scheduled life safety checks require immediate certification by duty engineering.</span>
          </div>
        </div>
      )}

      {/* Safety Checks List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-text-muted bg-white rounded-xl border border-border">
          Loading compliance logs...
        </div>
      ) : (
        <div className="space-y-3.5">
          {(data?.checks || []).map(check => (
            <Card key={check._id} className="p-5 bg-white hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                  check.status === 'completed' ? 'bg-success/15 text-success' :
                  check.status === 'overdue' ? 'bg-critical/15 text-critical' :
                  'bg-high/15 text-high'
                }`}>
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-bold text-sm text-primary">{check.category}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      check.status === 'completed' ? 'bg-success/15 text-success' :
                      check.status === 'overdue' ? 'bg-critical/15 text-critical' :
                      'bg-high/15 text-high'
                    }`}>
                      {check.status === 'completed' ? 'COMPLETED' : check.status === 'due_soon' ? 'DUE SOON' : 'OVERDUE'}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">{check.description}</p>
                  <div className="flex items-center gap-4 text-[11px] text-text-muted mt-2">
                    <span className="flex items-center gap-1"><MapPin size={12} /> {check.location}</span>
                    <span className="flex items-center gap-1"><Calendar size={12} /> Due: {new Date(check.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="shrink-0">
                {check.status !== 'completed' ? (
                  <Button
                    size="sm"
                    onClick={() => handleCompleteCheck(check._id)}
                    className="bg-primary text-accent hover:bg-primary-hover font-bold text-xs gap-1.5"
                  >
                    <Check size={14} /> Mark Compliant
                  </Button>
                ) : (
                  <span className="text-xs font-semibold text-success flex items-center gap-1 bg-success/10 px-3 py-1.5 rounded-xl">
                    <CheckCircle2 size={15} /> Verified
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

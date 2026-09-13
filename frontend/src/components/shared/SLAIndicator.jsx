import React from 'react';
import { Clock, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

export default function SLAIndicator({ slaDeadline, slaMinutes = 60, status, compact = false }) {
  if (status === 'completed') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-success/15 text-success">
        <CheckCircle size={12} /> Resolved
      </span>
    );
  }

  if (!slaDeadline) return null;

  const now = Date.now();
  const deadline = new Date(slaDeadline).getTime();
  const diffMs = deadline - now;
  const remainingMins = Math.round(diffMs / 60000);

  if (diffMs <= 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-critical/15 text-critical border border-critical/20 animate-pulse">
        <AlertCircle size={12} /> {Math.abs(remainingMins)}m Breached
      </span>
    );
  }

  if (remainingMins <= 15 || diffMs / (slaMinutes * 60000) <= 0.25) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-high/15 text-high border border-high/20">
        <AlertTriangle size={12} /> {remainingMins}m At Risk
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
      <Clock size={12} /> {remainingMins}m left
    </span>
  );
}

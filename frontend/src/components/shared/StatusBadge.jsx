import React from 'react';

export default function StatusBadge({ status = 'new' }) {
  const s = status.toLowerCase();

  const config = {
    new: { label: 'New', bg: 'bg-info/10 text-info border-info/20' },
    assigned: { label: 'Assigned', bg: 'bg-primary/10 text-primary border-primary/20' },
    accepted: { label: 'Accepted', bg: 'bg-accent/20 text-primary border-accent/40' },
    in_progress: { label: 'In Progress', bg: 'bg-high/15 text-high border-high/30' },
    completed: { label: 'Completed', bg: 'bg-success/15 text-success border-success/30' },
    escalated: { label: 'Escalated', bg: 'bg-critical/15 text-critical border-critical/30 font-bold' }
  };

  const item = config[s] || { label: status, bg: 'bg-secondary-bg text-text-muted border-border' };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${item.bg}`}>
      {item.label}
    </span>
  );
}

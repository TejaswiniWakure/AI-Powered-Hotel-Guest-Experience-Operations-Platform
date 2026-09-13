import React from 'react';

export default function PriorityBadge({ priority = 'Medium' }) {
  const p = priority.toLowerCase();
  
  if (p === 'critical') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-critical/15 text-critical border border-critical/30">
        <span className="w-1.5 h-1.5 rounded-full bg-critical animate-ping" />
        Critical
      </span>
    );
  }
  if (p === 'high') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-high/15 text-high border border-high/30">
        High
      </span>
    );
  }
  if (p === 'low') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-bg text-text-muted border border-border">
        Low
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-medium/15 text-medium border border-medium/30">
      Medium
    </span>
  );
}

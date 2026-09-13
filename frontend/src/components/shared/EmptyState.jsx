import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <Card className="p-12 text-center border-dashed border-2 bg-secondary-bg/20 flex flex-col items-center justify-center">
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-accent mb-4">
          <Icon size={28} />
        </div>
      )}
      <h3 className="text-lg font-bold text-primary mb-1">{title}</h3>
      <p className="text-text-muted text-sm max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm">
          {actionLabel}
        </Button>
      )}
    </Card>
  );
}

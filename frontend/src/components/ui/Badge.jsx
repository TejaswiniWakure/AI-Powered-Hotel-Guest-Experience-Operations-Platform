import React from 'react';
import { cn } from '../../lib/utils';

export function Badge({ className, variant = 'default', children, ...props }) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2",
        {
          "border-transparent bg-primary text-white": variant === 'default',
          "border-transparent bg-secondary-bg text-primary": variant === 'secondary',
          "border-transparent bg-critical text-white": variant === 'danger',
          "border-transparent bg-success text-white": variant === 'success',
          "border-transparent bg-high text-white": variant === 'warning',
          "border-transparent bg-accent text-primary": variant === 'accent',
          "border-border text-text-main": variant === 'outline',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

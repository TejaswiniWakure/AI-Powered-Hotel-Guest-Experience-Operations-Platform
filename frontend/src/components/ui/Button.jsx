import React from 'react';
import { cn } from '../../lib/utils';

const Button = React.forwardRef(({ className, variant = 'primary', size = 'default', children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50 disabled:pointer-events-none",
        {
          "bg-primary text-white hover:bg-primary-hover": variant === 'primary',
          "bg-accent text-primary hover:bg-accent-light": variant === 'secondary',
          "border border-border bg-transparent hover:bg-secondary-bg text-text-main": variant === 'outline',
          "hover:bg-secondary-bg hover:text-text-main text-text-muted": variant === 'ghost',
          "bg-critical text-white hover:bg-critical/90": variant === 'danger',
          "h-10 py-2 px-4": size === 'default',
          "h-9 px-3 rounded-md": size === 'sm',
          "h-11 px-8 rounded-md": size === 'lg',
          "h-10 w-10": size === 'icon',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});
Button.displayName = "Button";

export { Button };

import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  border?: boolean;
  className?: string;
}

export default function PageHeader({ title, description, action, border = false, className }: PageHeaderProps) {
  return (
    <div className={cn(
      "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
      border && "border-b border-slate-100 pb-4",
      className
    )}>
      <div>
        <h1 className="text-xl font-bold text-brand-text sm:text-2xl">{title}</h1>
        <p className="text-xs text-slate-400 mt-1">{description}</p>
      </div>
      {action && (
        <div className="flex items-center gap-3 shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}

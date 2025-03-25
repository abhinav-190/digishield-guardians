
import React from 'react';
import { cn } from '@/lib/utils';

interface DataCardProps {
  className?: string;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  isLoading?: boolean;
}

const DataCard = ({
  className,
  title,
  icon,
  children,
  footer,
  isLoading = false
}: DataCardProps) => {
  return (
    <div 
      className={cn(
        "glass-card rounded-xl overflow-hidden transition-all duration-300 hover-glow animate-slide-up",
        isLoading && "animate-pulse opacity-70",
        className
      )}
    >
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <h3 className="font-medium text-sm">{title}</h3>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>
      <div className="p-5">{children}</div>
      {footer && (
        <div className="px-5 py-3 border-t border-white/5 bg-secondary/50">
          {footer}
        </div>
      )}
    </div>
  );
};

export default DataCard;

import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ListItemProps {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  badge?: { label: string; color?: string };
  onClick?: () => void;
  className?: string;
}

export default function ListItem({ icon: Icon, title, subtitle, badge, onClick, className }: ListItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center gap-4 px-4 py-3 border-b border-border-subtle transition-colors',
        onClick && 'cursor-pointer hover:bg-bg-card-hover',
        className
      )}
    >
      {Icon && (
        <div className="p-2 rounded-lg bg-bg-secondary">
          <Icon className="w-5 h-5 text-accent" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-text-primary truncate">{title}</div>
        {subtitle && (
          <div className="text-sm text-text-secondary truncate">{subtitle}</div>
        )}
      </div>
      {badge && (
        <span className={cn(
          'px-2 py-1 text-xs font-medium rounded-full',
          badge.color || 'bg-accent/10 text-accent'
        )}>
          {badge.label}
        </span>
      )}
    </div>
  );
}

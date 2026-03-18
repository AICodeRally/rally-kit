import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  accent?: 'primary' | 'secondary' | 'tertiary' | 'success';
}

const accentClasses = {
  primary: {
    icon: 'bg-accent/10 text-accent',
  },
  secondary: {
    icon: 'bg-secondary/10 text-secondary',
  },
  tertiary: {
    icon: 'bg-tertiary/10 text-tertiary',
  },
  success: {
    icon: 'bg-success/10 text-success',
  },
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accent = 'primary',
}: StatCardProps) {
  const styles = accentClasses[accent];

  return (
    <div
      className={cn(
        'bg-bg-card border border-border-default rounded-xl p-6',
        'shadow-card hover:shadow-card-hover transition-all duration-200'
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wide">
          {title}
        </h3>
        {Icon && (
          <div className={cn('p-2 rounded-lg', styles.icon)}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="text-3xl font-bold text-text-primary mb-1">
        {value}
      </div>

      <div className="flex items-center gap-2">
        {subtitle && (
          <span className="text-sm text-text-muted">{subtitle}</span>
        )}
        {trend && (
          <span
            className={cn(
              'text-sm font-medium',
              trend.positive ? 'text-success' : 'text-danger'
            )}
          >
            {trend.positive ? '\u2191' : '\u2193'} {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}

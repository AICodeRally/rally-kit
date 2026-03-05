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
  accent?: 'orange' | 'cyan' | 'purple' | 'green';
}

const accentStyles = {
  orange: {
    iconBg: 'bg-rally-orange/10',
    iconColor: 'text-rally-orange',
    border: 'border-rally-orange/20',
    glow: 'hover:shadow-glow-orange',
  },
  cyan: {
    iconBg: 'bg-rally-cyan/10',
    iconColor: 'text-rally-cyan',
    border: 'border-rally-cyan/20',
    glow: 'hover:shadow-glow-cyan',
  },
  purple: {
    iconBg: 'bg-rally-purple/10',
    iconColor: 'text-rally-purple',
    border: 'border-rally-purple/20',
    glow: 'hover:shadow-glow-purple',
  },
  green: {
    iconBg: 'bg-green-500/10',
    iconColor: 'text-green-400',
    border: 'border-green-500/20',
    glow: 'hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]',
  },
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accent = 'orange',
}: StatCardProps) {
  const styles = accentStyles[accent];

  return (
    <div
      className={cn(
        'bg-bg-card border border-border-default rounded-xl p-6',
        'shadow-card hover:shadow-card-hover transition-all duration-200',
        styles.glow
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wide">
          {title}
        </h3>
        {Icon && (
          <div className={cn('p-2 rounded-lg', styles.iconBg)}>
            <Icon className={cn('w-5 h-5', styles.iconColor)} />
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
              trend.positive ? 'text-green-400' : 'text-red-400'
            )}
          >
            {trend.positive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}

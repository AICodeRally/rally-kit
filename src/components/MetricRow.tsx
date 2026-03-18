import { cn } from '@/lib/utils';

interface MetricItem {
  label: string;
  value: string | number;
}

interface MetricRowProps {
  metrics: MetricItem[];
  className?: string;
}

export default function MetricRow({ metrics, className }: MetricRowProps) {
  return (
    <div className={cn(
      'flex items-center gap-6 px-6 py-4 bg-bg-card border border-border-default rounded-xl',
      className
    )}>
      {metrics.map((metric, i) => (
        <div key={i} className={cn(
          'flex-1 text-center',
          i < metrics.length - 1 && 'border-r border-border-default'
        )}>
          <div className="text-xl font-bold text-text-primary">{metric.value}</div>
          <div className="text-sm text-text-secondary">{metric.label}</div>
        </div>
      ))}
    </div>
  );
}

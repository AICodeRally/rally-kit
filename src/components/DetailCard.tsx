import { cn } from '@/lib/utils';

interface DetailField {
  label: string;
  value: string | number | React.ReactNode;
}

interface DetailCardProps {
  title?: string;
  fields: DetailField[];
  imageUrl?: string;
  className?: string;
}

export default function DetailCard({ title, fields, imageUrl, className }: DetailCardProps) {
  return (
    <div className={cn('bg-bg-card border border-border-default rounded-xl p-6', className)}>
      {imageUrl && (
        <div className="w-full h-40 rounded-lg bg-bg-secondary mb-4 overflow-hidden">
          <img src={imageUrl} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      {title && (
        <h3 className="text-lg font-semibold text-text-primary mb-4">{title}</h3>
      )}
      <dl className="space-y-3">
        {fields.map((field, i) => (
          <div key={i} className="flex justify-between items-start">
            <dt className="text-sm text-text-secondary">{field.label}</dt>
            <dd className="text-sm font-medium text-text-primary text-right">{field.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

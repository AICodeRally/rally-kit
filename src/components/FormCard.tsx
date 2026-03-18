'use client';

import { cn } from '@/lib/utils';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'select' | 'textarea';
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

interface FormCardProps {
  title?: string;
  fields: FormField[];
  submitLabel?: string;
  onSubmit?: (data: Record<string, string>) => void;
  className?: string;
}

export default function FormCard({ title, fields, submitLabel = 'Submit', onSubmit, className }: FormCardProps) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!onSubmit) return;
    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    formData.forEach((value, key) => { data[key] = String(value); });
    onSubmit(data);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('bg-bg-card border border-border-default rounded-xl p-6', className)}
    >
      {title && (
        <h3 className="text-lg font-semibold text-text-primary mb-4">{title}</h3>
      )}
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              {field.label}
              {field.required && <span className="text-danger ml-1">*</span>}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                name={field.name}
                placeholder={field.placeholder}
                required={field.required}
                rows={3}
                className="w-full px-3 py-2 bg-bg-primary border border-border-default rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              />
            ) : field.type === 'select' ? (
              <select
                name={field.name}
                required={field.required}
                className="w-full px-3 py-2 bg-bg-primary border border-border-default rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              >
                <option value="">{field.placeholder || 'Select...'}</option>
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                required={field.required}
                className="w-full px-3 py-2 bg-bg-primary border border-border-default rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              />
            )}
          </div>
        ))}
      </div>
      <button
        type="submit"
        className="mt-6 w-full py-2.5 bg-accent text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
      >
        {submitLabel}
      </button>
    </form>
  );
}

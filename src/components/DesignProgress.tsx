'use client';

const steps = [
  { num: 1, label: 'Team' },
  { num: 2, label: 'Idea' },
  { num: 3, label: 'Niche' },
  { num: 4, label: 'Users' },
  { num: 5, label: 'Features' },
  { num: 6, label: 'Name' },
  { num: 7, label: 'Layout' },
  { num: 8, label: 'Theme' },
  { num: 9, label: 'Review' },
];

interface DesignProgressProps {
  current: number;
}

export default function DesignProgress({ current }: DesignProgressProps) {
  return (
    <div className="w-full px-6 pt-4 pb-2">
      <div className="max-w-4xl mx-auto">
        {/* Bar */}
        <div className="flex items-center gap-1">
          {steps.map((step) => (
            <div key={step.num} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full h-1.5 rounded-full transition-colors"
                style={{
                  backgroundColor: step.num <= current ? '#f97316' : '#222',
                }}
              />
              <span
                className="text-[9px] font-medium uppercase tracking-wider"
                style={{ color: step.num === current ? '#f97316' : step.num < current ? '#666' : '#333' }}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Home } from 'lucide-react';

const steps = [
  { num: 1, label: 'Team', href: '/design/team' },
  { num: 2, label: 'Idea', href: '/design/idea' },
  { num: 3, label: 'Niche', href: '/design/niche' },
  { num: 4, label: 'Users', href: '/design/users' },
  { num: 5, label: 'Features', href: '/design/features' },
  { num: 6, label: 'Name', href: '/design/name' },
  { num: 7, label: 'Layout', href: '/design/layout' },
  { num: 8, label: 'Theme', href: '/design/theme' },
  { num: 9, label: 'Review', href: '/design/review' },
];

interface DesignProgressProps {
  current: number;
}

export default function DesignProgress({ current }: DesignProgressProps) {
  const prev = steps.find((s) => s.num === current - 1);
  const next = steps.find((s) => s.num === current + 1);

  return (
    <div className="w-full px-6 pt-4 pb-2">
      <div className="max-w-5xl mx-auto">
        {/* Step bar — clickable */}
        <div className="flex items-center gap-1 mb-3">
          {steps.map((step) => (
            <Link
              key={step.num}
              href={step.href}
              className="flex-1 flex flex-col items-center gap-1 group"
            >
              <div
                className="w-full h-2 rounded-full transition-colors group-hover:opacity-80"
                style={{
                  backgroundColor: step.num <= current ? '#f97316' : '#222',
                }}
              />
              <span
                className="text-[10px] font-semibold uppercase tracking-wider transition-colors group-hover:text-white"
                style={{ color: step.num === current ? '#f97316' : step.num < current ? '#888' : '#444' }}
              >
                {step.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Navigation row */}
        <div className="flex items-center justify-between">
          {/* Left: Back or Home */}
          {prev ? (
            <Link
              href={prev.href}
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-white"
              style={{ color: '#ddd' }}
            >
              <ArrowLeft className="w-4 h-4" />
              {prev.label}
            </Link>
          ) : (
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-white"
              style={{ color: '#ddd' }}
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
          )}

          {/* Center: step count */}
          <span className="text-sm font-bold" style={{ color: '#888' }}>
            Step {current} of {steps.length}
          </span>

          {/* Right: Next */}
          {next ? (
            <Link
              href={next.href}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white transition-all hover:scale-[1.03]"
              style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
            >
              Next: {next.label}
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white transition-all hover:scale-[1.03]"
              style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
            >
              Done
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { Sparkles, Lightbulb, ArrowRight } from 'lucide-react';
import DesignProgress from '@/components/DesignProgress';

const namePatterns = [
  {
    pattern: 'Noun + Noun',
    examples: ['PawLink', 'BookStack', 'FitPulse', 'MealMap'],
    color: '#f97316',
  },
  {
    pattern: 'Adjective + Noun',
    examples: ['CozyPaws', 'SwiftShift', 'FreshPlate', 'BrightPath'],
    color: '#0ea5e9',
  },
  {
    pattern: 'Verb + Object',
    examples: ['TrackMyFit', 'FindaSitter', 'GrabChow', 'BuildFolio'],
    color: '#22c55e',
  },
  {
    pattern: 'Made-Up Word',
    examples: ['Sitterfy', 'Booklio', 'Pawrify', 'Studyio'],
    color: '#8b5cf6',
  },
  {
    pattern: 'Abbreviation',
    examples: ['PMC (Pet My Cat)', 'GFT (Get Fit Today)', 'EZBook'],
    color: '#ec4899',
  },
];

const tips = [
  { tip: 'Say it out loud — does it sound good?', icon: '1' },
  { tip: 'Can you spell it without explaining?', icon: '2' },
  { tip: 'Does it hint at what the app does?', icon: '3' },
  { tip: 'Would it work as a logo?', icon: '4' },
];

export default function DesignName() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      <DesignProgress current={6} />

      <div className="max-w-6xl mx-auto px-4 pt-3 pb-8">
        <h1 className="text-3xl font-extrabold text-white text-center mb-1">Name Your Business</h1>
        <p className="text-base text-center mb-5" style={{ color: '#ddd' }}>Claude will brainstorm with you. Here are common patterns that work.</p>

        {/* Naming patterns */}
        <div className="grid grid-cols-5 gap-2.5 mb-5">
          {namePatterns.map((p) => (
            <div key={p.pattern} className="rounded-xl p-4 flex flex-col items-center text-center h-36 justify-center" style={{ backgroundColor: '#111', border: `1px solid ${p.color}40` }}>
              <span className="text-sm font-bold px-3 py-1 rounded-lg mb-3" style={{ backgroundColor: `${p.color}20`, color: p.color }}>
                {p.pattern}
              </span>
              <div className="flex flex-col gap-1">
                {p.examples.map((ex) => (
                  <span key={ex} className="text-base font-bold text-white">{ex}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Quick test */}
        <div className="rounded-xl p-4" style={{ backgroundColor: '#111', border: '1px solid #222' }}>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5" style={{ color: '#eab308' }} />
            <span className="text-sm font-bold uppercase tracking-widest" style={{ color: '#eab308' }}>Quick Name Test</span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {tips.map((t) => (
              <div key={t.tip} className="flex items-start gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: '#f97316', color: '#000' }}>{t.icon}</span>
                <span className="text-sm text-white">{t.tip}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-4">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl" style={{ backgroundColor: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)' }}>
            <Sparkles className="w-5 h-5" style={{ color: '#f97316' }} />
            <span className="text-base font-semibold" style={{ color: '#f97316' }}>Ask Claude for more name ideas — it&apos;s great at this</span>
          </div>
        </div>
      </div>
    </div>
  );
}

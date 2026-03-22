'use client';

import {
  ClipboardCheck, Users, Lightbulb, Target, LayoutGrid, Tag,
  Palette, ArrowRight, CheckCircle, Database, BarChart3, Layers
} from 'lucide-react';
import DesignProgress from '@/components/DesignProgress';

const summaryCards = [
  {
    icon: Users,
    label: 'Team',
    color: '#0ea5e9',
    desc: 'Names, roles assigned',
    step: 1,
  },
  {
    icon: Lightbulb,
    label: 'Business Type',
    color: '#f97316',
    desc: 'Category + niche chosen',
    step: 2,
  },
  {
    icon: Target,
    label: 'User Model',
    color: '#22c55e',
    desc: 'Who uses your app & how',
    step: 4,
  },
  {
    icon: LayoutGrid,
    label: 'Features',
    color: '#a855f7',
    desc: 'Core features selected',
    step: 5,
  },
  {
    icon: Tag,
    label: 'App Name',
    color: '#ec4899',
    desc: 'Brand name finalized',
    step: 6,
  },
  {
    icon: Layers,
    label: 'Layout',
    color: '#06b6d4',
    desc: 'Shell type picked',
    step: 7,
  },
  {
    icon: Palette,
    label: 'Theme',
    color: '#eab308',
    desc: 'Color palette set',
    step: 8,
  },
];

const prdSections = [
  {
    icon: LayoutGrid,
    title: 'Pages & Navigation',
    color: '#0ea5e9',
    items: ['Home / Dashboard', 'Detail views', 'Profile / Settings', 'List / Browse pages', 'Forms & input screens'],
  },
  {
    icon: Database,
    title: 'Data Model',
    color: '#22c55e',
    items: ['Users & profiles', 'Core business objects', 'Relationships & references', 'Status & workflow states', 'Metrics & analytics'],
  },
  {
    icon: BarChart3,
    title: 'KPIs & Metrics',
    color: '#a855f7',
    items: ['Revenue / earnings tracker', 'User counts & growth', 'Engagement / usage stats', 'Conversion rates', 'Custom business metrics'],
  },
];

export default function DesignReview() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      <DesignProgress current={9} />

      <div className="max-w-6xl mx-auto px-4 pt-3 pb-8">
        <div className="flex items-center justify-center gap-3 mb-1">
          <ClipboardCheck className="w-7 h-7" style={{ color: '#22c55e' }} />
          <h1 className="text-3xl font-extrabold text-white text-center">Review Your Design</h1>
        </div>
        <p className="text-base text-center mb-5" style={{ color: '#ddd' }}>
          Claude will summarize everything before building. Make sure it matches your vision.
        </p>

        {/* Design decisions summary */}
        <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: '#111', border: '1px solid #222' }}>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: '#f97316' }}>
            Your Design Decisions
          </h3>
          <div className="grid grid-cols-7 gap-3">
            {summaryCards.map((card) => (
              <div key={card.label} className="text-center">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-1.5"
                  style={{ backgroundColor: card.color + '20' }}
                >
                  <card.icon className="w-6 h-6" style={{ color: card.color }} />
                </div>
                <p className="text-sm font-bold text-white">{card.label}</p>
                <p className="text-xs" style={{ color: '#ddd' }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* PRD sections */}
        <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: '#06b6d4' }}>
          Claude will generate your PRD with
        </h3>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {prdSections.map((section) => (
            <div key={section.title} className="rounded-xl overflow-hidden" style={{ backgroundColor: '#111', border: '1px solid #222' }}>
              <div
                className="h-12 flex items-center gap-2 px-4"
                style={{ backgroundColor: section.color + '10' }}
              >
                <section.icon className="w-5 h-5" style={{ color: section.color }} />
                <span className="text-sm font-bold text-white">{section.title}</span>
              </div>
              <div className="p-4">
                {section.items.map((item) => (
                  <div key={item} className="flex items-center gap-2 py-1">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: section.color }} />
                    <span className="text-sm" style={{ color: '#ddd' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* What happens next */}
        <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: '#111', border: '1px solid #f97316', borderStyle: 'solid' }}>
          <h3 className="text-base font-bold text-white mb-3">What Happens Next</h3>
          <div className="flex items-center gap-4">
            {[
              { label: 'Review PRD', color: '#f97316' },
              { label: 'Approve', color: '#eab308' },
              { label: 'Claude Builds', color: '#22c55e' },
              { label: 'See Your App', color: '#0ea5e9' },
            ].map((step, i) => (
              <div key={step.label} className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{ backgroundColor: step.color }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium text-white">{step.label}</span>
                </div>
                {i < 3 && <ArrowRight className="w-4 h-4" style={{ color: '#ddd' }} />}
              </div>
            ))}
          </div>
        </div>

        {/* Claude will ask */}
        <div className="rounded-xl p-4" style={{ backgroundColor: '#111', border: '1px solid #222' }}>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: '#f97316' }}>
            Claude will ask you
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              'Does this PRD match your vision?',
              'Anything to add or change?',
              'Ready to start building?',
            ].map((q, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-base font-bold flex-shrink-0" style={{ color: '#f97316' }}>{i + 1}.</span>
                <span className="text-base" style={{ color: '#ddd' }}>{q}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

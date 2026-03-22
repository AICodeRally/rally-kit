'use client';

import { Monitor, Smartphone, Globe, Zap, AlertTriangle, ArrowRight } from 'lucide-react';
import DesignProgress from '@/components/DesignProgress';

const shells = [
  {
    name: 'Dashboard',
    icon: Monitor,
    color: '#0ea5e9',
    gradient: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
    bestFor: 'Startup AI',
    desc: 'Sidebar + charts + tables + KPIs',
    features: ['Collapsible sidebar navigation', 'Stat cards with trends', 'Data tables with sorting', 'Chart cards (bar, line, pie)'],
    example: 'Think: Shopify admin, Notion workspace, QuickBooks',
  },
  {
    name: 'Mobile App',
    icon: Smartphone,
    color: '#f97316',
    gradient: 'linear-gradient(135deg, #f97316, #ea580c)',
    bestFor: 'Campus AI',
    desc: 'Bottom tabs + cards + lists',
    features: ['Bottom tab navigation (5 tabs)', 'Scrollable card feed', 'Compact stat cards', 'List items with badges'],
    example: 'Think: Instagram, Cash App, Strava',
  },
  {
    name: 'Portfolio',
    icon: Globe,
    color: '#a855f7',
    gradient: 'linear-gradient(135deg, #a855f7, #9333ea)',
    bestFor: 'My Future',
    desc: 'Top nav + hero + content grid',
    features: ['Horizontal top navigation', 'Hero section with profile', 'Project cards in grid', 'Detail cards side by side'],
    example: 'Think: Behance, Dribbble, personal website',
  },
];

export default function DesignLayout() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      <DesignProgress current={7} />

      <div className="max-w-6xl mx-auto px-4 pt-3 pb-8">
        <h1 className="text-3xl font-extrabold text-white text-center mb-1">Pick Your Layout</h1>
        <p className="text-base text-center mb-5" style={{ color: '#ddd' }}>This is the frame your app lives inside. Every page uses it.</p>

        <div className="grid grid-cols-3 gap-4 mb-4">
          {shells.map((shell) => (
            <div key={shell.name} className="rounded-xl overflow-hidden" style={{ backgroundColor: '#111', border: '1px solid #222' }}>
              {/* Gradient header */}
              <div className="h-40 relative flex items-center justify-center" style={{ background: shell.gradient }}>
                <shell.icon className="w-16 h-16 text-white/90" />
                <span className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full bg-white/20 text-white">
                  {shell.bestFor}
                </span>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-0.5">{shell.name}</h3>
                <p className="text-sm font-medium mb-3" style={{ color: shell.color }}>{shell.desc}</p>

                <ul className="space-y-1.5 mb-3">
                  {shell.features.map((f) => (
                    <li key={f} className="text-sm flex items-start gap-2" style={{ color: '#ddd' }}>
                      <ArrowRight className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: shell.color }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <p className="text-xs" style={{ color: '#ddd' }}>{shell.example}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Roll your own */}
        <div className="rounded-xl p-4 flex items-center gap-4" style={{ background: 'linear-gradient(135deg, #f97316, #ec4899, #8b5cf6)', border: '1px solid #f9731640' }}>
          <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/20 backdrop-blur">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Roll Your Own Layout</h3>
            <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.9)' }}>Want something completely custom? Claude can build any layout from scratch.</p>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" style={{ color: '#fde047' }} />
              <span className="text-sm font-medium" style={{ color: '#fde047' }}>Takes longer — less time for features. Only if you have a strong vision.</span>
            </div>
          </div>
        </div>

        {/* See them live */}
        <div className="text-center mt-4">
          <a href="/preview/dashboard" className="inline-flex items-center gap-2 text-base font-semibold transition-colors" style={{ color: '#0ea5e9' }}>
            See live previews with sample data <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
}

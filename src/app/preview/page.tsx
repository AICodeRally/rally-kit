'use client';

import {
  Monitor, Smartphone, Globe, ArrowRight, ArrowLeft,
  ShoppingBag, CalendarCheck, Store, LayoutDashboard, Newspaper,
  BookOpen, Users, Wallet, Dumbbell, Brain,
  Briefcase, User, TrendingUp, Code, Network,
  Package, Receipt, Handshake, LineChart, FileText,
} from 'lucide-react';
import Link from 'next/link';
import { type LucideIcon } from 'lucide-react';

interface BusinessType {
  title: string;
  brands: string;
  icon: LucideIcon;
  gradient: string;
  color: string;
}

interface TrackSection {
  track: string;
  trackColor: string;
  types: BusinessType[];
}

const tracks: TrackSection[] = [
  {
    track: 'Startup AI',
    trackColor: '#f97316',
    types: [
      { title: 'Product Business', brands: 'Shopify, Amazon', icon: ShoppingBag, gradient: 'linear-gradient(135deg, #f97316, #ea580c)', color: '#f97316' },
      { title: 'Service Business', brands: 'Square, Calendly', icon: CalendarCheck, gradient: 'linear-gradient(135deg, #eab308, #ca8a04)', color: '#eab308' },
      { title: 'Marketplace', brands: 'Airbnb, Etsy, StockX', icon: Store, gradient: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#22c55e' },
      { title: 'SaaS Tool', brands: 'Notion, Slack, Canva', icon: LayoutDashboard, gradient: 'linear-gradient(135deg, #0ea5e9, #0284c7)', color: '#0ea5e9' },
      { title: 'Content Platform', brands: 'Substack, TikTok', icon: Newspaper, gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', color: '#8b5cf6' },
    ],
  },
  {
    track: 'Campus AI',
    trackColor: '#06b6d4',
    types: [
      { title: 'Student Planner', brands: 'Notion, Todoist', icon: BookOpen, gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)', color: '#06b6d4' },
      { title: 'Campus Community', brands: 'Discord, GroupMe', icon: Users, gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', color: '#8b5cf6' },
      { title: 'Budget Tracker', brands: 'Venmo, Mint', icon: Wallet, gradient: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#22c55e' },
      { title: 'Fitness / Health', brands: 'Strava, Nike Run', icon: Dumbbell, gradient: 'linear-gradient(135deg, #f97316, #ea580c)', color: '#f97316' },
      { title: 'Study Tool', brands: 'Quizlet, Chegg', icon: Brain, gradient: 'linear-gradient(135deg, #ec4899, #db2777)', color: '#ec4899' },
    ],
  },
  {
    track: 'Working Toward My Future',
    trackColor: '#a855f7',
    types: [
      { title: 'Job Tracker', brands: 'LinkedIn, Handshake', icon: Briefcase, gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#3b82f6' },
      { title: 'Portfolio Site', brands: 'Behance, Dribbble', icon: User, gradient: 'linear-gradient(135deg, #a855f7, #9333ea)', color: '#a855f7' },
      { title: 'Career Planner', brands: 'Glassdoor, Coursera', icon: TrendingUp, gradient: 'linear-gradient(135deg, #14b8a6, #0d9488)', color: '#14b8a6' },
      { title: 'Skills Dashboard', brands: 'Udemy, Kaggle', icon: Code, gradient: 'linear-gradient(135deg, #f97316, #ea580c)', color: '#f97316' },
      { title: 'Network Builder', brands: 'LinkedIn, Lunchclub', icon: Network, gradient: 'linear-gradient(135deg, #ec4899, #db2777)', color: '#ec4899' },
    ],
  },
];

const shells = [
  {
    name: 'Dashboard',
    href: '/preview/dashboard',
    icon: Monitor,
    color: '#0ea5e9',
    vibe: 'Business command center',
    bestFor: 'Startup AI',
    tags: ['sidebar', 'charts', 'tables'],
    preview: [
      { label: 'Revenue', value: '$48K', color: '#0ea5e9' },
      { label: 'Users', value: '342', color: '#06b6d4' },
      { label: 'Orders', value: '1.2K', color: '#8b5cf6' },
    ],
  },
  {
    name: 'Mobile App',
    href: '/preview/mobile',
    icon: Smartphone,
    color: '#f97316',
    vibe: 'Phone-first experience',
    bestFor: 'Campus AI',
    tags: ['bottom tabs', 'cards', 'lists'],
    preview: [
      { label: 'Streak', value: '7 days', color: '#f97316' },
      { label: 'Steps', value: '8.4K', color: '#22c55e' },
      { label: 'Cal', value: '2.1K', color: '#eab308' },
    ],
  },
  {
    name: 'Portfolio',
    href: '/preview/portfolio',
    icon: Globe,
    color: '#a855f7',
    vibe: 'Your personal brand site',
    bestFor: 'My Future',
    tags: ['top nav', 'hero', 'project grid'],
    preview: [
      { label: 'Projects', value: '12', color: '#a855f7' },
      { label: 'Skills', value: '8', color: '#ec4899' },
      { label: 'GPA', value: '3.85', color: '#22c55e' },
    ],
  },
];

export default function PreviewPicker() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      {/* Back nav */}
      <div className="px-6 pt-4">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium transition-colors" style={{ color: '#ddd' }}>
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      {/* ═══ Business ideas by track — compact tiles ═══ */}
      {tracks.map((section) => (
        <section key={section.track} className="pt-6 pb-2 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm font-bold uppercase tracking-widest" style={{ color: section.trackColor }}>
                {section.track}
              </span>
              <div className="flex-1 h-px" style={{ backgroundColor: `${section.trackColor}25` }} />
            </div>

            {/* Compact cards — text overlaid on gradient */}
            <div className="grid grid-cols-5 gap-2">
              {section.types.map((type) => (
                <div
                  key={type.title}
                  className="relative rounded-xl overflow-hidden h-28 flex flex-col justify-end p-3 cursor-default transition-all hover:scale-[1.03]"
                  style={{ background: type.gradient }}
                >
                  {/* Icon top-right */}
                  <type.icon className="absolute top-2.5 right-2.5 w-6 h-6 text-white/30" />
                  {/* Scrim for text legibility */}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)' }} />
                  {/* Text overlay */}
                  <div className="relative">
                    <div className="text-sm font-bold text-white leading-tight">{type.title}</div>
                    <div className="text-xs text-white/80 mt-0.5">{type.brands}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      <p className="text-center text-sm pt-3 pb-2" style={{ color: '#ddd' }}>
        Starting points — you can build anything. Tell Claude your idea.
      </p>

      {/* ═══ Pick your layout — compact row ═══ */}
      <section className="pt-6 pb-8 px-6" style={{ borderTop: '1px solid #1a1a1a' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-extrabold text-white text-center mb-5">
            Pick your layout
          </h2>

          <div className="grid grid-cols-3 gap-4">
            {shells.map((shell) => (
              <Link
                key={shell.name}
                href={shell.href}
                className="group block rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02]"
                style={{ backgroundColor: '#111', border: '1px solid #222' }}
              >
                {/* Preview area with icon + floating stats */}
                <div className="relative h-36 flex items-center justify-center overflow-hidden" style={{ background: `linear-gradient(135deg, ${shell.color}15, ${shell.color}05)` }}>
                  <shell.icon className="w-14 h-14" style={{ color: `${shell.color}50` }} />
                  <div className="absolute bottom-2 left-2 right-2 flex gap-1.5">
                    {shell.preview.map((stat) => (
                      <div key={stat.label} className="flex-1 rounded-md px-1.5 py-1 text-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
                        <div className="text-xs font-bold" style={{ color: stat.color }}>{stat.value}</div>
                        <div className="text-[10px] uppercase" style={{ color: '#ddd' }}>{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Compact info */}
                <div className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base font-bold text-white">{shell.name}</h3>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" style={{ color: shell.color }} />
                  </div>
                  <p className="text-sm mb-2" style={{ color: shell.color }}>{shell.vibe}</p>
                  <div className="flex flex-wrap gap-1">
                    {shell.tags.map((tag) => (
                      <span key={tag} className="text-xs font-medium px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#1a1a1a', color: '#ddd', border: '1px solid #2a2a2a' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

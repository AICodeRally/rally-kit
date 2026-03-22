'use client';

import {
  ShoppingBag, CalendarCheck, Store, LayoutDashboard, Newspaper,
  BookOpen, Users, Wallet, Dumbbell, Brain,
  Briefcase, User, TrendingUp, Code, Network, Zap,
} from 'lucide-react';
import DesignProgress from '@/components/DesignProgress';
import { type LucideIcon } from 'lucide-react';

interface BizType {
  title: string;
  brands: string;
  icon: LucideIcon;
  gradient: string;
}

interface Track {
  name: string;
  color: string;
  types: BizType[];
}

const tracks: Track[] = [
  {
    name: 'Startup AI',
    color: '#f97316',
    types: [
      { title: 'Product Business', brands: 'Shopify, Amazon', icon: ShoppingBag, gradient: 'linear-gradient(135deg, #f97316, #ea580c)' },
      { title: 'Service Business', brands: 'Square, Calendly', icon: CalendarCheck, gradient: 'linear-gradient(135deg, #eab308, #ca8a04)' },
      { title: 'Marketplace', brands: 'Airbnb, Etsy, StockX', icon: Store, gradient: 'linear-gradient(135deg, #22c55e, #16a34a)' },
      { title: 'SaaS Tool', brands: 'Notion, Slack, Canva', icon: LayoutDashboard, gradient: 'linear-gradient(135deg, #0ea5e9, #0284c7)' },
      { title: 'Content Platform', brands: 'Substack, TikTok', icon: Newspaper, gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
    ],
  },
  {
    name: 'Campus AI',
    color: '#06b6d4',
    types: [
      { title: 'Student Planner', brands: 'Notion, Todoist', icon: BookOpen, gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)' },
      { title: 'Campus Community', brands: 'Discord, GroupMe', icon: Users, gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
      { title: 'Budget Tracker', brands: 'Venmo, Mint', icon: Wallet, gradient: 'linear-gradient(135deg, #22c55e, #16a34a)' },
      { title: 'Fitness / Health', brands: 'Strava, Nike Run', icon: Dumbbell, gradient: 'linear-gradient(135deg, #f97316, #ea580c)' },
      { title: 'Study Tool', brands: 'Quizlet, Chegg', icon: Brain, gradient: 'linear-gradient(135deg, #ec4899, #db2777)' },
    ],
  },
  {
    name: 'Working Toward My Future',
    color: '#c084fc',
    types: [
      { title: 'Job Tracker', brands: 'LinkedIn, Handshake', icon: Briefcase, gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
      { title: 'Portfolio Site', brands: 'Behance, Dribbble', icon: User, gradient: 'linear-gradient(135deg, #a855f7, #9333ea)' },
      { title: 'Career Planner', brands: 'Glassdoor, Coursera', icon: TrendingUp, gradient: 'linear-gradient(135deg, #14b8a6, #0d9488)' },
      { title: 'Skills Dashboard', brands: 'Udemy, Kaggle', icon: Code, gradient: 'linear-gradient(135deg, #f97316, #ea580c)' },
      { title: 'Network Builder', brands: 'LinkedIn, Lunchclub', icon: Network, gradient: 'linear-gradient(135deg, #ec4899, #db2777)' },
    ],
  },
];

export default function DesignIdea() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      <DesignProgress current={2} />

      <div className="max-w-6xl mx-auto px-4 pt-3 pb-8">
        <h1 className="text-3xl font-extrabold text-white text-center mb-1">Pick Your Business Type</h1>
        <p className="text-base text-center mb-5" style={{ color: '#ddd' }}>Tell Claude the number or describe your own idea.</p>

        {tracks.map((track) => (
          <section key={track.name} className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-bold uppercase tracking-widest" style={{ color: track.color }}>{track.name}</span>
              <div className="flex-1 h-px" style={{ backgroundColor: `${track.color}25` }} />
            </div>
            <div className="grid grid-cols-5 gap-2.5">
              {track.types.map((type) => (
                <div
                  key={type.title}
                  className="relative rounded-xl overflow-hidden h-36 flex flex-col items-center justify-center p-3 text-center"
                  style={{ background: type.gradient }}
                >
                  <type.icon className="w-9 h-9 text-white mb-2" />
                  <div className="text-base font-bold text-white leading-tight">{type.title}</div>
                  <div className="text-sm text-white/80 mt-0.5">{type.brands}</div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Roll your own */}
        <div className="rounded-xl p-4 flex items-center gap-4 mt-3" style={{ background: 'linear-gradient(135deg, #f97316, #ec4899, #8b5cf6)', border: '1px solid #f9731640' }}>
          <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/20 backdrop-blur">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Roll Your Own</h3>
            <p className="text-sm font-medium text-white/90">Got a totally different idea? Tell Claude anything — there are no rules.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

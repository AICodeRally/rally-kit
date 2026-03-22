'use client';

import {
  Crown, Palette, Mic, Users, ArrowRight, TrendingUp,
  Calculator, Code, Megaphone, ClipboardList, Target, Handshake,
} from 'lucide-react';
import DesignProgress from '@/components/DesignProgress';

const roles = [
  {
    title: 'CEO',
    icon: Crown,
    color: '#f97316',
    gradient: 'linear-gradient(135deg, #f97316, #ea580c)',
    desc: 'Final calls on features and priorities',
    degree: 'Business, Entrepreneurship',
    tasks: ['Decides what to build next', 'Breaks ties on design choices', 'Owns the product vision'],
  },
  {
    title: 'Designer',
    icon: Palette,
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    desc: 'Feedback on layout, colors, and UX',
    degree: 'Graphic Design, UX, Marketing',
    tasks: ['Reviews every page Claude builds', 'Suggests visual improvements', 'Picks colors and themes'],
  },
  {
    title: 'Presenter',
    icon: Mic,
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
    desc: 'Prepares and delivers the demo pitch',
    degree: 'Communications, Public Speaking',
    tasks: ['Takes notes on key decisions', 'Plans the demo story arc', 'Delivers the final pitch'],
  },
  {
    title: 'Product Manager',
    icon: ClipboardList,
    color: '#22c55e',
    gradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
    desc: 'Keeps the team on track and on time',
    degree: 'Project Management, Operations',
    tasks: ['Watches the clock — keeps phases moving', 'Prioritizes features by impact', 'Makes sure nothing gets skipped'],
  },
  {
    title: 'Analyst',
    icon: TrendingUp,
    color: '#eab308',
    gradient: 'linear-gradient(135deg, #eab308, #ca8a04)',
    desc: 'Defines the numbers that matter',
    degree: 'Finance, Accounting, Analytics',
    tasks: ['Picks KPIs and chart types', 'Creates realistic mock data', 'Reviews dashboard accuracy'],
  },
  {
    title: 'Marketer',
    icon: Megaphone,
    color: '#ec4899',
    gradient: 'linear-gradient(135deg, #ec4899, #db2777)',
    desc: 'Names the app and crafts the story',
    degree: 'Marketing, Advertising, PR',
    tasks: ['Leads app naming brainstorm', 'Writes taglines and copy', 'Shapes the brand identity'],
  },
  {
    title: 'Strategist',
    icon: Target,
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
    desc: 'Thinks about the customer and competition',
    degree: 'Strategy, Consulting, MBA',
    tasks: ['Defines target customer persona', 'Identifies competitive advantages', 'Shapes the business model'],
  },
  {
    title: 'Developer',
    icon: Code,
    color: '#38bdf8',
    gradient: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
    desc: 'Guides technical decisions with Claude',
    degree: 'CS, IT, Software Engineering',
    tasks: ['Suggests data model improvements', 'Reviews code Claude writes', 'Helps debug when things break'],
  },
  {
    title: 'Customer Success',
    icon: Handshake,
    color: '#a855f7',
    gradient: 'linear-gradient(135deg, #a855f7, #9333ea)',
    desc: 'Champions the user experience',
    degree: 'Hospitality, Healthcare, Education',
    tasks: ['Tests the app like a real user', 'Spots confusing flows', 'Ensures the app feels welcoming'],
  },
  {
    title: 'Finance Lead',
    icon: Calculator,
    color: '#14b8a6',
    gradient: 'linear-gradient(135deg, #14b8a6, #0d9488)',
    desc: 'Handles pricing, costs, and revenue logic',
    degree: 'Finance, Accounting, Economics',
    tasks: ['Defines pricing tiers or fee structure', 'Reviews revenue KPIs', 'Validates financial mock data'],
  },
];

export default function DesignTeam() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      <DesignProgress current={1} />

      <div className="max-w-4xl mx-auto px-6 pt-4 pb-12">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-3 mb-1">
            <Users className="w-7 h-7" style={{ color: '#f97316' }} />
            <h1 className="text-3xl font-extrabold text-white">Your Team</h1>
          </div>
          <p className="text-base" style={{ color: '#ddd' }}>Tell Claude your team name, members, and pick roles that match your strengths.</p>
        </div>

        {/* Team size guide */}
        <div className="grid grid-cols-4 gap-2 mb-5">
          {[
            { size: 'Solo', count: '1', roles: 'Pick any 1 role', color: '#f97316' },
            { size: 'Duo', count: '2', roles: 'Pick any 2 roles', color: '#06b6d4' },
            { size: 'Trio', count: '3', roles: 'Pick any 3 roles', color: '#8b5cf6' },
            { size: 'Full Squad', count: '4', roles: 'Pick any 4 roles', color: '#22c55e' },
          ].map((t) => (
            <div key={t.size} className="rounded-lg p-3 text-center" style={{ backgroundColor: '#111', border: `1px solid ${t.color}40` }}>
              <div className="text-2xl font-extrabold" style={{ color: t.color }}>{t.count}</div>
              <div className="text-base font-bold text-white">{t.size}</div>
              <div className="text-sm mt-1" style={{ color: '#ddd' }}>{t.roles}</div>
            </div>
          ))}
        </div>

        {/* What Claude will ask */}
        <div className="rounded-xl p-4 mb-5" style={{ backgroundColor: '#111', border: '1px solid #222' }}>
          <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: '#f97316' }}>Claude will ask you</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              'What\u2019s your team name?',
              'Who\u2019s on the team? (first names)',
              'Want to assign roles? (pick from below)',
            ].map((q, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-base font-bold flex-shrink-0" style={{ color: '#f97316' }}>{i + 1}.</span>
                <span className="text-base" style={{ color: '#ddd' }}>{q}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Roles — 2 rows of 5, laptop-friendly */}
        <p className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: '#ddd' }}>Available Roles — pick what fits your degree</p>
        <div className="grid grid-cols-5 gap-2">
          {roles.map((role) => (
            <div key={role.title} className="rounded-xl overflow-hidden" style={{ backgroundColor: '#111', border: '1px solid #333' }}>
              <div className="h-14 flex items-center justify-center" style={{ background: role.gradient }}>
                <role.icon className="w-6 h-6 text-white" />
              </div>
              <div className="p-2.5">
                <h3 className="text-sm font-bold text-white">{role.title}</h3>
                <p className="text-xs mt-0.5 leading-tight" style={{ color: role.color }}>{role.desc}</p>
                <p className="text-xs mt-1 font-medium" style={{ color: '#ddd' }}>{role.degree}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-base mt-3" style={{ color: '#ddd' }}>
          Roles are optional — solo teams do everything. Pick roles that match your degree or interests.
        </p>
      </div>
    </div>
  );
}

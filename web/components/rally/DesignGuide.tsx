'use client'

import React, { useState } from 'react'
import {
  Users, Lightbulb, ShoppingBag, Target, LayoutGrid, Tag, Monitor,
  Palette, ClipboardCheck, ArrowLeft, ArrowRight,
  Crown, Mic, ClipboardList, TrendingUp, Calculator, Code, Megaphone,
  Handshake, BookOpen, Wallet, Dumbbell, Brain, Briefcase, User, Network,
  CalendarCheck, Store, LayoutDashboard, Newspaper,
  Smartphone, Globe, Droplets, Sun, Trees, Cherry, Layers, Sparkles,
  Flame, Snowflake, Moon, Zap, Heart, Coffee, Waves, Circle,
  Database, BarChart3, CheckCircle, Package, Receipt, LineChart, FileText,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/* ── Step definitions ──────────────────────────────────────────── */

const STEPS = [
  { key: 'team', label: 'Team', icon: Users, color: '#f97316' },
  { key: 'idea', label: 'Idea', icon: Lightbulb, color: '#eab308' },
  { key: 'niche', label: 'Niche', icon: ShoppingBag, color: '#22c55e' },
  { key: 'users', label: 'Users', icon: Target, color: '#06b6d4' },
  { key: 'features', label: 'Features', icon: LayoutGrid, color: '#a855f7' },
  { key: 'name', label: 'Name', icon: Tag, color: '#ec4899' },
  { key: 'layout', label: 'Layout', icon: Monitor, color: '#0ea5e9' },
  { key: 'theme', label: 'Theme', icon: Palette, color: '#eab308' },
  { key: 'review', label: 'Review', icon: ClipboardCheck, color: '#22c55e' },
] as const

/* ── Step content components ──────────────────────────────────── */

function TeamStep() {
  const roles = [
    { title: 'CEO', icon: Crown, color: '#f97316', desc: 'Final calls on features' },
    { title: 'Designer', icon: Palette, color: '#8b5cf6', desc: 'Layout, colors, UX' },
    { title: 'Presenter', icon: Mic, color: '#06b6d4', desc: 'Demo pitch' },
    { title: 'PM', icon: ClipboardList, color: '#22c55e', desc: 'Keeps team on track' },
    { title: 'Analyst', icon: TrendingUp, color: '#eab308', desc: 'Numbers & KPIs' },
    { title: 'Marketer', icon: Megaphone, color: '#ec4899', desc: 'Brand & copy' },
    { title: 'Strategist', icon: Target, color: '#ef4444', desc: 'Customer & competition' },
    { title: 'Developer', icon: Code, color: '#38bdf8', desc: 'Tech decisions' },
    { title: 'CX Lead', icon: Handshake, color: '#a855f7', desc: 'User experience' },
    { title: 'Finance', icon: Calculator, color: '#14b8a6', desc: 'Pricing & revenue' },
  ]
  return (
    <div className="space-y-3">
      <p className="text-sm" style={{ color: '#ddd' }}>Tell Claude your team name, members, and pick roles:</p>
      <div className="grid grid-cols-2 gap-1.5">
        {roles.map((r) => (
          <div key={r.title} className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: '#1a1a1a' }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: r.color + '20' }}>
              <r.icon className="w-3.5 h-3.5" style={{ color: r.color }} />
            </div>
            <div>
              <div className="text-xs font-bold text-white">{r.title}</div>
              <div className="text-[10px]" style={{ color: '#aaa' }}>{r.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function IdeaStep() {
  const tracks = [
    { name: 'Startup AI', color: '#f97316', examples: ['Product Business', 'SaaS Tool', 'Marketplace'] },
    { name: 'Campus AI', color: '#06b6d4', examples: ['Study Tool', 'Budget Tracker', 'Campus Community'] },
    { name: 'My Future', color: '#a855f7', examples: ['Job Tracker', 'Portfolio Site', 'Skills Dashboard'] },
  ]
  return (
    <div className="space-y-3">
      <p className="text-sm" style={{ color: '#ddd' }}>Pick a track, then describe your app idea:</p>
      {tracks.map((t) => (
        <div key={t.name} className="p-3 rounded-lg" style={{ backgroundColor: '#1a1a1a' }}>
          <div className="text-sm font-bold mb-1" style={{ color: t.color }}>{t.name}</div>
          <div className="flex gap-1.5 flex-wrap">
            {t.examples.map((ex) => (
              <span key={ex} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: t.color + '20', color: t.color }}>{ex}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function NicheStep() {
  const types = [
    { title: 'Product', icon: ShoppingBag, color: '#f97316' },
    { title: 'Service', icon: CalendarCheck, color: '#eab308' },
    { title: 'Marketplace', icon: Store, color: '#22c55e' },
    { title: 'SaaS', icon: LayoutDashboard, color: '#0ea5e9' },
    { title: 'Content', icon: Newspaper, color: '#8b5cf6' },
    { title: 'Community', icon: Users, color: '#06b6d4' },
  ]
  return (
    <div className="space-y-3">
      <p className="text-sm" style={{ color: '#ddd' }}>What type of business? Pick what fits best:</p>
      <div className="grid grid-cols-3 gap-1.5">
        {types.map((t) => (
          <div key={t.title} className="flex flex-col items-center gap-1 p-3 rounded-lg" style={{ backgroundColor: '#1a1a1a' }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: t.color + '20' }}>
              <t.icon className="w-4.5 h-4.5" style={{ color: t.color }} />
            </div>
            <span className="text-xs font-bold text-white">{t.title}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function UsersStep() {
  const models = [
    { title: 'Consumer (B2C)', icon: User, color: '#0ea5e9', desc: 'Regular people use your app' },
    { title: 'Business (B2B)', icon: Briefcase, color: '#22c55e', desc: 'Companies are your customers' },
    { title: 'Two-Sided', icon: Network, color: '#a855f7', desc: 'Buyers + Sellers' },
    { title: 'Internal', icon: Users, color: '#f97316', desc: 'For your own team' },
  ]
  return (
    <div className="space-y-3">
      <p className="text-sm" style={{ color: '#ddd' }}>Who uses your app?</p>
      <div className="grid grid-cols-2 gap-1.5">
        {models.map((m) => (
          <div key={m.title} className="p-3 rounded-lg" style={{ backgroundColor: '#1a1a1a' }}>
            <div className="flex items-center gap-2 mb-1">
              <m.icon className="w-4 h-4" style={{ color: m.color }} />
              <span className="text-xs font-bold text-white">{m.title}</span>
            </div>
            <p className="text-[10px]" style={{ color: '#aaa' }}>{m.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function FeaturesStep() {
  const groups = [
    { label: 'Core', items: ['Dashboard', 'User Profiles', 'Search', 'Settings'], color: '#0ea5e9' },
    { label: 'Business', items: ['Payments', 'Analytics', 'Notifications', 'Reports'], color: '#22c55e' },
    { label: 'Social', items: ['Chat', 'Reviews', 'Sharing', 'Followers'], color: '#a855f7' },
  ]
  return (
    <div className="space-y-3">
      <p className="text-sm" style={{ color: '#ddd' }}>Pick features for your app:</p>
      {groups.map((g) => (
        <div key={g.label}>
          <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: g.color }}>{g.label}</div>
          <div className="flex gap-1.5 flex-wrap">
            {g.items.map((item) => (
              <span key={item} className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: '#1a1a1a', color: '#ddd' }}>{item}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function NameStep() {
  const patterns = [
    { label: 'Mashup', examples: ['Instagram', 'Pinterest', 'Groupon'], color: '#f97316' },
    { label: 'Real Word', examples: ['Slack', 'Stripe', 'Notion'], color: '#0ea5e9' },
    { label: 'Misspelling', examples: ['Lyft', 'Fiverr', 'Tumblr'], color: '#8b5cf6' },
    { label: 'Abstract', examples: ['Vercel', 'Figma', 'Canva'], color: '#22c55e' },
  ]
  return (
    <div className="space-y-3">
      <p className="text-sm" style={{ color: '#ddd' }}>Name your app — try these patterns:</p>
      <div className="grid grid-cols-2 gap-1.5">
        {patterns.map((p) => (
          <div key={p.label} className="p-2.5 rounded-lg" style={{ backgroundColor: '#1a1a1a', border: `1px solid ${p.color}30` }}>
            <div className="text-xs font-bold mb-1" style={{ color: p.color }}>{p.label}</div>
            <div className="text-[10px]" style={{ color: '#aaa' }}>{p.examples.join(', ')}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function LayoutStep() {
  const shells = [
    { name: 'Dashboard', icon: Monitor, color: '#0ea5e9', desc: 'Sidebar + charts' },
    { name: 'Mobile App', icon: Smartphone, color: '#f97316', desc: 'Phone-first' },
    { name: 'Portfolio', icon: Globe, color: '#a855f7', desc: 'Personal brand' },
  ]
  return (
    <div className="space-y-3">
      <p className="text-sm" style={{ color: '#ddd' }}>Pick a layout shell for your app:</p>
      {shells.map((s) => (
        <div key={s.name} className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#1a1a1a' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: s.color + '15' }}>
            <s.icon className="w-5 h-5" style={{ color: s.color }} />
          </div>
          <div>
            <div className="text-sm font-bold text-white">{s.name}</div>
            <div className="text-xs" style={{ color: s.color }}>{s.desc}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ThemeStep() {
  const themes = [
    { name: 'Ocean', color: '#0ea5e9', icon: Droplets },
    { name: 'Sunset', color: '#f97316', icon: Sun },
    { name: 'Forest', color: '#22c55e', icon: Trees },
    { name: 'Berry', color: '#a855f7', icon: Cherry },
    { name: 'Neon', color: '#22d3ee', icon: Zap },
    { name: 'Lava', color: '#ef4444', icon: Flame },
    { name: 'Midnight', color: '#6366f1', icon: Moon },
    { name: 'Rose', color: '#f43f5e', icon: Heart },
    { name: 'Gold', color: '#eab308', icon: Crown },
    { name: 'Arctic', color: '#38bdf8', icon: Snowflake },
    { name: 'Mocha', color: '#92400e', icon: Coffee },
    { name: 'Mono', color: '#ffffff', icon: Circle },
  ]
  return (
    <div className="space-y-3">
      <p className="text-sm" style={{ color: '#ddd' }}>Pick your color vibe:</p>
      <div className="grid grid-cols-4 gap-1.5">
        {themes.map((t) => (
          <div key={t.name} className="flex flex-col items-center gap-1 p-2 rounded-lg" style={{ backgroundColor: '#1a1a1a' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: t.color + '25' }}>
              <t.icon className="w-4 h-4" style={{ color: t.color }} />
            </div>
            <span className="text-[10px] font-bold text-white">{t.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ReviewStep() {
  const items = [
    { label: 'Team', icon: Users, color: '#0ea5e9' },
    { label: 'Idea', icon: Lightbulb, color: '#f97316' },
    { label: 'Users', icon: Target, color: '#22c55e' },
    { label: 'Features', icon: LayoutGrid, color: '#a855f7' },
    { label: 'Name', icon: Tag, color: '#ec4899' },
    { label: 'Layout', icon: Monitor, color: '#06b6d4' },
    { label: 'Theme', icon: Palette, color: '#eab308' },
  ]
  return (
    <div className="space-y-3">
      <p className="text-sm" style={{ color: '#ddd' }}>Claude will summarize your design, then build your app:</p>
      <div className="grid grid-cols-4 gap-1.5">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-1 p-2 rounded-lg" style={{ backgroundColor: '#1a1a1a' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: item.color + '20' }}>
              <item.icon className="w-4 h-4" style={{ color: item.color }} />
            </div>
            <span className="text-[10px] font-bold text-white">{item.label}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#f9731615', border: '1px solid #f9731640' }}>
        <CheckCircle className="w-5 h-5 shrink-0" style={{ color: '#f97316' }} />
        <span className="text-sm font-bold text-white">Ready? Claude will generate your PRD and start building!</span>
      </div>
    </div>
  )
}

const STEP_CONTENT: Record<string, () => React.ReactElement> = {
  team: TeamStep,
  idea: IdeaStep,
  niche: NicheStep,
  users: UsersStep,
  features: FeaturesStep,
  name: NameStep,
  layout: LayoutStep,
  theme: ThemeStep,
  review: ReviewStep,
}

/* ── Main component ──────────────────────────────────────────── */

export function DesignGuide() {
  const [currentStep, setCurrentStep] = useState(0)
  const step = STEPS[currentStep]
  const StepContent = STEP_CONTENT[step.key]

  return (
    <div
      className="flex flex-col h-full"
      style={{ backgroundColor: '#111', borderLeft: '1px solid #222' }}
    >
      {/* Step tabs */}
      <div className="flex items-center gap-0.5 px-2 py-2 shrink-0 overflow-x-auto" style={{ borderBottom: '1px solid #222' }}>
        {STEPS.map((s, i) => (
          <button
            key={s.key}
            onClick={() => setCurrentStep(i)}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shrink-0 transition-colors"
            style={{
              backgroundColor: i === currentStep ? s.color + '20' : 'transparent',
              color: i === currentStep ? s.color : '#666',
            }}
          >
            <s.icon className="w-3 h-3" />
            {s.label}
          </button>
        ))}
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${step.color}, ${step.color}cc)` }}>
            <step.icon className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Step {currentStep + 1}: {step.label}</h3>
            <p className="text-[10px] uppercase tracking-wider" style={{ color: step.color }}>
              Tell Claude in the chat
            </p>
          </div>
        </div>
        <StepContent />
      </div>

      {/* Nav buttons */}
      <div className="flex items-center justify-between px-3 py-2 shrink-0" style={{ borderTop: '1px solid #222' }}>
        <button
          onClick={() => setCurrentStep((c) => Math.max(0, c - 1))}
          disabled={currentStep === 0}
          className="flex items-center gap-1 text-xs font-medium disabled:opacity-30 transition-colors"
          style={{ color: '#ddd' }}
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
        <span className="text-[10px] font-bold" style={{ color: '#666' }}>
          {currentStep + 1} / {STEPS.length}
        </span>
        <button
          onClick={() => setCurrentStep((c) => Math.min(STEPS.length - 1, c + 1))}
          disabled={currentStep === STEPS.length - 1}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white disabled:opacity-30 transition-colors"
          style={{ backgroundColor: step.color }}
        >
          Next <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

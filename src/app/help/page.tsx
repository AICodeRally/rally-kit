'use client';

import { AlertCircle, RefreshCw, CheckCircle, Terminal, ArrowLeft, MessageSquare, RotateCcw, Eye, Hammer, Wrench, Lightbulb, Sparkles, Mic, HelpCircle, ClipboardCopy } from 'lucide-react';
import Link from 'next/link';

const tips = [
  {
    icon: AlertCircle,
    color: '#ef4444',
    title: 'See red text?',
    action: 'Copy + paste it into Claude',
    subIcon: ClipboardCopy,
  },
  {
    icon: RefreshCw,
    color: '#0ea5e9',
    title: 'Made a change?',
    action: 'Refresh your browser',
    subIcon: Eye,
  },
  {
    icon: CheckCircle,
    color: '#22c55e',
    title: '"Allow write" prompt?',
    action: 'Type Y and press Enter',
    subIcon: Terminal,
  },
  {
    icon: RotateCcw,
    color: '#f97316',
    title: '"Interrupted" message?',
    action: 'Type "continue"',
    subIcon: MessageSquare,
  },
  {
    icon: Terminal,
    color: '#8b5cf6',
    title: 'Other terminal window?',
    action: 'Leave it open — it runs your app',
    subIcon: Eye,
  },
  {
    icon: Eye,
    color: '#06b6d4',
    title: 'Where is my app?',
    action: 'Check your browser tab at localhost',
    subIcon: RefreshCw,
  },
];

const commands = [
  { cmd: '/build', desc: 'Start building', icon: Hammer, color: '#f97316' },
  { cmd: '/fix', desc: 'Fix something', icon: Wrench, color: '#ef4444' },
  { cmd: '/brainstorm', desc: 'Get ideas', icon: Lightbulb, color: '#eab308' },
  { cmd: '/polish', desc: 'Make it pretty', icon: Sparkles, color: '#a855f7' },
  { cmd: '/demo', desc: 'Prep your pitch', icon: Mic, color: '#22c55e' },
  { cmd: '/help', desc: 'This page', icon: HelpCircle, color: '#0ea5e9' },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      {/* Back nav */}
      <div className="px-6 pt-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium transition-colors" style={{ color: '#ddd' }}>
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      {/* Header */}
      <div className="text-center pt-8 pb-8 px-6">
        <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f97316, #eab308)' }}>
          <HelpCircle className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">Quick Help</h1>
        <p className="text-base" style={{ color: '#ddd' }}>Everything you need, nothing you don&apos;t.</p>
      </div>

      {/* Main tips — visual cards */}
      <div className="max-w-4xl mx-auto px-6 pb-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {tips.map((tip) => (
            <div key={tip.title} className="rounded-xl p-4" style={{ backgroundColor: '#111', border: '1px solid #222' }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${tip.color}20` }}>
                  <tip.icon className="w-5 h-5" style={{ color: tip.color }} />
                </div>
              </div>
              <h3 className="text-base font-bold text-white mb-1">{tip.title}</h3>
              <p className="text-sm font-semibold" style={{ color: tip.color }}>{tip.action}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Commands */}
      <div className="max-w-4xl mx-auto px-6 pb-10">
        <h2 className="text-center text-sm font-bold uppercase tracking-widest mb-4" style={{ color: '#ddd' }}>Type these in Claude</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {commands.map((c) => (
            <div key={c.cmd} className="rounded-xl p-3 text-center" style={{ backgroundColor: '#111', border: '1px solid #222' }}>
              <div className="w-10 h-10 rounded-lg mx-auto mb-1.5 flex items-center justify-center" style={{ backgroundColor: `${c.color}20` }}>
                <c.icon className="w-5 h-5" style={{ color: c.color }} />
              </div>
              <div className="text-sm font-bold text-white">{c.cmd}</div>
            </div>
          ))}
        </div>
      </div>

      {/* The golden rule */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <div className="rounded-2xl p-6 text-center" style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.1), rgba(234,179,8,0.1))', border: '1px solid rgba(249,115,22,0.2)' }}>
          <div className="w-14 h-14 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f97316, #eab308)' }}>
            <MessageSquare className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">The #1 Rule</h2>
          <p className="text-xl font-semibold" style={{ color: '#f97316' }}>
            Just talk to Claude like a person.
          </p>
          <p className="text-base mt-2" style={{ color: '#ddd' }}>
            &quot;Make the header bigger&quot; &middot; &quot;Add a contact form&quot; &middot; &quot;Change the color to blue&quot;
          </p>
        </div>
      </div>
    </div>
  );
}

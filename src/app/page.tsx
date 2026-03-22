import { Users, Zap, Trophy, ArrowRight, Play, Presentation, Terminal, MapPin, Calendar, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

interface EventConfig {
  eventName: string;
  tagline: string;
  subTagline: string;
  date: string;
  time: string;
  location: string;
  room: string;
  maxSpots: number;
  teamsOf: string;
  partner: { name: string; short: string; logoUrl?: string; color: string };
  tracks: { title: string; subtitle: string; desc: string; icon: string; color: string }[];
  schedule: { time: string; title: string; desc: string; color: string }[];
  bringLaptop: boolean;
}

const DEFAULTS: EventConfig = {
  eventName: 'Vibe Code Rally',
  tagline: 'Build a real product using AI in 3 hours.',
  subTagline: 'No experience needed. Just show up.',
  date: 'TBD',
  time: 'TBD',
  location: 'TBD',
  room: '',
  maxSpots: 60,
  teamsOf: '3-4',
  partner: { name: 'University Partner', short: 'Partner', color: '#f97316' },
  tracks: [],
  schedule: [],
  bringLaptop: true,
};

function loadEventConfig(): EventConfig {
  try {
    const p = join(process.cwd(), 'event.config.json');
    if (existsSync(p)) {
      return { ...DEFAULTS, ...JSON.parse(readFileSync(p, 'utf-8')) };
    }
  } catch { /* use defaults */ }
  return DEFAULTS;
}

export default function Home() {
  const cfg = loadEventConfig();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: '#0a0a0a', color: '#ffffff' }}>

      {/* Dot grid background */}
      <div className="fixed inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

      {/* Content — centered on screen */}
      <div className="relative text-center max-w-3xl">

        {/* Co-brand strip */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="flex items-center gap-2.5">
            {cfg.partner.logoUrl && (
              <img src={cfg.partner.logoUrl} alt={cfg.partner.name} className="w-10 h-10 rounded-lg" style={{ border: `1px solid ${cfg.partner.color}30` }} />
            )}
            <span className="text-lg font-bold" style={{ color: cfg.partner.color }}>{cfg.partner.short}</span>
          </div>
          <span style={{ color: '#ddd' }} className="text-xl">&times;</span>
          <div className="flex items-center gap-1.5">
            <Zap className="w-5 h-5" style={{ color: '#f97316' }} />
            <span className="text-lg font-extrabold" style={{ fontFamily: 'var(--font-logo, inherit)' }}>
              <span className="ai-gradient">AI</span>
              <span style={{ color: '#ffffff' }}>Code</span>
              <span className="gradient-text">Rally</span>
            </span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-6xl lg:text-7xl font-extrabold tracking-tight mb-3">
          <span style={{ color: '#f97316' }}>Vibe</span>{' '}
          <span style={{ color: '#ffffff' }}>Code Rally</span>
        </h1>

        <p className="text-2xl font-bold mb-1" style={{ color: '#ffffff' }}>{cfg.tagline}</p>
        <p className="text-lg mb-6" style={{ color: '#ddd' }}>{cfg.subTagline}</p>

        {/* Meta row */}
        <div className="flex items-center justify-center gap-5 flex-wrap text-base font-medium mb-10" style={{ color: '#ddd' }}>
          <span className="inline-flex items-center gap-2">
            <Calendar className="w-5 h-5" style={{ color: cfg.partner.color }} />
            <span className="font-bold" style={{ color: '#fff' }}>{cfg.date} &middot; {cfg.time}</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin className="w-5 h-5" style={{ color: '#a78bfa' }} />
            <span>{cfg.room || cfg.location}</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <Users className="w-5 h-5" style={{ color: '#06b6d4' }} />
            <span>{cfg.maxSpots} spots</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <Trophy className="w-5 h-5" style={{ color: cfg.partner.color }} />
            <span className="font-bold" style={{ color: '#fff' }}>Pizza &amp; Prizes</span>
          </span>
        </div>

        {/* BIG GO BUTTON */}
        <Link
          href="/design/team"
          className="inline-flex items-center gap-3 px-12 py-5 rounded-2xl text-2xl font-extrabold text-white transition-all hover:scale-[1.04] hover:shadow-2xl"
          style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', boxShadow: '0 0 60px rgba(249,115,22,0.35)' }}
        >
          <Play className="w-7 h-7" />
          Enter the Rally
          <ArrowRight className="w-6 h-6" />
        </Link>

        <p className="text-base mt-4" style={{ color: '#ddd' }}>
          Design your app step by step, then Claude builds it.
        </p>

        {/* Quick links */}
        <div className="flex items-center justify-center gap-6 mt-5">
          <Link href="/preview" className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:underline" style={{ color: '#0ea5e9' }}>
            <Presentation className="w-4 h-4" />
            Preview Templates
          </Link>
          <Link href="/help" className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:underline" style={{ color: '#22c55e' }}>
            <HelpCircle className="w-4 h-4" />
            Quick Help
          </Link>
        </div>
      </div>

      {/* Minimal footer */}
      <div className="absolute bottom-4 text-center">
        <p className="text-sm" style={{ color: '#666' }}>
          &copy; {new Date().getFullYear()} AI Code Rally
        </p>
      </div>
    </div>
  );
}

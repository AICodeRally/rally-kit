import { Rocket, Terminal, Clock, Users, Zap, Trophy, ArrowRight, MessageSquare, GraduationCap, TrendingUp, Briefcase, MapPin, Calendar, CheckCircle, Play, Presentation } from 'lucide-react';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

/* ── Event config ─────────────────────────────────────────────────
 * Reads from event.config.json at project root.
 * If missing, falls back to defaults.
 * This makes the landing page reusable for ANY client rally.
 * ──────────────────────────────────────────────────────────────── */
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

const TRACK_ICONS: Record<string, typeof GraduationCap> = {
  GraduationCap, TrendingUp, Briefcase,
};

export default function Home() {
  const cfg = loadEventConfig();
  const hasSchedule = cfg.schedule.length > 0;
  const hasTracks = cfg.tracks.length > 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a', color: '#ffffff' }}>

      {/* ═══ HERO ═══ */}
      <header className="relative pt-10 pb-14 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

        <div className="relative max-w-4xl mx-auto">
          {/* Co-brand strip */}
          <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
            <div className="flex items-center gap-2.5">
              {cfg.partner.logoUrl && (
                <img src={cfg.partner.logoUrl} alt={cfg.partner.name} className="w-10 h-10 rounded-lg" style={{ border: `1px solid ${cfg.partner.color}30` }} />
              )}
              <span className="text-base font-bold" style={{ color: cfg.partner.color }}>{cfg.partner.short}</span>
            </div>
            <span style={{ color: '#ddd' }} className="text-lg">&times;</span>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4" style={{ color: '#f97316' }} />
              <span className="text-base font-extrabold" style={{ fontFamily: 'var(--font-logo, inherit)' }}>
                <span className="ai-gradient">AI</span>
                <span style={{ color: '#ffffff' }}>Code</span>
                <span className="gradient-text">Rally</span>
              </span>
            </div>
          </div>

          {/* Registration badge */}
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ backgroundColor: 'rgba(249,115,22,0.1)', color: '#f97316', border: '1px solid rgba(249,115,22,0.25)' }}>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: '#f97316', animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite' }} />
              <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: '#f97316' }} />
            </span>
            Registration Open
          </span>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4">
            <span className="block" style={{ color: cfg.partner.color }}>{cfg.partner.short}</span>
            <span className="block">
              <span style={{ color: '#f97316' }}>Vibe</span>{' '}
              <span style={{ color: '#ffffff' }}>Code Rally</span>
            </span>
          </h1>

          <p className="text-xl sm:text-2xl font-bold mb-2" style={{ color: '#ffffff' }}>{cfg.tagline}</p>
          <p className="text-base sm:text-lg mb-6" style={{ color: '#e0e0e0' }}>{cfg.subTagline}</p>

          {/* Meta row */}
          <div className="flex items-center justify-center gap-5 flex-wrap text-base font-medium" style={{ color: '#e0e0e0' }}>
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
        </div>
      </header>

      {/* ═══ WHAT IS VIBE CODING ═══ */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#06b6d4' }}>Wait, what is this?</p>
          <h2 className="text-2xl font-extrabold mb-4" style={{ color: '#ffffff' }}>What is a Vibe Code Rally?</h2>

          <div className="rounded-xl p-6 space-y-5" style={{ backgroundColor: '#111', border: '1px solid #222' }}>
            <p className="text-base leading-relaxed" style={{ color: '#e0e0e0' }}>
              <strong style={{ color: '#fff' }}>Vibe coding</strong> = you describe what you want in plain English, and AI builds it for you. No syntax. No Stack Overflow. You <strong style={{ color: '#fff' }}>talk to the computer and it writes the code.</strong>
            </p>
            <p className="text-base leading-relaxed" style={{ color: '#e0e0e0' }}>
              Think of it like directing a movie. You don&apos;t operate the camera &mdash; you tell the AI what to build, tweak the results, and ship something real.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { Icon: MessageSquare, color: '#06b6d4', label: 'Describe', sub: 'Tell AI what to build' },
                { Icon: Zap, color: '#f97316', label: 'Generate', sub: 'AI writes the code' },
                { Icon: Rocket, color: '#8b5cf6', label: 'Tweak', sub: 'Refine the output' },
                { Icon: Trophy, color: '#22c55e', label: 'Ship', sub: 'Deploy it live' },
              ].map((step) => (
                <div key={step.label} className="text-center">
                  <step.Icon className="w-6 h-6 mx-auto mb-1.5" style={{ color: step.color }} />
                  <div className="text-sm font-bold" style={{ color: '#fff' }}>{step.label}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#ddd' }}>{step.sub}</div>
                </div>
              ))}
            </div>

            <p className="text-base leading-relaxed" style={{ color: '#e0e0e0' }}>
              A <strong style={{ color: '#fff' }}>Vibe Code Rally</strong> is a 3-hour jam session where teams of {cfg.teamsOf} race to build the best product using AI. No experience necessary. Come with an open mind to learn about the power of AI and how it can help you as you prepare to leverage your college degree. It&apos;s a fun, high-energy event, but... <strong style={{ color: '#fff' }}>the best demo wins.</strong>
            </p>

            <p className="text-sm" style={{ color: '#ccc' }}>
              <strong style={{ color: '#fff' }}>You do NOT need to know how to code.</strong> If you can describe an idea clearly, you can vibe code it.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ TRACKS ═══ */}
      {hasTracks && (
        <section className="py-12 px-6">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#f97316' }}>Pick your fight</p>
            <h2 className="text-2xl font-extrabold mb-4" style={{ color: '#ffffff' }}>Three Tracks</h2>

            <div className="space-y-2">
              {cfg.tracks.map((track) => {
                const Icon = TRACK_ICONS[track.icon] || GraduationCap;
                return (
                  <div key={track.title} className="rounded-xl p-5 flex items-start gap-4" style={{ backgroundColor: '#111', border: '1px solid #222' }}>
                    <div className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: `${track.color}15` }}>
                      <Icon className="w-5 h-5" style={{ color: track.color }} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold" style={{ color: '#fff' }}>{track.title}</h3>
                      <p className="text-sm font-medium" style={{ color: track.color }}>{track.subtitle}</p>
                      <p className="text-sm mt-1" style={{ color: '#ddd' }}>{track.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══ STATS BAR ═══ */}
      <section className="py-10 px-6">
        <div className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { value: '3hr', label: 'Duration' },
            { value: cfg.teamsOf, label: 'Per Team' },
            { value: 'Free', label: 'Pizza & Prizes' },
            { value: String(cfg.maxSpots), label: 'Max Spots' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl p-4 text-center" style={{ backgroundColor: '#111', border: '1px solid #222' }}>
              <div className="text-2xl font-extrabold" style={{ color: '#f97316' }}>{stat.value}</div>
              <div className="text-xs uppercase tracking-wider mt-1" style={{ color: '#ddd' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ SCHEDULE ═══ */}
      {hasSchedule && (
        <section className="py-12 px-6">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#06b6d4' }}>The game plan</p>
            <h2 className="text-2xl font-extrabold mb-6" style={{ color: '#ffffff' }}>Event Schedule</h2>

            <div className="relative pl-8 space-y-6">
              <div className="absolute left-[11px] top-2 bottom-2 w-px" style={{ background: 'linear-gradient(to bottom, #f97316, #06b6d4, #22c55e)' }} />
              {cfg.schedule.map((item) => (
                <div key={item.time} className="relative flex items-start gap-4">
                  <div className="absolute -left-8 top-1.5 w-[10px] h-[10px] rounded-full" style={{ borderWidth: 2, borderStyle: 'solid', borderColor: item.color, backgroundColor: '#0a0a0a' }} />
                  <div>
                    <span className="text-sm font-bold" style={{ color: item.color }}>{item.time}</span>
                    <h3 className="text-base font-bold mt-0.5" style={{ color: '#fff' }}>{item.title}</h3>
                    <p className="text-sm leading-relaxed mt-0.5" style={{ color: '#ddd' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ WHAT TO BRING ═══ */}
      {cfg.bringLaptop && (
        <section className="py-10 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-xl p-6 flex items-start gap-4" style={{ backgroundColor: '#111', border: `1px solid ${cfg.partner.color}30` }}>
              <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: `${cfg.partner.color}15` }}>
                <span className="text-2xl">&#128187;</span>
              </div>
              <div>
                <h3 className="text-lg font-bold" style={{ color: '#fff' }}>Bring a laptop</h3>
                <p className="text-base leading-relaxed" style={{ color: '#e0e0e0' }}>
                  A laptop is <strong style={{ color: cfg.partner.color }}>required</strong> to participate. You&apos;ll use it to direct AI and build your project. Charger recommended &mdash; it&apos;s a 3-hour sprint.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══ CTA — Talk to Claude ═══ */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl p-8 text-center" style={{ background: 'linear-gradient(135deg, #111, #1a1a1a)', border: '1px solid #333' }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5" style={{ backgroundColor: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#22c55e', animation: 'pulse 2s infinite' }} />
              <span className="text-sm font-semibold" style={{ color: '#4ade80' }}>Ready to build</span>
            </div>

            <h2 className="text-3xl font-bold mb-3" style={{ color: '#ffffff' }}>Talk to Claude in Your Terminal</h2>
            <p className="text-lg mb-6 max-w-xl mx-auto" style={{ color: '#ddd' }}>
              Claude is your AI coding partner. Describe your business idea and watch this page transform into your app.
            </p>

            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl" style={{ backgroundColor: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.25)' }}>
              <Terminal className="w-5 h-5" style={{ color: '#38bdf8' }} />
              <span className="text-base font-medium" style={{ color: '#e2e8f0' }}>Switch to the terminal window</span>
              <ArrowRight className="w-4 h-4" style={{ color: '#38bdf8' }} />
            </div>

            <p className="text-sm mt-5" style={{ color: '#ddd' }}>
              This page updates live as Claude builds your app — just refresh your browser.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER — Standard AICR website footer ═══ */}
      <footer className="relative pt-12 pb-8" style={{ backgroundColor: '#0a0a0a' }}>
        {/* Animated gradient top border */}
        <div className="absolute top-0 left-0 right-0 h-[2px] gradient-animate" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* 3-column grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">
            {/* Brand column */}
            <div>
              <span className="text-xl font-extrabold block mb-3" style={{ fontFamily: 'var(--font-logo, inherit)' }}>
                <span className="ai-gradient">AI</span>
                <span style={{ color: '#ffffff' }}>Code</span>
                <span className="gradient-text">Rally</span>
              </span>
              <p className="text-base leading-relaxed" style={{ color: '#ccc' }}>
                Custom tools powered by AI. Built for your business. You own everything.
              </p>
            </div>

            {/* Product column */}
            <div>
              <p className="text-sm uppercase tracking-wider font-semibold mb-3" style={{ color: '#ccc' }}>Product</p>
              <nav className="flex flex-col gap-2 text-base" style={{ color: '#ccc' }}>
                <a href="https://aicoderally.com/#how-it-works" className="hover:text-white transition-colors">How It Works</a>
                <a href="https://aicoderally.com/campus" className="hover:text-white transition-colors">Campus</a>
                <a href="https://aicoderally.com/training" className="hover:text-white transition-colors">Training</a>
                <a href="https://aicoderally.com/#contact" className="hover:text-white transition-colors">Start a Rally</a>
              </nav>
            </div>

            {/* Company column */}
            <div>
              <p className="text-sm uppercase tracking-wider font-semibold mb-3" style={{ color: '#ccc' }}>Company</p>
              <nav className="flex flex-col gap-2 text-base" style={{ color: '#ccc' }}>
                <a href="https://aicoderally.com/partners" className="hover:text-white transition-colors">Partners</a>
                <a href="https://aicoderally.com/intel" className="hover:text-white transition-colors">The Vibe Check</a>
                <a href="https://aicoderally.com/legal" className="hover:text-white transition-colors">Legal</a>
              </nav>
            </div>
          </div>

          {/* Bottom row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid #222', paddingTop: '1.5rem' }}>
            <p className="text-base" style={{ color: '#ccc' }}>
              &copy; {new Date().getFullYear()} AI Code Rally &middot; Powered by{' '}
              <span className="gradient-text font-bold" style={{ fontFamily: 'var(--font-logo, inherit)' }}>AICR</span>
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-5">
              {/* LinkedIn */}
              <a href="https://www.linkedin.com/company/aicoderally" target="_blank" rel="noopener noreferrer" className="transition-colors" style={{ color: '#ccc' }} aria-label="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              {/* X / Twitter */}
              <a href="https://twitter.com/aicoderally" target="_blank" rel="noopener noreferrer" className="transition-colors" style={{ color: '#ccc' }} aria-label="X (Twitter)">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              {/* Email */}
              <a href="mailto:todd@aicoderally.com" className="transition-colors" style={{ color: '#ccc' }} aria-label="Email">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

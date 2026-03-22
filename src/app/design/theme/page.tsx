'use client';

import {
  Palette, Droplets, Sun, Trees, Cherry, Layers, Sparkles,
  Flame, Snowflake, Moon, Zap, Heart, Crown, Coffee, Waves, Circle,
} from 'lucide-react';
import DesignProgress from '@/components/DesignProgress';

const themeOptions = [
  {
    name: 'Ocean',
    icon: Droplets,
    accent: '#0ea5e9',
    secondary: '#06b6d4',
    tertiary: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
    vibe: 'Clean, professional, trustworthy',
    brands: 'Stripe, Linear, Vercel',
  },
  {
    name: 'Sunset',
    icon: Sun,
    accent: '#f97316',
    secondary: '#eab308',
    tertiary: '#ef4444',
    gradient: 'linear-gradient(135deg, #f97316, #eab308)',
    vibe: 'Bold, energetic, attention-grabbing',
    brands: 'Strava, Soundcloud, Reddit',
  },
  {
    name: 'Forest',
    icon: Trees,
    accent: '#22c55e',
    secondary: '#14b8a6',
    tertiary: '#84cc16',
    gradient: 'linear-gradient(135deg, #22c55e, #14b8a6)',
    vibe: 'Natural, calm, growth-oriented',
    brands: 'Robinhood, Spotify, Mint',
  },
  {
    name: 'Berry',
    icon: Cherry,
    accent: '#a855f7',
    secondary: '#ec4899',
    tertiary: '#6366f1',
    gradient: 'linear-gradient(135deg, #a855f7, #ec4899)',
    vibe: 'Creative, playful, premium',
    brands: 'Figma, Notion, Twitch',
  },
  {
    name: 'Slate',
    icon: Layers,
    accent: '#64748b',
    secondary: '#0ea5e9',
    tertiary: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #64748b, #475569)',
    vibe: 'Minimal, sophisticated, neutral',
    brands: 'Apple, GitHub, Tesla',
  },
  {
    name: 'Neon',
    icon: Zap,
    accent: '#22d3ee',
    secondary: '#a3e635',
    tertiary: '#f472b6',
    gradient: 'linear-gradient(135deg, #22d3ee, #a3e635)',
    vibe: 'Electric, futuristic, high-energy',
    brands: 'Cyberpunk, Discord, Razer',
  },
  {
    name: 'Lava',
    icon: Flame,
    accent: '#ef4444',
    secondary: '#f97316',
    tertiary: '#eab308',
    gradient: 'linear-gradient(135deg, #ef4444, #f97316)',
    vibe: 'Intense, powerful, urgent',
    brands: 'YouTube, Netflix, ESPN',
  },
  {
    name: 'Midnight',
    icon: Moon,
    accent: '#6366f1',
    secondary: '#8b5cf6',
    tertiary: '#06b6d4',
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    vibe: 'Deep, mysterious, premium',
    brands: 'Starlink, Calm, Headspace',
  },
  {
    name: 'Rose',
    icon: Heart,
    accent: '#f43f5e',
    secondary: '#fb7185',
    tertiary: '#fda4af',
    gradient: 'linear-gradient(135deg, #f43f5e, #fb7185)',
    vibe: 'Warm, friendly, approachable',
    brands: 'Airbnb, Pinterest, Glossier',
  },
  {
    name: 'Arctic',
    icon: Snowflake,
    accent: '#38bdf8',
    secondary: '#e0f2fe',
    tertiary: '#7dd3fc',
    gradient: 'linear-gradient(135deg, #38bdf8, #bae6fd)',
    vibe: 'Icy, crisp, ultra-clean',
    brands: 'Dropbox, Zoom, Salesforce',
  },
  {
    name: 'Gold',
    icon: Crown,
    accent: '#eab308',
    secondary: '#ca8a04',
    tertiary: '#fbbf24',
    gradient: 'linear-gradient(135deg, #eab308, #ca8a04)',
    vibe: 'Luxury, premium, high-end',
    brands: 'Louis Vuitton, Rolls-Royce, Amex',
  },
  {
    name: 'Mocha',
    icon: Coffee,
    accent: '#92400e',
    secondary: '#b45309',
    tertiary: '#d97706',
    gradient: 'linear-gradient(135deg, #92400e, #b45309)',
    vibe: 'Earthy, warm, artisan',
    brands: 'Starbucks, Etsy, Patagonia',
  },
  {
    name: 'Coral',
    icon: Waves,
    accent: '#fb923c',
    secondary: '#f87171',
    tertiary: '#fbbf24',
    gradient: 'linear-gradient(135deg, #fb923c, #f87171)',
    vibe: 'Tropical, vibrant, fun',
    brands: 'Duolingo, Headspace, Calm',
  },
  {
    name: 'Mono',
    icon: Circle,
    accent: '#ffffff',
    secondary: '#a1a1aa',
    tertiary: '#71717a',
    gradient: 'linear-gradient(135deg, #27272a, #18181b)',
    vibe: 'Black and white, stark, modern',
    brands: 'Nike, Uber, X (Twitter)',
  },
];

function MiniCard({ accent, secondary }: { accent: string; secondary: string }) {
  return (
    <div className="rounded-lg overflow-hidden" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
      {/* Mini header */}
      <div className="h-5 flex items-center px-1.5 gap-1" style={{ backgroundColor: accent + '15' }}>
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
        <div className="w-8 h-1 rounded-full" style={{ backgroundColor: accent + '40' }} />
      </div>
      {/* Mini stats */}
      <div className="p-1.5 flex gap-1">
        <div className="flex-1 rounded p-1" style={{ backgroundColor: accent + '10', border: `1px solid ${accent}25` }}>
          <div className="w-3 h-0.5 rounded-full mb-0.5" style={{ backgroundColor: accent + '30' }} />
          <div className="w-6 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
        </div>
        <div className="flex-1 rounded p-1" style={{ backgroundColor: secondary + '10', border: `1px solid ${secondary}25` }}>
          <div className="w-3 h-0.5 rounded-full mb-0.5" style={{ backgroundColor: secondary + '30' }} />
          <div className="w-6 h-1.5 rounded-full" style={{ backgroundColor: secondary }} />
        </div>
      </div>
      {/* Mini chart */}
      <div className="px-1.5 pb-1.5">
        <div className="h-6 rounded flex items-end gap-px px-0.5" style={{ backgroundColor: '#111' }}>
          {[40, 70, 55, 85, 60, 90, 75].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t"
              style={{
                height: `${h}%`,
                backgroundColor: i % 2 === 0 ? accent : secondary,
                opacity: 0.7,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DesignTheme() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      <DesignProgress current={8} />

      <div className="max-w-6xl mx-auto px-4 pt-3 pb-8">
        <div className="flex items-center justify-center gap-3 mb-1">
          <Palette className="w-7 h-7" style={{ color: '#f97316' }} />
          <h1 className="text-3xl font-extrabold text-white text-center">Pick Your Color Theme</h1>
        </div>
        <p className="text-base text-center mb-5" style={{ color: '#ddd' }}>
          Sets the vibe for your whole app. Every button, chart, and accent follows this palette.
        </p>

        {/* Theme grid — rows of 7, tighter cards */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {themeOptions.map((theme) => (
            <div key={theme.name} className="rounded-xl overflow-hidden" style={{ backgroundColor: '#111', border: '1px solid #222' }}>
              {/* Color swatch header */}
              <div
                className="h-16 relative flex items-center justify-center"
                style={{ background: theme.gradient }}
              >
                <theme.icon className="w-7 h-7 text-white/90" />
                {/* Color dots */}
                <div className="absolute bottom-1.5 left-0 right-0 flex justify-center gap-1">
                  <div className="w-3 h-3 rounded-full border border-white/30" style={{ backgroundColor: theme.accent }} />
                  <div className="w-3 h-3 rounded-full border border-white/30" style={{ backgroundColor: theme.secondary }} />
                  <div className="w-3 h-3 rounded-full border border-white/30" style={{ backgroundColor: theme.tertiary }} />
                </div>
              </div>

              <div className="p-2">
                <h3 className="text-sm font-bold text-white mb-0.5">{theme.name}</h3>
                <p className="text-xs mb-1.5" style={{ color: theme.accent }}>{theme.vibe}</p>

                {/* Mini preview card */}
                <MiniCard accent={theme.accent} secondary={theme.secondary} />

                <p className="text-xs mt-1.5" style={{ color: '#ddd' }}>{theme.brands}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Custom theme option */}
        <div className="rounded-xl p-4 flex items-center gap-4" style={{ background: 'linear-gradient(135deg, #f97316, #ec4899, #8b5cf6)', border: '1px solid #f9731640' }}>
          <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/20 backdrop-blur">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Custom Colors</h3>
            <p className="text-sm mb-2" style={{ color: 'rgba(255,255,255,0.9)' }}>
              Tell Claude your brand colors or vibe. &quot;Make it look like a luxury brand&quot; or &quot;I want neon green and black.&quot;
            </p>
            <div className="flex gap-2.5">
              {['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6eb4', '#00d2ff', '#c471f5', '#fca311'].map((c) => (
                <div key={c} className="w-5 h-5 rounded-full" style={{ backgroundColor: c }} />
              ))}
              <span className="text-sm self-center ml-1 text-white/80">Any color you want</span>
            </div>
          </div>
        </div>

        {/* What Claude asks */}
        <div className="mt-4 rounded-xl p-4" style={{ backgroundColor: '#111', border: '1px solid #222' }}>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: '#f97316' }}>
            Claude will ask you
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              'Which color theme fits your brand?',
              'Want light mode, dark mode, or both?',
              'Any specific colors you love?',
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

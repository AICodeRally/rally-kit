'use client';

import { Home, Dumbbell, Trophy, BarChart3, User, Flame, Timer, TrendingUp, Target, Activity } from 'lucide-react';

import MobileShell from '@/components/shells/MobileShell';
import StatCard from '@/components/StatCard';
import ListItem from '@/components/ListItem';
import MetricRow from '@/components/MetricRow';
import PageHeader from '@/components/PageHeader';

const navItems = [
  { label: 'Home', href: '/preview/mobile', icon: Home },
  { label: 'Workouts', href: '/preview/mobile', icon: Dumbbell },
  { label: 'Goals', href: '/preview/mobile', icon: Trophy },
  { label: 'Stats', href: '/preview/mobile', icon: BarChart3 },
  { label: 'Profile', href: '/preview/mobile', icon: User },
];

export default function PreviewMobile() {
  return (
    <MobileShell appName="FitTrack" navItems={navItems}>
      <PageHeader title="Hey Alex!" subtitle="You're on a 7-day streak" />

      <div className="space-y-4">
        {/* Today's stats */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard title="Calories" value="2,100" icon={Flame} trend={{ value: '12%', positive: true }} accent="primary" />
          <StatCard title="Workouts" value="24" icon={Dumbbell} trend={{ value: '3 this week', positive: true }} accent="secondary" />
        </div>

        <MetricRow metrics={[
          { label: 'Streak', value: '7 days' },
          { label: 'Steps', value: '8,432' },
          { label: 'Sleep', value: '7.5 hr' },
        ]} />

        {/* Today's plan */}
        <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest pt-2">Today&apos;s Plan</h3>
        <div className="bg-bg-card border border-border-default rounded-xl overflow-hidden">
          <ListItem icon={Dumbbell} title="Upper Body Strength" subtitle="45 min — Chest, shoulders, triceps" badge={{ label: 'Next Up' }} />
          <ListItem icon={Timer} title="HIIT Cardio" subtitle="20 min — High intensity intervals" badge={{ label: '4:00 PM', color: 'bg-success/10 text-success' }} />
          <ListItem icon={Target} title="Stretch + Cool Down" subtitle="15 min — Full body flexibility" />
        </div>

        {/* Recent activity */}
        <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest pt-2">This Week</h3>
        <div className="bg-bg-card border border-border-default rounded-xl overflow-hidden">
          <ListItem icon={Activity} title="Monday — Leg Day" subtitle="52 min — 380 cal burned" badge={{ label: 'Done', color: 'bg-success/10 text-success' }} />
          <ListItem icon={Activity} title="Tuesday — Cardio" subtitle="35 min — 290 cal burned" badge={{ label: 'Done', color: 'bg-success/10 text-success' }} />
          <ListItem icon={Activity} title="Wednesday — Rest Day" subtitle="Stretching only — 45 cal" badge={{ label: 'Done', color: 'bg-success/10 text-success' }} />
        </div>

        {/* Sample badge */}
        <div className="text-center pt-4 pb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(249,115,22,0.1)', color: '#f97316', border: '1px solid rgba(249,115,22,0.2)' }}>
            <Dumbbell className="w-3.5 h-3.5" />
            Sample mobile app — Claude builds YOUR idea like this
          </span>
        </div>
      </div>
    </MobileShell>
  );
}

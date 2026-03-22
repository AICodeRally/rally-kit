'use client';

import { Home, Briefcase, Code, Mail, Star, MapPin, GraduationCap, ExternalLink, User } from 'lucide-react';
import PortfolioShell from '@/components/shells/PortfolioShell';
import StatCard from '@/components/StatCard';
import DetailCard from '@/components/DetailCard';
import PageHeader from '@/components/PageHeader';

const navItems = [
  { label: 'Home', href: '/preview/portfolio', icon: Home },
  { label: 'Projects', href: '/preview/portfolio', icon: Briefcase },
  { label: 'Skills', href: '/preview/portfolio', icon: Code },
  { label: 'Contact', href: '/preview/portfolio', icon: Mail },
];

export default function PreviewPortfolio() {
  return (
    <PortfolioShell
      appName="Alex Johnson"
      navItems={navItems}
      heroContent={
        <div className="text-center">
          {/* Avatar placeholder */}
          <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: 'rgba(168,85,247,0.15)', border: '3px solid rgba(168,85,247,0.3)' }}>
            <User className="w-10 h-10" style={{ color: '#a855f7' }} />
          </div>
          <h2 className="text-3xl font-bold text-text-primary mb-1">Alex Johnson</h2>
          <p className="text-lg text-text-secondary">Future Product Manager — GCU Class of 2027</p>
          <div className="flex items-center justify-center gap-1 mt-2">
            <MapPin className="w-4 h-4 text-text-muted" />
            <span className="text-sm text-text-muted">Phoenix, AZ</span>
          </div>
          <p className="text-base text-text-muted mt-3 max-w-lg mx-auto">
            Business student turning ideas into products. I built this portfolio with AI in 3 hours at the Vibe Code Rally.
          </p>
        </div>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard title="Projects" value="12" icon={Briefcase} accent="primary" />
        <StatCard title="Skills" value="8" icon={Star} accent="secondary" />
        <StatCard title="GPA" value="3.85" icon={GraduationCap} accent="success" />
      </div>

      {/* Projects grid */}
      <PageHeader title="Projects" subtitle="" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-bg-card border border-border-default rounded-xl overflow-hidden">
          <div className="h-32 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(236,72,153,0.1))' }}>
            <Code className="w-10 h-10" style={{ color: '#a855f7' }} />
          </div>
          <div className="p-4">
            <h3 className="text-base font-bold text-text-primary">Campus Connect</h3>
            <p className="text-sm text-text-secondary mt-1">Study group finder for GCU students</p>
            <div className="flex gap-2 mt-3">
              <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent">React</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/10 text-secondary">Firebase</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-tertiary/10 text-tertiary">250+ users</span>
            </div>
          </div>
        </div>

        <div className="bg-bg-card border border-border-default rounded-xl overflow-hidden">
          <div className="h-32 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.15), rgba(6,182,212,0.1))' }}>
            <Briefcase className="w-10 h-10" style={{ color: '#0ea5e9' }} />
          </div>
          <div className="p-4">
            <h3 className="text-base font-bold text-text-primary">Budget Buddy</h3>
            <p className="text-sm text-text-secondary mt-1">Personal finance tracker for college students</p>
            <div className="flex gap-2 mt-3">
              <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent">Next.js</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/10 text-secondary">Tailwind</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-tertiary/10 text-tertiary">100+ users</span>
            </div>
          </div>
        </div>
      </div>

      {/* Skills + Contact side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <DetailCard
          title="Skills"
          fields={[
            { label: 'Product', value: 'Figma, Notion, Jira' },
            { label: 'Data', value: 'Excel, SQL, Tableau' },
            { label: 'Marketing', value: 'HubSpot, Analytics' },
            { label: 'AI Tools', value: 'Claude, ChatGPT, Midjourney' },
          ]}
        />
        <DetailCard
          title="Contact"
          fields={[
            { label: 'Email', value: 'alex.johnson@my.gcu.edu' },
            { label: 'LinkedIn', value: 'linkedin.com/in/alexj' },
            { label: 'GitHub', value: 'github.com/alexj27' },
            { label: 'Location', value: 'Phoenix, AZ' },
          ]}
        />
      </div>

      {/* Sample badge */}
      <div className="text-center pt-4">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(168,85,247,0.1)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.2)' }}>
          <GraduationCap className="w-3.5 h-3.5" />
          Sample portfolio — Claude builds YOUR profile like this
        </span>
      </div>
    </PortfolioShell>
  );
}

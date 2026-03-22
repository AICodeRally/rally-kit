'use client';

import { User, Users, ArrowLeftRight, Building2, ArrowRight } from 'lucide-react';
import DesignProgress from '@/components/DesignProgress';

const userModels = [
  {
    title: 'One-Sided',
    subtitle: 'One type of user',
    icon: User,
    color: '#0ea5e9',
    gradient: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
    example: 'A pet owner managing their own bookings',
    apps: 'Mint, Todoist, MyFitnessPal',
    diagram: ['Customer'],
  },
  {
    title: 'Two-Sided',
    subtitle: 'Two types of users interact',
    icon: ArrowLeftRight,
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    example: 'Pet owners find and book pet sitters',
    apps: 'Airbnb, Uber, Rover',
    diagram: ['Buyer', 'Seller'],
  },
  {
    title: 'Team / Multi-Role',
    subtitle: 'One org, different access levels',
    icon: Users,
    color: '#22c55e',
    gradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
    example: 'Admin manages staff schedules and clients',
    apps: 'Slack, Notion, Asana',
    diagram: ['Admin', 'Staff', 'Client'],
  },
  {
    title: 'Solo Operator',
    subtitle: 'You run the whole business',
    icon: Building2,
    color: '#f97316',
    gradient: 'linear-gradient(135deg, #f97316, #ea580c)',
    example: 'One person managing a tutoring business',
    apps: 'Square, Calendly, QuickBooks',
    diagram: ['You'],
  },
];

export default function DesignUsers() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      <DesignProgress current={4} />

      <div className="max-w-6xl mx-auto px-4 pt-3 pb-8">
        <h1 className="text-3xl font-extrabold text-white text-center mb-1">Who Uses Your App?</h1>
        <p className="text-base text-center mb-5" style={{ color: '#ddd' }}>This shapes every page Claude builds. Pick the model that fits.</p>

        <div className="grid grid-cols-4 gap-3">
          {userModels.map((model) => (
            <div key={model.title} className="rounded-xl overflow-hidden" style={{ backgroundColor: '#111', border: '1px solid #222' }}>
              {/* Gradient header with diagram */}
              <div className="h-36 relative flex items-center justify-center" style={{ background: model.gradient }}>
                {/* User diagram */}
                <div className="flex items-center gap-3">
                  {model.diagram.map((role, i) => (
                    <div key={role} className="flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xs font-bold text-white mt-1">{role}</span>
                      </div>
                      {i < model.diagram.length - 1 && (
                        <ArrowLeftRight className="w-5 h-5 text-white/60" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  <model.icon className="w-5 h-5" style={{ color: model.color }} />
                  <h3 className="text-base font-bold text-white">{model.title}</h3>
                </div>
                <p className="text-sm font-medium mb-2" style={{ color: model.color }}>{model.subtitle}</p>
                <p className="text-sm mb-2" style={{ color: '#ddd' }}>{model.example}</p>
                <p className="text-xs" style={{ color: '#ddd' }}>Think: {model.apps}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

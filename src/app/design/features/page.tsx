'use client';

import {
  Search, UserCircle, CalendarCheck, CreditCard, Star,
  BarChart3, Bell, MessageSquare, Share2, MapPin,
  Shield, FileText, Upload, Settings, Gift,
  ShoppingCart, Heart, Clock, Tag, Truck,
} from 'lucide-react';
import DesignProgress from '@/components/DesignProgress';
import { type LucideIcon } from 'lucide-react';

interface Feature {
  name: string;
  icon: LucideIcon;
  color: string;
}

const featureGroups: { label: string; color: string; features: Feature[] }[] = [
  {
    label: 'Browse + Discover',
    color: '#0ea5e9',
    features: [
      { name: 'Search + Filter', icon: Search, color: '#0ea5e9' },
      { name: 'Map View', icon: MapPin, color: '#0ea5e9' },
      { name: 'Categories / Tags', icon: Tag, color: '#0ea5e9' },
      { name: 'Favorites', icon: Heart, color: '#0ea5e9' },
    ],
  },
  {
    label: 'Profiles + Identity',
    color: '#8b5cf6',
    features: [
      { name: 'User Profiles', icon: UserCircle, color: '#8b5cf6' },
      { name: 'Reviews + Ratings', icon: Star, color: '#8b5cf6' },
      { name: 'Verification', icon: Shield, color: '#8b5cf6' },
      { name: 'Photo Upload', icon: Upload, color: '#8b5cf6' },
    ],
  },
  {
    label: 'Booking + Commerce',
    color: '#22c55e',
    features: [
      { name: 'Book / Schedule', icon: CalendarCheck, color: '#22c55e' },
      { name: 'Shopping Cart', icon: ShoppingCart, color: '#22c55e' },
      { name: 'Payments', icon: CreditCard, color: '#22c55e' },
      { name: 'Order Tracking', icon: Truck, color: '#22c55e' },
    ],
  },
  {
    label: 'Data + Analytics',
    color: '#f97316',
    features: [
      { name: 'Dashboard KPIs', icon: BarChart3, color: '#f97316' },
      { name: 'Activity History', icon: Clock, color: '#f97316' },
      { name: 'Reports', icon: FileText, color: '#f97316' },
      { name: 'Settings', icon: Settings, color: '#f97316' },
    ],
  },
  {
    label: 'Engagement',
    color: '#ec4899',
    features: [
      { name: 'Notifications', icon: Bell, color: '#ec4899' },
      { name: 'Messaging', icon: MessageSquare, color: '#ec4899' },
      { name: 'Referrals', icon: Share2, color: '#ec4899' },
      { name: 'Rewards / Loyalty', icon: Gift, color: '#ec4899' },
    ],
  },
];

export default function DesignFeatures() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      <DesignProgress current={5} />

      <div className="max-w-6xl mx-auto px-4 pt-3 pb-8">
        <h1 className="text-3xl font-extrabold text-white text-center mb-1">Pick Your Features</h1>
        <p className="text-base text-center mb-5" style={{ color: '#ddd' }}>Tell Claude your top 3-4. You can always add more later.</p>

        <div className="space-y-3">
          {featureGroups.map((group) => (
            <div key={group.label}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-bold uppercase tracking-widest" style={{ color: group.color }}>{group.label}</span>
                <div className="flex-1 h-px" style={{ backgroundColor: `${group.color}25` }} />
              </div>
              <div className="grid grid-cols-4 gap-2.5">
                {group.features.map((feat) => (
                  <div
                    key={feat.name}
                    className="rounded-xl p-3.5 flex items-center gap-3"
                    style={{ backgroundColor: '#111', border: '1px solid #222' }}
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${feat.color}20` }}>
                      <feat.icon className="w-5 h-5" style={{ color: feat.color }} />
                    </div>
                    <span className="text-sm font-bold text-white leading-tight">{feat.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-base mt-3" style={{ color: '#ddd' }}>
          Don&apos;t see what you need? Describe it to Claude — anything goes.
        </p>
      </div>
    </div>
  );
}

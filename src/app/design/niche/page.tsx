'use client';

import {
  Dumbbell, Home, GraduationCap, Camera, Scissors,
  Heart, Truck, Wrench, Dog, UtensilsCrossed,
  Car, Baby, Leaf, Music, Shirt,
} from 'lucide-react';
import DesignProgress from '@/components/DesignProgress';

/* Each business type has sub-niches. Claude shows the relevant set
   based on what the student picked in Step 2. This page shows ALL
   niches grouped by parent type so students can browse visually. */

const niches = [
  {
    parent: 'Service Business',
    color: '#eab308',
    items: [
      { name: 'Fitness / Personal Training', icon: Dumbbell, brands: 'ClassPass, Mindbody' },
      { name: 'Home Services', icon: Home, brands: 'TaskRabbit, Thumbtack' },
      { name: 'Tutoring / Teaching', icon: GraduationCap, brands: 'Wyzant, Varsity Tutors' },
      { name: 'Events / Photography', icon: Camera, brands: 'The Knot, Peerspace' },
      { name: 'Beauty / Salon', icon: Scissors, brands: 'Booksy, Vagaro' },
      { name: 'Pet Services', icon: Dog, brands: 'Rover, Wag' },
      { name: 'Auto / Car Care', icon: Car, brands: 'Yelp, RepairPal' },
      { name: 'Wellness / Therapy', icon: Heart, brands: 'Headspace, BetterHelp' },
    ],
  },
  {
    parent: 'Product Business',
    color: '#f97316',
    items: [
      { name: 'Food / Beverage', icon: UtensilsCrossed, brands: 'DoorDash, Toast' },
      { name: 'Fashion / Apparel', icon: Shirt, brands: 'SHEIN, Depop' },
      { name: 'Baby / Kids', icon: Baby, brands: 'Buy Buy Baby, Primary' },
      { name: 'Eco / Sustainability', icon: Leaf, brands: 'Thrive Market, Grove' },
      { name: 'Music / Audio', icon: Music, brands: 'Fender Play, Reverb' },
      { name: 'Auto Parts / Tools', icon: Wrench, brands: 'AutoZone, McMaster' },
      { name: 'Delivery / Logistics', icon: Truck, brands: 'DoorDash, Instacart' },
    ],
  },
];

export default function DesignNiche() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      <DesignProgress current={3} />

      <div className="max-w-6xl mx-auto px-4 pt-3 pb-8">
        <h1 className="text-3xl font-extrabold text-white text-center mb-1">Get Specific</h1>
        <p className="text-base text-center mb-5" style={{ color: '#ddd' }}>What kind of business exactly? The more specific, the better the app.</p>

        {niches.map((group) => (
          <section key={group.parent} className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-bold uppercase tracking-widest" style={{ color: group.color }}>{group.parent}</span>
              <div className="flex-1 h-px" style={{ backgroundColor: `${group.color}25` }} />
            </div>
            <div className="grid grid-cols-5 gap-2.5">
              {group.items.map((niche) => (
                <div
                  key={niche.name}
                  className="rounded-xl p-3 flex flex-col items-center justify-center text-center h-28"
                  style={{ backgroundColor: '#111', border: '1px solid #222' }}
                >
                  <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: `${group.color}20` }}>
                    <niche.icon className="w-6 h-6" style={{ color: group.color }} />
                  </div>
                  <div className="text-sm font-bold text-white leading-tight">{niche.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#ddd' }}>{niche.brands}</div>
                </div>
              ))}
            </div>
          </section>
        ))}

        <p className="text-center text-base mt-3" style={{ color: '#ddd' }}>
          Don&apos;t see your niche? Just tell Claude — any idea works.
        </p>
      </div>
    </div>
  );
}

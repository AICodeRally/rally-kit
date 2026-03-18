// src/lib/mockData.ts

const FIRST_NAMES = [
  'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn',
  'Parker', 'Sage', 'Dakota', 'Reese', 'Finley', 'Hayden', 'Emerson', 'Blake',
  'Charlie', 'Drew', 'Jamie', 'Skyler', 'Robin', 'Peyton', 'Logan', 'Cameron',
];

const LAST_NAMES = [
  'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson',
];

const COMPANIES = [
  'Acme Corp', 'Globex Inc', 'Initech', 'Hooli', 'Stark Industries',
  'Wayne Enterprises', 'Umbrella Corp', 'Weyland Corp', 'Cyberdyne',
  'Soylent Corp', 'Aperture Labs', 'Massive Dynamic', 'Pied Piper',
  'Prestige Worldwide', 'TechFlow', 'BrightEdge', 'CloudNine', 'DataVault',
];

const STATUSES = ['Active', 'Pending', 'Completed', 'Cancelled', 'In Progress', 'On Hold'];

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomName(): string {
  return `${randomFrom(FIRST_NAMES)} ${randomFrom(LAST_NAMES)}`;
}

export function randomCompany(): string {
  return randomFrom(COMPANIES);
}

export function randomDollars(min = 100, max = 100000): string {
  const amount = randomInt(min, max);
  return `$${amount.toLocaleString()}`;
}

export function randomDollarAmount(min = 100, max = 100000): number {
  return randomInt(min, max);
}

export function randomPercent(min = 1, max = 100): string {
  return `${randomInt(min, max)}%`;
}

export function randomStatus(): string {
  return randomFrom(STATUSES);
}

export function randomDate(daysBack = 90): string {
  const date = new Date();
  date.setDate(date.getDate() - randomInt(0, daysBack));
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function randomISODate(daysBack = 90): string {
  const date = new Date();
  date.setDate(date.getDate() - randomInt(0, daysBack));
  return date.toISOString().split('T')[0];
}

export function randomEmail(name?: string): string {
  const n = name || randomName();
  const [first, last] = n.toLowerCase().split(' ');
  const domains = ['gmail.com', 'outlook.com', 'yahoo.com', 'company.com'];
  return `${first}.${last}@${randomFrom(domains)}`;
}

export function randomPhone(): string {
  return `(${randomInt(200, 999)}) ${randomInt(200, 999)}-${randomInt(1000, 9999)}`;
}

export function randomId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export function generateMany<T>(count: number, factory: (index: number) => T): T[] {
  return Array.from({ length: count }, (_, i) => factory(i));
}

export function generateMonthlyData(
  months = 6,
  valueKey = 'value',
  minVal = 1000,
  maxVal = 10000
): Record<string, unknown>[] {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  return Array.from({ length: months }, (_, i) => {
    const monthIndex = (now.getMonth() - months + 1 + i + 12) % 12;
    return {
      month: monthNames[monthIndex],
      [valueKey]: randomInt(minVal, maxVal),
    };
  });
}

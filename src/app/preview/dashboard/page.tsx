'use client';

import { LayoutDashboard, Users, ShoppingCart, BarChart3, Settings, Coffee, DollarSign, TrendingUp, Clock } from 'lucide-react';

import DashboardShell from '@/components/shells/DashboardShell';
import StatCard from '@/components/StatCard';
import ChartCard from '@/components/ChartCard';
import DataTable from '@/components/DataTable';
import ListItem from '@/components/ListItem';
import MetricRow from '@/components/MetricRow';
import PageHeader from '@/components/PageHeader';

const navItems = [
  { label: 'Dashboard', href: '/preview/dashboard', icon: LayoutDashboard },
  { label: 'Customers', href: '/preview/dashboard', icon: Users },
  { label: 'Orders', href: '/preview/dashboard', icon: ShoppingCart },
  { label: 'Analytics', href: '/preview/dashboard', icon: BarChart3 },
  { label: 'Settings', href: '/preview/dashboard', icon: Settings },
];

const chartData = [
  { month: 'Jan', revenue: 4200, orders: 180 },
  { month: 'Feb', revenue: 5800, orders: 220 },
  { month: 'Mar', revenue: 7100, orders: 310 },
  { month: 'Apr', revenue: 6300, orders: 275 },
  { month: 'May', revenue: 8900, orders: 380 },
  { month: 'Jun', revenue: 9500, orders: 420 },
];

const pieData = [
  { name: 'Espresso', value: 35 },
  { name: 'Latte', value: 28 },
  { name: 'Cold Brew', value: 22 },
  { name: 'Pastries', value: 15 },
];

const recentOrders = [
  { id: '1', customer: 'Emma Wilson', items: 'Oat Latte, Croissant', total: '$11.50', time: '2 min ago' },
  { id: '2', customer: 'Liam Chen', items: 'Double Espresso', total: '$4.75', time: '8 min ago' },
  { id: '3', customer: 'Sofia Rodriguez', items: 'Iced Matcha, Muffin', total: '$9.25', time: '15 min ago' },
  { id: '4', customer: 'Noah Kim', items: 'Cold Brew (Large)', total: '$6.50', time: '22 min ago' },
  { id: '5', customer: 'Ava Patel', items: 'Cappuccino, Bagel', total: '$10.00', time: '31 min ago' },
];

const tableColumns = [
  { key: 'customer' as const, label: 'Customer', sortable: true },
  { key: 'items' as const, label: 'Items' },
  { key: 'total' as const, label: 'Total', sortable: true },
  {
    key: 'time' as const,
    label: 'When',
    render: (value: unknown) => <span className="text-text-muted">{String(value)}</span>,
  },
];

export default function PreviewDashboard() {
  return (
    <DashboardShell appName="Brewtiful" navItems={navItems}>
      <PageHeader
        title="Good morning, Team!"
        subtitle="Here's how Brewtiful Coffee is doing today."
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Today's Sales" value="$1,247" icon={DollarSign} trend={{ value: '18%', positive: true }} accent="primary" />
        <StatCard title="Orders" value="87" icon={Coffee} trend={{ value: '12%', positive: true }} accent="secondary" />
        <StatCard title="Customers" value="342" icon={Users} trend={{ value: '8%', positive: true }} accent="tertiary" />
        <StatCard title="Avg Order" value="$14.33" icon={TrendingUp} trend={{ value: '3%', positive: true }} accent="success" />
      </div>

      <MetricRow metrics={[
        { label: 'Open', value: '7 AM' },
        { label: 'Close', value: '8 PM' },
        { label: 'Rating', value: '4.9 / 5' },
        { label: 'Wait Time', value: '3 min' },
      ]} />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 mb-8">
        <ChartCard title="Monthly Revenue" subtitle="Last 6 months" type="bar" data={chartData} dataKey="revenue" xAxisKey="month" color="cyan" />
        <ChartCard title="Best Sellers" subtitle="By category" type="pie" data={pieData} dataKey="value" xAxisKey="name" />
      </div>

      {/* Recent orders */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest mb-3">Recent Orders</h3>
        <DataTable columns={tableColumns} data={recentOrders} onRowClick={() => {}} />
      </div>

      {/* Quick list */}
      <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest mb-3">Top Customers</h3>
      <div className="bg-bg-card border border-border-default rounded-xl overflow-hidden">
        <ListItem icon={Users} title="Emma Wilson" subtitle="28 orders this month — $324 total" badge={{ label: 'VIP' }} />
        <ListItem icon={Users} title="Liam Chen" subtitle="22 orders this month — $198 total" badge={{ label: 'Regular', color: 'bg-success/10 text-success' }} />
        <ListItem icon={Users} title="Sofia Rodriguez" subtitle="15 orders this month — $167 total" />
      </div>

      {/* Sample data badge */}
      <div className="mt-10 text-center">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(14,165,233,0.1)', color: '#0ea5e9', border: '1px solid rgba(14,165,233,0.2)' }}>
          <Coffee className="w-3.5 h-3.5" />
          Sample dashboard — Claude builds YOUR business like this
        </span>
      </div>
    </DashboardShell>
  );
}

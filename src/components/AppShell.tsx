'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface AppShellProps {
  appName: string;
  navItems: NavItem[];
  children: React.ReactNode;
}

export default function AppShell({ appName, navItems, children }: AppShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-bg-primary">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-bg-sidebar border-r border-border-default',
          'transform transition-transform duration-200 ease-in-out',
          'lg:translate-x-0 lg:static lg:z-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* App name */}
        <div className="h-16 flex items-center px-6 border-b border-border-default">
          <h1 className="text-lg font-bold bg-gradient-to-r from-rally-orange to-rally-cyan bg-clip-text text-transparent">
            {appName}
          </h1>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 sidebar-scroll overflow-y-auto h-[calc(100vh-4rem)]">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-rally-orange/10 text-rally-orange border border-rally-orange/20'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-card'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 flex items-center px-6 border-b border-border-default bg-bg-secondary/50 backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 text-text-secondary hover:text-text-primary"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="lg:hidden ml-3 text-sm font-medium text-text-secondary">
            {appName}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

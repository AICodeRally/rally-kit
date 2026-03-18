'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type NavRoute, isActiveRoute } from '@/lib/navigation';

interface DashboardShellProps {
  appName: string;
  navItems: NavRoute[];
  children: React.ReactNode;
}

export default function DashboardShell({ appName, navItems, children }: DashboardShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-bg-primary">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-bg-sidebar border-r border-border-default',
          'transform transition-transform duration-200 ease-in-out',
          'lg:translate-x-0 lg:static lg:z-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-border-default">
          <h1 className="text-lg font-bold text-accent">{appName}</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-text-secondary hover:text-text-primary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1 sidebar-scroll overflow-y-auto h-[calc(100vh-4rem)]">
          {navItems.map((item) => {
            const active = isActiveRoute(pathname, item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  active
                    ? 'bg-accent/10 text-accent border border-accent/20'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-card-hover'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-6 border-b border-border-default bg-bg-nav">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-text-secondary hover:text-text-primary"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="lg:hidden ml-3 text-sm font-medium text-text-secondary">
              {appName}
            </span>
          </div>
          <div className="hidden lg:flex items-center gap-2 text-text-muted">
            <Search className="w-4 h-4" />
            <span className="text-sm">Search...</span>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

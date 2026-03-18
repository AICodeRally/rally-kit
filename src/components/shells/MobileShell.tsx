'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { type NavRoute, isActiveRoute } from '@/lib/navigation';

interface MobileShellProps {
  appName: string;
  navItems: NavRoute[];
  children: React.ReactNode;
}

export default function MobileShell({ appName, navItems, children }: MobileShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary max-w-md mx-auto border-x border-border-default">
      <header className="h-14 flex items-center justify-between px-4 border-b border-border-default bg-bg-nav sticky top-0 z-10">
        <h1 className="text-lg font-bold text-accent">{appName}</h1>
      </header>

      <main className="flex-1 overflow-auto p-4 pb-20">
        {children}
      </main>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-bg-nav border-t border-border-default z-10">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.slice(0, 5).map((item) => {
            const active = isActiveRoute(pathname, item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-0',
                  active
                    ? 'text-accent'
                    : 'text-text-muted hover:text-text-secondary'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className={cn(
                  'text-xs truncate',
                  active ? 'font-semibold' : 'font-medium'
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

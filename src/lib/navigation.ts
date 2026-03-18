// src/lib/navigation.ts

import { type LucideIcon } from 'lucide-react';

export interface NavRoute {
  label: string;
  href: string;
  icon: LucideIcon;
}

/**
 * Claude adds routes here as pages are built.
 * Students never edit this file directly.
 */
export const routes: NavRoute[] = [];

/** Check if a path matches a route (exact or prefix for nested routes) */
export function isActiveRoute(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}

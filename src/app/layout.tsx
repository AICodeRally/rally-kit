import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import './globals.css';
import { ThemeInitializer } from '@/components/ThemeInitializer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Rally Kit — Vibe Code Rally',
  description: 'Built with AI at the GCU Vibe Code Rally',
};

function readRallyConfig(): { theme?: string; customAccent?: string } {
  try {
    const configPath = join(process.cwd(), 'rally.config.json');
    if (existsSync(configPath)) {
      return JSON.parse(readFileSync(configPath, 'utf-8'));
    }
  } catch {
    // Config doesn't exist yet — use defaults
  }
  return {};
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = readRallyConfig();

  return (
    <html lang="en">
      <body className={`${inter.className} bg-bg-primary text-text-primary min-h-screen`}>
        <ThemeInitializer theme={config.theme} customAccent={config.customAccent} />
        {children}
      </body>
    </html>
  );
}

import { Rocket, Sparkles, Code2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
      <div className="text-center max-w-2xl px-8">
        {/* Logo area */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-rally-orange/10 border border-rally-orange/20">
            <Rocket className="w-8 h-8 text-rally-orange" />
          </div>
          <div className="p-3 rounded-xl bg-rally-cyan/10 border border-rally-cyan/20">
            <Code2 className="w-8 h-8 text-rally-cyan" />
          </div>
          <div className="p-3 rounded-xl bg-rally-purple/10 border border-rally-purple/20">
            <Sparkles className="w-8 h-8 text-rally-purple" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-rally-orange via-rally-cyan to-rally-purple bg-clip-text text-transparent">
          Rally Kit
        </h1>
        <p className="text-xl text-text-secondary mb-8">
          Your app starts here. Tell Claude what to build.
        </p>

        {/* Instructions card */}
        <div className="bg-bg-card border border-border-default rounded-xl p-8 text-left shadow-card">
          <h2 className="text-lg font-semibold text-rally-cyan mb-4">
            Getting Started
          </h2>
          <ol className="space-y-3 text-text-secondary">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-rally-orange/20 text-rally-orange text-sm font-bold flex items-center justify-center">1</span>
              <span>Open Claude Code in this project folder</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-rally-cyan/20 text-rally-cyan text-sm font-bold flex items-center justify-center">2</span>
              <span>Tell Claude about your business idea — it will help you design a domain pack</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-rally-purple/20 text-rally-purple text-sm font-bold flex items-center justify-center">3</span>
              <span>Say &quot;Now build the app&quot; — Claude builds it page by page</span>
            </li>
          </ol>
        </div>

        {/* Footer */}
        <p className="mt-8 text-sm text-text-muted">
          GCU Vibe Code Rally &bull; Powered by Claude
        </p>
      </div>
    </div>
  );
}

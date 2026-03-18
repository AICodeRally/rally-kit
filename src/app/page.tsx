import { Rocket, MessageCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#ffffff' }}>
      <div className="text-center max-w-lg px-8">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="p-4 rounded-2xl" style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd' }}>
            <Rocket className="w-12 h-12" style={{ color: '#0284c7' }} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold mb-3" style={{ color: '#0f172a' }}>
          Vibe Code Rally
        </h1>

        {/* Status */}
        <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <div className="flex items-center justify-center gap-3 mb-3">
            <MessageCircle className="w-5 h-5" style={{ color: '#0284c7' }} />
            <p className="text-lg font-semibold" style={{ color: '#0f172a' }}>
              Talk to Claude in Terminal
            </p>
          </div>
          <p className="text-base" style={{ color: '#475569' }}>
            Claude is your AI coding partner. Tell it about your
            business idea and watch this page transform into your app.
          </p>
        </div>

        {/* Hint */}
        <p className="text-sm" style={{ color: '#94a3b8' }}>
          This page updates live as Claude builds your app.
        </p>
      </div>
    </div>
  );
}

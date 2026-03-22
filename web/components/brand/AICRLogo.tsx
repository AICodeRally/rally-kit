'use client'

interface AICRLogoProps {
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: { icon: 24, text: 'text-sm' },
  md: { icon: 36, text: 'text-xl' },
  lg: { icon: 56, text: 'text-4xl' },
}

export function AICRLogo({ size = 'md' }: AICRLogoProps) {
  const s = sizes[size]

  return (
    <div className="flex items-center gap-2">
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Geometric mark — stacked chevrons forming an "A" */}
        <rect width="48" height="48" rx="10" fill="currentColor" opacity="0.1" />
        <path
          d="M24 8L10 36h6l8-18 8 18h6L24 8Z"
          fill="currentColor"
        />
        <path
          d="M16 30h16"
          stroke="var(--accent, #2563eb)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <span className={`font-bold tracking-tight ${s.text}`} style={{ color: 'var(--text-primary)' }}>
        AICR
      </span>
    </div>
  )
}

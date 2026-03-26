'use client'

import { useEffect, useRef } from 'react'

interface GameOverlayProps {
  visible: boolean
  count: number
  elapsedMs: number
  bestCount: number
  bestTime: number
  onPlayAgain: () => void
  onShare: () => void
}

function formatSeconds(ms: number): string {
  return `${Math.floor(ms / 1000)}"`
}

export default function GameOverlay({
  visible,
  count,
  elapsedMs,
  bestCount,
  bestTime,
  onPlayAgain,
  onShare,
}: GameOverlayProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!cardRef.current || !visible) return
    const el = cardRef.current
    el.style.opacity = '0'
    el.style.transform = 'translateY(16px)'
    requestAnimationFrame(() => {
      el.style.transition =
        'opacity 500ms cubic-bezier(0.16, 1, 0.3, 1), transform 500ms cubic-bezier(0.16, 1, 0.3, 1)'
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    })
  }, [visible])

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
    >
      {/* Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.75) 100%)',
          animation: 'vignetteIn 600ms ease-in forwards',
        }}
      />

      {/* Result card */}
      <div
        ref={cardRef}
        style={{
          position: 'relative',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '4px',
          padding: '48px',
          maxWidth: '340px',
          width: '90%',
          textAlign: 'center',
        }}
      >
        {/* Current score */}
        <p style={{ ...labelStyle, marginBottom: '16px' }}>THIS ROUND</p>

        <div style={scoreRowStyle}>
          <ScoreCell value={count} label="HITS" size={48} />
          <Divider vertical />
          <ScoreCell value={formatSeconds(elapsedMs)} label="TIME" size={48} />
        </div>

        <Divider />

        {/* Best score */}
        <p style={{ ...labelStyle, color: 'var(--color-dim)', marginBottom: '16px' }}>BEST</p>

        <div style={{ ...scoreRowStyle, marginBottom: '32px' }}>
          <ScoreCell value={bestCount} label="HITS" size={36} dimmed />
          <Divider vertical />
          <ScoreCell value={formatSeconds(bestTime)} label="TIME" size={36} dimmed />
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <GameButton onClick={onPlayAgain} primary>PLAY AGAIN</GameButton>
          <GameButton onClick={onShare}>SHARE</GameButton>
        </div>
      </div>

      <style>{`
        @keyframes vignetteIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScoreCell({
  value,
  label,
  size,
  dimmed = false,
}: {
  value: number | string
  label: string
  size: number
  dimmed?: boolean
}) {
  return (
    <div>
      <div
        style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: `${size}px`,
          fontWeight: 300,
          letterSpacing: '0.1em',
          color: dimmed ? 'var(--color-dim)' : 'var(--color-primary)',
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div style={{ ...labelStyle, color: dimmed ? 'var(--color-dim)' : 'var(--color-accent)', marginTop: '8px' }}>
        {label}
      </div>
    </div>
  )
}

function Divider({ vertical = false }: { vertical?: boolean }) {
  return (
    <div
      style={
        vertical
          ? { width: '1px', background: 'var(--color-divider)', alignSelf: 'stretch' }
          : { width: '100%', height: '1px', background: 'var(--color-divider)', margin: '24px 0' }
      }
    />
  )
}

function GameButton({
  onClick,
  primary = false,
  children,
}: {
  onClick: () => void
  primary?: boolean
  children: React.ReactNode
}) {
  const baseStyle: React.CSSProperties = {
    background: 'none',
    border: primary
      ? '1px solid rgba(var(--accent-rgb, 200,169,110),0.6)'
      : '1px solid var(--color-btn-default)',
    borderRadius: '2px',
    padding: '14px 32px',
    fontFamily: 'var(--font-inter)',
    fontSize: '13px',
    fontWeight: 500,
    letterSpacing: '0.3em',
    color: primary ? 'var(--color-accent)' : 'var(--color-btn-text)',
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'all 200ms ease',
    width: '100%',
  }

  return (
    <button
      onClick={onClick}
      style={baseStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(139,105,20,0.08)'
        e.currentTarget.style.borderColor = 'var(--color-accent)'
        e.currentTarget.style.color = 'var(--color-accent)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'none'
        e.currentTarget.style.borderColor = primary
          ? 'rgba(200,169,110,0.6)'
          : 'var(--color-btn-default)'
        e.currentTarget.style.color = primary ? 'var(--color-accent)' : 'var(--color-btn-text)'
      }}
    >
      {children}
    </button>
  )
}

// ─── Shared styles ────────────────────────────────────────────────────────────
const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-inter)',
  fontSize: '10px',
  fontWeight: 400,
  letterSpacing: '0.5em',
  color: 'var(--color-accent)',
  textTransform: 'uppercase',
}

const scoreRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: '40px',
  marginBottom: '8px',
}

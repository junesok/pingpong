'use client'

import { useEffect, useRef } from 'react'

interface HUDProps {
  count: number
  elapsedMs: number
}

function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const min = Math.floor(totalSec / 60)
  const sec = totalSec % 60
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

export default function HUD({ count, elapsedMs }: HUDProps) {
  const counterRef = useRef<HTMLSpanElement>(null)
  const prevCount = useRef(count)

  useEffect(() => {
    if (count !== prevCount.current && counterRef.current) {
      const el = counterRef.current
      el.style.transition = 'none'
      el.style.transform = 'scale(1.08)'
      requestAnimationFrame(() => {
        el.style.transition = 'transform 150ms ease-out'
        el.style.transform = 'scale(1.0)'
      })
      prevCount.current = count
    }
  }, [count])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      {/* Hit counter — top center */}
      <div
        style={{
          position: 'absolute',
          top: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '11px',
            fontWeight: 400,
            letterSpacing: '0.5em',
            color: 'var(--color-accent)',
            textTransform: 'uppercase',
          }}
        >
          HITS
        </span>
        <span
          ref={counterRef}
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: '96px',
            fontWeight: 300,
            letterSpacing: '0.15em',
            color: 'var(--color-primary)',
            lineHeight: 1,
            display: 'block',
          }}
        >
          {count}
        </span>
      </div>

      {/* Timer — top right */}
      <div
        style={{
          position: 'absolute',
          top: '32px',
          right: '32px',
          textAlign: 'right',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '6px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '10px',
            fontWeight: 400,
            letterSpacing: '0.5em',
            color: 'var(--color-dim)',
            textTransform: 'uppercase',
          }}
        >
          TIME
        </span>
        <span
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: '32px',
            fontWeight: 300,
            letterSpacing: '0.1em',
            color: 'var(--color-primary)',
            lineHeight: 1,
          }}
        >
          {formatTime(elapsedMs)}
        </span>
      </div>
    </div>
  )
}

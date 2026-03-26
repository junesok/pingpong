'use client'

import { useEffect, useRef } from 'react'
import HUD from './HUD'
import GameOverlay from './GameOverlay'
import ThemeToggle from './ThemeToggle'
import { useCanvasSize } from '@/hooks/useCanvasSize'
import { useShake } from '@/hooks/useShake'
import { useTheme } from '@/hooks/useTheme'
import { useGame } from '@/hooks/useGame'
import { THEME_COLORS } from '@/lib/theme'

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const { theme, toggleTheme } = useTheme()

  // Keep a ref of the current theme colors so the render loop reads it each frame
  const themeColorsRef = useRef(THEME_COLORS[theme])
  useEffect(() => {
    themeColorsRef.current = THEME_COLORS[theme]
  }, [theme])

  useCanvasSize(canvasRef)
  const triggerShake = useShake(wrapperRef)

  const {
    hudCount,
    hudElapsed,
    overlayVisible,
    finalCount,
    finalElapsed,
    bestCount,
    bestTime,
    startGame,
    handleShare,
  } = useGame({ canvasRef, triggerShake, themeColorsRef })

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <div ref={wrapperRef} style={{ willChange: 'transform' }}>
        <canvas
          ref={canvasRef}
          style={{ display: 'block', touchAction: 'none', willChange: 'transform' }}
        />
      </div>

      <ThemeToggle theme={theme} onToggle={toggleTheme} />
      <HUD count={hudCount} elapsedMs={hudElapsed} />

      <GameOverlay
        visible={overlayVisible}
        count={finalCount}
        elapsedMs={finalElapsed}
        bestCount={bestCount}
        bestTime={bestTime}
        onPlayAgain={startGame}
        onShare={handleShare}
      />
    </div>
  )
}

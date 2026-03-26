'use client'

import { RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { useLocalRecord } from './useLocalRecord'
import { Ball, GameStatus, Paddle, Particle } from '@/lib/types'
import { ThemeColors } from '@/lib/theme'
import { spawnParticles, updateParticles } from '@/lib/particles'
import {
  BALL_INITIAL_VX,
  BALL_INITIAL_VY,
  PADDLE_WIDTH,
  PADDLE_HEIGHT,
  checkPaddleCollision,
  isGameOver,
  isNearBottom,
  resolvePaddleCollision,
  resolveWallCollision,
  updateBall,
} from '@/lib/physics'
import {
  clearCanvas,
  drawBall,
  drawFlash,
  drawIdleHint,
  drawPaddle,
  drawParticles,
} from '@/lib/renderer'

// ─── Init helpers ─────────────────────────────────────────────────────────────
function createBall(w: number, h: number): Ball {
  return {
    x: w / 2,
    y: h * 0.35,
    vx: (Math.random() > 0.5 ? 1 : -1) * BALL_INITIAL_VX,
    vy: BALL_INITIAL_VY,
    trail: [],
  }
}

function createPaddle(w: number, h: number, x?: number): Paddle {
  return {
    x: x ?? w / 2,
    y: h * 0.85,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    glowIntensity: 0,
  }
}

// ─── Hook interface ───────────────────────────────────────────────────────────
interface UseGameOptions {
  canvasRef: RefObject<HTMLCanvasElement | null>
  triggerShake: () => void
  themeColorsRef: RefObject<ThemeColors>
}

export interface UseGameReturn {
  hudCount: number
  hudElapsed: number
  overlayVisible: boolean
  finalCount: number
  finalElapsed: number
  bestCount: number
  bestTime: number
  startGame: () => void
  handleShare: () => void
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useGame({
  canvasRef,
  triggerShake,
  themeColorsRef,
}: UseGameOptions): UseGameReturn {
  // Mutable game state (refs — no re-render on change)
  const rafRef = useRef<number>(0)
  const statusRef = useRef<GameStatus>('idle')
  const ballRef = useRef<Ball | null>(null)
  const paddleRef = useRef<Paddle | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const startTimeRef = useRef<number>(0)
  const elapsedRef = useRef<number>(0)
  const countRef = useRef<number>(0)
  const timeScaleRef = useRef<number>(1)
  const flashRef = useRef<boolean>(false)
  const paddleXRef = useRef<number>(0)

  // React state (triggers re-render for HUD / overlay)
  const [hudCount, setHudCount] = useState(0)
  const [hudElapsed, setHudElapsed] = useState(0)
  const [overlayVisible, setOverlayVisible] = useState(false)
  const [finalCount, setFinalCount] = useState(0)
  const [finalElapsed, setFinalElapsed] = useState(0)
  const [bestCount, setBestCount] = useState(0)
  const [bestTime, setBestTime] = useState(0)

  const { getRecord, saveRecord } = useLocalRecord()

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const getCSSDimensions = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return { w: 0, h: 0 }
    const dpr = window.devicePixelRatio || 1
    return { w: canvas.width / dpr, h: canvas.height / dpr }
  }, [canvasRef])

  // ─── startGame ────────────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    const { w, h } = getCSSDimensions()
    if (!w || !h) return

    ballRef.current = createBall(w, h)
    paddleRef.current = createPaddle(w, h, paddleXRef.current || undefined)
    particlesRef.current = []
    countRef.current = 0
    timeScaleRef.current = 1
    flashRef.current = false
    startTimeRef.current = performance.now()
    elapsedRef.current = 0
    statusRef.current = 'playing'

    setHudCount(0)
    setHudElapsed(0)
    setOverlayVisible(false)
  }, [getCSSDimensions])

  // ─── endGame ──────────────────────────────────────────────────────────────
  const endGame = useCallback(() => {
    statusRef.current = 'gameover'
    const elapsed = elapsedRef.current
    const count = countRef.current

    saveRecord(count, elapsed)
    const rec = getRecord()

    setFinalCount(count)
    setFinalElapsed(elapsed)
    setBestCount(Math.max(rec.bestCount, count))
    setBestTime(Math.max(rec.bestTime, elapsed))

    setTimeout(() => setOverlayVisible(true), 300)
  }, [saveRecord, getRecord])

  // ─── handleShare ──────────────────────────────────────────────────────────
  const handleShare = useCallback(() => {
    const text = `Pingpong Rally — ${countRef.current} hits / ${Math.floor(elapsedRef.current / 1000)}s`
    if (navigator.share) {
      navigator.share({ title: 'Pingpong Rally', text }).catch(() => {})
    } else {
      navigator.clipboard.writeText(text).catch(() => {})
    }
  }, [])

  // ─── Input handlers ───────────────────────────────────────────────────────
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      paddleXRef.current = e.clientX
      if (paddleRef.current) paddleRef.current.x = e.clientX
      if (statusRef.current === 'idle') startGame()
    }

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const x = e.touches[0].clientX
      paddleXRef.current = x
      if (paddleRef.current) paddleRef.current.x = x
      if (statusRef.current === 'idle') startGame()
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [startGame])

  // ─── Render loop ──────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let hudTick = 0

    const loop = (now: number) => {
      const dpr = window.devicePixelRatio || 1
      const w = canvas.width / dpr
      const h = canvas.height / dpr
      const colors = themeColorsRef.current

      clearCanvas(ctx, w, h, colors)

      const status = statusRef.current

      if (status === 'idle') {
        drawIdleHint(ctx, w, h, colors)
        rafRef.current = requestAnimationFrame(loop)
        return
      }

      if (status === 'playing') {
        elapsedRef.current = now - startTimeRef.current
      }

      const ball = ballRef.current
      const paddle = paddleRef.current

      if (ball && paddle && status === 'playing') {
        // Slow motion near bottom
        const nearBottom = isNearBottom(ball, h)
        timeScaleRef.current = nearBottom
          ? Math.max(0.2, timeScaleRef.current - 0.05)
          : Math.min(1, timeScaleRef.current + 0.1)

        // Physics step
        let next = updateBall(ball, timeScaleRef.current)
        const { ball: afterWall } = resolveWallCollision(next, w, h)
        next = afterWall

        // Paddle collision
        if (checkPaddleCollision(next, paddle)) {
          next = resolvePaddleCollision(next, paddle)
          countRef.current++
          paddle.glowIntensity = 1.0
          particlesRef.current = [
            ...particlesRef.current,
            ...spawnParticles(
              next.x,
              paddle.y - paddle.height / 2,
              now,
              colors.particleCore,
              colors.particleOuter
            ),
          ]
          triggerShake()
          setHudCount(countRef.current)
        }

        // Glow decay
        paddle.glowIntensity *= 0.93

        // Game over check
        if (isGameOver(next, h)) {
          flashRef.current = true
          ballRef.current = next
          endGame()
        } else {
          ballRef.current = next
        }
      }

      // Update particles
      particlesRef.current = updateParticles(particlesRef.current, now)

      // White flash (one frame)
      if (flashRef.current) {
        drawFlash(ctx, w, h, colors)
        flashRef.current = false
      }

      // Draw scene
      if (ballRef.current) drawBall(ctx, ballRef.current, colors)
      if (paddleRef.current) drawPaddle(ctx, paddleRef.current, colors)
      drawParticles(ctx, particlesRef.current)

      // HUD timer (throttled ~10fps)
      hudTick++
      if (hudTick % 6 === 0 && status === 'playing') {
        setHudElapsed(elapsedRef.current)
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [canvasRef, triggerShake, endGame, themeColorsRef])

  return {
    hudCount,
    hudElapsed,
    overlayVisible,
    finalCount,
    finalElapsed,
    bestCount,
    bestTime,
    startGame,
    handleShare,
  }
}

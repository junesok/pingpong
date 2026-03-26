import { Ball, Paddle, Particle } from './types'
import { ThemeColors } from './theme'
import { BALL_RADIUS } from './physics'

const TRAIL_OPACITIES = [0.12, 0.07, 0.04, 0.02] as const

// ─── Background ───────────────────────────────────────────────────────────────
export function clearCanvas(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  colors: ThemeColors
): void {
  ctx.fillStyle = colors.bg
  ctx.fillRect(0, 0, w, h)
}

export function drawFlash(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  colors: ThemeColors
): void {
  ctx.fillStyle = colors.flash
  ctx.fillRect(0, 0, w, h)
}

export function drawIdleHint(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  colors: ThemeColors
): void {
  ctx.fillStyle = colors.idleHint
  ctx.font = '400 13px Inter, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('MOVE TO START', w / 2, h / 2)
}

// ─── Ball ─────────────────────────────────────────────────────────────────────
export function drawBall(
  ctx: CanvasRenderingContext2D,
  ball: Ball,
  colors: ThemeColors
): void {
  // Trail
  ball.trail.forEach((pos, i) => {
    ctx.save()
    ctx.globalAlpha = TRAIL_OPACITIES[i] ?? 0
    ctx.fillStyle = colors.ball
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, BALL_RADIUS, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  })

  // Ball with glow
  ctx.save()
  ctx.shadowColor = colors.ballShadow
  ctx.shadowBlur = 16
  ctx.fillStyle = colors.ball
  ctx.beginPath()
  ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

// ─── Paddle ───────────────────────────────────────────────────────────────────
export function drawPaddle(
  ctx: CanvasRenderingContext2D,
  paddle: Paddle,
  colors: ThemeColors
): void {
  const { glowIntensity: glow } = paddle
  ctx.save()
  ctx.shadowColor = glow > 0.05 ? colors.paddleShadowPeak : colors.paddleShadowBase
  ctx.shadowBlur = 10 + glow * 30
  ctx.fillStyle = colors.paddle
  ctx.beginPath()
  ctx.roundRect(
    paddle.x - paddle.width / 2,
    paddle.y - paddle.height / 2,
    paddle.width,
    paddle.height,
    3
  )
  ctx.fill()
  ctx.restore()
}

// ─── Particles ────────────────────────────────────────────────────────────────
// Particles carry their own color (set at spawn time) — no theme param needed.
export function drawParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[]
): void {
  particles.forEach((p) => {
    ctx.save()
    ctx.globalAlpha = p.opacity
    ctx.fillStyle = p.color
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  })
}

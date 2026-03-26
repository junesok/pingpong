import { Ball, Paddle } from './types'

// ─── Constants ────────────────────────────────────────────────────────────────
export const BALL_RADIUS = 7
export const BALL_INITIAL_VY = 4
export const BALL_INITIAL_VX = 2
export const PADDLE_WIDTH = 88
export const PADDLE_HEIGHT = 6
export const GRAVITY = 0.15
export const MAX_SPEED = 12

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function clampSpeed(vx: number, vy: number): { vx: number; vy: number } {
  const speed = Math.sqrt(vx * vx + vy * vy)
  if (speed > MAX_SPEED) {
    const ratio = MAX_SPEED / speed
    return { vx: vx * ratio, vy: vy * ratio }
  }
  return { vx, vy }
}

// ─── Ball ─────────────────────────────────────────────────────────────────────
export function updateBall(ball: Ball, timeScale: number): Ball {
  const newVy = ball.vy + GRAVITY * timeScale
  const newX = ball.x + ball.vx * timeScale
  const newY = ball.y + newVy * timeScale
  const trail = [{ x: ball.x, y: ball.y }, ...ball.trail].slice(0, 4)
  return { ...ball, x: newX, y: newY, vy: newVy, trail }
}

export function resolveWallCollision(
  ball: Ball,
  canvasWidth: number,
  canvasHeight: number
): { ball: Ball; hitCeiling: boolean } {
  let { x, y, vx, vy } = ball
  let hitCeiling = false

  if (x - BALL_RADIUS < 0) {
    x = BALL_RADIUS
    vx = Math.abs(vx)
  } else if (x + BALL_RADIUS > canvasWidth) {
    x = canvasWidth - BALL_RADIUS
    vx = -Math.abs(vx)
  }

  if (y - BALL_RADIUS < 0) {
    y = BALL_RADIUS
    vy = Math.abs(vy)
    hitCeiling = true
  }

  return { ball: { ...ball, x, y, vx, vy }, hitCeiling }
}

// ─── Paddle ───────────────────────────────────────────────────────────────────
export function checkPaddleCollision(ball: Ball, paddle: Paddle): boolean {
  const paddleLeft = paddle.x - paddle.width / 2
  const paddleRight = paddle.x + paddle.width / 2
  const paddleTop = paddle.y - paddle.height / 2
  const paddleBottom = paddle.y + paddle.height / 2

  return (
    ball.x + BALL_RADIUS > paddleLeft &&
    ball.x - BALL_RADIUS < paddleRight &&
    ball.y + BALL_RADIUS > paddleTop &&
    ball.y - BALL_RADIUS < paddleBottom &&
    ball.vy > 0
  )
}

export function resolvePaddleCollision(ball: Ball, paddle: Paddle): Ball {
  const offsetX = ball.x - paddle.x
  const newVx = ball.vx + offsetX * 0.05
  const newVy = -(Math.abs(ball.vy) + 0.3)
  const clamped = clampSpeed(newVx, newVy)
  return {
    ...ball,
    y: paddle.y - paddle.height / 2 - BALL_RADIUS,
    vx: clamped.vx,
    vy: clamped.vy,
  }
}

// ─── Game Over ────────────────────────────────────────────────────────────────
export function isGameOver(ball: Ball, canvasHeight: number): boolean {
  return ball.y - BALL_RADIUS > canvasHeight
}

export function isNearBottom(ball: Ball, canvasHeight: number): boolean {
  return ball.y + BALL_RADIUS > canvasHeight - 80
}

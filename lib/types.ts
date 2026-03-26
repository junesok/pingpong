// ─── Game Status ──────────────────────────────────────────────────────────────
export type GameStatus = 'idle' | 'playing' | 'gameover'

// ─── Physics ──────────────────────────────────────────────────────────────────
export interface Ball {
  x: number
  y: number
  vx: number
  vy: number
  trail: Array<{ x: number; y: number }>
}

export interface Paddle {
  x: number
  y: number
  width: number
  height: number
  glowIntensity: number
}

// ─── Particles ────────────────────────────────────────────────────────────────
export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  opacity: number
  color: string
  size: number
  life: number
  duration: number
  born: number
}

// ─── Local Record ─────────────────────────────────────────────────────────────
export interface LocalRecord {
  bestCount: number
  bestTime: number
  totalPlays: number
}

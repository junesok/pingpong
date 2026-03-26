import { Particle } from './types'

export function spawnParticles(
  x: number,
  y: number,
  now: number,
  coreColor: string,
  outerColor: string
): Particle[] {
  const DURATION = 500
  return Array.from({ length: 12 }, (_, i) => {
    const angle = Math.PI + Math.random() * Math.PI  // upper hemisphere
    const speed = 1.5 + Math.random() * 2.5
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      opacity: 1,
      color: i < 6 ? coreColor : outerColor,
      size: 2,
      life: 1,
      duration: DURATION,
      born: now,
    }
  })
}

export function updateParticles(particles: Particle[], now: number): Particle[] {
  return particles
    .map((p) => {
      const life = Math.max(0, 1 - (now - p.born) / p.duration)
      return { ...p, x: p.x + p.vx, y: p.y + p.vy, opacity: life, life }
    })
    .filter((p) => p.life > 0)
}

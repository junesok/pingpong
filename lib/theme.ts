export type Theme = 'dark' | 'light'

export interface ThemeColors {
  bg: string
  ball: string
  ballShadow: string
  paddle: string
  paddleShadowBase: string
  paddleShadowPeak: string
  particleCore: string
  particleOuter: string
  idleHint: string
  flash: string
}

export const THEME_COLORS: Record<Theme, ThemeColors> = {
  dark: {
    bg: '#080808',
    ball: '#ffffff',
    ballShadow: 'rgba(255,255,255,0.9)',
    paddle: '#C8A96E',
    paddleShadowBase: 'rgba(200,169,110,0.3)',
    paddleShadowPeak: 'rgba(200,169,110,0.95)',
    particleCore: '#ffffff',
    particleOuter: '#C8A96E',
    idleHint: 'rgba(255,255,255,0.12)',
    flash: 'rgba(255,255,255,0.06)',
  },
  light: {
    bg: '#F7F7F5',
    ball: '#1A1A1A',
    ballShadow: 'rgba(0,0,0,0.2)',
    paddle: '#8B6914',
    paddleShadowBase: 'rgba(139,105,20,0.3)',
    paddleShadowPeak: 'rgba(139,105,20,0.8)',
    particleCore: '#1A1A1A',
    particleOuter: '#8B6914',
    idleHint: 'rgba(0,0,0,0.15)',
    flash: 'rgba(0,0,0,0.03)',
  },
}

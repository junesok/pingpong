'use client'

import { RefObject, useEffect } from 'react'

/**
 * canvas의 width/height를 devicePixelRatio에 맞게 설정하고,
 * ctx.scale(dpr, dpr)을 적용해 모든 드로잉을 CSS 픽셀 단위로 사용할 수 있게 한다.
 * resize 이벤트에도 자동 대응한다.
 */
export function useCanvasSize(canvasRef: RefObject<HTMLCanvasElement | null>): void {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`

      // canvas resize는 context transform을 초기화하므로 매번 scale 재설정 필요
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.scale(dpr, dpr)
    }

    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [canvasRef])
}

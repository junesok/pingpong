'use client'

import { RefObject, useCallback } from 'react'

/**
 * 래퍼 엘리먼트에 화면 진동 이펙트를 적용하는 훅.
 * 반환된 triggerShake()를 패들 충돌 시 호출한다.
 */
export function useShake(wrapperRef: RefObject<HTMLDivElement | null>): () => void {
  return useCallback(() => {
    const el = wrapperRef.current
    if (!el) return

    el.style.transition = 'none'
    el.style.transform = 'translate(0, -2px)'

    setTimeout(() => {
      el.style.transition = 'transform 45ms cubic-bezier(0.36, 0.07, 0.19, 0.97)'
      el.style.transform = 'translate(0, 1px)'
    }, 45)

    setTimeout(() => {
      el.style.transform = 'translate(0, 0)'
    }, 90)
  }, [wrapperRef])
}

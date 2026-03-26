'use client'

import { useCallback } from 'react'
import { LocalRecord } from '@/lib/types'

export function useLocalRecord() {
  const getRecord = useCallback((): LocalRecord => {
    if (typeof window === 'undefined') {
      return { bestCount: 0, bestTime: 0, totalPlays: 0 }
    }
    return {
      bestCount: parseInt(localStorage.getItem('best_count') ?? '0', 10),
      bestTime: parseInt(localStorage.getItem('best_time') ?? '0', 10),
      totalPlays: parseInt(localStorage.getItem('total_plays') ?? '0', 10),
    }
  }, [])

  const saveRecord = useCallback((count: number, timeMs: number) => {
    if (typeof window === 'undefined') return
    const prev = getRecord()
    if (count > prev.bestCount) localStorage.setItem('best_count', String(count))
    if (timeMs > prev.bestTime) localStorage.setItem('best_time', String(timeMs))
    localStorage.setItem('total_plays', String(prev.totalPlays + 1))
  }, [getRecord])

  return { getRecord, saveRecord }
}

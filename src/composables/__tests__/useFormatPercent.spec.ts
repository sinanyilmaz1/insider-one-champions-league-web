import { describe, it, expect } from 'vitest'
import { useFormatPercent } from '../useFormatPercent'

describe('useFormatPercent', () => {
  const format = useFormatPercent()

  it('treats 0–1 floats as proportions and converts to percent', () => {
    expect(format(0.45)).toBe('%45')
    expect(format(0.5)).toBe('%50')
    expect(format(1)).toBe('%100')
  })

  it('treats values above 1 as already-percent', () => {
    expect(format(45)).toBe('%45')
    expect(format(100)).toBe('%100')
  })

  it('rounds to nearest integer', () => {
    expect(format(0.456)).toBe('%46')
    expect(format(0.454)).toBe('%45')
    expect(format(45.6)).toBe('%46')
  })

  it('handles zero', () => {
    expect(format(0)).toBe('%0')
  })
})

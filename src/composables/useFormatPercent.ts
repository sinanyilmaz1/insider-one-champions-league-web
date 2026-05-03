export function useFormatPercent() {
  return (value: number): string => {
    // Backend may emit 0–1 floats or 0–100 numbers — auto-detect.
    const pct = value <= 1 ? value * 100 : value
    return `%${Math.round(pct)}`
  }
}

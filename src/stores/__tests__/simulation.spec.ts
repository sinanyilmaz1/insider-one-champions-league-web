import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSimulationStore } from '../simulation'
import type { Fixture, SimulationState, Team } from '@/api/types'

vi.mock('@/api/endpoints', () => ({
  getStandings: vi.fn<() => Promise<unknown>>(),
  getPredictions: vi.fn<() => Promise<unknown>>(),
  getFixtures: vi.fn<() => Promise<unknown>>(),
  playWeek: vi.fn<() => Promise<unknown>>(),
  playAll: vi.fn<() => Promise<unknown>>(),
  resetSimulation: vi.fn<() => Promise<unknown>>(),
  updateMatchResult: vi.fn<() => Promise<unknown>>(),
  getTeams: vi.fn<() => Promise<unknown>>(),
  generateFixtures: vi.fn<() => Promise<unknown>>(),
}))

vi.mock('@/composables/useToast', () => ({ showToast: vi.fn<(message: string) => void>() }))

import * as api from '@/api/endpoints'

const team = (id: number, name: string): Team => ({
  id,
  name,
  attack: 70,
  defense: 70,
  midfield: 70,
  homeAdvantage: 1.15,
})

const fixture = (id: number, week: number, played: boolean): Fixture => ({
  id,
  week,
  homeTeam: team(1, 'Chelsea'),
  awayTeam: team(2, 'Arsenal'),
  matchResult: played ? { id, homeScore: 1, awayScore: 0 } : null,
})

const emptyState: SimulationState = {
  standings: [],
  predictions: [],
  fixtures: [],
  lastPlayedWeek: null,
  nextWeek: null,
}

describe('useSimulationStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('canShowPredictions', () => {
    it('is false before any week is played', () => {
      const store = useSimulationStore()
      expect(store.canShowPredictions).toBe(false)
    })

    it('is false through week 2', () => {
      const store = useSimulationStore()
      store.applyState({ ...emptyState, lastPlayedWeek: 2 })
      expect(store.canShowPredictions).toBe(false)
    })

    it('is true from week 3 onwards', () => {
      const store = useSimulationStore()
      store.applyState({ ...emptyState, lastPlayedWeek: 3 })
      expect(store.canShowPredictions).toBe(true)
    })
  })

  describe('isSeasonComplete', () => {
    it('is false when nothing has been played', () => {
      const store = useSimulationStore()
      expect(store.isSeasonComplete).toBe(false)
    })

    it('is false mid-season', () => {
      const store = useSimulationStore()
      store.applyState({ ...emptyState, lastPlayedWeek: 3, nextWeek: 4 })
      expect(store.isSeasonComplete).toBe(false)
    })

    it('is true once all weeks are played (nextWeek=null after lastPlayed)', () => {
      const store = useSimulationStore()
      store.applyState({ ...emptyState, lastPlayedWeek: 6, nextWeek: null })
      expect(store.isSeasonComplete).toBe(true)
    })
  })

  describe('playedMatchesByWeek', () => {
    it('groups played fixtures by week sorted ascending', () => {
      const store = useSimulationStore()
      store.applyState({
        ...emptyState,
        fixtures: [
          fixture(1, 2, true),
          fixture(2, 1, true),
          fixture(3, 1, true),
          fixture(4, 3, false),
        ],
      })

      const weeks = store.playedMatchesByWeek
      expect(weeks).toHaveLength(2)
      expect(weeks[0]?.week).toBe(1)
      expect(weeks[0]?.fixtures).toHaveLength(2)
      expect(weeks[1]?.week).toBe(2)
      expect(weeks[1]?.fixtures).toHaveLength(1)
    })

    it('returns empty when no fixtures are played', () => {
      const store = useSimulationStore()
      store.applyState({
        ...emptyState,
        fixtures: [fixture(1, 1, false)],
      })

      expect(store.playedMatchesByWeek).toEqual([])
    })
  })

  describe('weekPanelWeekNumber', () => {
    it('defaults to week 1 when nothing is played', () => {
      const store = useSimulationStore()
      expect(store.weekPanelWeekNumber).toBe(1)
    })

    it('reflects last played week once simulation has started', () => {
      const store = useSimulationStore()
      store.applyState({ ...emptyState, lastPlayedWeek: 4 })
      expect(store.weekPanelWeekNumber).toBe(4)
    })
  })

  describe('weekPanelFixtures', () => {
    it('filters fixtures to the panel week', () => {
      const store = useSimulationStore()
      store.applyState({
        ...emptyState,
        lastPlayedWeek: 2,
        fixtures: [fixture(1, 1, true), fixture(2, 2, true), fixture(3, 3, false)],
      })

      const result = store.weekPanelFixtures
      expect(result).toHaveLength(1)
      expect(result[0]?.week).toBe(2)
    })
  })

  describe('playWeek action', () => {
    it('applies the returned state on success', async () => {
      vi.mocked(api.playWeek).mockResolvedValue({
        ...emptyState,
        lastPlayedWeek: 1,
        nextWeek: 2,
        fixtures: [fixture(1, 1, true)],
      })
      const store = useSimulationStore()

      await store.playWeek()

      expect(store.lastPlayedWeek).toBe(1)
      expect(store.nextWeek).toBe(2)
      expect(store.fixtures).toHaveLength(1)
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('records the error and rethrows on failure', async () => {
      const apiError = { status: 409, message: 'season complete', isConflict: true }
      vi.mocked(api.playWeek).mockRejectedValue(apiError)
      const store = useSimulationStore()

      await expect(store.playWeek()).rejects.toEqual(apiError)
      expect(store.error).toEqual(apiError)
      expect(store.loading).toBe(false)
    })
  })

  describe('refresh action', () => {
    it('parallel-fetches standings/predictions/fixtures and flattens fixture groups', async () => {
      vi.mocked(api.getStandings).mockResolvedValue({
        standings: [],
        lastPlayedWeek: 3,
        nextWeek: 4,
      })
      vi.mocked(api.getPredictions).mockResolvedValue({
        predictions: [],
        lastPlayedWeek: 3,
        nextWeek: 4,
      })
      vi.mocked(api.getFixtures).mockResolvedValue([
        { week: 1, fixtures: [fixture(1, 1, true)] },
        { week: 2, fixtures: [fixture(2, 2, true), fixture(3, 2, true)] },
      ])

      const store = useSimulationStore()
      await store.refresh()

      expect(store.lastPlayedWeek).toBe(3)
      expect(store.fixtures).toHaveLength(3)
      expect(api.getStandings).toHaveBeenCalledOnce()
      expect(api.getPredictions).toHaveBeenCalledOnce()
      expect(api.getFixtures).toHaveBeenCalledOnce()
    })
  })
})

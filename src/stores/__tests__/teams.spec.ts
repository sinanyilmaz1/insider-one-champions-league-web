import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTeamsStore } from '../teams'

vi.mock('@/api/endpoints', () => ({
  getTeams: vi.fn<() => Promise<unknown>>(),
}))

vi.mock('@/composables/useToast', () => ({ showToast: vi.fn<(message: string) => void>() }))

import * as api from '@/api/endpoints'

describe('useTeamsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('starts empty with no error and not loading', () => {
    const store = useTeamsStore()
    expect(store.teams).toEqual([])
    expect(store.error).toBeNull()
    expect(store.loading).toBe(false)
  })

  it('populates teams on successful fetch', async () => {
    const teams = [
      { id: 1, name: 'Chelsea', attack: 80, defense: 75, midfield: 78, homeAdvantage: 1.15 },
      { id: 2, name: 'Arsenal', attack: 75, defense: 70, midfield: 75, homeAdvantage: 1.15 },
    ]
    vi.mocked(api.getTeams).mockResolvedValue(teams)

    const store = useTeamsStore()
    await store.fetch()

    expect(store.teams).toEqual(teams)
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('records the error and rethrows on failure', async () => {
    const apiError = { status: 500, message: 'boom', isConflict: false }
    vi.mocked(api.getTeams).mockRejectedValue(apiError)

    const store = useTeamsStore()
    await expect(store.fetch()).rejects.toEqual(apiError)

    expect(store.error).toEqual(apiError)
    expect(store.loading).toBe(false)
    expect(store.teams).toEqual([])
  })
})

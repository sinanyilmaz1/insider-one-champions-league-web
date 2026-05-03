import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import * as api from '@/api/endpoints'
import type {
  SimulationState,
  StandingRow,
  TeamPrediction,
  Fixture,
  WeekGroup,
  UpdateMatchResultBody,
} from '@/api/types'
import type { ApiError } from '@/api/client'
import { showToast } from '@/composables/useToast'

export const useSimulationStore = defineStore('simulation', () => {
  const standings = ref<StandingRow[]>([])
  const predictions = ref<TeamPrediction[]>([])
  const fixtures = ref<Fixture[]>([])
  const lastPlayedWeek = ref<number | null>(null)
  const nextWeek = ref<number | null>(null)
  const loading = ref(false)
  const error = ref<ApiError | null>(null)

  function applyState(state: SimulationState) {
    standings.value = state.standings
    predictions.value = state.predictions
    fixtures.value = state.fixtures
    lastPlayedWeek.value = state.lastPlayedWeek
    nextWeek.value = state.nextWeek
  }

  const canShowPredictions = computed(
    () => lastPlayedWeek.value !== null && lastPlayedWeek.value >= 3,
  )

  const isSeasonComplete = computed(() => lastPlayedWeek.value !== null && nextWeek.value === null)

  const playedMatchesByWeek = computed<WeekGroup[]>(() => {
    const played = fixtures.value.filter((f) => f.matchResult !== null)
    const map = new Map<number, Fixture[]>()
    for (const f of played) {
      if (!map.has(f.week)) map.set(f.week, [])
      map.get(f.week)!.push(f)
    }
    return [...map.entries()]
      .sort(([a], [b]) => a - b)
      .map(([week, weekFixtures]) => ({ week, fixtures: weekFixtures }))
  })

  // Before any week is played, show upcoming week 1; afterward, the most recent played week.
  const weekPanelWeekNumber = computed(() => lastPlayedWeek.value ?? 1)

  const weekPanelFixtures = computed(() =>
    fixtures.value.filter((f) => f.week === weekPanelWeekNumber.value),
  )

  async function refresh() {
    loading.value = true
    error.value = null
    try {
      const [standingsRes, predictionsRes, fixturesRes] = await Promise.all([
        api.getStandings(),
        api.getPredictions(),
        api.getFixtures(),
      ])
      standings.value = standingsRes.standings
      predictions.value = predictionsRes.predictions
      lastPlayedWeek.value = standingsRes.lastPlayedWeek
      nextWeek.value = standingsRes.nextWeek
      // GET /fixtures returns grouped — flatten so this store holds the canonical flat list.
      fixtures.value = fixturesRes.flatMap((w) => w.fixtures)
    } catch (e) {
      const err = e as ApiError
      error.value = err
      showToast(err.message)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function playWeek() {
    loading.value = true
    error.value = null
    try {
      applyState(await api.playWeek())
    } catch (e) {
      const err = e as ApiError
      error.value = err
      showToast(err.message)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function playAll() {
    loading.value = true
    error.value = null
    try {
      applyState(await api.playAll())
    } catch (e) {
      const err = e as ApiError
      error.value = err
      showToast(err.message)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function reset() {
    loading.value = true
    error.value = null
    try {
      applyState(await api.resetSimulation())
    } catch (e) {
      const err = e as ApiError
      error.value = err
      showToast(err.message)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function editMatch(id: number, body: UpdateMatchResultBody) {
    loading.value = true
    error.value = null
    try {
      applyState(await api.updateMatchResult(id, body))
    } catch (e) {
      const err = e as ApiError
      error.value = err
      // 422 errors render inline next to the offending input in MatchEditModal;
      // surface other failures via toast.
      if (err.status !== 422) showToast(err.message)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    standings,
    predictions,
    fixtures,
    lastPlayedWeek,
    nextWeek,
    loading,
    error,
    canShowPredictions,
    isSeasonComplete,
    playedMatchesByWeek,
    weekPanelWeekNumber,
    weekPanelFixtures,
    applyState,
    refresh,
    playWeek,
    playAll,
    reset,
    editMatch,
  }
})

import { ref } from 'vue'
import { defineStore } from 'pinia'
import * as api from '@/api/endpoints'
import type { SimulationState, StandingRow, TeamPrediction, Fixture } from '@/api/types'
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

  async function reset() {
    loading.value = true
    error.value = null
    try {
      const fresh = await api.resetSimulation()
      applyState(fresh)
    } catch (e) {
      const err = e as ApiError
      error.value = err
      showToast(err.message)
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
    applyState,
    reset,
  }
})

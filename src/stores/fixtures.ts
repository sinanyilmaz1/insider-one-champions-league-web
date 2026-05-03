import { ref } from 'vue'
import { defineStore } from 'pinia'
import * as api from '@/api/endpoints'
import type { Fixture, WeekGroup } from '@/api/types'
import type { ApiError } from '@/api/client'
import { showToast } from '@/composables/useToast'
import { useSimulationStore } from '@/stores/simulation'

function groupByWeek(fixtures: Fixture[]): WeekGroup[] {
  const map = new Map<number, Fixture[]>()
  for (const f of fixtures) {
    if (!map.has(f.week)) map.set(f.week, [])
    map.get(f.week)!.push(f)
  }
  return [...map.entries()]
    .sort(([a], [b]) => a - b)
    .map(([week, weekFixtures]) => ({ week, fixtures: weekFixtures }))
}

export const useFixturesStore = defineStore('fixtures', () => {
  const weeks = ref<WeekGroup[]>([])
  const loading = ref(false)
  const error = ref<ApiError | null>(null)

  // Documented cross-store exception: generate() is the bootstrapping mutation
  // that puts the simulation in its initial state, so it splats the response
  // into simulationStore in addition to populating its own weeks.
  async function generate() {
    loading.value = true
    error.value = null
    try {
      const fresh = await api.generateFixtures()
      weeks.value = groupByWeek(fresh.fixtures)
      useSimulationStore().applyState(fresh)
    } catch (e) {
      const err = e as ApiError
      error.value = err
      if (!err.isConflict) showToast(err.message)
      throw err
    } finally {
      loading.value = false
    }
  }

  return { weeks, loading, error, generate }
})

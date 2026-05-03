import { ref } from 'vue'
import { defineStore } from 'pinia'
import * as api from '@/api/endpoints'
import type { Team } from '@/api/types'
import type { ApiError } from '@/api/client'
import { showToast } from '@/composables/useToast'

export const useTeamsStore = defineStore('teams', () => {
  const teams = ref<Team[]>([])
  const loading = ref(false)
  const error = ref<ApiError | null>(null)

  async function fetch() {
    loading.value = true
    error.value = null
    try {
      teams.value = await api.getTeams()
    } catch (e) {
      const err = e as ApiError
      error.value = err
      showToast(err.message)
      throw err
    } finally {
      loading.value = false
    }
  }

  return { teams, loading, error, fetch }
})

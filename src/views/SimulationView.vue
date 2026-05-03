<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useSimulationStore } from '@/stores/simulation'
import { useFixturesStore } from '@/stores/fixtures'
import StandingsTable from '@/components/simulation/StandingsTable.vue'
import WeekMatchesPanel from '@/components/simulation/WeekMatchesPanel.vue'
import PredictionsPanel from '@/components/simulation/PredictionsPanel.vue'
import SimulationControls from '@/components/simulation/SimulationControls.vue'
import MatchEditModal from '@/components/simulation/MatchEditModal.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import type { UpdateMatchResultBody } from '@/api/types'
import type { ApiError } from '@/api/client'

const router = useRouter()
const simulationStore = useSimulationStore()
const fixturesStore = useFixturesStore()

const {
  standings,
  predictions,
  lastPlayedWeek,
  loading,
  weekPanelWeekNumber,
  weekPanelFixtures,
  canShowPredictions,
  isSeasonComplete,
  playedMatchesByWeek,
} = storeToRefs(simulationStore)

const showEditModal = ref(false)
const showResetDialog = ref(false)
const validationErrors = ref<Record<number, { homeScore?: string; awayScore?: string }>>({})

onMounted(() => {
  void simulationStore.refresh()
})

async function onPlayWeek() {
  try {
    await simulationStore.playWeek()
  } catch {
    // toast surfaced in store
  }
}

async function onPlayAll() {
  try {
    await simulationStore.playAll()
  } catch {
    // toast surfaced in store
  }
}

function onResetClick() {
  showResetDialog.value = true
}

async function onConfirmReset() {
  try {
    await simulationStore.reset()
    // Reset wipes server-side fixtures; clear the fixturesStore cache too so
    // the navigation guard correctly redirects future /fixtures visits.
    fixturesStore.weeks = []
    await router.push('/')
  } catch {
    // toast surfaced in store
  }
}

async function onSaveEdit(payload: { id: number; body: UpdateMatchResultBody }) {
  try {
    await simulationStore.editMatch(payload.id, payload.body)
    if (validationErrors.value[payload.id]) {
      const next = { ...validationErrors.value }
      delete next[payload.id]
      validationErrors.value = next
    }
  } catch (e) {
    const err = e as ApiError
    if (err.status === 422 && err.validationErrors) {
      validationErrors.value = {
        ...validationErrors.value,
        [payload.id]: {
          homeScore: err.validationErrors.homeScore?.[0],
          awayScore: err.validationErrors.awayScore?.[0],
        },
      }
    }
  }
}
</script>

<template>
  <h1 class="text-text mb-4 text-2xl font-semibold">Simulation</h1>
  <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
    <StandingsTable :standings="standings" />
    <WeekMatchesPanel :week-number="weekPanelWeekNumber" :fixtures="weekPanelFixtures" />
    <PredictionsPanel :predictions="predictions" :gated="!canShowPredictions" />
  </div>
  <SimulationControls
    :playing="loading"
    :season-complete="isSeasonComplete"
    :has-played-matches="lastPlayedWeek !== null"
    @play-week="onPlayWeek"
    @play-all="onPlayAll"
    @reset="onResetClick"
    @edit="showEditModal = true"
  />
  <MatchEditModal
    v-if="showEditModal"
    :played-matches="playedMatchesByWeek"
    :validation-errors="validationErrors"
    @close="showEditModal = false"
    @save="onSaveEdit"
  />
  <ConfirmDialog
    v-model:open="showResetDialog"
    title="Reset simulation?"
    message="All match results and fixtures will be deleted. Teams will remain. This cannot be undone."
    confirm-label="Reset"
    @confirm="onConfirmReset"
  />
</template>

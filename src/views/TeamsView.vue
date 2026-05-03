<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useTeamsStore } from '@/stores/teams'
import { useFixturesStore } from '@/stores/fixtures'
import { useSimulationStore } from '@/stores/simulation'
import TeamsTable from '@/components/teams/TeamsTable.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import type { ApiError } from '@/api/client'

const router = useRouter()
const teamsStore = useTeamsStore()
const fixturesStore = useFixturesStore()
const simulationStore = useSimulationStore()

const { teams } = storeToRefs(teamsStore)
const { loading: fixturesLoading } = storeToRefs(fixturesStore)

const showResetDialog = ref(false)

onMounted(() => {
  void teamsStore.fetch()
})

async function onGenerate() {
  try {
    await fixturesStore.generate()
    await router.push('/fixtures')
  } catch (e) {
    if ((e as ApiError).isConflict) {
      showResetDialog.value = true
    }
  }
}

async function onConfirmReset() {
  try {
    await simulationStore.reset()
    await fixturesStore.generate()
    await router.push('/fixtures')
  } catch {
    // Errors are surfaced via toast in the stores; stay on this page.
  }
}
</script>

<template>
  <h1 class="text-text mb-4 text-2xl font-semibold">Tournament Teams</h1>
  <TeamsTable :teams="teams" />
  <button
    type="button"
    class="bg-brand hover:bg-brand-hover mt-6 rounded px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
    :disabled="fixturesLoading"
    @click="onGenerate"
  >
    Generate Fixtures
  </button>
  <ConfirmDialog
    v-model:open="showResetDialog"
    title="Fixtures already exist"
    message="Generating new fixtures will delete the current simulation, including all match results. Continue?"
    confirm-label="Reset and regenerate"
    @confirm="onConfirmReset"
  />
</template>

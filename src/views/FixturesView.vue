<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useFixturesStore } from '@/stores/fixtures'
import FixturesGrid from '@/components/fixtures/FixturesGrid.vue'

const router = useRouter()
const fixturesStore = useFixturesStore()
const { weeks } = storeToRefs(fixturesStore)

onMounted(() => {
  if (fixturesStore.weeks.length === 0) {
    void fixturesStore.fetch()
  }
})

function onStart() {
  void router.push('/simulation')
}
</script>

<template>
  <h1 class="text-text mb-4 text-2xl font-semibold">Generated Fixtures</h1>
  <FixturesGrid :weeks="weeks" />
  <button
    type="button"
    class="bg-brand hover:bg-brand-hover mt-6 rounded px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
    @click="onStart"
  >
    Start Simulation
  </button>
</template>

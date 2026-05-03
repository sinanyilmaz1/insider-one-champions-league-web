<script setup lang="ts">
import { computed } from 'vue'
import type { TeamPrediction } from '@/api/types'
import { useFormatPercent } from '@/composables/useFormatPercent'

const props = defineProps<{
  predictions: TeamPrediction[]
  gated: boolean
}>()

const formatPercent = useFormatPercent()

const sortedPredictions = computed(() =>
  [...props.predictions].sort((a, b) => b.championPercentage - a.championPercentage),
)
</script>

<template>
  <div class="bg-surface overflow-hidden rounded shadow-sm">
    <div
      class="bg-header-bg text-header-fg px-4 py-3 text-sm font-semibold tracking-wide uppercase"
    >
      Championship Predictions
    </div>
    <div v-if="gated" class="text-text-muted px-4 py-8 text-center text-sm">
      Available from week 3.
    </div>
    <ul v-else>
      <li
        v-for="row in sortedPredictions"
        :key="row.team.id"
        class="text-text border-border flex items-center justify-between border-b px-4 py-3 text-sm last:border-b-0"
      >
        <span>{{ row.team.name }}</span>
        <span class="font-semibold">{{ formatPercent(row.championPercentage) }}</span>
      </li>
    </ul>
  </div>
</template>

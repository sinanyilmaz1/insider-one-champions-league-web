<script setup lang="ts">
import type { Fixture } from '@/api/types'

defineProps<{
  weekNumber: number
  fixtures: Fixture[]
}>()
</script>

<template>
  <div class="bg-surface overflow-hidden rounded shadow-sm">
    <div
      class="bg-header-bg text-header-fg px-4 py-3 text-sm font-semibold tracking-wide uppercase"
    >
      Week {{ weekNumber }}
    </div>
    <ul>
      <li
        v-for="fixture in fixtures"
        :key="fixture.id"
        class="text-text border-border border-b px-4 py-3 text-sm last:border-b-0"
      >
        {{ fixture.homeTeam.name }} – {{ fixture.awayTeam.name }}
      </li>
    </ul>
  </div>
</template>

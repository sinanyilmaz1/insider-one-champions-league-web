<script setup lang="ts">
import { computed } from 'vue'
import type { StandingRow } from '@/api/types'

const props = defineProps<{ standings: StandingRow[] }>()

const sortedStandings = computed(() =>
  [...props.standings].sort(
    (a, b) =>
      b.points - a.points ||
      b.goalDifference - a.goalDifference ||
      b.goalsFor - a.goalsFor ||
      a.team.name.localeCompare(b.team.name),
  ),
)
</script>

<template>
  <div class="bg-surface overflow-hidden rounded shadow-sm">
    <div
      class="bg-header-bg text-header-fg px-4 py-3 text-sm font-semibold tracking-wide uppercase"
    >
      Standings
    </div>
    <table class="w-full">
      <thead>
        <tr class="text-text-muted border-border border-b text-xs uppercase">
          <th class="px-4 py-2 text-left font-medium">Team</th>
          <th class="px-2 py-2 text-right font-medium">PTS</th>
          <th class="px-2 py-2 text-right font-medium">P</th>
          <th class="px-2 py-2 text-right font-medium">W</th>
          <th class="px-2 py-2 text-right font-medium">D</th>
          <th class="px-2 py-2 text-right font-medium">L</th>
          <th class="px-2 py-2 pr-4 text-right font-medium">GD</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in sortedStandings"
          :key="row.team.id"
          class="border-border text-text border-b text-sm last:border-b-0"
        >
          <td class="px-4 py-2 text-left">{{ row.team.name }}</td>
          <td class="px-2 py-2 text-right font-semibold">{{ row.points }}</td>
          <td class="px-2 py-2 text-right">{{ row.played }}</td>
          <td class="px-2 py-2 text-right">{{ row.won }}</td>
          <td class="px-2 py-2 text-right">{{ row.drawn }}</td>
          <td class="px-2 py-2 text-right">{{ row.lost }}</td>
          <td class="px-2 py-2 pr-4 text-right">{{ row.goalDifference }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

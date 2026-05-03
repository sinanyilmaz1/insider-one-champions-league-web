<script setup lang="ts">
import type { Team } from '@/api/types'

defineProps<{ teams: Team[] }>()
</script>

<template>
  <table class="bg-surface w-full overflow-hidden rounded shadow-sm">
    <thead>
      <tr>
        <th
          class="bg-header-bg text-header-fg px-4 py-3 text-left text-sm font-semibold tracking-wide uppercase"
        >
          Team Name
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="team in teams" :key="team.id" class="border-border border-b last:border-b-0">
        <td class="text-text px-4 py-3 text-sm">{{ team.name }}</td>
      </tr>
    </tbody>
  </table>
</template>

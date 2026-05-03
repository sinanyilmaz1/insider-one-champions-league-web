<script setup lang="ts">
import type { WeekGroup } from '@/api/types'
import WeekCard from './WeekCard.vue'

defineProps<{ weeks: WeekGroup[] }>()
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <WeekCard
      v-for="group in weeks"
      :key="group.week"
      :week-number="group.week"
      :fixtures="group.fixtures"
    />
  </div>
</template>

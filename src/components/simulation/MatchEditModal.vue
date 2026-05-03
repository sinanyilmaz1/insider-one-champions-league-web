<script setup lang="ts">
import type { WeekGroup, UpdateMatchResultBody } from '@/api/types'
import MatchEditRow from './MatchEditRow.vue'

defineProps<{
  playedMatches: WeekGroup[]
  validationErrors?: Record<number, { homeScore?: string; awayScore?: string }>
}>()

const emit = defineEmits<{
  close: []
  save: [payload: { id: number; body: UpdateMatchResultBody }]
}>()

function onRowSave(id: number, body: UpdateMatchResultBody) {
  emit('save', { id, body })
}

function onClose() {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Edit match results"
      @click.self="onClose"
    >
      <div
        class="bg-surface flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded shadow-lg"
      >
        <div class="border-border flex items-center justify-between border-b px-5 py-4">
          <h2 class="text-text text-lg font-semibold">Edit Match Results</h2>
          <button
            type="button"
            class="text-text-muted hover:text-text text-2xl leading-none"
            aria-label="Close"
            @click="onClose"
          >
            ×
          </button>
        </div>
        <div class="overflow-y-auto p-5">
          <p v-if="!playedMatches.length" class="text-text-muted text-center text-sm">
            No played matches yet.
          </p>
          <section v-for="group in playedMatches" :key="group.week" class="mb-6 last:mb-0">
            <h3 class="text-text-muted mb-2 text-xs font-semibold tracking-wide uppercase">
              Week {{ group.week }}
            </h3>
            <div class="space-y-3">
              <MatchEditRow
                v-for="fixture in group.fixtures"
                :key="fixture.id"
                :fixture="fixture"
                :field-errors="validationErrors?.[fixture.id]"
                @save="(payload) => onRowSave(fixture.id, payload)"
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  </Teleport>
</template>

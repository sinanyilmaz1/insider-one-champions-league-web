<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { Fixture } from '@/api/types'

const props = defineProps<{
  fixture: Fixture
  fieldErrors?: { homeScore?: string; awayScore?: string }
}>()

const emit = defineEmits<{
  save: [payload: { homeScore: number; awayScore: number }]
}>()

const draft = reactive({ home: 0, away: 0 })
const serverSnapshot = reactive({ home: 0, away: 0 })

watch(
  () => props.fixture.matchResult,
  (result) => {
    if (!result) return
    if (serverSnapshot.home !== result.homeScore || serverSnapshot.away !== result.awayScore) {
      draft.home = result.homeScore
      draft.away = result.awayScore
      serverSnapshot.home = result.homeScore
      serverSnapshot.away = result.awayScore
    }
  },
  { immediate: true, deep: true },
)

function isDirty(): boolean {
  return draft.home !== serverSnapshot.home || draft.away !== serverSnapshot.away
}

function onSave() {
  emit('save', { homeScore: draft.home, awayScore: draft.away })
}
</script>

<template>
  <div class="border-border rounded border p-3">
    <div class="flex items-center gap-2">
      <span class="text-text flex-1 truncate text-sm">{{ fixture.homeTeam.name }}</span>
      <input
        v-model.number="draft.home"
        type="number"
        min="0"
        max="255"
        class="border-border w-16 rounded border px-2 py-1 text-center text-sm"
        :aria-label="`${fixture.homeTeam.name} score`"
        :class="{ 'border-danger': fieldErrors?.homeScore }"
      />
      <span class="text-text-muted text-sm">–</span>
      <input
        v-model.number="draft.away"
        type="number"
        min="0"
        max="255"
        class="border-border w-16 rounded border px-2 py-1 text-center text-sm"
        :aria-label="`${fixture.awayTeam.name} score`"
        :class="{ 'border-danger': fieldErrors?.awayScore }"
      />
      <span class="text-text flex-1 truncate text-right text-sm">{{ fixture.awayTeam.name }}</span>
      <button
        type="button"
        class="bg-brand hover:bg-brand-hover ml-2 rounded px-3 py-1 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="!isDirty()"
        @click="onSave"
      >
        Save
      </button>
      <span
        v-if="isDirty()"
        class="text-brand w-3 text-center text-xl leading-none"
        aria-label="Unsaved changes"
        title="Unsaved changes"
      >
        •
      </span>
      <span v-else class="w-3" aria-hidden="true"></span>
    </div>
    <div
      v-if="fieldErrors?.homeScore || fieldErrors?.awayScore"
      class="text-danger mt-2 space-y-1 text-xs"
    >
      <div v-if="fieldErrors?.homeScore">Home: {{ fieldErrors.homeScore }}</div>
      <div v-if="fieldErrors?.awayScore">Away: {{ fieldErrors.awayScore }}</div>
    </div>
  </div>
</template>

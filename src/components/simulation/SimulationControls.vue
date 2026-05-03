<script setup lang="ts">
defineProps<{
  playing: boolean
  seasonComplete: boolean
  hasPlayedMatches: boolean
}>()

defineEmits<{
  'play-week': []
  'play-all': []
  reset: []
  edit: []
}>()
</script>

<template>
  <div class="mt-6 flex flex-wrap gap-3">
    <button
      type="button"
      class="bg-brand hover:bg-brand-hover inline-flex items-center gap-2 rounded px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="playing || seasonComplete"
      @click="$emit('play-week')"
    >
      <span
        v-if="playing"
        class="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white"
        aria-hidden="true"
      ></span>
      Play Next Week
    </button>

    <button
      type="button"
      class="bg-brand hover:bg-brand-hover inline-flex items-center gap-2 rounded px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="playing || seasonComplete"
      @click="$emit('play-all')"
    >
      <span
        v-if="playing"
        class="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white"
        aria-hidden="true"
      ></span>
      Play All Weeks
    </button>

    <button
      type="button"
      class="bg-danger hover:bg-danger-hover rounded px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="playing"
      @click="$emit('reset')"
    >
      Reset Data
    </button>

    <button
      type="button"
      class="text-text border-border hover:bg-surface-alt rounded border bg-white px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="playing || !hasPlayedMatches"
      @click="$emit('edit')"
    >
      Edit Results
    </button>
  </div>
</template>

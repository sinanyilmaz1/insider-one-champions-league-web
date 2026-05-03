<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { toasts, dismiss } = useToast()
</script>

<template>
  <div class="pointer-events-none fixed top-4 right-4 z-50 flex flex-col gap-2">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="bg-header-bg text-header-fg pointer-events-auto flex max-w-sm items-start gap-3 rounded px-4 py-3 shadow-lg"
      role="status"
    >
      <span class="flex-1 text-sm">{{ toast.message }}</span>
      <button
        type="button"
        class="text-header-fg/70 hover:text-header-fg text-sm leading-none"
        aria-label="Dismiss"
        @click="dismiss(toast.id)"
      >
        ×
      </button>
    </div>
  </div>
</template>

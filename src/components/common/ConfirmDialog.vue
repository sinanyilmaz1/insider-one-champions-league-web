<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    open: boolean
    title: string
    message: string
    confirmLabel?: string
    cancelLabel?: string
  }>(),
  {
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
  },
)

const emit = defineEmits<{
  'update:open': [value: boolean]
  confirm: []
}>()

function close() {
  emit('update:open', false)
}

function onConfirm() {
  emit('confirm')
  close()
}

void props
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      role="dialog"
      aria-modal="true"
      :aria-label="title"
      @click.self="close"
    >
      <div class="bg-surface w-full max-w-md rounded shadow-lg">
        <div class="border-border border-b px-5 py-4">
          <h2 class="text-text text-lg font-semibold">{{ title }}</h2>
        </div>
        <div class="text-text px-5 py-4 text-sm">
          {{ message }}
        </div>
        <div class="border-border flex justify-end gap-2 border-t px-5 py-3">
          <button
            type="button"
            class="text-text hover:bg-surface-alt rounded px-4 py-2 text-sm"
            @click="close"
          >
            {{ cancelLabel }}
          </button>
          <button
            type="button"
            class="bg-brand hover:bg-brand-hover rounded px-4 py-2 text-sm font-medium text-white"
            @click="onConfirm"
          >
            {{ confirmLabel }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

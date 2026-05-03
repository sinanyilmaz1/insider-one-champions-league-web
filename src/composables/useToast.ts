import { reactive, readonly } from 'vue'

export interface ToastItem {
  id: number
  message: string
}

const state = reactive<{ items: ToastItem[] }>({ items: [] })
let nextId = 1
const DISMISS_MS = 4000

function dismiss(id: number) {
  const index = state.items.findIndex((t) => t.id === id)
  if (index !== -1) state.items.splice(index, 1)
}

export function showToast(message: string) {
  const id = nextId++
  state.items.push({ id, message })
  setTimeout(() => dismiss(id), DISMISS_MS)
}

export function useToast() {
  return {
    toasts: readonly(state.items),
    showToast,
    dismiss,
  }
}

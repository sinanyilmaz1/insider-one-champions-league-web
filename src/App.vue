<script setup lang="ts">
import AppHeader from '@/components/common/AppHeader.vue'
import AppToast from '@/components/common/AppToast.vue'
</script>

<template>
  <AppHeader />
  <main class="mx-auto max-w-6xl px-6 py-6">
    <router-view />
  </main>
  <AppToast />
</template>

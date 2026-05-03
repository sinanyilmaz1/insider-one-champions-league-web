<script setup lang="ts">
import AppToast from '@/components/common/AppToast.vue'
</script>

<template>
  <div class="bg-brand h-2 w-full" data-test="tailwind-token-check"></div>
  <router-view />
  <AppToast />
</template>

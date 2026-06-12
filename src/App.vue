<script setup>
import { RouterView } from 'vue-router'
import ToastNotification from '@/components/ToastNotification.vue'
</script>

<template>
  <RouterView />
  <ToastNotification />
</template>

<style>
/* Any custom styles or base setup if needed */
body {
  margin: 0;
  background-color: #020617;
}
</style>

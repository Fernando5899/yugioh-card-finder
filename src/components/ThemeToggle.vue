<script setup>
import { useThemeStore } from '@/stores/themeStore';

const themeStore = useThemeStore();
</script>

<template>
  <button
    @click="themeStore.toggleTheme()"
    class="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-2xl"
    aria-label="Cambiar tema"
  >
    <span v-if="themeStore.theme === 'light'">🌙</span>
    <span v-else>☀️</span>
  </button>
</template>

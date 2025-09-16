<script setup>
import { RouterView } from 'vue-router';
import { useThemeStore } from '@/stores/themeStore';

const themeStore = useThemeStore();
themeStore.applyTheme();
</script>

<template>
  <div class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen">
    <RouterView />
  </div>
</template>

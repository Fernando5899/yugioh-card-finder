<script setup>
import { storeToRefs } from 'pinia';
import { useCardStore } from '@/stores/cardStore';

const cardStore = useCardStore();
const { banlistFormats, selectedBanlist } = storeToRefs(cardStore);
</script>

<template>
  <div class="filters-container">
    <select
      v-model="selectedBanlist"
      :class="[
        'bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500',
        selectedBanlist ? 'text-gray-800 dark:text-white' : 'text-gray-500'
      ]"
    >
      <option value="" disabled class="text-black">Selecciona Formato de Banlist</option>
      <option value="all" class="text-black">-- Todas las Cartas --</option>
      <option v-for="format in banlistFormats" :key="format" :value="format" class="text-black">
        {{ format }}
      </option>
    </select>
  </div>
</template>

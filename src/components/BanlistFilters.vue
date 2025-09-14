<script setup>
import { storeToRefs } from 'pinia';
import { useCardStore } from '@/stores/cardStore';

const cardStore = useCardStore();
const { banlistFormats, selectedBanlist } = storeToRefs(cardStore);
</script>

<template>
  <div class="filters-container">
    <select v-model="selectedBanlist">
      <option value="">Selecciona Formato de Banlist</option>
      <option value="">-- Todas las Cartas --</option>
      <option v-for="format in banlistFormats" :key="format" :value="format">
        {{ format }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.filters-container {
  margin-bottom: 1.5rem;
}

select {
  width: 100%;
  padding: 0.75rem;
  font-size: 1.2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: white;
}

</style>

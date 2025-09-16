<script setup>
import { storeToRefs } from 'pinia';
import { useCardStore } from '@/stores/cardStore';

const cardStore = useCardStore();
// Simplemente nos conectamos al searchTerm del almacén
const { searchTerm } = storeToRefs(cardStore);
</script>

<template>
  <div class="search-container">
    <input
      v-model="searchTerm"
      type="text"
      placeholder="Buscar carta por nombre..."
      class="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
</template>

<style scoped>
/* El atributo 'scoped' asegura que estos estilos solo se aplicaran a este componente */
.search-container {
  margin-bottom: 1.5rem;
}

input {
  width: 100%;
  padding: 0.75rem;
  font-size: 1.2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-sizing: border-box; /* Asegura que el padding no afecte el ancho total */
}
</style>

<script setup>
import { storeToRefs } from 'pinia';
import { useCardStore } from '@/stores/cardStore';

const cardStore = useCardStore();
// Extraemos las propiedades de paginación del store
const { currentPage, totalPages } = storeToRefs(cardStore);

// Esta función llama a la acción 'changePage' que creamos en el store
function goToPage(page) {
  cardStore.changePage(page);
}
</script>

<template>
  <div class="flex justify-center items-center gap-4 my-8">
    <button
      @click="goToPage(currentPage - 1)"
      :disabled="currentPage === 1"
      class="px-4 py-2 bg-gray-700 rounded disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed hover:bg-gray-600"
    >
      &lt;&lt; Anterior
    </button>

    <span class="text-lg font-semibold">
      Página {{ currentPage }} de {{ totalPages }}
    </span>

    <button
      @click="goToPage(currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="px-4 py-2 bg-gray-700 rounded disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed hover:bg-gray-600"
    >
      Siguiente &gt;&gt;
    </button>
  </div>
</template>

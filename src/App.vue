<script setup>
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useCardStore } from '@/stores/cardStore';
import SearchInput from '@/components/SearchInput.vue';
import BanlistFilters from '@/components/BanlistFilters.vue';
import PaginationControls from '@/components/PaginationControls.vue'

const cardStore = useCardStore();
const { loading, error, filteredCards } = storeToRefs(cardStore);

onMounted(() => {
  cardStore.fetchAllCards();
});
</script>

<template>
  <main class="bg-gray-900 text-white min-h-screen p-4">
    <h1 class="text-3xl font-bold text-center mb-6">Buscador de Cartas de Yu-Gi-Oh!</h1>
    <SearchInput />
    <BanlistFilters />

    <div v-if="loading">
      <h2 class="text-2xl text-center mt-10">Cargando cartas... 🌀</h2>
    </div>

    <div v-else-if="error">
      <h2 class="text-2xl text-center mt-10 text-red-500">Ha ocurrido un error: {{ error.message }}</h2>
    </div>

    <div v-else class="mt-6 grid gap-4 grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
      <div v-for="card in filteredCards" :key="card.id" class="card-item">
        <img :src="card.card_images[0].image_url_small" :alt="card.name" class="rounded-lg hover:scale-110 transition-transform duration-200" />
      </div>
    </div>
    <PaginationControls />
  </main>
</template>

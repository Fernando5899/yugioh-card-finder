<script setup>
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useCardStore } from '@/stores/cardStore';
import SearchInput from '@/components/SearchInput.vue';
import BanlistFilters from '@/components/BanlistFilters.vue'

const cardStore = useCardStore();

// 1. CAMBIO AQUÍ: Pedimos 'filteredCards' en lugar de 'cards'.
const { loading, error, filteredCards } = storeToRefs(cardStore);

onMounted(() => {
  cardStore.fetchAllCards();
});
</script>

<template>
  <main>
    <h1>Buscador de Cartas de Yu-Gi-Oh!</h1>
    <SearchInput />
    <BanlistFilters />
    <div v-if="loading">
      <h2>Cargando cartas... 🌀</h2>
    </div>

    <div v-else-if="error">
      <h2>Ha ocurrido un error: {{ error.message }}</h2>
    </div>

    <div v-else class="card-grid">
      <div v-for="card in filteredCards" :key="card.id" class="card-item">
        <img :src="card.card_images[0].image_url_small" :alt="card.name" />
      </div>
    </div>
  </main>
</template>

<style>
/* Estilos sin cambios */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
}

.card-item img {
  width: 100%;
  display: block;
}

h2 {
  text-align: center;
  font-family: sans-serif;
}
</style>

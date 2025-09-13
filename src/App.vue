<script setup>
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useCardStore } from '@/stores/cardStore.js';

// 1. Obtenemos acceso a nuestro almacén de cartas
const cardStore = useCardStore();

// 2. Extraemos las propiedades que queremos usar (cards, loading, error) de forma 'reactiva'
// Esto asegura que nuestro componente se actualice cuando estos valores cambien.
const { cards, loading, error } = storeToRefs(cardStore);

// 3. 'onMounted' es un 'gancho del ciclo de vida'. La función que le pasemos
// Se ejecutará automáticamente en cuanto el componente esté listo y montado en la pantalla.
onMounted(() => {
  cardStore.fetchCards(); // Llamamos a la acción para que busque cartas en el servidor.
});
</script>

<template>
  <main>
    <h1> Buscador de Cartas de Yu-Gi-Oh! </h1>

    <div v-if="loading">
      <h2> Cargando cartas... </h2>
    </div>

    <div v-else-if="error">
      <h2>Ha ocurrido un Error: {{ error.message }}</h2>
    </div>

    <div v-else class="card-grid">
      <div v-for="card in cards" :key="card.id" class="card-item">
        <img :src="card.card_images[0].image_url_small" :alt="card.name" />
      </div>
    </div>

  </main>
</template>

<style>
/* Unos estilos básicos para que se vea como una cuadricula */
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


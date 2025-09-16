<script setup>
import { onMounted } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { useCardStore } from '@/stores/cardStore';
import { storeToRefs } from 'pinia';
import ThemeToggle from '@/components/ThemeToggle.vue';

const route = useRoute();
const cardStore = useCardStore();
const cardId = parseInt(route.params.id);

// Extraemos la carta actual (la renombramos a 'card') y el estado de carga
const { currentCard: card, loading, error } = storeToRefs(cardStore);

// Cuando el componente se monta, llamamos a la acción para buscar esa carta específica
onMounted(() => {
  cardStore.getCardById(cardId);
});
</script>

<template>
  <div class="p-4 md:p-8">
    <header class="flex justify-between items-center mb-8">
      <RouterLink to="/" class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 font-bold py-2 px-4 rounded transition-colors">
        &larr; Volver al buscador
      </RouterLink>
      <ThemeToggle />
    </header>

    <div v-if="loading">
      <h2 class="text-2xl text-center mt-10">Cargando carta... 🌀</h2>
    </div>
    <div v-else-if="error">
      <h2 class="text-2xl text-center mt-10 text-red-600 dark:text-red-400">Ha ocurrido un error al cargar la carta.</h2>
    </div>
    <div v-else-if="card" class="flex flex-col md:flex-row gap-8 items-start">
      <div class="w-full md:w-1/3">
        <img :src="card.card_images[0].image_url" :alt="card.name" class="rounded-lg w-full">
      </div>
      <div class="w-full md:w-2/3">
        <h1 class="text-3xl md:text-5xl font-bold mb-4">{{ card.name }}</h1>
        <p class="text-lg bg-gray-100 dark:bg-gray-800 p-4 rounded-lg whitespace-pre-wrap mb-6">{{ card.desc }}</p>
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 text-lg bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <div v-if="card.type"><strong>Tipo:</strong> {{ card.type }}</div>
          <div v-if="card.race"><strong>Raza:</strong> {{ card.race }}</div>
          <div v-if="card.attribute"><strong>Atributo:</strong> {{ card.attribute }}</div>
          <div v-if="card.level"><strong>Nivel/Rango:</strong> {{ card.level }}</div>
          <div v-if="card.atk !== undefined"><strong>ATK:</strong> {{ card.atk }}</div>
          <div v-if="card.def !== undefined"><strong>DEF:</strong> {{ card.def }}</div>
        </div>
      </div>
    </div>
    <div v-else>
      <h2 class="text-2xl text-center mt-10">Carta no encontrada.</h2>
    </div>
  </div>
</template>

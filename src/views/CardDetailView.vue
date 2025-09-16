<script setup>
import { computed } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { useCardStore } from '@/stores/cardStore';

// 1. Obtenemos acceso a la información de la ruta actual
const route = useRoute();
const cardStore = useCardStore();

// 2. Extraemos el ID de la carta de los parámetros de la URL
//    La URL es /card/:id, así que accedemos a 'id'. Viene como texto, lo convertimos a número.
const cardId = parseInt(route.params.id);

// 3. Usamos 'computed' para buscar la carta en nuestro almacén.
//    'computed' crea una variable reactiva que se actualiza si sus dependencias cambian.
const card = computed(() => {
  return cardStore.allCards.find(c => c.id === cardId);
});
</script>

<template>
  <div class="p-4 md:p-8">
    <RouterLink to="/" class="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mb-8 inline-block transition-colors">
      &larr; Volver al buscador
    </RouterLink>

    <div v-if="card" class="flex flex-col md:flex-row gap-8 items-start">

      <div class="w-full md:w-1/3">
        <img :src="card.card_images[0].image_url" :alt="card.name" class="rounded-lg w-full">
      </div>

      <div class="w-full md:w-2/3">
        <h1 class="text-3xl md:text-5xl font-bold mb-4">{{ card.name }}</h1>

        <p class="text-lg bg-gray-800 p-4 rounded-lg whitespace-pre-wrap mb-6">{{ card.desc }}</p>

        <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 text-lg bg-gray-800 p-4 rounded-lg">
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

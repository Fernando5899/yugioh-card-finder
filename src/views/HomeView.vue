<script setup>
import { onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useCardStore } from '@/stores/cardStore';
import { RouterLink } from 'vue-router'; // <-- 1. RESTAURAMOS LA IMPORTACIÓN DEL ROUTERLINK
import SearchInput from '@/components/SearchInput.vue';
import BanlistFilters from '@/components/BanlistFilters.vue';
import PaginationControls from '@/components/PaginationControls.vue';
import TypeFilter from '@/components/TypeFilter.vue';
import ThemeToggle from '@/components/ThemeToggle.vue'; // <-- 2. RESTAURAMOS LA IMPORTACIÓN DEL BOTÓN DE TEMA
import CardSkeleton from '@/components/CardSkeleton.vue';

const cardStore = useCardStore();
const { loading, error, cards, searchTerm, selectedBanlist, selectedType } = storeToRefs(cardStore);

let debounceTimer;

onMounted(() => {
  cardStore.getCards();
});

watch([searchTerm, selectedBanlist, selectedType], () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    cardStore.currentPage = 1;
    cardStore.getCards();
  }, 500);
});
</script>

<template>
  <main class="p-6">
    <header class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Buscador de Cartas de Yu-Gi-Oh!</h1>
      <div class="flex items-center gap-4">
        <RouterLink
          to="/deck-builder"
          class="text-lg font-semibold hover:text-cyan-400 dark:hover:text-cyan-300 transition-colors"
        >
          Constructor de Mazos
        </RouterLink>
        <ThemeToggle />
      </div>
    </header>

    <div class="bg-gray-100 dark:bg-slate-800 p-4 rounded-lg mb-6">
      <SearchInput />
      <div class="flex flex-col md:flex-row gap-4 mt-4">
        <BanlistFilters class="w-full md:w-1/2" />
        <TypeFilter class="w-full md:w-1/2" />
      </div>
    </div>

    <div v-if="loading" class="mt-6 grid gap-4 grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
      <div v-for="n in 20" :key="n">
        <CardSkeleton />
      </div>
    </div>

    <div v-else-if="error">
      <h2 class="text-2xl text-center mt-10 text-red-600 dark:text-red-400">Ha ocurrido un error: {{ error.message }}</h2>
    </div>

    <TransitionGroup
      v-else
      tag="div"
      name="card-fade"
      class="mt-6 grid gap-4 grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10"
    >
      <div v-for="card in cards" :key="card.id" class="card-item">
        <RouterLink :to="`/card/${card.id}`">
          <img
            :src="card.card_images[0].image_url_small"
            :alt="card.name"
            class="rounded-lg hover:scale-110 hover:shadow-lg hover:shadow-cyan-400/50 transition-all duration-300"
          />
        </RouterLink>
      </div>
    </TransitionGroup>

    <PaginationControls />
  </main>
</template>

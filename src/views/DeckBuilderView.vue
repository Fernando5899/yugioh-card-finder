<script setup>
import { onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useCardStore } from '@/stores/cardStore';
import { useDeckStore } from '@/stores/deckStore';
import { RouterLink } from 'vue-router';
import SearchInput from '@/components/SearchInput.vue';
import BanlistFilters from '@/components/BanlistFilters.vue';
import PaginationControls from '@/components/PaginationControls.vue';
import TypeFilter from '@/components/TypeFilter.vue';
import CardSkeleton from '@/components/CardSkeleton.vue';
import ThemeToggle from '@/components/ThemeToggle.vue';

const cardStore = useCardStore();
const { loading, error, cards, searchTerm, selectedBanlist, selectedType } = storeToRefs(cardStore);
const deckStore = useDeckStore();
const { mainDeck, mainDeckCount } = storeToRefs(deckStore);

function onDragStartFromList(event, card) {
  event.dataTransfer.dropEffect = 'move';
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('action', 'add');
  event.dataTransfer.setData('cardID', card.id);
}

function onDragStartFromDeck(event, cardIndex) {
  event.dataTransfer.dropEffect = 'move';
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('action', 'remove');
  event.dataTransfer.setData('cardIndex', cardIndex);
}

function onDropOnDeck(event) {
  const action = event.dataTransfer.getData('action');
  if (action !== 'add') return;
  const cardID = parseInt(event.dataTransfer.getData('cardID'));
  const cardToAdd = cardStore.cards.find(c => c.id === cardID);
  if (cardToAdd) {
    deckStore.addCard(cardToAdd);
  }
}

function onDropOnList(event) {
  const action = event.dataTransfer.getData('action');
  if (action !== 'remove') return;
  const cardIndex = parseInt(event.dataTransfer.getData('cardIndex'));
  deckStore.removeCard(cardIndex);
}

function handleAddCard(card) {
  deckStore.addCard(card);
}

onMounted(() => {
  cardStore.getCards();
});

watch([searchTerm, selectedBanlist, selectedType], () => {
  cardStore.currentPage = 1;
  cardStore.getCards();
});
</script>

<template>
  <div class="flex flex-col md:flex-row min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">

    <aside
      @dragover.prevent
      @drop="onDropOnList($event)"
      class="w-full md:w-1/2 p-4 flex flex-col"
    >
      <header class="flex justify-between items-center mb-4 flex-shrink-0">
        <RouterLink to="/" class="text-2xl font-bold hover:text-cyan-400 dark:hover:text-cyan-300 transition-colors">
          Buscador de Cartas
        </RouterLink>
        <ThemeToggle />
      </header>

      <div class="bg-gray-100 dark:bg-slate-800 p-4 rounded-lg mb-4 flex-shrink-0">
        <SearchInput />
        <div class="flex flex-col md:flex-row gap-4 mt-4">
          <BanlistFilters class="w-full md:w-1/2" />
          <TypeFilter class="w-full md:w-1/2" />
        </div>
      </div>

      <div class="flex-grow overflow-y-auto pr-2">
        <div v-if="loading" class="mt-6 grid gap-4 grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5">
          <div v-for="n in 20" :key="n"><CardSkeleton /></div>
        </div>
        <div v-else-if="error" class="mt-6">
          <h2 class="text-2xl text-center text-red-600 dark:text-red-400">Ha ocurrido un error.</h2>
        </div>
        <TransitionGroup
          v-else
          tag="div"
          name="card-fade"
          class="mt-6 grid gap-4 grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5"
        >
          <div v-for="card in cards" :key="card.id" class="card-item relative group">
            <RouterLink :to="`/card/${card.id}`">
              <img
                :draggable="true"
                @dragstart="onDragStartFromList($event, card)"
                :src="card.card_images[0].image_url_small"
                :alt="card.name"
                class="rounded-lg"
              />
            </RouterLink>
            <button
              @click="handleAddCard(card)"
              class="absolute top-1 right-1 bg-blue-600 hover:bg-blue-500 text-white font-bold w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              aria-label="Añadir al mazo"
            >
              +
            </button>
          </div>
        </TransitionGroup>
      </div>

      <div class="mt-auto flex-shrink-0 pt-4">
        <PaginationControls />
      </div>
    </aside>

    <main class="w-full md:w-1/2 p-4 border-t-2 md:border-t-0 md:border-l-2 border-gray-200 dark:border-gray-700 flex flex-col">
      <div class="flex justify-between items-center flex-shrink-0">
        <h2 class="text-2xl font-bold mb-4">Tu Mazo</h2>
        <span class="text-xl font-bold text-gray-400 dark:text-gray-500">{{ mainDeckCount }} / 60</span>
      </div>
      <div
        @dragover.prevent
        @drop="onDropOnDeck($event)"
        class="bg-gray-100 dark:bg-slate-800 rounded-lg p-2 h-full flex-grow overflow-y-auto"
      >
        <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-9 gap-2">
          <div
            v-for="(card, index) in mainDeck"
            :key="`${card.id}-${index}`"
            class="card-item-deck"
            :draggable="true"
            @dragstart="onDragStartFromDeck($event, index)"
          >
            <img :src="card.card_images[0].image_url_small" :alt="card.name" class="rounded" />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

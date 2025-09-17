<script setup>
import { onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useCardStore } from '@/stores/cardStore';
import { useDeckStore } from '@/stores/deckStore';
import { RouterLink } from 'vue-router';
import draggable from 'vuedraggable';
import SearchInput from '@/components/SearchInput.vue';
import BanlistFilters from '@/components/BanlistFilters.vue';
import PaginationControls from '@/components/PaginationControls.vue';
import TypeFilter from '@/components/TypeFilter.vue';
import CardSkeleton from '@/components/CardSkeleton.vue';
import ThemeToggle from '@/components/ThemeToggle.vue';

const cardStore = useCardStore();
const { loading, error, cards, searchTerm, selectedBanlist, selectedType } = storeToRefs(cardStore);
const deckStore = useDeckStore();
const { mainDeck, extraDeck, sideDeck, mainDeckCount, extraDeckCount, sideDeckCount, deckStatus } = storeToRefs(deckStore);

const extraDeckTypes = ['Fusion Monster', 'Link Monster', 'Synchro Monster', 'XYZ Monster'];

// --- VERSIÓN FINAL DE LA LÓGICA DE VALIDACIÓN ---
function checkMove(event) {
  const card = event.draggedContext.element;
  const fromId = event.from.id;
  const toId = event.to.id;

  // Si se mueve dentro de la misma lista (reordenar), siempre se permite.
  if (fromId === toId) return true;

  // --- VALIDACIONES DEL MAZO DE DESTINO ---
  const isExtraDeckCard = extraDeckTypes.includes(card.type);

  // Regla de Tipo: ¿La carta puede ir al mazo de destino?
  if (toId === 'main-deck-list' && isExtraDeckCard) return false;
  if (toId === 'extra-deck-list' && !isExtraDeckCard) return false;

  // Regla de Tamaño: ¿El mazo de destino está lleno?
  if (toId === 'main-deck-list' && deckStore.mainDeckCount >= 60) return false;
  if (toId === 'extra-deck-list' && deckStore.extraDeckCount >= 15) return false;
  if (toId === 'side-deck-list' && deckStore.sideDeckCount >= 15) return false;

  // --- VALIDACIÓN DE COPIAS (SOLO AL AÑADIR UNA CARTA NUEVA) ---
  const isAddingNewCard = !fromId; // La lista de búsqueda no tiene ID, los mazos sí.
  if (isAddingNewCard) {
    if (deckStore.getCardCount(card.id) >= 3) {
      return false; // Bloquear si ya hay 3 copias
    }
  }

  return true; // Si pasa todas las validaciones, el movimiento es válido.
}

function handleAddCard(card) { deckStore.addCard(card); }
function handleRemoveFromMain(index) { deckStore.removeCardFromMain(index); }
function handleRemoveFromExtra(index) { deckStore.removeCardFromExtra(index); }
function handleRemoveFromSide(index) { deckStore.removeCardFromSide(index); }

onMounted(() => { cardStore.getCards(); });

watch([searchTerm, selectedBanlist, selectedType], () => {
  cardStore.currentPage = 1;
  cardStore.getCards();
});
</script>

<template>
  <div class="flex flex-col md:flex-row min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">

    <aside class="w-full md:w-1/2 p-4 flex flex-col">
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
        <draggable
          v-else
          :list="cards"
          item-key="id"
          :group="{ name: 'cards', pull: 'clone', put: false }"
          :move="checkMove"
          tag="div"
          class="mt-6 grid gap-4 grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5"
        >
          <template #item="{ element: card }">
            <div class="card-item relative group">
              <RouterLink :to="`/card/${card.id}`">
                <img :src="card.card_images[0].image_url_small" :alt="card.name" class="rounded-lg" />
              </RouterLink>
              <button @click="handleAddCard(card)" class="absolute top-1 right-1 bg-blue-600 hover:bg-blue-500 text-white font-bold w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" aria-label="Añadir al mazo">+</button>
            </div>
          </template>
        </draggable>
      </div>

      <div class="mt-auto flex-shrink-0 pt-4">
        <PaginationControls />
      </div>
    </aside>

    <main class="w-full md:w-1/2 p-4 border-t-2 md:border-t-0 md:border-l-2 border-gray-200 dark:border-gray-700 flex flex-col">
      <div class="flex-grow flex flex-col gap-8">
        <div class="flex flex-col">
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-xl font-bold">Main Deck</h3>
            <span class="font-semibold text-gray-400 dark:text-gray-500">{{ mainDeckCount }} / 60</span>
          </div>
          <div class="bg-gray-100 dark:bg-slate-800 rounded-lg p-2 min-h-[120px]">
            <draggable
              :list="mainDeck"
              :move="checkMove"
              id="main-deck-list"
              item-key="id"
              group="cards"
              tag="div"
              class="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-9 gap-2"
            >
              <template #item="{ element: card, index }">
                <div class="relative group">
                  <img @click="handleRemoveFromMain(index)" :src="card.card_images[0].image_url_small" :alt="card.name" class="rounded cursor-pointer" />
                  <div class="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-70 flex items-center justify-center rounded transition-opacity cursor-pointer" @click="handleRemoveFromMain(index)">
                    <span class="text-white text-4xl font-black">−</span>
                  </div>
                </div>
              </template>
            </draggable>
          </div>
        </div>

        <div>
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-xl font-bold">Extra Deck</h3>
            <span class="font-semibold text-gray-400 dark:text-gray-500">{{ extraDeckCount }} / 15</span>
          </div>
          <div class="bg-gray-100 dark:bg-slate-800 rounded-lg p-2 min-h-[120px]">
            <draggable
              :list="extraDeck"
              :move="checkMove"
              id="extra-deck-list"
              item-key="id"
              group="cards"
              tag="div"
              class="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-9 gap-2"
            >
              <template #item="{ element: card, index }">
                <div class="relative group">
                  <img @click="handleRemoveFromExtra(index)" :src="card.card_images[0].image_url_small" :alt="card.name" class="rounded cursor-pointer" />
                  <div @click="handleRemoveFromExtra(index)" class="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-70 flex items-center justify-center rounded transition-opacity cursor-pointer">
                    <span class="text-white text-4xl font-black">−</span>
                  </div>
                </div>
              </template>
            </draggable>
          </div>
        </div>

        <div>
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-xl font-bold">Side Deck</h3>
            <span class="font-semibold text-gray-400 dark:text-gray-500">{{ sideDeckCount }} / 15</span>
          </div>
          <div class="bg-gray-100 dark:bg-slate-800 rounded-lg p-2 min-h-[120px]">
            <draggable
              :list="sideDeck"
              :move="checkMove"
              id="side-deck-list"
              item-key="id"
              group="cards"
              tag="div"
              class="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-9 gap-2"
            >
              <template #item="{ element: card, index }">
                <div class="relative group">
                  <img @click="handleRemoveFromSide(index)" :src="card.card_images[0].image_url_small" :alt="card.name" class="rounded cursor-pointer" />
                  <div @click="handleRemoveFromSide(index)" class="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-70 flex items-center justify-center rounded transition-opacity cursor-pointer">
                    <span class="text-white text-4xl font-black">−</span>
                  </div>
                </div>
              </template>
            </draggable>
          </div>
        </div>
      </div>

      <div class="mt-auto p-4 rounded-lg flex-shrink-0" :class="deckStatus.isValid ? 'bg-green-100 dark:bg-green-900' : 'bg-yellow-100 dark:bg-yellow-900'">
        <h4 class="font-bold text-lg mb-2" :class="deckStatus.isValid ? 'text-green-800 dark:text-green-200' : 'text-yellow-800 dark:text-yellow-200'">
          Estado del Mazo
        </h4>
        <ul>
          <li v-for="issue in deckStatus.issues" :key="issue" :class="deckStatus.isValid ? 'text-green-700 dark:text-green-300' : 'text-yellow-700 dark:text-yellow-300'">
            - {{ issue }}
          </li>
        </ul>
      </div>
    </main>
  </div>
</template>

import { defineStore } from 'pinia';
import { fetchAllCards } from '@/services/ygoApiService.js';

export const useCardStore = defineStore('cardStore', {
  state: () => ({
    allCards: [],
    loading: false,
    error: null,
    searchTerm: '',
    // --- LISTA DE FORMATOS SIMPLIFICADA ---
    banlistFormats: ['TCG', 'OCG', 'GOAT'],
    selectedBanlist: '',
  }),

  getters: {
    filteredCards: (state) => {
      let cardsToFilter = state.allCards;

      // 1. Filtramos por Banlist (lógica simplificada)
      if (state.selectedBanlist) {
        const format = state.selectedBanlist;
        cardsToFilter = state.allCards.filter(card => {
          if (format === 'TCG') return card.banlist_info?.ban_tcg;
          if (format === 'OCG') return card.banlist_info?.ban_ocg;
          if (format === 'GOAT') return card.banlist_info?.ban_goat;
          return false;
        });
      }

      // 2. Filtramos por término de búsqueda
      if (state.searchTerm) {
        cardsToFilter = cardsToFilter.filter(card =>
          card.name.toLowerCase().includes(state.searchTerm.toLowerCase())
        );
      }

      return cardsToFilter;
    },
  },

  actions: {
    async fetchAllCards() {
      this.loading = true;
      this.error = null;
      try {
        this.allCards = await fetchAllCards();
      } catch (err) {
        this.error = err;
      } finally {
        this.loading = false;
      }
    },
  },
});

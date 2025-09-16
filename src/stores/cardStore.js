import { defineStore } from 'pinia';
// ¡CORRECCIÓN AQUÍ!
import { fetchCards, fetchCardById } from '@/services/ygoApiService.js';

export const useCardStore = defineStore('cardStore', {
  state: () => ({
    cards: [],
    currentCard: null,
    loading: false,
    error: null,
    // Estado de los filtros
    searchTerm: '',
    banlistFormats: ['TCG', 'OCG', 'GOAT'],
    selectedBanlist: '',
    cardTypes: ['Effect Monster', 'Flip Effect Monster', 'Fusion Monster', 'Link Monster', 'Normal Monster', 'Pendulum Effect Monster', 'Ritual Monster', 'Spell Card', 'Synchro Monster', 'Trap Card', 'XYZ Monster'],
    selectedType: '',
    // Estado de la paginación
    currentPage: 1,
    cardsPerPage: 50,
    totalCards: 0,
  }),

  getters: {
    totalPages: (state) => {
      if (state.totalCards === 0) return 1;
      return Math.ceil(state.totalCards / state.cardsPerPage);
    },
  },

  actions: {
    async getCards() {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetchCards({
          searchTerm: this.searchTerm,
          selectedBanlist: this.selectedBanlist,
          selectedType: this.selectedType,
          currentPage: this.currentPage,
          cardsPerPage: this.cardsPerPage,
        });
        this.cards = response.data;
        this.totalCards = response.meta.total_rows;
      } catch (err) {
        this.error = err;
      } finally {
        this.loading = false;
      }
    },

    async getCardById(id) {
      this.loading = true;
      this.currentCard = null;
      this.error = null;
      try {
        this.currentCard = await fetchCardById(id);
      } catch (err) {
        this.error = err;
      } finally {
        this.loading = false;
      }
    },

    async changePage(newPage) {
      if (newPage < 1 || newPage > this.totalPages) return;
      this.currentPage = newPage;
      await this.getCards();
    }
  },
});

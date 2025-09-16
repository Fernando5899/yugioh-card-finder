import { defineStore } from 'pinia';
import { fetchCards } from '@/services/ygoApiService.js';

export const useCardStore = defineStore('cardStore', {
  state: () => ({
    cards: [], // Solo necesitamos una lista de cartas
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
    cardsPerPage: 50, // Reducimos un poco para que sea más rápido
    totalCards: 0,
  }),

  getters: {
    // El getter ahora es mucho más simple, solo calcula las páginas
    totalPages: (state) => {
      if (state.totalCards === 0) return 1;
      return Math.ceil(state.totalCards / state.cardsPerPage);
    },
  },

  actions: {
    // La ÚNICA acción que necesitamos para buscar y filtrar
    async getCards() {
      this.loading = true;
      this.error = null;
      try {
        // Pasamos el estado actual de los filtros a nuestro servicio
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

    // Esta acción ahora solo cambia la página y vuelve a llamar a la acción principal
    async changePage(newPage) {
      if (newPage < 1 || newPage > this.totalPages) return;
      this.currentPage = newPage;
      await this.getCards();
    }
  },
});

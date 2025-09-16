import { defineStore } from 'pinia';
import { fetchAllCards } from '@/services/ygoApiService.js';

export const useCardStore = defineStore('cardStore', {
  state: () => ({
    allCards: [],
    loading: false,
    error: null,
    searchTerm: '',
    banlistFormats: ['TCG', 'OCG', 'GOAT'],
    selectedBanlist: '',
    // --- ¡NUEVO ESTADO PARA EL FILTRO DE TIPO! ---
    cardTypes: ['Effect Monster', 'Flip Effect Monster', 'Fusion Monster', 'Link Monster', 'Normal Monster', 'Pendulum Effect Monster', 'Ritual Monster', 'Spell Card', 'Synchro Monster', 'Trap Card', 'XYZ Monster'],
    selectedType: '',
    // --- Paginación ---
    currentPage: 1,
    cardsPerPage: 100,
    totalCards: 0,
  }),

  getters: {
    filteredCards: (state) => {
      let cardsToFilter = state.allCards;

      // 1. Filtramos por Banlist
      if (state.selectedBanlist && state.selectedBanlist !== 'all') {
        const format = state.selectedBanlist;
        cardsToFilter = cardsToFilter.filter(card => {
          if (format === 'TCG') return card.banlist_info?.ban_tcg;
          if (format === 'OCG') return card.banlist_info?.ban_ocg;
          if (format === 'GOAT') return card.banlist_info?.ban_goat;
          return false;
        });
      }

      // --- ¡NUEVO BLOQUE DE FILTRADO POR TIPO! ---
      if (state.selectedType) {
        cardsToFilter = cardsToFilter.filter(card => card.type === state.selectedType);
      }

      // 2. Filtramos por término de búsqueda
      if (state.searchTerm) {
        cardsToFilter = cardsToFilter.filter(card =>
          card.name.toLowerCase().includes(state.searchTerm.toLowerCase())
        );
      }

      return cardsToFilter;
    },
    totalPages: (state) => {
      if (state.totalCards === 0) return 1;
      return Math.ceil(state.totalCards / state.cardsPerPage);
    },
  },
  
  // Son las acciones que se ejecutan cuando se modifica el estado
  actions: {
    async fetchAllCards() {
      this.loading = true;
      this.error = null;
      // Calculamos el 'offset' basado en la página actual
      const offset = (this.currentPage - 1) * this.cardsPerPage;
      try {
        // Llamamos al servicio con los parámetros de paginación
        const response = await fetchAllCards(this.cardsPerPage, offset);
        this.allCards = response.data;
        // Guardamos el número total de cartas que nos informa la API
        this.totalCards = response.meta.total_rows;
      } catch (err) {
        this.error = err;
      } finally {
        this.loading = false;
      }
    },
    // --- ¡NUEVA ACCIÓN PARA CAMBIAR DE PÁGINA! ---
    async changePage(newPage) {
      if (newPage < 1 || newPage > this.totalPages) return; // No ir a páginas inválidas
      this.currentPage = newPage;
      // Volvemos a llamar a la acción principal para que traiga los datos de la nueva página
      await this.fetchAllCards();
    }
  },
});

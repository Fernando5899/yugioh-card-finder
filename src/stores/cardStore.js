import { defineStore } from 'pinia';
import { fetchAllCards } from '@/services/ygoApiService.js';

export const useCardStore = defineStore('cardStore', {
  // State: El corazón de nuestro almacén, donde se almacenan los datos
  state: () => ({
    cards: [], // Empezamos con una lista de cartas vacía.
    loading: false, // Un estado para saber si estamos cargando datos.
    error: null, // Para guardar un posible error.
  }),

  // Actions: Las funciones que modifican el estado.
  actions: {
    async fetchCards() {
      this.loading = true; // Ponemos el estado de carga en true.
      this.error = null; // Reseteamos cualquier error anterior.

      try {
        // Lamamos a nuestro 'mensajero' y esperamos la respuesta.
        const allCards = await fetchAllCards();
        // Cuando las trae, las guardamos en el estado.
        this.cards = allCards;
      } catch (err) {
        // Si hay un error, guardamos el mensaje de error.
        this.error = err;
      } finally {
        // Al final, sea cual sea el resultado dejamos de cargar.
        this.loading = false;
      }
    },
  },
});

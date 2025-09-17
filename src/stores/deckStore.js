import { defineStore } from 'pinia';

export const useDeckStore = defineStore('deck', {
  state: () => ({
    mainDeck: [], // Array para las cartas del mazo principal
  }),
  getters: {
    // Getter para saber cuántas cartas tenemos en el mazo principal
    mainDeckCount: (state) => state.mainDeck.length,
  },
  actions: {
    // Acción para añadir una carta al mazo principal
    addCard(card) {
      // Lógica de reglas (la mejoraremos después):
      // Contamos cuántas copias de esta carta tenemos en el mazo principal
      const count = this.mainDeck.filter(c => c.id === card.id).length;

      // No permitimos más de 3 copias de la misma carta
      if (count >= 3) {
        alert(`Ya tienes 3 copias de ${card.name}. En tu mazo.`);
        return; // Detenemos la función
      }
      // Si todo está bien, añadimos la carta al mazo
      this.mainDeck.push(card);
    },
  },
});

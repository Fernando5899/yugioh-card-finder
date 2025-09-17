import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';

const extraDeckTypes = [
  'Fusion Monster',
  'Link Monster',
  'Synchro Monster',
  'XYZ Monster',
];

export const useDeckStore = defineStore('deck', {
  state: () => ({
    mainDeck: [],
    extraDeck: [],
    sideDeck:  [],// <-- AÑADIMOS EL SIDE DECK
  }),

  getters: {
    mainDeckCount: (state) => state.mainDeck.length,
    extraDeckCount: (state) => state.extraDeck.length,
    sideDeckCount: (state) => state.sideDeck.length, // <-- Nuevo contador

    getCardCount: (state) => (cardId) => {
      const mainCount = state.mainDeck.filter(c => c.id === cardId).length;
      const extraCount = state.extraDeck.filter(c => c.id === cardId).length;
      const sideCount = state.sideDeck.filter(c => c.id === cardId).length; // <-- Contamos en el Side Deck
      return mainCount + extraCount + sideCount; // Sumamos los tres
    },

    deckStatus: (state) => {
      const issues = [];
      if (state.mainDeck.length < 40) { issues.push(`Faltan ${40 - state.mainDeck.length} cartas en el Main Deck.`); }
      if (state.mainDeck.length > 60) { issues.push('El Main Deck no puede tener más de 60 cartas.'); }
      if (state.extraDeck.length > 15) { issues.push('El Extra Deck no puede tener más de 15 cartas.'); }
      if (state.sideDeck.length > 15) { issues.push('El Side Deck no puede tener más de 15 cartas.'); } // <-- Nueva regla

      if (issues.length === 0) { return { isValid: true, issues: ['¡Tu mazo es válido!'] }; }
      return { isValid: false, issues };
    },
  },

  actions: {
    addCard(card) {
      const currentCount = this.getCardCount(card.id);
      if (currentCount >= 3) {
        alert(`Límite de 3 copias alcanzado para "${card.name}".`);
        return;
      }

      if (extraDeckTypes.includes(card.type)) {
        if (this.extraDeckCount >= 15) {
          alert('El Extra Deck no puede tener más de 15 cartas.');
          return;
        }
        this.extraDeck.push(card);
      } else {
        if (this.mainDeckCount >= 60) {
          alert('El Main Deck no puede tener más de 60 cartas.');
          return;
        }
        this.mainDeck.push(card);
      }
    },

    removeCardFromMain(cardIndex) {
      this.mainDeck.splice(cardIndex, 1);
    },

    removeCardFromExtra(cardIndex) {
      this.extraDeck.splice(cardIndex, 1);
    },
    removeCardFromSide(cardIndex) {
      this.sideDeck.splice(cardIndex, 1);
    },
  },
});

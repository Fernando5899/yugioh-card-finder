<script setup>
import { storeToRefs } from 'pinia';
import { useCardStore } from '@/stores/cardStore';

// 1. Obtenemos acceso a nuestro almacén de cartas.
const cardStore = useCardStore();

// 2. Extraemos 'searchTerm' para poder enlazarlo con el input.
const { searchTerm } = storeToRefs(cardStore);
</script>

<template>
  <div class="search-container">
    <input
      v-model="searchTerm"
      type="text"
      placeholder="Buscar carta por nombre..."
      />
  </div>
</template>

<style scoped>
/* El atributo 'scoped' asegura que estos estilos solo se aplicaran a este componente */
.search-container {
  margin-bottom: 1.5rem;
}

input {
  width: 100%;
  padding: 0.75rem;
  font-size: 1.2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-sizing: border-box; /* Asegura que el padding no afecte el ancho total */
}
</style>

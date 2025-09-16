<script setup>
import { storeToRefs } from 'pinia';
import { useCardStore } from '@/stores/cardStore';

// Hola a todos esto nos ayudará para poder filtrar las cartas por tipo.

const cardStore = useCardStore();
// Conectamos el componente a las nuevas propiedades del almacén
const { cardTypes, selectedType } = storeToRefs(cardStore);
</script>

<template>
  <div class="w-full">
    <select
      v-model="selectedType"
      class="bg-gray-700 text-white border border-gray-600 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="" class="text-black">-- Todos los Tipos --</option>
      <option v-for="type in cardTypes" :key="type" :value="type" class="text-black">
        {{ type }}
      </option>
    </select>
  </div>
</template>

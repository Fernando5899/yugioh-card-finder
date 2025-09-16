import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    // useStorage guarda el valor en el localStorage del navegador.
    // El tema por defecto será 'light'.
    theme: useStorage('theme', 'light'),
  }),

  actions: {
    // Acción para cambiar entre 'light' y 'dark'
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      // Después de cambiar, aplicamos la clase al HTML
      this.applyTheme();
    },
    // Acción para aplicar la clase al elemento <html>
    applyTheme() {
      if (this.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  },
});

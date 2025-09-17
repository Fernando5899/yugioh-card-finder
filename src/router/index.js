import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import CardDetailView from '../views/CardDetailView.vue';
import DeckBuilderView from '@/views/DeckBuilderView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/card/:id',
    name: 'CardDetail',
    component: CardDetailView,
  },
  {
    path: '/deck-builder',
    name: 'DeckBuilder',
    component: DeckBuilderView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

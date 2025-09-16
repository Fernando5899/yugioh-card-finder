import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from '@/router' // 1. Importamos el router
import '@/assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router) // 2. Le decimos a la aplicación que use el router
app.mount('#app')

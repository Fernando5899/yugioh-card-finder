import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import '@/assets/main.css'; // <-- VERIFICA QUE ESTA LÍNEA EXISTA

const app = createApp(App)

app.use(createPinia())
app.mount('#app')

import { createApp } from 'vue'
import router from './router'
import App from './app.vue'
import './assets/index.css'

createApp(App)
  .use(router)
  .mount('#app')
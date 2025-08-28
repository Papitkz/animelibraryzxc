import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'
import vuetify from './plugins/vuetify'

// Create Pinia instance and use plugin
const pinia = createPinia()
pinia.use(piniaPluginPersistedState)

const app = createApp(App)

app.use(router)
app.use(pinia)       // Use the single Pinia instance
app.use(vuetify)

app.mount('#app')
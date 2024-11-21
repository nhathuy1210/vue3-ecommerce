import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// Import global components
import TheHeader from './components/shared/TheHeader.vue'
import TheFooter from './components/shared/TheFooter.vue'
import ThePagination from './components/shared/ThePagination.vue'

// Create Vue app
const app = createApp(App)


app.component('TheHeader', TheHeader)
app.component('TheFooter', TheFooter)
app.component('ThePagination', ThePagination)

// Global error handler
app.config.errorHandler = (err) => {
    console.error('Global error:', err)
    store.dispatch('setError', err.message)
}

// Global properties
app.config.globalProperties.$filters = {
    currency(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(value)
    },
    date(value) {
        return new Date(value).toLocaleDateString()
    }
}

// Use plugins
app.use(router)
app.use(store)

// Mount app
app.mount('#app')

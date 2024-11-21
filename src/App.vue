<template>
  <div id="app">
    <TheHeader />
    
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <TheFooter />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useStore } from 'vuex'
import '@fortawesome/fontawesome-free/css/all.css'
import TheHeader from '@/components/shared/TheHeader.vue'
import TheFooter from '@/components/shared/TheFooter.vue'

const store = useStore()

onMounted(() => {
  
  store.dispatch('product/fetchProducts')
  
  
  const token = localStorage.getItem('token')
  if (token) {
    store.dispatch('auth/refreshToken')
  }
})
</script>
<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: var(--spacing-lg) 0;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

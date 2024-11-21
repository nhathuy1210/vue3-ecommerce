<template>
    <div class="product-detail-view">
      <UserProductDetail v-if="product" :product="product" />
      <div v-else class="loading">Loading...</div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useStore } from 'vuex'
  import UserProductDetail from '@/components/user/UserProductDetail.vue'
  
  const route = useRoute()
  const store = useStore()
  
  const productId = parseInt(route.params.id)
  const product = computed(() => store.getters['product/getProductById'](productId))
  </script>
  <style scoped>
  .product-detail-view {
    margin-top: 100px;
    max-width: 1200px;
    padding: 2rem;
  }
  
  .product-detail-view h1 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    color: var(--text-color);
  }
  
  @media (max-width: 768px) {
    .product-detail-view {
      padding: 1rem;
    }
  }
  </style>
  
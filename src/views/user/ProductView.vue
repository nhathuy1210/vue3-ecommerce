<template>
    <div class="products-view">
      <h1>Our Products</h1>
      <UserProductList />
    </div>
  </template>
  
  <script setup>
  import UserProductList from '@/components/user/UserProductList.vue'
  </script>
  <style scoped>
  .products-view {
    margin-top: 100px;
    padding: var(--spacing-xl);
    max-width: 1200px;
 
  }
  
  h1 {
    font-size: 40px;
    color: var(--text-color);
    margin-bottom: var(--spacing-lg);
    text-align: center;
  }
  
  @media (max-width: 768px) {
    .products-view {
      padding: var(--spacing-md);
    }
  
    h1 {
      font-size: var(--heading);
    }
  }
  </style>
  
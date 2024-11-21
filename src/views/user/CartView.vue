<template>
    <div class="cart-view">
      <UserCart />
    </div>
  </template>
  
  <script setup>
  import UserCart from '@/components/user/UserCart.vue'
  </script>
  <style scoped>
  .cart-view {
    margin-top: 40px;
    max-width: 1200px;
    padding: 2rem;
  }
  
  h1 {
    font-size: 2rem;
    color: var(--text-color);
    margin-bottom: 2rem;
    text-align: center;
  }
  </style>
  
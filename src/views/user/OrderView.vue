<template>
    <div class="orders-view">
      <h1>My Orders</h1>
      <UserOrderHistory />
    </div>
  </template>
  
  <script setup>
  import UserOrderHistory from '@/components/user/UserOrderHistory.vue'
  </script>
  <style scoped>
  .orders-view {
    margin-top: 100px;
    max-width: 1200px;
    padding: 2rem;
  }
  
  h1 {
    font-size: 2rem;
    color: var(--text-color);
    margin-bottom: 2rem;
    text-align: center;
  }
  
  @media (max-width: 768px) {
    .orders-view {
      padding: 1rem;
    }
  
    h1 {
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
    }
  }
  </style>
  
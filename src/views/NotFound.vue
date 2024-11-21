<template>
    <div class="not-found">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      
      <div class="actions">
        <router-link to="/" class="home-button">
          Return to Home
        </router-link>
        
        <button @click="goBack" class="back-button">
          Go Back
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  const goBack = () => {
    router.go(-1)
  }
  </script>
  <style scoped>
  .not-found {
    margin-top: 100px;
    text-align: center;
    padding: 50px 20px;
    min-height: 60vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  h1 {
    font-size: 80px;
    color: var(--primary-color);
    margin-bottom: 20px;
  }
  
  h2 {
    font-size: 32px;
    color: var(--text-color);
    margin-bottom: 15px;
  }
  
  p {
    color: #666;
    margin-bottom: 30px;
  }
  
  .actions {
    display: flex;
    gap: 20px;
  }
  
  .home-button, .back-button {
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .home-button {
    background-color: var(--primary-color);
    color: white;
    text-decoration: none;
  }
  
  .back-button {
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    color: var(--text-color);
  }
  
  .home-button:hover {
    background-color: var(--secondary-color);
  }
  
  .back-button:hover {
    background-color: #eee;
  }
  </style>
  
  
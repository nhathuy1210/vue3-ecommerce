<template>
    <div class="order-confirmation">
      <div class="confirmation-card">
        <div class="success-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        
        <h2>Order Confirmed!</h2>
        <p class="thank-you">Thank you for your purchase</p>
        
        <div class="order-details">
          <p class="order-number">Order #{{ orderId }}</p>
          <p class="order-email">A confirmation email has been sent to your email address.</p>
        </div>
  
        <div class="next-steps">
          <router-link to="/orders" class="view-order-btn">View Order</router-link>
          <router-link to="/products" class="continue-shopping-btn">Continue Shopping</router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref} from 'vue'
  import { useRoute } from 'vue-router'
  
  const route = useRoute()
  const orderId = ref(route.query.orderId || 'PENDING')
  </script>
  
  <style scoped>
  .order-confirmation {
    min-height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  
  .confirmation-card {
    background: white;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
    text-align: center;
    max-width: 500px;
    width: 100%;
  }
  
  .success-icon {
    color: #4CAF50;
    font-size: 64px;
    margin-bottom: 20px;
  }
  
  h2 {
    color: #2c3e50;
    margin-bottom: 10px;
    font-size: 28px;
  }
  
  .thank-you {
    color: #666;
    font-size: 18px;
    margin-bottom: 30px;
  }
  
  .order-details {
    margin: 30px 0;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 4px;
  }
  
  .order-number {
    font-weight: bold;
    color: #2c3e50;
    font-size: 18px;
    margin-bottom: 10px;
  }
  
  .order-email {
    color: #666;
  }
  
  .next-steps {
    display: flex;
    gap: 15px;
    justify-content: center;
    margin-top: 30px;
  }
  
  .view-order-btn,
  .continue-shopping-btn {
    padding: 12px 24px;
    border-radius: 4px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
  }
  
  .view-order-btn {
    background: #3498db;
    color: white;
  }
  
  .continue-shopping-btn {
    background: #ecf0f1;
    color: #2c3e50;
  }
  
  .view-order-btn:hover {
    background: #2980b9;
  }
  
  .continue-shopping-btn:hover {
    background: #bdc3c7;
  }
  </style>
  
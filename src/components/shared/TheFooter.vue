<template>
    <footer>
      <div class="footer-content">
        <div class="footer-section">
          <h3>About Us</h3>
          <p>Your trusted online shopping destination for quality products.</p>
        </div>
  
        <div class="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/products">Products</router-link></li>
            <li><router-link to="/cart">Shopping Cart</router-link></li>
            <li><router-link to="/contact">Contact</router-link></li>
          </ul>
        </div>
  
        <div class="footer-section">
          <h3>Categories</h3>
          <ul>
            <li v-for="category in categories" :key="category">
              <router-link :to="`/category/${category}`">
                {{ category }}
              </router-link>
            </li>
          </ul>
        </div>
  
        <div class="footer-section">
          <h3>Contact Info</h3>
          <ul>
            <li>Email: support@techshop.com</li>
            <li>Phone: (+84) 123-456-7890</li>
            <li>Address: 123 Tech Street, Ho Chi Minh City, Vietnam</li>
          </ul>
        </div>
      </div>
  
      <div class="footer-bottom">
        <p>&copy; 2024 Your Shop Name. All rights reserved.</p>
      </div>
    </footer>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { useStore } from 'vuex'
  
  const store = useStore()
  const categories = computed(() => store.getters['product/getAllCategories'])
  </script>
<style>
footer {
  background-color: var(--dark-bg);
  color: var(--light-text);
  padding: var(--spacing-xl) 0;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-lg);
  padding: 0 var(--spacing-md);
}

.footer-section h3 {
  color: var(--primary-color);
  margin-bottom: var(--spacing-md);
  font-size: var(--text-lg);
}

.footer-section ul {
  list-style: none;
}

.footer-section ul li {
  margin-bottom: var(--spacing-sm);
}

.footer-section a {
  color: var(--light-text);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-section a:hover {
  color: var(--primary-color);
}

.footer-bottom {
  text-align: center;
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-md);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .footer-content {
    grid-template-columns: 1fr;
  }
}
</style>

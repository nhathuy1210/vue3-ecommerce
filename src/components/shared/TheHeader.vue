<template>
  <header>
    <nav>
      <div class="nav-left">
        <div class="logo-container">
          <img src="@/assets/shop-logo.png" alt="Shop Logo" class="shop-logo" />
          <router-link to="/" class="logo-text">Shop</router-link>
        </div>

        <div class="nav-links primary-links">
          <router-link to="/">Home</router-link>
          <router-link to="/products">Products</router-link>
          <router-link to="/about">About</router-link>
          <router-link to="/contact">Contact</router-link>
        </div>
      </div>

      <div class="search-container">
    <input 
      type="text" 
      placeholder="Search for products..." 
      v-model="searchQuery"
      @input="handleSearch"
    />
    <button class="search-button">
      <i class="fas fa-search"></i>
    </button>

    <div class="search-results" v-if="searchResults.length > 0">
      <div 
        v-for="product in searchResults" 
        :key="product.id" 
        class="search-result-item"
        @click="navigateToProduct(product.id)"
      >
        <img :src="product.image" :alt="product.name" class="product-thumbnail" />
        <span class="product-name">{{ product.name }}</span>
      </div>
    </div>
  </div>

      <div class="nav-links secondary-links">
        <!-- Guest Links -->
        <template v-if="!authState.isLoggedIn">
          <router-link to="/login">
            <i class="fas fa-sign-in-alt"></i> Login
          </router-link>
          <router-link to="/register">
            <i class="fas fa-user-plus"></i> Register
          </router-link>
        </template>

        <!-- User Links -->
        <template v-if="authState.isLoggedIn && !authState.isAdmin">
          <router-link to="/cart" class="cart-link">
            <i class="fas fa-shopping-cart"></i>
            <span class="cart-count">{{ cartCount }}</span>
          </router-link>
          <router-link to="/orders">
            <i class="fas fa-box"></i> Orders
          </router-link>
          <router-link to="/profile">
            <i class="fas fa-user"></i> {{ authState.currentUser?.fullName }}
          </router-link>
          <button @click="handleLogout">
            <i class="fas fa-sign-out-alt"></i> Logout
          </button>
        </template>

        <!-- Admin Links -->
        <template v-if="authState.isAdmin">
          <router-link to="/admin">
            <i class="fas fa-user-shield"></i> Admin Dashboard
          </router-link>
          <button @click="handleLogout">
            <i class="fas fa-sign-out-alt"></i> Logout
          </button>
        </template>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { computed, reactive, watch, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

// Auth state management
const authState = reactive({
  isLoggedIn: computed(() => store.getters['auth/isLoggedIn']),
  isAdmin: computed(() => store.getters['auth/isAdmin']),
  currentUser: computed(() => store.getters['auth/currentUser'])
})

// Search functionality
const searchQuery = ref('')
const searchResults = ref([])

const handleSearch = async () => {
  if (searchQuery.value.trim()) {
    try {
      const results = await store.dispatch('product/searchProducts', searchQuery.value)
      searchResults.value = Array.isArray(results) ? results : []
    } catch {
      searchResults.value = []
    }
  } else {
    searchResults.value = []
  }
}

// Debounce search
let searchTimeout
watch(searchQuery, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(handleSearch, 300)
})

const navigateToProduct = (productId) => {
  searchQuery.value = ''
  searchResults.value = []
  router.push(`/products/${productId}`)
}

// Cart management with reactive updates
const cartCount = computed(() => store.getters['cart/getTotalItems'])

// Initialize cart and set up watchers
onMounted(() => {
  if (authState.isLoggedIn) {
    store.dispatch('cart/fetchCart')
  }
})

// Watch for auth state changes
watch(() => authState.isLoggedIn, (newValue) => {
  if (newValue) {
    store.dispatch('cart/fetchCart')
  }
})

// Watch for cart changes
watch(() => store.state.cart.items, () => {
  store.commit('cart/UPDATE_CART_COUNT')
}, { deep: true })

// Logout handler
const handleLogout = async () => {
  await store.dispatch('auth/logout')
  router.push('/login')
}
</script>

<style scoped>

header {
  background: #ffffff;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
}

nav {
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.shop-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 800;
  text-decoration: none;
  color: #2980b9;
}

.search-container {
  flex: 0 1 400px;
  margin: 0 1rem;
  position: relative;
  display: flex;
  align-items: center;
}

.search-container input {
  width: 100%;
  padding: 0.8rem 1rem;
  padding-right: 40px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
}

.search-result-item {
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-result-item:hover {
  background-color: #f5f5f5;
}

.product-thumbnail {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 12px;
}

.product-name {
  font-size: 14px;
  color: #333;
}

.search-button {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);

  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  z-index: 2; 
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-shrink: 0;
  
}

.nav-links a {
  color: #1f2937;
  text-decoration: none;
  font-weight: bold;
  font-size: 0.95rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
}

.cart-link {
  position: relative;
  z-index: 1;
}

.cart-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ef4444;
  color: white;
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  min-width: 20px;
  text-align: center;
}

.nav-links button {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-links button:hover {
  background: #dc2626;
  transform: translateY(-2px);
}

.nav-links a:hover {
  color: #2980b9;
  background: #f3f4f6;
}

.router-link-active {
  color: #2980b9 !important;
  background: #eff6ff;
}

.logo-container .router-link-active {
  background: none !important;
  color: #2980b9 !important;
}

@media (max-width: 1024px) {
  .nav-links {
    gap: 1rem;
  }
  
  .nav-links a {
    padding: 0.4rem 0.8rem;
  }
  
  .search-container {
    max-width: 300px;
  }
}

@media (max-width: 768px) {
  nav {
    flex-direction: column;
    padding: 1rem;
  }
  
  .nav-left {
    width: 100%;
    justify-content: space-between;
  }
  
  .search-container {
    width: 100%;
    max-width: none;
    margin: 1rem 0;
  }
  
  .nav-links {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>
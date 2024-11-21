<template>
  <div class="product-list">
    <div class="filters">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Search products..."
      >
      <select v-model="selectedCategory">
        <option value="">All Categories</option>
        <option v-for="category in categories" :key="category">
          {{ category }}
        </option>
      </select>
      <select v-model="sortBy">
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="name">Name</option>
      </select>
    </div>

    <div class="products-grid">
      <div v-for="product in filteredProducts" :key="product.id" class="product-card">
        <div class="product-image">
          <img :src="product.image" :alt="product.name">
          <div class="product-overlay">
            <div class="icon-group">
              <i class="fas fa-search" @click="viewDetail(product.id)"></i>
              <i 
                class="fas" 
                :class="{
                  'fa-shopping-cart': !isLoading[product.id],
                  'fa-spinner fa-spin': isLoading[product.id]
                }"
                @click="addToCart(product)"
                :disabled="isLoading[product.id]"
              ></i>
            </div>
            <h3>{{ product.name }}</h3>
          </div>
        </div>
      </div>
    </div>

    <ThePagination
      :current-page="currentPage"
      :total-pages="totalPages"
      @page-change="handlePageChange"
    />

    <!-- Success Toast -->
    <div class="toast" :class="{ 'show': showToast }">
      <div class="toast-content">
        <i class="fas fa-check-circle"></i>
        <span>Added to cart successfully!</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import ThePagination from '../shared/ThePagination.vue'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

// Reactive refs
const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('price-asc')
const currentPage = ref(1)
const itemsPerPage = 12
const isLoading = ref({})
const showToast = ref(false)

// Computed properties
const products = computed(() => store.getters['product/getAllProducts'])
const categories = computed(() => store.getters['product/getAllCategories'])

const filteredProducts = computed(() => {
  let result = [...products.value]
  
  // Apply search filter
  if (searchQuery.value) {
    result = result.filter(p => 
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  // Apply category filter
  if (selectedCategory.value) {
    result = result.filter(p => p.category === selectedCategory.value)
  }
  
  // Apply sorting
  switch (sortBy.value) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      result.sort((a, b) => b.price - a.price)
      break
    case 'name':
      result.sort((a, b) => a.name.localeCompare(b.name))
      break
  }

  // Apply pagination
  const startIndex = (currentPage.value - 1) * itemsPerPage
  if (currentPage.value === 4) {
    return result.slice(-2)
  }
  return result.slice(startIndex, startIndex + itemsPerPage)
})

const totalPages = computed(() => 4)

// Methods
const addToCart = async (product) => {
  isLoading.value[product.id] = true

   // Check if user is logged in
   const currentUser = store.getters['auth/currentUser']
  
  if (!currentUser) {
    // Redirect to login page
    router.push('/login')
    return
  }
  
  try {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    }
    
    await store.dispatch('cart/addItem', cartItem)
    
    showToast.value = true
    setTimeout(() => {
      showToast.value = false
    }, 2000)
    
  } catch (error) {
    console.error("Failed to add item to cart:", error)
  } finally {
    setTimeout(() => {
      isLoading.value[product.id] = false
    }, 500)
    
  }
  setTimeout(() => {
    window.location.reload()
    }, 1000)
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const viewDetail = (productId) => {
  router.push(`/products/${productId}`)
}
</script>


<style scoped>
.product-list {
  padding: 20px;
}

.filters {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.filters input,
.filters select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 200px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 30px;
  margin: 30px;
  padding: 20px;
}

.product-card {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  height: 250px;
  width: 200px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.product-image {
  position: relative;
  width: 100%;
  height: 100%;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
  background: white;
}

.product-card:hover .product-image img {
  transform: scale(1.1);
}

.product-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  padding: 20px;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.product-card:hover .product-overlay {
  transform: translateY(0);
}

.icon-group {
  display: flex;
  gap: 20px;
}

.icon-group i {
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s ease;
  padding: 10px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
}

.icon-group i:hover {
  transform: scale(1.2);
  background: rgba(0, 0, 0, 0.8);
}

h3 {
  color: white;
  margin: 0;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 500;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
}

.fa-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #4CAF50;
  color: white;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(100px);
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 1000;
}

.toast.show {
  transform: translateY(0);
  opacity: 1;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toast-content i {
  font-size: 1.2rem;
}

[disabled] {
  opacity: 0.7;
  cursor: not-allowed;
}

.icon-group i:disabled {
  pointer-events: none;
}
</style>

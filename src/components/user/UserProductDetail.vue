<template>
  <div class="product-detail" v-if="product">
    <div class="product-images">
      <img :src="product.image" :alt="product.name">
    </div>
    
    <div class="product-info">
      <h1>{{ product.name }}</h1>
      <div class="product-meta">
        <div class="rating">
          <span>Rating: {{ product.rating }}/5</span>
          <span>({{ product.reviews?.length || 0 }} reviews)</span>
        </div>
        <span class="category">Category: {{ product.category }}</span>
      </div>

      <div class="product-price">
        <h2>{{ formatCurrency(product.price) }}</h2>
        <span class="stock" :class="{ 'low-stock': product.stock < 10 }">
          {{ product.stock }} items in stock
        </span>
      </div>

      <div class="product-description">
        <h3>Description</h3>
        <p>{{ product.description }}</p>
      </div>

      <div class="purchase-actions">
        <div class="quantity-selector">
          <button @click="decreaseQuantity">-</button>
          <input type="number" v-model="quantity" min="1" :max="product.stock">
          <button @click="increaseQuantity">+</button>
        </div>

        <button 
          class="add-to-cart"
          @click="handleAddToCart"
          :disabled="!product.stock"
        >
          Add to Cart
        </button>

        <button 
      class="buy-now"
      @click="handleBuyNow"
      :disabled="!product.stock"
    >
      Buy Now
    </button>
      </div>
    </div>

    <div class="product-reviews">
      <h3>Customer Reviews</h3>
      
      <div v-if="isLoggedIn" class="review-form">
        <h4>Write a Review</h4>
        <div class="rating-input">
          <span>Your Rating:</span>
          <select v-model="newReview.rating">
            <option v-for="n in 5" :key="n" :value="n">{{ n }} stars</option>
          </select>
        </div>
        <textarea 
          v-model="newReview.comment"
          placeholder="Write your review here..."
        ></textarea>
        <button @click="submitReview">Submit Review</button>
      </div>

      <div class="reviews-list">
        <div v-for="review in product.reviews" :key="review.userId" class="review">
          <div class="review-header">
            <span class="rating">{{ review.rating }} stars</span>
            <span class="date">{{ formatDate(review.date) }}</span>
          </div>
          <p class="comment">{{ review.comment }}</p>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="loading">
    Loading product details...
  </div>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue'
import { useStore } from 'vuex'
import { formatCurrency } from '@/utils/format'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useStore()
const quantity = ref(1)
const newReview = ref({
  rating: 5,
  comment: ''
})

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const isLoggedIn = computed(() => store.getters['auth/isLoggedIn'])

const increaseQuantity = () => {
  if (quantity.value < props.product.stock) {
    quantity.value++
  }
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const handleAddToCart = async () => {
  if (!isLoggedIn.value) {
    router.push('/login')
    return
  }

  try {
    await store.dispatch('cart/addItem', {
      id: props.product.id,
      name: props.product.name,
      price: props.product.price,
      image: props.product.image,
      quantity: quantity.value
    })
    
    quantity.value = 1
    setTimeout(() => {
      window.location.reload()
    }, 700)
  } catch (error) {
    console.error('Failed to add item to cart:', error)
  }
}

const handleBuyNow = () => {
  const buyItem = {
    id: props.product.id,
    name: props.product.name,
    price: props.product.price,
    image: props.product.image,
    quantity: quantity.value
  }
  
  store.dispatch('cart/setDirectBuy', {
    item: buyItem,
    quantity: quantity.value
  })
  
  router.push({
    name: 'Checkout',
    query: { directBuy: 'true' }
  })
}




const submitReview = async () => {
  if (!isLoggedIn.value) {
    router.push('/login')
    return
  }

  if (!newReview.value.comment) return

  try {
    await store.dispatch('product/addReview', {
      productId: props.product.id,
      review: {
        ...newReview.value,
        date: new Date().toISOString()
      }
    })
    
    newReview.value = {
      rating: 5,
      comment: ''
    }
  } catch (error) {
    console.error('Failed to submit review:', error)
  }
}
</script>



<style scoped>
.product-detail {
max-width: 1200px;
margin: 0 auto;
padding: 2rem;
display: grid;
grid-template-columns: 1fr 1fr;
gap: 3rem;
}

.product-images {
border-radius: 12px;
overflow: hidden;
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.product-images img {
width: 100%;
height: auto;
object-fit: cover;
transition: transform 0.3s ease;
}

.product-images img:hover {
transform: scale(1.05);
}

.product-info {
display: flex;
flex-direction: column;
gap: 1.5rem;
}

.product-info h1 {
font-size: 2.5rem;
color: #2c3e50;
margin-bottom: 0.5rem;
}

.product-meta {
display: flex;
justify-content: space-between;
color: #666;
font-size: 0.9rem;
}

.rating {
display: flex;
gap: 1rem;
align-items: center;
}

.product-price {
margin: 1.5rem 0;
padding: 1rem;
background: #f8f9fa;
border-radius: 8px;
}

.product-price h2 {
font-size: 2rem;
color: #2c3e50;
margin-bottom: 0.5rem;
}

.stock {
color: #28a745;
font-size: 0.9rem;
}

.low-stock {
color: #dc3545;
}

.product-description {
line-height: 1.6;
color: #4a5568;
}

.purchase-actions {
display: flex;
gap: 1rem;
margin-top: 2rem;
}

.buy-now {
  padding: 0 2rem;
  height: 36px;
  background: #27ae60; 
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.buy-now:hover {
  background: #219a52;
}

.buy-now:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.quantity-selector {
display: flex;
align-items: center;
gap: 0.5rem;
}

.quantity-selector button {
width: 36px;
height: 36px;
border: none;
background: #e9ecef;
border-radius: 4px;
cursor: pointer;
transition: background 0.2s;
}

.quantity-selector button:hover {
background: #dee2e6;
}

.quantity-selector input {
width: 60px;
height: 36px;
text-align: center;
border: 1px solid #dee2e6;
border-radius: 4px;
}

.add-to-cart {
padding: 0 2rem;
height: 36px;
background: #3498db;
color: white;
border: none;
border-radius: 4px;
cursor: pointer;
transition: background 0.2s;
}

.add-to-cart:hover {
background: #2980b9;
}

.add-to-cart:disabled {
background: #ccc;
cursor: not-allowed;
}

.product-reviews {
grid-column: span 2;
margin-top: 3rem;
}

.review-form {
background: #f8f9fa;
padding: 1.5rem;
border-radius: 8px;
margin-bottom: 2rem;
}

.rating-input {
margin: 1rem 0;
}

.rating-input select {
padding: 0.5rem;
border-radius: 4px;
border: 1px solid #dee2e6;
}

textarea {
width: 100%;
height: 100px;
padding: 0.5rem;
border: 1px solid #dee2e6;
border-radius: 4px;
margin: 1rem 0;
resize: vertical;
}

.reviews-list {
display: flex;
flex-direction: column;
gap: 1.5rem;
}

.review {
padding: 1rem;
border: 1px solid #dee2e6;
border-radius: 8px;
}

.review-header {
display: flex;
justify-content: space-between;
color: #666;
margin-bottom: 0.5rem;
}

.comment {
line-height: 1.6;
color: #4a5568;
}

.loading {
text-align: center;
padding: 2rem;
font-size: 1.2rem;
color: #666;
}

@media (max-width: 768px) {
.product-detail {
  grid-template-columns: 1fr;
  padding: 1rem;
}

.product-reviews {
  grid-column: span 1;
}
}
</style>

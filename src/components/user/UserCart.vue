<template>
  <div class="cart">
    <h2>Shopping Cart</h2>

    
    <div v-if="cartItems.length === 0" class="empty-cart">
      Your cart is empty
    </div>
    
    <div v-else class="cart-items">
      <div v-for="item in cartItems" :key="item.id" class="cart-item">
        <img :src="item.image" :alt="item.name">
        <div class="item-details">
          <h3>{{ item.name }}</h3>
          <p>Price: ${{ item.price }}</p>
          <div class="quantity-controls">
            <button @click="decreaseQuantity(item)" :disabled="item.quantity <= 1">-</button>
            <span>{{ item.quantity }}</span>
            <button @click="increaseQuantity(item)">+</button>
          </div>
          <button @click="removeItem(item)" class="remove-btn">Remove</button>
        </div>
        <div class="item-total">
          ${{ (item.price * item.quantity).toFixed(2) }}
        </div>
      </div>
      
      <div class="cart-summary">
        <div class="subtotal">
          <span>Subtotal:</span>
          <span>${{ subtotal.toFixed(2) }}</span>
        </div>
        <div class="shipping">
          <span>Shipping:</span>
          <span>${{ shippingCost.toFixed(2) }}</span>
        </div>
        <div class="tax">
          <span>Tax (10%):</span>
          <span>${{ tax.toFixed(2) }}</span>
        </div>
        <div class="total">
          <span>Total:</span>
          <span>${{ total.toFixed(2) }}</span>
        </div>
        
        <button 
          class="checkout-button"
          @click="proceedToCheckout"
          :disabled="cartItems.length === 0"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const cartItems = computed(() => store.getters['cart/items'])
const isLoading = computed(() => store.getters['cart/isLoading'])
const subtotal = computed(() => 
  cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
)
const shippingCost = computed(() => subtotal.value > 100 ? 0 : 10)
const tax = computed(() => subtotal.value * 0.1)
const total = computed(() => subtotal.value + shippingCost.value + tax.value)

const increaseQuantity = async (item) => {
    if (isLoading.value) return
    const newQuantity = Number(item.quantity) + 1
    await store.dispatch('cart/updateQuantity', {
        itemId: item.id,
        quantity: newQuantity
    })
    setTimeout(() => {
    window.location.reload()
    }, 500)
}

const decreaseQuantity = async (item) => {
    if (isLoading.value || item.quantity <= 1) return
    const newQuantity = Number(item.quantity) - 1
    await store.dispatch('cart/updateQuantity', {
        itemId: item.id,
        quantity: newQuantity
    })
    setTimeout(() => {
    window.location.reload()
    }, 500)
}

const removeItem = async (item) => {
    if (isLoading.value) return
    await store.dispatch('cart/removeItem', item.id)
    
}

const proceedToCheckout = () => {
    router.push('/checkout')
    
}
</script>
<style scoped>
.cart {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  background: #f8f9fa;
  min-height: 100vh;
}

h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 40px;
  font-size: 2.5rem;
  font-weight: 600;
}

.empty-cart {
  text-align: center;
  padding: 60px;
  font-size: 1.4rem;
  color: #666;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.cart-item {
  display: grid;
  grid-template-columns: 200px 1fr auto;
  gap: 30px;
  padding: 25px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transition: transform 0.2s ease;
}

.cart-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0,0,0,0.1);
}

.cart-item img {
  width: 200px;
  height: 200px;
  object-fit: contain;
  border-radius: 8px;
  background: #f8f9fa;
  padding: 10px;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 10px 0;
}

.item-details h3 {
  font-size: 1.4rem;
  color: #2c3e50;
  margin: 0;
}

.item-details p {
  font-size: 1.2rem;
  color: #666;
  margin: 0;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 10px 0;
}

.quantity-controls button {
  width: 35px;
  height: 35px;
  border: 2px solid #3498db;
  background: white;
  color: #3498db;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.2s ease;
}

.quantity-controls button:hover:not(:disabled) {
  background: #3498db;
  color: white;
}

.quantity-controls button:disabled {
  border-color: #ccc;
  color: #ccc;
  cursor: not-allowed;
}

.quantity-controls span {
  font-size: 1.2rem;
  min-width: 30px;
  text-align: center;
}

.remove-btn {
  padding: 8px 20px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
  font-size: 1rem;
}

.remove-btn:hover {
  background: #c0392b;
}

.item-total {
  font-weight: bold;
  font-size: 1.4rem;
  color: #2c3e50;
  display: flex;
  align-items: center;
}

.cart-summary {
  margin-top: 40px;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.subtotal,
.shipping,
.tax,
.total {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 1.1rem;
  color: #2c3e50;
}

.total {
  font-weight: bold;
  font-size: 1.4rem;
  border-top: 2px solid #eee;
  padding-top: 15px;
  margin-top: 15px;
}

.checkout-button {
  width: 100%;
  padding: 18px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 25px;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 400;
}

.checkout-button:hover:not(:disabled) {
  background: #2980b9;
  transform: translateY(-2px);
}

.checkout-button:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}
</style>

<template>
    <div class="checkout">
      <h2>Checkout</h2>
      
      <div class="checkout-form">
        <div class="shipping-info">
          <h3>Shipping Information</h3>
          <form @submit.prevent="submitOrder">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" v-model="shippingInfo.fullName" required>
            </div>
            
            <div class="form-group">
              <label>Address</label>
              <input type="text" v-model="shippingInfo.address" required>
            </div>
            
            <div class="form-group">
              <label>City</label>
              <input type="text" v-model="shippingInfo.city" required>
            </div>
            
            <div class="form-group">
              <label>Phone</label>
              <input type="tel" v-model="shippingInfo.phone" required>
            </div>
            
            <div class="payment-method">
              <h3>Payment Method</h3>
              <select v-model="paymentMethod" required>
                <option value="cod">Cash on Delivery</option>
                <option value="card">Credit Card</option>
              </select>
            </div>
            
            <div class="order-summary">
              <h3>Order Summary</h3>
              <div v-for="item in cartItems" :key="item.id" class="summary-item">
                <span>{{ item.name }} x {{ item.quantity }}</span>
                <span>${{ (item.price * item.quantity).toFixed(2) }}</span>
              </div>
              
              <div class="summary-total">
                <div>Subtotal: ${{ subtotal.toFixed(2) }}</div>
                <div>Shipping: ${{ shippingCost.toFixed(2) }}</div>
                <div>Tax: ${{ tax.toFixed(2) }}</div>
                <div class="total">Total: ${{ total.toFixed(2) }}</div>
              </div>
            </div>
            
            <button 
              type="submit" 
              class="place-order-button"
              :disabled="isProcessing"
            >
              {{ isProcessing ? 'Processing...' : 'Place Order' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useStore } from 'vuex'
  import { useRouter } from 'vue-router'
  
  const store = useStore()
  const router = useRouter()
  
  const isProcessing = ref(false)
  const paymentMethod = ref('cod')
  const shippingInfo = ref({
    fullName: '',
    address: '',
    city: '',
    phone: ''
  })
  
  const cartItems = computed(() => store.getters['cart/items'])
  const subtotal = computed(() => 
    cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  )
  const shippingCost = computed(() => subtotal.value > 100 ? 0 : 10)
  const tax = computed(() => subtotal.value * 0.1)
  const total = computed(() => subtotal.value + shippingCost.value + tax.value)
  
  const submitOrder = async () => {
    isProcessing.value = true
    
    try {
      await store.dispatch('order/createOrder', {
        items: cartItems.value,
        shippingInfo: shippingInfo.value,
        paymentMethod: paymentMethod.value,
        total: total.value
      })
      
      await store.dispatch('cart/clearCart')
      router.push('/order-confirmation')
    } catch (error) {
      console.error('Order submission failed:', error)
    } finally {
      isProcessing.value = false
    }
  }
  </script>
 <style scoped>
 .checkout {
   max-width: 800px;
   margin: 0 auto;
   padding: 20px;
 }
 
 .checkout h2 {
   text-align: center;
   margin-bottom: 30px;
 }
 
 .checkout-form {
   background: #fff;
   padding: 30px;
   border-radius: 8px;
   box-shadow: 0 2px 10px rgba(0,0,0,0.1);
 }
 
 .form-group {
   margin-bottom: 20px;
 }
 
 .form-group label {
   display: block;
   margin-bottom: 5px;
   font-weight: 500;
 }
 
 .form-group input,
 .form-group select {
   width: 100%;
   padding: 10px;
   border: 1px solid #ddd;
   border-radius: 4px;
 }
 
 .payment-method {
   margin: 30px 0;
 }
 
 .payment-method select {
   width: 100%;
   padding: 10px;
   border: 1px solid #ddd;
   border-radius: 4px;
 }
 
 .order-summary {
   margin-top: 30px;
   padding: 20px;
   background: #f8f9fa;
   border-radius: 4px;
 }
 
 .summary-item {
   display: flex;
   justify-content: space-between;
   margin-bottom: 10px;
 }
 
 .summary-total {
   margin-top: 20px;
   padding-top: 20px;
   border-top: 1px solid #ddd;
 }
 
 .summary-total div {
   display: flex;
   justify-content: space-between;
   margin-bottom: 10px;
 }
 
 .total {
   font-weight: bold;
   font-size: 1.2em;
   color: #2c3e50;
 }
 
 .place-order-button {
   width: 100%;
   padding: 15px;
   background: #3498db;
   color: white;
   border: none;
   border-radius: 4px;
   font-size: 16px;
   cursor: pointer;
   margin-top: 20px;
 }
 
 .place-order-button:disabled {
   background: #95a5a6;
   cursor: not-allowed;
 }
 
 .place-order-button:hover:not(:disabled) {
   background: #2980b9;
 }
 </style>
 
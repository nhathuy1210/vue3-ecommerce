<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const currentUser = computed(() => store.getters['auth/currentUser'])
const userOrders = computed(() => store.getters['order/getUserOrders'](currentUser.value.id))
const isLoading = computed(() => store.getters['order/isLoading'])
const error = computed(() => store.getters['order/getError'])

const formatDate = (date) => {
    return new Date(date).toLocaleDateString()
}

const cancelOrder = async (orderId) => {
    if (confirm('Are you sure you want to cancel this order?')) {
        try {
            await store.dispatch('order/cancelOrder', orderId)
        } catch (error) {
            alert('Could not cancel order. Please try again.')
        }
    }
}

onMounted(async () => {
    await store.dispatch('order/fetchOrders')
})
</script>

<template>
    <div class="order-history">
        <h2>Order History</h2>

        <!-- Loading State -->
        <div v-if="isLoading" class="loading-state">
            Loading orders...
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
            {{ error }}
        </div>

        <!-- Empty State -->
        <div v-else-if="userOrders.length === 0" class="empty-state">
            You haven't placed any orders yet.
        </div>

        <!-- Orders List -->
        <div v-else class="orders-list">
            <div v-for="order in userOrders" 
                 :key="order.id" 
                 class="order-card"
                 :class="{ 'disabled': isLoading }">
                
                <div class="order-header">
                    <span>Order #{{ order.id }}</span>
                    <span>{{ formatDate(order.createdAt) }}</span>
                    <span :class="['status', order.status]">{{ order.status }}</span>
                </div>

                <div class="order-items">
                    <div v-for="item in order.items" 
                         :key="item.id" 
                         class="order-item">
                        <img :src="item.image" :alt="item.name">
                        <div class="item-details">
                            <h4>{{ item.name }}</h4>
                            <p>Quantity: {{ item.quantity }}</p>
                            <p>Price: ${{ item.price }}</p>
                        </div>
                    </div>
                </div>

                <div class="order-footer">
                    <div class="order-total">
                        Total: ${{ order.total }}
                    </div>
                    <button 
                        v-if="order.status === 'pending'"
                        @click="cancelOrder(order.id)"
                        :disabled="isLoading"
                        class="cancel-button">
                        Cancel Order
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.order-history {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.loading-state,
.error-state,
.empty-state {
    text-align: center;
    padding: 40px;
    background: #fff;
    border-radius: 8px;
    margin: 20px 0;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.error-state {
    color: #dc3545;
    background: #f8d7da;
}

.empty-state {
    color: #666;
}

.disabled {
    opacity: 0.7;
    pointer-events: none;
}

.cancel-button:disabled {
    background: #6c757d;
    cursor: not-allowed;
    transform: none;
}


.order-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.status {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
}

.status.pending { background: #fff3cd; color: #856404; }
.status.processing { background: #cce5ff; color: #004085; }
.status.delivered { background: #d4edda; color: #155724; }
.status.cancelled { background: #f8d7da; color: #721c24; }

.order-items {
  padding: 20px 0;
}

.order-item {
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 20px;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.order-item img {
  width: 150px;
  height: 150px;
  object-fit: contain;
  border-radius: 8px;
  background: #f8f9fa;
  padding: 10px;
}

.item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.item-details h4 {
  margin: 0 0 10px 0;
  font-size: 1.2rem;
  color: #2c3e50;
}

.item-details p {
  margin: 5px 0;
  color: #666;
  font-size: 1rem;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
}

.order-total {
  font-weight: bold;
  font-size: 1.25rem;
  color: #2c3e50;
}

.cancel-button {
  padding: 10px 20px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.cancel-button:hover {
  background: #c82333;
  transform: translateY(-2px);
}

.cancel-button:active {
  transform: translateY(0);
}
</style>


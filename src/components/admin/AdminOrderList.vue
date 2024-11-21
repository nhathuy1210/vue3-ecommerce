<script setup>
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'

const searchQuery = ref('')
const store = useStore()
const orders = ref([])
const changedOrders = ref([])
const showViewModal = ref(false)
const selectedOrder = ref(null)

const orderStatuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
]

onMounted(async () => {
    await store.dispatch('order/fetchOrders')
    orders.value = store.getters['order/getAllOrders']
})

const filteredOrders = computed(() => {
    if (!searchQuery.value) return orders.value
    return orders.value.filter(order => 
        order.shippingInfo?.fullName?.toLowerCase()
        .includes(searchQuery.value.toLowerCase())
    )
})

const markAsChanged = (order) => {
    if (!changedOrders.value.includes(order.id)) {
        changedOrders.value.push(order.id)
    }
}

const saveStatus = async (order) => {
    if (changedOrders.value.includes(order.id)) {
        try {
            await axios.put(`http://localhost:3000/api/orders/${order.id}`, order)
            const index = changedOrders.value.indexOf(order.id)
            changedOrders.value.splice(index, 1)
        } catch (error) {
            console.error('Failed to update order status:', error)
        }
    }
}

const cancelOrder = async (order) => {
    if (confirm('Are you sure you want to cancel this order?')) {
        try {
            order.status = 'cancelled'
            await saveStatus(order)
            orders.value = store.getters['order/getAllOrders']
        } catch (error) {
            console.error('Failed to cancel order:', error)
        }
    }
}

const viewOrder = (order) => {
    selectedOrder.value = order
    showViewModal.value = true
}

const closeViewModal = () => {
    showViewModal.value = false
    selectedOrder.value = null
}
</script>

<template>
    <div class="admin-orders">
        <h2 class="page-title">Order Management</h2>
        
        <div class="search-container">
            <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Search by customer name..."
                class="search-input"
            >
        </div>
        <div class="orders-list">
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="order in filteredOrders" :key="order.id">
                        <td>#{{ order.id }}</td>
                        <td>{{ order.shippingInfo?.fullName || 'N/A' }}</td>
                        <td>
                            <div v-for="item in order.items" :key="item.id">
                                {{ item.name }} (x{{ item.quantity }})
                            </div>
                        </td>
                        <td>${{ order.total?.toFixed(2) }}</td>
                        <td>
                            <select 
                                v-model="order.status" 
                                :class="'status-' + order.status"
                                @change="markAsChanged(order)"
                            >
                                <option 
                                    v-for="status in orderStatuses" 
                                    :key="status.value"
                                    :value="status.value"
                                >
                                    {{ status.label }}
                                </option>
                            </select>
                        </td>
                        <td>{{ new Date(order.createdAt).toLocaleDateString() }}</td>
                        <td class="action-buttons">
    <button @click="viewOrder(order)" class="view-button">
        <i class="fas fa-eye"></i> View
    </button>
    <button 
        @click="saveStatus(order)"
        :class="['save-button', { active: changedOrders.includes(order.id) }]"
    >
        <i class="fas fa-save"></i> Save
    </button>
    <button 
        v-if="order.status === 'pending'"
        @click="cancelOrder(order)"
        class="cancel-button"
    >
        <i class="fas fa-ban"></i> Cancel
    </button>
</td>

                    </tr>
                </tbody>
            </table>
        </div>

        <!-- View Order Modal -->
        <div v-if="showViewModal" class="modal">
            <div class="modal-content">
                <h3>Order Details</h3>
                <div class="order-details">
                    <div class="detail-group">
                        <label>Customer Name:</label>
                        <span>{{ selectedOrder?.shippingInfo?.fullName }}</span>
                    </div>
                    <div class="detail-group">
                        <label>Address:</label>
                        <span>{{ selectedOrder?.shippingInfo?.address }}</span>
                    </div>
                    <div class="detail-group">
                        <label>City:</label>
                        <span>{{ selectedOrder?.shippingInfo?.city }}</span>
                    </div>
                    <div class="detail-group">
                        <label>Phone:</label>
                        <span>{{ selectedOrder?.shippingInfo?.phone }}</span>
                    </div>
                    <div class="detail-group">
                        <label>Payment Method:</label>
                        <span>{{ selectedOrder?.paymentMethod }}</span>
                    </div>
                    <div class="detail-group">
                        <label>Total:</label>
                        <span>${{ selectedOrder?.total?.toFixed(2) }}</span>
                    </div>
                    <div class="detail-group">
                        <label>Status:</label>
                        <span :class="'status-' + selectedOrder?.status">
                            {{ selectedOrder?.status }}
                        </span>
                    </div>
                    <div class="detail-group">
                        <label>Order Date:</label>
                        <span>{{ new Date(selectedOrder?.createdAt).toLocaleString() }}</span>
                    </div>
                </div>
                <div class="modal-actions">
                    <button @click="closeViewModal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.admin-orders {
    height: 100%;
    overflow: auto;
    padding: 0;
    background: #f8f9fa;
}

.page-title {
    color: #2c3e50;
    font-size: 24px;
    margin-bottom: 25px;
    padding-bottom: 15px;
    border-bottom: 2px solid #3498db;
}

.search-container {
    margin-bottom: 25px;
}

.search-input {
    width: 300px;
    padding: 12px 20px;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: white;
}

.search-input:focus {
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
    outline: none;
}

.orders-list {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    margin-bottom: 30px;
}

table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
}

th {
    background: #f8f9fa;
    padding: 16px;
    font-weight: 600;
    color: #2c3e50;
    border-bottom: 2px solid #e9ecef;
    white-space: nowrap;
}

td {
    padding: 16px;
    border-bottom: 1px solid #e9ecef;
    color: #444;
    vertical-align: middle;
}

tr:hover {
    background: #f8f9fa;
}

select {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    background: white;
    cursor: pointer;
    width: 130px;
    font-size: 0.9rem;
}

/* Status styles */
.status-pending {
    background-color: #fff3cd;
    color: #856404;
    border-color: #ffeeba;
}

.status-processing {
    background-color: #cce5ff;
    color: #004085;
    border-color: #b8daff;
}

.status-shipped {
    background-color: #d4edda;
    color: #155724;
    border-color: #c3e6cb;
}

.status-delivered {
    background-color: #d1e7dd;
    color: #0f5132;
    border-color: #badbcc;
}

.status-cancelled {
    background-color: #f8d7da;
    color: #721c24;
    border-color: #f5c6cb;
}

.action-buttons {
    display: flex;
    gap: 10px;
    justify-content: flex-start;
    align-items: center;
}

button {
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
    font-size: 0.9rem;
    min-width: 90px;
    border: none;
    color: white;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
}

.view-button {
    background: #3498db;
}

.view-button:hover {
    background: #2980b9;
}

.save-button {
    background: #2ecc71;
}

.save-button.active {
    background: #27ae60;
}

.cancel-button {
    background: #e74c3c;
}

.cancel-button:hover {
    background: #c0392b;
}

/* Modal styles */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    width: 500px;
    max-width: 90%;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-content h3 {
    color: #2c3e50;
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    text-align: center;
    border-bottom: 2px solid #3498db;
    padding-bottom: 1rem;
}

.order-details {
    margin: 1.5rem 0;
}

.detail-group {
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
    padding: 0.8rem;
    border-bottom: 1px solid #eee;
}

.detail-group label {
    font-weight: 600;
    color: #2c3e50;
}

.detail-group span {
    color: #444;
}

.modal-actions {
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e9ecef;
    display: flex;
    justify-content: center;
}

.modal-actions button {
    padding: 10px 24px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 1rem;
    min-width: 120px;
}

@media (max-width: 768px) {
    .search-input {
        width: 100%;
    }
    
    .action-buttons {
        flex-direction: column;
    }
    
    button {
        width: 100%;
    }
}
</style>
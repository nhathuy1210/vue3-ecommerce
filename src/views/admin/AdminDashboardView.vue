<template>
  <div class="admin-dashboard">
    <h1>Admin Dashboard</h1>

    <div v-if="isLoading" class="loading-overlay">
      <div class="loader"></div>
    </div>

    <div v-else class="dashboard-stats">
      <div class="stat-card" v-for="(value, key) in stats" :key="key">
        <h3>{{ formatLabel(key) }}</h3>
        <p>{{ formatValue(key, value) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const isLoading = ref(false)
const stats = ref({
  totalOrders: 0,
  totalUsers: 0,
  totalProducts: 0,
  totalRevenue: 0
})

// Load cached data first
const cachedStats = JSON.parse(localStorage.getItem('dashboardStats'))
if (cachedStats) {
  stats.value = cachedStats
}

// Format 
const formatLabel = (key) => {
  return key.replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
}

const formatValue = (key, value) => {
  if (key === 'totalRevenue') {
    return `$${value.toFixed(2)}`
  }
  return value
}


watch(
  () => store.state.admin.dashboardStats,
  (newStats) => {
    stats.value = newStats
  }
)


onMounted(async () => {
  try {
    isLoading.value = true
    const dashboardStats = await store.dispatch('admin/getDashboardStats')
    stats.value = dashboardStats
  } catch (error) {
    console.error('Failed to load dashboard stats:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.admin-dashboard {
  padding: 20px;
  position: relative;
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.stat-card {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.stat-card h3 {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 10px;
}

.stat-card p {
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: bold;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}

.loader {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

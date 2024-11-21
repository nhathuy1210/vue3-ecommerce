<template>
  <div class="admin-users">
    <div class="page-header">
      <h1>User Management</h1>
      <button class="save-button" @click="saveChanges" :disabled="!hasChanges">
        <i class="fas fa-save"></i> Save Changes
      </button>
    </div>

    <div class="search-filters">
      <input 
        type="text" 
        v-model="searchQuery"
        placeholder="Search users..."
      >
      <select v-model="roleFilter">
        <option value="">All Roles</option>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <select v-model="statusFilter">
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="blocked">Blocked</option>
      </select>
    </div>

    <table class="users-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Status</th>
          <th>Joined Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in filteredUsers" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.fullName }}</td>
          <td>{{ user.email }}</td>
          <td>
            <select 
              v-model="user.role"
              @change="updateUserRole(user.id, user.role)"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </td>
          <td>
            <select 
              v-model="user.status"
              @change="updateUserStatus(user.id, user.status)"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>
          </td>
          <td>{{ formatDate(user.joinedDate) }}</td>
          <td class="action-buttons">
            <button class="view-btn" @click="viewUserDetails(user)">
              <i class="fas fa-eye"></i> View
            </button>
            <button class="delete-btn" @click="deleteUser(user.id)">
              <i class="fas fa-trash"></i> Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- User Details Modal -->
    <div v-if="selectedUser" class="modal">
      <div class="modal-content">
        <h3>User Details</h3>
        
        <div class="user-info">
          <p><strong>Name:</strong> {{ selectedUser.fullName }}</p>
          <p><strong>Email:</strong> {{ selectedUser.email }}</p>
          <p><strong>Phone:</strong> {{ selectedUser.phone }}</p>
          <p><strong>Address:</strong> {{ selectedUser.address }}</p>
          <p><strong>Role:</strong> {{ selectedUser.role }}</p>
          <p><strong>Status:</strong> {{ selectedUser.status }}</p>
          <p><strong>Joined Date:</strong> {{ formatDate(selectedUser.joinedDate) }}</p>
        </div>

        <div class="user-stats">
          <h4>User Statistics</h4>
          <p>Total Orders: {{ selectedUser.totalOrders }}</p>
          <p>Total Spent: ${{ selectedUser?.totalSpent?.toFixed(2) || '0.00' }}</p>
          <p>Last Order: {{ selectedUser.lastOrderDate ? formatDate(selectedUser.lastOrderDate) : 'N/A' }}</p>
        </div>

        <button class="close-btn" @click="selectedUser = null">
          <i class="fas fa-times"></i> Close
        </button>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const searchQuery = ref('')
const roleFilter = ref('')
const statusFilter = ref('')
const selectedUser = ref(null)
const loading = ref(false)
const originalUsers = ref([])
const pendingChanges = ref([])

onMounted(async () => {
  loading.value = true
  try {
    await store.dispatch('user/fetchUsers')
    originalUsers.value = JSON.parse(JSON.stringify(store.getters['user/getAllUsers']))
  } finally {
    loading.value = false
  }
})

const users = computed(() => store.getters['user/getAllUsers'])

const hasChanges = computed(() => {
  return pendingChanges.value.length > 0
})

const filteredUsers = computed(() => {
  let filtered = [...users.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user => 
      (user?.fullName?.toLowerCase() || '').includes(query) ||
      (user?.email?.toLowerCase() || '').includes(query)
    )
  }

  if (roleFilter.value) {
    filtered = filtered.filter(user => user?.role === roleFilter.value)
  }

  if (statusFilter.value) {
    filtered = filtered.filter(user => user?.status === statusFilter.value)
  }

  return filtered
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

const updateUserRole = (userId, newRole) => {
  const changeIndex = pendingChanges.value.findIndex(change => change.userId === userId)
  if (changeIndex !== -1) {
    pendingChanges.value[changeIndex].role = newRole
  } else {
    pendingChanges.value.push({
      userId,
      role: newRole,
      type: 'role'
    })
  }
}

const updateUserStatus = (userId, newStatus) => {
  const changeIndex = pendingChanges.value.findIndex(change => change.userId === userId)
  if (changeIndex !== -1) {
    pendingChanges.value[changeIndex].status = newStatus
  } else {
    pendingChanges.value.push({
      userId,
      status: newStatus,
      type: 'status'
    })
  }
}

const saveChanges = async () => {
  if (!pendingChanges.value.length) return

  loading.value = true
  try {
    for (const change of pendingChanges.value) {
      if (change.role) {
        await store.dispatch('user/updateUserRole', {
          userId: change.userId,
          role: change.role
        })
      }
      if (change.status) {
        await store.dispatch('user/updateUserStatus', {
          userId: change.userId,
          status: change.status
        })
      }
    }
    
    // Clear pending changes after successful save
    pendingChanges.value = []
    
    // Refresh users list
    await store.dispatch('user/fetchUsers')
    originalUsers.value = JSON.parse(JSON.stringify(users.value))
    
    alert('Changes saved successfully!')
  } catch (error) {
    alert('Error saving changes. Please try again.')
    console.error('Save error:', error)
  } finally {
    loading.value = false
  }
}

const deleteUser = async (userId) => {
  if (confirm('Are you sure you want to delete this user?')) {
    loading.value = true
    try {
      await store.dispatch('user/deleteUser', userId)
      alert('User deleted successfully')
      // Remove any pending changes for deleted user
      pendingChanges.value = pendingChanges.value.filter(change => change.userId !== userId)
    } catch (error) {
      alert('Could not delete user. Please try again.')
      console.error('Delete error:', error)
    } finally {
      loading.value = false
    }
  }
}

const viewUserDetails = (user) => {
  selectedUser.value = user
}
</script>


<style scoped>
.admin-users {
  padding: 24px;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  position: relative;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 24px;
  color: #2c3e50;
  margin: 0;
}

.save-button {
  background: #2ecc71;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.save-button:hover {
  background: #27ae60;
  transform: translateY(-1px);
}

.save-button:disabled {
  background: #95a5a6;
  cursor: not-allowed;
  transform: none;
}

.search-filters {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.search-filters input,
.search-filters select {
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  flex: 1;
  min-width: 200px;
  font-size: 14px;
}

.users-table {
  width: 100%;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.users-table th {
  background: #f8f9fa;
  padding: 16px;
  font-weight: 600;
  color: #2c3e50;
  text-align: left;
  border-bottom: 2px solid #e0e0e0;
}

.users-table td {
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.users-table tr:hover {
  background: #f8f9fa;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.view-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.delete-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 24px;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.spinner {
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

@media (max-width: 768px) {
  .search-filters {
    flex-direction: column;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .users-table {
    font-size: 14px;
  }
}
</style>

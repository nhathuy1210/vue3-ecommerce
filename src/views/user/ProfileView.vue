<template>
  <div class="profile-view">
    <h1>My Profile</h1>
    
    <div v-if="updateStatus" class="alert success">
      {{ updateStatus }}
    </div>

    <div class="profile-content">
      <div class="user-info">
        <h2>Personal Information</h2>
        <form @submit.prevent="updateProfile">
          <div class="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              v-model="userInfo.fullName" 
              required
              class="form-control"
              placeholder="Enter your full name"
            >
          </div>

          <div class="form-group">
            <label>Email</label>
            <input 
              type="email" 
              v-model="userInfo.email" 
              disabled
              class="form-control"
            >
          </div>

          <div class="form-group">
            <label>Phone</label>
            <input 
              type="tel" 
              v-model="userInfo.phone"
              class="form-control"
              placeholder="Enter your phone number"
            >
          </div>

          <div class="form-group">
            <label>Address</label>
            <textarea 
              v-model="userInfo.address"
              class="form-control"
              rows="3"
              placeholder="Enter your address"
            ></textarea>
          </div>

          <button type="submit" class="btn-submit">Update Profile</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const userInfo = ref({
  fullName: '',
  email: '',
  phone: '',
  address: ''
})

const updateStatus = computed(() => store.getters['user/getUpdateStatus'])

const updateProfile = async () => {
  try {
    const currentUser = store.getters['auth/currentUser']
    
    const updateData = {
      id: currentUser.id,
      fullName: userInfo.value.fullName,
      email: userInfo.value.email,
      phone: userInfo.value.phone,
      address: userInfo.value.address
    }

    const updatedUser = await store.dispatch('user/updateUser', updateData)
    
    // Update local storage with new user data
    const userData = JSON.parse(localStorage.getItem('user'))
    userData.fullName = updatedUser.fullName
    userData.email = updatedUser.email
    userData.phone = updatedUser.phone
    userData.address = updatedUser.address
    localStorage.setItem('user', JSON.stringify(userData))
    
    // Update form data
    userInfo.value = {
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address
    }
    
    store.commit('user/SET_UPDATE_STATUS', 'Profile updated successfully!')
    setTimeout(() => store.commit('user/SET_UPDATE_STATUS', null), 3000)
  } catch (error) {
    console.error('Update failed:', error)
    store.commit('user/SET_UPDATE_STATUS', 'Update failed')
  }
}

// Load data from localStorage on mount
onMounted(() => {
  const userData = JSON.parse(localStorage.getItem('user'))
  userInfo.value = {
    fullName: userData.fullName || '',
    email: userData.email || '',
    phone: userData.phone || '',
    address: userData.address || ''
  }
})

</script>

<style scoped>
.profile-view {
  
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  margin-top: 120px;
  color: #333;
  margin-bottom: 30px;
}

.alert {
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 4px;
}

.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.profile-content {
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-control {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.form-control:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

textarea.form-control {
  resize: vertical;
  min-height: 100px;
}

.btn-submit {
  background-color: #007bff;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.btn-submit:hover {
  background-color: #0056b3;
}
</style>

<template>
  <form @submit.prevent="handleSubmit" class="register-form">
    <div class="form-group">
      <label for="fullName">Full Name</label>
      <input 
        type="text" 
        id="fullName"
        v-model="formData.fullName"
        required
      >
    </div>

    <div class="form-group">
      <label for="email">Email</label>
      <input 
        type="email" 
        id="email"
        v-model="formData.email"
        required
      >
    </div>

    <div class="form-group">
      <label for="password">Password</label>
      <input 
        type="password" 
        id="password"
        v-model="formData.password"
        required
      >
    </div>

    <div class="form-group">
      <label for="confirmPassword">Confirm Password</label>
      <input 
        type="password" 
        id="confirmPassword"
        v-model="formData.confirmPassword"
        required
      >
    </div>

    <button type="submit">Register</button>
  </form>
</template>

<script setup>

import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'


const store = useStore()
const router = useRouter()


const formData = ref({
  fullName: '', // Họ tên
  email: '', // Email
  password: '', // Mật khẩu
  confirmPassword: '' // Xác nhận mật khẩu
})

// 4. Xử lý đăng ký
const handleSubmit = async () => {
  // Kiểm tra mật khẩu và xác nhận mật khẩu có khớp
  if (formData.value.password !== formData.value.confirmPassword) {
    alert('Mật khẩu không khớp')
    return
  }

  try {
    // Gọi action register với thông tin đăng ký
    await store.dispatch('auth/register', formData.value)
    // Chuyển hướng đến trang đăng nhập
    router.push('/login')
  } catch (error) {
    console.error('Đăng ký thất bại:', error)
  }
}
</script>
<style scoped>
.register-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52,152,219,0.2);
}

button {
  width: 100%;
  padding: 12px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease;
}

button:hover {
  background: #2980b9;
}
</style>

<template>
  <form @submit.prevent="handleSubmit" class="login-form">
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

    <button type="submit">Login</button>
  </form>
</template>

<script setup>

import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import users from '@/data/users.json'


const store = useStore()
const router = useRouter()


const formData = ref({
  email: '',
  password: ''
})

//  Xử lý đăng nhập
const handleSubmit = async () => {
  // Tìm user trong data có email và password khớp
  const user = users.users.find(u => 
    u.email === formData.value.email && 
    u.password === formData.value.password
  )

  // Nếu tìm thấy user hợp lệ
  if (user) {
    // Dispatch action login với thông tin user
    await store.dispatch('auth/login', user)
    // Chuyển hướng về trang chủ
    router.push('/')
  } else {
    // Log lỗi nếu thông tin không hợp lệ
    console.error('Thông tin đăng nhập không hợp lệ')
  }
}

</script>
<style scoped>
.login-form {
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
  font-size: 16px;
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
  cursor: pointer;
  transition: background 0.3s ease;
}

button:hover {
  background: #2980b9;
}
</style>

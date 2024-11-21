<template>
  <div class="register-container">
    <h1>Register</h1>
    <RegisterForm />
    <div class="auth-links">
      <p>Already have an account? <router-link to="/login">Login</router-link></p>
    </div>
  </div>
</template>

<script setup>
import RegisterForm from '@/components/auth/RegisterForm.vue'
</script>
<style scoped>
.register-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}

.auth-links {
  text-align: center;
  margin-top: 20px;
}

.auth-links a {
  color: #3498db;
  text-decoration: none;
}

.auth-links a:hover {
  text-decoration: underline;
}
</style>

<template>
  <div class="login-container">
    <h1>Login</h1>
    <LoginForm />
    <div class="auth-links">
      <p>Don't have an account? <router-link to="/register">Register</router-link></p>
    </div>
  </div>
</template>

<script setup>
import LoginForm from '@/components/auth/LoginForm.vue'
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

h1 {
  text-align: center;
  color: #333;
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


<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const isActive = computed(() => (routeName) => route.name === routeName)
</script>

<template>
    <div class="admin-layout">
        <aside class="admin-sidebar">
            <div class="sidebar-header">
                <h2>Admin Panel</h2>
            </div>
            <nav class="sidebar-nav">
                <router-link :to="{name: 'AdminDashboard'}" :class="['nav-item', { active: isActive('AdminDashboard') }]">
                    <i class="fas fa-tachometer-alt"></i>
                    Dashboard
                </router-link>
                <router-link :to="{name: 'AdminProducts'}" :class="['nav-item', { active: isActive('AdminProducts') }]">
                    <i class="fas fa-box"></i>
                    Products
                </router-link>
                <router-link :to="{name: 'AdminOrders'}" :class="['nav-item', { active: isActive('AdminOrders') }]">
                    <i class="fas fa-shopping-cart"></i>
                    Orders
                </router-link>
                <router-link :to="{name: 'AdminUsers'}" :class="['nav-item', { active: isActive('AdminUsers') }]">
                    <i class="fas fa-users"></i>
                    Users
                </router-link>
            </nav>
        </aside>
        <main class="admin-content">
            <router-view></router-view>
        </main>
    </div>
</template>

<style scoped>

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.admin-layout {
    display: flex;
    min-height: calc(100vh - 70px); 
    position: fixed;
    top: 90px;
    left: 0;
    right: 0;
    bottom: 0;
    background: #f5f6fa;
}

.admin-sidebar {
    width: 250px;
    background: #2c3e50;
    color: white;
    box-shadow: 2px 0 5px rgba(0,0,0,0.1);
    height: 100%;
    overflow-y: auto;
    flex-shrink: 0;
}

.sidebar-header {
    padding: 20px;
    border-bottom: 1px solid #34495e;
}

.sidebar-header h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #ecf0f1;
}

.sidebar-nav {
    padding: 20px 0;
}

.nav-item {
    display: flex;
    align-items: center;
    padding: 15px 20px;
    color: #ecf0f1;
    text-decoration: none;
    transition: all 0.3s ease;
}

.nav-item i {
    margin-right: 10px;
    width: 20px;
    text-align: center;
}

.nav-item:hover {
    background: #34495e;
    padding-left: 25px;
}

.nav-item.active,
.router-link-exact-active {
    background: #3498db;
}

.admin-content {
    flex: 1;
    padding: 30px;
    background: #f5f6fa;
    overflow-y: auto;
    height: 100%;
    width: calc(100% - 250px);
}

@media (max-width: 768px) {
    .admin-sidebar {
        width: 200px;
    }
    
    .admin-content {
        width: calc(100% - 200px);
    }
    
    .nav-item {
        padding: 12px 15px;
    }
}
</style>

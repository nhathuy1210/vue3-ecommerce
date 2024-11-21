import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/user/HomeView.vue')
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('../views/user/AboutView.vue')
    },
    {
        path: '/contact',
        name: 'Contact',
        component: () => import('../views/user/ContactView.vue')
    },
    {
        path: '/products',
        name: 'Products',
        component: () => import('../views/user/ProductView.vue')
    },
    {
        path: '/products/:id',
        name: 'ProductDetail',
        component: () => import('../views/user/ProductDetailView.vue'),
        props: true
    },

    // Auth routes
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/auth/LoginView.vue'),
        meta: { requiresGuest: true }
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/auth/RegisterView.vue'),
        meta: { requiresGuest: true }
    },
    // Protected user routes
    {
        path: '/profile',
        name: 'Profile',
        component: () => import('../views/user/ProfileView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/cart',
        name: 'Cart',
        component: () => import('../views/user/CartView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/checkout',
        name: 'Checkout',
        component: () => import('../views/user/CheckoutView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/order-confirmation',
        name: 'OrderConfirmation',
        component: () => import('../views/user/OrderConfirmationView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/orders',
        name: 'Orders',
        component: () => import('../views/user/OrderView.vue'),
        meta: { requiresAuth: true }
    },

    // Admin routes
    {
        path: '/admin',
        component: () => import('../views/admin/AdminLayout.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
        children: [
            {
                path: '',  // Default route
                redirect: { name: 'AdminDashboard' }
            },
            {
                path: 'dashboard',
                name: 'AdminDashboard',
                component: () => import('../views/admin/AdminDashboardView.vue')
            },
            {
                path: 'products',
                name: 'AdminProducts',
                component: () => import('../views/admin/AdminProductView.vue')
            },
            {
                path: 'orders',
                name: 'AdminOrders',
                component: () => import('../views/admin/AdminOrderView.vue')
            },
            {
                path: 'users',
                name: 'AdminUsers',
                component: () => import('../views/admin/AdminUserView.vue')
            }
        ]
    }
    ,

    // Error route
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('../views/NotFound.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const isLoggedIn = store.getters['auth/isLoggedIn']
    const isAdmin = store.getters['auth/isAdmin']

    if (to.meta.requiresAuth && !isLoggedIn) {
        next({ name: 'Login', query: { redirect: to.fullPath } })
        return
    }

    if (to.meta.requiresAdmin && !isAdmin) {
        next({ name: 'Home' })
        return
    }

    if (to.meta.requiresGuest && isLoggedIn) {
        next({ name: 'Home' })
        return
    }

    next()
})

export default router

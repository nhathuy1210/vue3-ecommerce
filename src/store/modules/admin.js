export default {
    namespaced: true,

    state: {
        dashboardStats: {
            totalOrders: 0,
            totalUsers: 0,
            totalProducts: 0,
            totalRevenue: 0
        },
        isLoading: false
    },

    getters: {
        getDashboardStats: state => state.dashboardStats,
        getLoadingStatus: state => state.isLoading
    },

    mutations: {
        SET_DASHBOARD_STATS(state, stats) {
            state.dashboardStats = stats
        },
        SET_LOADING(state, status) {
            state.isLoading = status
        }
    },

    actions: {
        async getDashboardStats({ commit, rootState }) {
            try {
                commit('SET_LOADING', true)

                // Sử dụng Promise.all để tải dữ liệu song song nếu cần
                const [orders, users, products] = await Promise.all([
                    rootState.order.orders,
                    rootState.user.users,
                    rootState.product.products
                ])

                const stats = {
                    totalOrders: orders.length,
                    totalUsers: users.length,
                    totalProducts: products.length,
                    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0)
                }

                // Lưu vào localStorage để cache
                localStorage.setItem('dashboardStats', JSON.stringify(stats))

                commit('SET_DASHBOARD_STATS', stats)
                return stats

            } catch (error) {
                console.error('Error fetching dashboard stats:', error)
                // Lấy dữ liệu từ cache nếu có lỗi
                const cachedStats = localStorage.getItem('dashboardStats')
                if (cachedStats) {
                    commit('SET_DASHBOARD_STATS', JSON.parse(cachedStats))
                }
                throw error
            } finally {
                commit('SET_LOADING', false)
            }
        },

        // Action để load dữ liệu từ cache khi khởi động
        initializeDashboard({ commit }) {
            const cachedStats = localStorage.getItem('dashboardStats')
            if (cachedStats) {
                commit('SET_DASHBOARD_STATS', JSON.parse(cachedStats))
            }
        }
    }
}

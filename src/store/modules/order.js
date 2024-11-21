import axios from 'axios'

export const API_URL = 'http://localhost:3000/api'

export default {
    namespaced: true,

    state: {
        orders: JSON.parse(localStorage.getItem('orders')) || [],
        loading: false,
        error: null
    },

    getters: {
        getAllOrders: state => state.orders,
        getUserOrders: state => userId => state.orders.filter(o => o.userId === userId),
        getOrderById: state => id => state.orders.find(o => o.id === id),
        getOrdersByStatus: state => status => state.orders.filter(o => o.status === status),
        getTotalOrders: state => state.orders.length,
        getTotalRevenue: state => state.orders.reduce((sum, order) => sum + (order.total || 0), 0),
        isLoading: state => state.loading,
        getError: state => state.error
    },

    mutations: {
        SET_LOADING(state, status) {
            state.loading = status
            state.error = null
        },
        SET_ERROR(state, error) {
            state.error = error
            state.loading = false
        },
        SET_ORDERS(state, orders) {
            state.orders = orders || []
            localStorage.setItem('orders', JSON.stringify(state.orders))
        },
        ADD_ORDER(state, order) {
            state.orders.unshift(order)
            localStorage.setItem('orders', JSON.stringify(state.orders))
        },
        UPDATE_ORDER_STATUS(state, { orderId, status }) {
            const orderIndex = state.orders.findIndex(o => o.id === orderId)
            if (orderIndex !== -1) {
                state.orders[orderIndex] = {
                    ...state.orders[orderIndex],
                    status,
                    updatedAt: new Date().toISOString()
                }
                localStorage.setItem('orders', JSON.stringify(state.orders))
            }
        }
    },

    actions: {
        async fetchOrders({ commit, rootState }) {
            commit('SET_LOADING', true)
            try {
                const isAdmin = rootState.auth.currentUser?.role === 'admin'
                const userId = rootState.auth.currentUser?.id
                const url = `${API_URL}/orders${!isAdmin ? `?userId=${userId}` : ''}`

                const response = await axios.get(url)
                commit('SET_ORDERS', response.data)
                return response.data
            } catch (error) {
                commit('SET_ERROR', error.response?.data?.message || error.message)
                throw error
            }
        },

        async createOrder({ commit, dispatch, rootState }, orderData) {
            commit('SET_LOADING', true)
            try {
                const userId = rootState.auth.currentUser?.id
                const cartItems = rootState.cart.items

                const newOrder = {
                    userId,
                    items: cartItems,
                    shippingInfo: orderData.shippingInfo,
                    paymentMethod: orderData.paymentMethod,
                    total: orderData.total,
                    status: 'pending',
                    createdAt: new Date().toISOString()
                }

                const [orderResponse] = await Promise.all([
                    axios.post(`${API_URL}/orders`, newOrder),
                    ...cartItems.map(item =>
                        axios.put(`${API_URL}/products/${item.id}/stock`, {
                            quantity: item.quantity
                        })
                    )
                ])

                commit('ADD_ORDER', orderResponse.data)
                await dispatch('cart/clearCart', null, { root: true })

                return orderResponse.data
            } catch (error) {
                commit('SET_ERROR', error.response?.data?.message || error.message)
                throw error
            }
        },

        async cancelOrder({ commit }, orderId) {
            commit('SET_LOADING', true)
            try {

                const response = await axios.patch(`${API_URL}/orders/${orderId}`, {
                    status: 'cancelled',
                    updatedAt: new Date().toISOString()
                })

                if (response.data) {
                    commit('UPDATE_ORDER_STATUS', {
                        orderId,
                        status: 'cancelled'
                    })
                }
            } catch (error) {
                commit('SET_ERROR', error.response?.data?.message || error.message)
                throw error
            } finally {
                commit('SET_LOADING', false)
            }
            setTimeout(() => {
                window.location.reload()
            }, 500)
        },

        async updateOrderStatus({ commit }, { orderId, status }) {
            commit('SET_LOADING', true)
            try {
                await axios.patch(`${API_URL}/orders/${orderId}`, { status })
                commit('UPDATE_ORDER_STATUS', { orderId, status })
            } catch (error) {
                commit('SET_ERROR', error.response?.data?.message || error.message)
                throw error
            }
        }
    }
}

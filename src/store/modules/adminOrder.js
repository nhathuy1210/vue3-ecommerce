import axios from 'axios'
export const API_URL = 'http://localhost:3000/api'

export default {
    namespaced: true,

    state: {
        orders: [],
        loading: false,
        error: null,
        currentOrder: null
    },

    getters: {
        getAllOrders: state => state.orders,
        getOrderById: state => id => state.orders.find(order => order.id === id),
        getOrdersByStatus: state => status => state.orders.filter(order => order.status === status),
        getTotalOrders: state => state.orders.length,
        getTotalRevenue: state => state.orders.reduce((sum, order) => sum + Number(order.total), 0),
        getLoading: state => state.loading,
        getError: state => state.error,
        getCurrentOrder: state => state.currentOrder
    },

    mutations: {
        SET_ORDERS(state, orders) {
            state.orders = orders
        },
        SET_LOADING(state, status) {
            state.loading = status
        },
        SET_ERROR(state, error) {
            state.error = error
        },
        SET_CURRENT_ORDER(state, order) {
            state.currentOrder = order
        },
        UPDATE_ORDER_STATUS(state, { orderId, status }) {
            const order = state.orders.find(o => o.id === orderId)
            if (order) {
                order.status = status
            }
        },
        DELETE_ORDER(state, orderId) {
            state.orders = state.orders.filter(order => order.id !== orderId)
        }
    },

    actions: {
        async fetchAllOrders({ commit }) {
            commit('SET_LOADING', true)
            try {
                const response = await axios.get(`${API_URL}/orders`)
                commit('SET_ORDERS', response.data)
                commit('SET_ERROR', null)
            } catch (error) {
                commit('SET_ERROR', error.message)
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async fetchOrderById({ commit }, orderId) {
            commit('SET_LOADING', true)
            try {
                const response = await axios.get(`${API_URL}/orders/${orderId}`)
                commit('SET_CURRENT_ORDER', response.data)
                commit('SET_ERROR', null)
            } catch (error) {
                commit('SET_ERROR', error.message)
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async updateOrderStatus({ commit }, { orderId, status }) {
            commit('SET_LOADING', true)
            try {
                await axios.put(`${API_URL}/orders/${orderId}`, { status })
                commit('UPDATE_ORDER_STATUS', { orderId, status })
                commit('SET_ERROR', null)
            } catch (error) {
                commit('SET_ERROR', error.message)
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async deleteOrder({ commit }, orderId) {
            commit('SET_LOADING', true)
            try {
                await axios.delete(`${API_URL}/orders/${orderId}`)
                commit('DELETE_ORDER', orderId)
                commit('SET_ERROR', null)
            } catch (error) {
                commit('SET_ERROR', error.message)
            } finally {
                commit('SET_LOADING', false)
            }
            window.location.reload()
        },

        async searchOrders({ commit }, searchTerm) {
            commit('SET_LOADING', true)
            try {
                const response = await axios.get(`${API_URL}/orders?search=${searchTerm}`)
                commit('SET_ORDERS', response.data)
                commit('SET_ERROR', null)
            } catch (error) {
                commit('SET_ERROR', error.message)
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async filterOrdersByDate({ commit }, { startDate, endDate }) {
            commit('SET_LOADING', true)
            try {
                const response = await axios.get(
                    `${API_URL}/orders?startDate=${startDate}&endDate=${endDate}`
                )
                commit('SET_ORDERS', response.data)
                commit('SET_ERROR', null)
            } catch (error) {
                commit('SET_ERROR', error.message)
            } finally {
                commit('SET_LOADING', false)
            }
        }
    }
}

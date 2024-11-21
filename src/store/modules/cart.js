import axios from 'axios'

export const API_URL = 'http://localhost:3000/api'

export default {
    namespaced: true,

    state: {
        items: JSON.parse(localStorage.getItem('cart')) || [],
        cartCount: JSON.parse(localStorage.getItem('cart'))?.reduce((sum, item) => sum + Number(item.quantity), 0) || 0,
        loading: false,
        directBuyItem: null,

    },

    getters: {
        items: (state) => state.items,
        itemCount: state => state.cartCount,
        total: (state) => state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        getTotalItems: (state) => state.cartCount,
        isLoading: state => state.loading,
        getDirectBuyItem: state => ({
            ...state.directBuyItem,
            quantity: state.directBuyQuantity
        })
    },

    mutations: {
        SET_LOADING(state, status) {
            state.loading = status
        },

        SET_ITEMS(state, items) {
            const mappedItems = items.map(item => ({
                ...item,
                quantity: Number(item.quantity)
            }))
            state.items = mappedItems
            state.cartCount = mappedItems.reduce((sum, item) => sum + Number(item.quantity), 0)
            localStorage.setItem('cart', JSON.stringify(mappedItems))
        },

        ADD_ITEM(state, item) {
            const existingItem = state.items.find(i => i.id === item.id)
            if (existingItem) {
                existingItem.quantity += Number(item.quantity)
            } else {
                state.items.push({
                    ...item,
                    quantity: Number(item.quantity)
                })
            }
            state.cartCount = state.items.reduce((sum, item) => sum + Number(item.quantity), 0)
            localStorage.setItem('cart', JSON.stringify(state.items))
        },

        SET_DIRECT_BUY(state, { item, quantity }) {
            state.directBuyItem = item
            state.directBuyQuantity = Number(quantity)
        },
        SET_DIRECT_BUY_ITEM(state, item) {
            state.directBuyItem = item
            
            localStorage.setItem('directBuyItem', JSON.stringify(item))
        },

        CLEAR_DIRECT_BUY(state) {
            state.directBuyItem = null
            state.directBuyQuantity = 1
        },

        REMOVE_ITEM(state, itemId) {
            state.items = state.items.filter(item => item.id !== itemId)
            state.cartCount = state.items.reduce((sum, item) => sum + Number(item.quantity), 0)
            localStorage.setItem('cart', JSON.stringify(state.items))
        },

        UPDATE_QUANTITY(state, { itemId, quantity }) {
            const item = state.items.find(i => i.id === itemId)
            if (item) {
                item.quantity = Number(quantity)
                state.cartCount = state.items.reduce((sum, item) => sum + Number(item.quantity), 0)
                localStorage.setItem('cart', JSON.stringify(state.items))
            }
        },

        CLEAR_CART(state) {
            state.items = []
            state.cartCount = 0
            localStorage.removeItem('cart')
        }
    },

    actions: {
        async fetchCart({ commit, rootState }) {
            try {
                commit('SET_LOADING', true)
                const userId = rootState.auth.currentUser?.id
                if (userId) {
                    const response = await axios.get(`${API_URL}/cart/${userId}`)
                    commit('SET_ITEMS', response.data.items || [])
                }
            } finally {
                commit('SET_LOADING', false)
            }
        },

        setDirectBuy({ commit }, { item, quantity }) {
            const directBuyItem = {
                ...item,
                quantity: Number(quantity)
            }
            commit('SET_DIRECT_BUY_ITEM', directBuyItem)
        }
        ,

        clearDirectBuy({ commit }) {
            commit('CLEAR_DIRECT_BUY')
        },

        async addItem({ commit, rootState }, item) {
            try {
                commit('SET_LOADING', true)
                const userId = rootState.auth.currentUser?.id

                if (userId) {
                    const cartItem = {
                        ...item,
                        userId: userId,
                        quantity: Number(item.quantity)
                    }

                    const response = await axios.post(`${API_URL}/cart`, cartItem)
                    commit('ADD_ITEM', cartItem)

                    if (response.data && response.data.items) {
                        commit('SET_ITEMS', response.data.items)
                    }

                    return response.data
                }
            } catch (error) {
                console.error('Error adding item to cart:', error)
                throw error
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async removeItem({ commit, rootState }, itemId) {
            try {
                commit('SET_LOADING', true)
                const userId = rootState.auth.currentUser?.id
                if (userId) {
                    await axios.delete(`${API_URL}/cart/${userId}/${itemId}`)
                    commit('REMOVE_ITEM', itemId)
                }
            } finally {
                commit('SET_LOADING', false)
            }
            setTimeout(() => {
                window.location.reload()
            }, 1000)
        },

        async updateQuantity({ commit, rootState }, { itemId, quantity }) {
            try {
                commit('SET_LOADING', true)
                const userId = rootState.auth.currentUser?.id
                if (userId) {
                    await axios.put(`${API_URL}/cart/${userId}/${itemId}`, { quantity })
                    commit('UPDATE_QUANTITY', { itemId, quantity })
                }
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async clearCart({ commit, rootState }) {
            try {
                commit('SET_LOADING', true)
                const userId = rootState.auth.currentUser?.id
                if (userId) {
                    await axios.delete(`${API_URL}/cart/${userId}`)
                    commit('CLEAR_CART')
                }
            } finally {
                commit('SET_LOADING', false)
            }
            setTimeout(() => {
                window.location.reload()
            }, 700)
        }
    }
}

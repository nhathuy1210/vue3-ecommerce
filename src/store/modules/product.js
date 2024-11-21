import axios from 'axios'

export const API_URL = 'http://localhost:3000/api'

export default {
    namespaced: true,

    state: {
        products: JSON.parse(localStorage.getItem('products')) || [],
        categories: ['Smartphones', 'Laptops', 'Tablets', 'Accessories'],
        loading: false,
        error: null,
        currentCategory: localStorage.getItem('currentCategory') || null,
        searchResults: []
    },

    getters: {
        getAllProducts: state => state.products,
        getAllCategories: state => state.categories,
        getProductById: state => id => state.products.find(p => Number(p.id) === Number(id)),
        getProductsByCategory: state => category => {
            return state.products.filter(product => product.category === category)
        },
        getLoading: state => state.loading,
        getError: state => state.error
    },

    mutations: {
        SET_PRODUCTS(state, products) {
            state.products = products
            localStorage.setItem('products', JSON.stringify(products))
        },
        SET_LOADING(state, status) {
            state.loading = status
        },
        SET_ERROR(state, error) {
            state.error = error
        },
        SET_CURRENT_CATEGORY(state, category) {
            state.currentCategory = category
            localStorage.setItem('currentCategory', category)
        },
        SET_SEARCH_RESULTS(state, results) {
            state.searchResults = results
        },
        UPDATE_STOCK(state, { productId, quantity }) {
            const product = state.products.find(p => p.id === productId)
            if (product) {
                product.stock -= quantity
                localStorage.setItem('products', JSON.stringify(state.products))
            }
        },
        ADD_PRODUCT(state, product) {
            state.products.push(product)
            localStorage.setItem('products', JSON.stringify(state.products))
        },
        DELETE_PRODUCT(state, productId) {
            state.products = state.products.filter(p => p.id !== productId)
            localStorage.setItem('products', JSON.stringify(state.products))
        },
        UPDATE_PRODUCT(state, updatedProduct) {
            const index = state.products.findIndex(p => p.id === updatedProduct.id)
            if (index !== -1) {
                state.products[index] = updatedProduct
                localStorage.setItem('products', JSON.stringify(state.products))
            }
        }
    },

    actions: {
        setError({ commit }, error) {
            commit('SET_ERROR', error)
        },

        setCurrentCategory({ commit }, category) {
            commit('SET_CURRENT_CATEGORY', category)
        },

        async fetchProducts({ commit }) {
            commit('SET_LOADING', true)
            try {
                const response = await axios.get(`${API_URL}/products`)
                const products = response.data
                commit('SET_PRODUCTS', products)
                console.log('Products loaded:', products.length)
                return products
            } catch (error) {
                console.log('API Response:', error.response)
                throw new Error('Unable to load products')
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async searchProducts({ commit }, query) {
            commit('SET_LOADING', true)
            try {
                const response = await axios.get(`${API_URL}/products/search?q=${encodeURIComponent(query)}`)
                const results = response.data
                commit('SET_SEARCH_RESULTS', results)
                return results
            } catch (error) {
                commit('SET_ERROR', error.message)
                return []
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async addProduct({ commit, dispatch }, product) {
            commit('SET_LOADING', true)
            try {
                const formattedProduct = {
                    name: product.name,
                    category: product.category,
                    price: Number(product.price),
                    stock: Number(product.stock),
                    description: product.description,
                    image: product.image || 'https://placehold.co/400x400'
                }

                const response = await axios.post(`${API_URL}/products`, formattedProduct)
                const newProduct = response.data
                commit('ADD_PRODUCT', newProduct)
                await dispatch('fetchProducts')
                return newProduct
            } catch (error) {
                console.log('Debug - Add Product:', {
                    endpoint: `${API_URL}/products`,
                    data: product,
                    error: error.response?.data || error.message
                })
                throw new Error('Failed to add product')
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async decreaseStock({ commit }, { productId, quantity }) {
            try {
                await axios.put(`${API_URL}/products/${productId}/stock`, {
                    quantity: quantity
                })
                commit('UPDATE_STOCK', { productId, quantity })
            } catch (error) {
                throw new Error('Unable to update stock quantity')
            }
        },

        async deleteProduct({ commit }, productId) {
            commit('SET_LOADING', true)
            try {
                const response = await axios.delete(`${API_URL}/products/${Number(productId)}`)
                if (response.data.success) {
                    commit('DELETE_PRODUCT', productId)
                    return { success: true, message: response.data.message }
                }
                throw new Error(response.data.message || 'Delete operation failed')
            } catch (error) {
                const errorMessage = error.response?.data?.message || error.message
                commit('SET_ERROR', errorMessage)
                throw new Error(errorMessage)
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async updateProduct({ commit, dispatch }, product) {
            commit('SET_LOADING', true)
            try {
                const formattedProduct = {
                    ...product,
                    id: Number(product.id),
                    price: Number(product.price),
                    stock: Number(product.stock)
                }
                const response = await axios.put(`${API_URL}/products/${formattedProduct.id}`, formattedProduct)
                commit('UPDATE_PRODUCT', response.data.data)
                await dispatch('fetchProducts')
                return response.data
            } catch (error) {
                const errorMessage = error.response?.data?.message || error.message
                commit('SET_ERROR', errorMessage)
                throw new Error(errorMessage)
            } finally {
                commit('SET_LOADING', false)
            }
        }
    }
}

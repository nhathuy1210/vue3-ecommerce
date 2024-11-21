import users from '@/data/users.json'
import router from '@/router'
import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

export default {
    namespaced: true,

    state: {
        currentUser: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
        isLoading: false,
        error: null,
        users: users.users
    },

    getters: {
        isLoggedIn: (state) => !!state.token,
        currentUser: (state) => state.currentUser,
        isAdmin: (state) => state.currentUser?.role === 'admin',
        isLoading: (state) => state.isLoading,
        error: (state) => state.error,
        getAllUsers: (state) => state.users
    },

    mutations: {
        SET_USER(state, user) {
            state.currentUser = user
        },
        SET_TOKEN(state, token) {
            state.token = token
        },
        SET_LOADING(state, status) {
            state.isLoading = status
        },
        SET_ERROR(state, error) {
            state.error = error
        },
        CLEAR_AUTH(state) {
            state.currentUser = null
            state.token = null
            state.error = null
        },
        ADD_NEW_USER(state, user) {
            state.users.push(user)
            localStorage.setItem('users', JSON.stringify(state.users))
        }
    },

    actions: {
        async refreshToken({ commit }) {
            const token = localStorage.getItem('token')
            const user = JSON.parse(localStorage.getItem('user'))

            if (token && user) {
                commit('SET_TOKEN', token)
                commit('SET_USER', user)
            }
        },

        async register({ commit, state }, userData) {
            commit('SET_LOADING', true)
            commit('SET_ERROR', null)

            try {
                const existingUser = state.users.find(u => u.email === userData.email)
                if (existingUser) {
                    throw new Error('Email already registered')
                }

                const response = await axios.post(`${API_URL}/register`, userData)
                const newUser = response.data

                commit('ADD_NEW_USER', newUser)
                router.push('/login')
                return true
            } catch (error) {
                commit('SET_ERROR', error.message)
                throw error
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async login({ commit }, credentials) {
            commit('SET_LOADING', true)
            commit('SET_ERROR', null)

            try {
                const user = users.users.find(u =>
                    u.email === credentials.email &&
                    u.password === credentials.password
                )

                if (!user) {
                    throw new Error('Invalid credentials')
                }

                const token = 'mock-jwt-token-' + Math.random()

                commit('SET_USER', user)
                commit('SET_TOKEN', token)
                localStorage.setItem('token', token)
                localStorage.setItem('user', JSON.stringify(user))

                if (user.role === 'admin') {
                    router.push('/admin')
                } else {
                    router.push('/')
                }
                window.location.href = '/'
                return user
            } catch (error) {
                commit('SET_ERROR', error.message)
                throw error
            } finally {
                commit('SET_LOADING', false)
            }
        },

        logout({ commit }) {
            commit('CLEAR_AUTH')
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/'
        },

        initAuth({ commit }) {
            const token = localStorage.getItem('token')
            const user = JSON.parse(localStorage.getItem('user'))

            if (token && user) {
                commit('SET_TOKEN', token)
                commit('SET_USER', user)
            } else {
                commit('CLEAR_AUTH')
                localStorage.removeItem('token')
                localStorage.removeItem('user')
            }
        }
    }
}

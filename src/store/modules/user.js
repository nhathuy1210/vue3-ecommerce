import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

export default {
    namespaced: true,

    state: {
        users: JSON.parse(localStorage.getItem('users')) || [],
        updateStatus: null,
        pendingChanges: []
    },

    getters: {
        getAllUsers: state => state.users,
        getUserById: state => id => state.users.find(u => u.id === parseInt(id)),
        getUpdateStatus: state => state.updateStatus,
        getPendingChanges: state => state.pendingChanges
    },

    mutations: {
        SET_USERS(state, users) {
            state.users = users
            localStorage.setItem('users', JSON.stringify(users))
        },
        UPDATE_USER(state, updatedUser) {
            const index = state.users.findIndex(u => u.id === updatedUser.id)
            if (index !== -1) {
                // Update in Vuex state
                state.users.splice(index, 1, updatedUser)
                // Update in localStorage
                const users = [...state.users]
                localStorage.setItem('users', JSON.stringify(users))
            }
        },
        DELETE_USER(state, userId) {
            state.users = state.users.filter(u => u.id !== parseInt(userId))
            localStorage.setItem('users', JSON.stringify(state.users))
        },
        SET_UPDATE_STATUS(state, status) {
            state.updateStatus = status
        },
        SET_PENDING_CHANGES(state, changes) {
            state.pendingChanges = changes
        }
    },

    actions: {
        async updateUser({ commit }, userData) {
            try {
                console.log('Sending update request:', userData)
                // Send update to server to save in users.json
                const response = await axios.put(`${API_URL}/users/${userData.id}`, userData)

                
                commit('UPDATE_USER', response.data)
                commit('SET_UPDATE_STATUS', 'Profile updated successfully')

                return response.data
            } catch (error) {
                console.error('Update failed:', error)
                commit('SET_UPDATE_STATUS', 'Update failed')
                throw error
            }
        },

        async fetchUsers({ commit }) {
            try {
                const response = await axios.get(`${API_URL}/users`)
                commit('SET_USERS', response.data)
                return response.data
            } catch (error) {
                console.log('Fetch users error:', error)
                throw error
            }
        },

        async updateUserRole({ commit }, { userId, role }) {
            try {
                const response = await axios.patch(`${API_URL}/users/${userId}/role`, { role })
                commit('UPDATE_USER', response.data)
                return response.data
            } catch (error) {
                console.log('Update role error:', error)
                throw error
            }
        },

        async updateUserStatus({ commit }, { userId, status }) {
            try {
                const response = await axios.patch(`${API_URL}/users/${userId}/status`, { status })
                commit('UPDATE_USER', response.data)
                return response.data
            } catch (error) {
                console.log('Update status error:', error)
                throw error
            }
        },

        async saveAllChanges({ commit }, changes) {
            try {
                const updatePromises = changes.map(change => {
                    if (change.role) {
                        return axios.patch(`${API_URL}/users/${change.userId}/role`, {
                            role: change.role
                        })
                    }
                    if (change.status) {
                        return axios.patch(`${API_URL}/users/${change.userId}/status`, {
                            status: change.status
                        })
                    }
                })

                const responses = await Promise.all(updatePromises)

                responses.forEach(response => {
                    commit('UPDATE_USER', response.data)
                })

                commit('SET_PENDING_CHANGES', [])

                return responses.map(r => r.data)
            } catch (error) {
                console.log('Save changes error:', error)
                throw error
            }
        },

        async deleteUser({ commit }, userId) {
            try {
                const response = await axios.delete(`${API_URL}/users/${userId}`)
                if (response.data.success) {
                    commit('DELETE_USER', userId)
                    return response.data
                }
                throw new Error(response.data.message || 'Delete operation failed')
            } catch (error) {
                console.log('Delete operation details:', {
                    userId,
                    error: error.response?.data || error.message
                })
                throw error
            }
        }
    }
}

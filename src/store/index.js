import { createStore } from 'vuex'
import product from './modules/product'
import cart from './modules/cart'
import order from './modules/order'
import user from './modules/user'
import auth from './modules/auth'
import admin from './modules/admin'
import adminOrder from './modules/adminOrder'

export default createStore({
    modules: {
        product,
        cart,
        order,
        user,
        auth,
        admin,
        adminOrder
    }
})

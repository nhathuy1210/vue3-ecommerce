const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const app = express()

app.use(cors())
app.use(express.json())

// Define file paths with /src/data/
const USERS_FILE = path.join(__dirname, '../src/data/users.json')
const PRODUCTS_FILE = path.join(__dirname, '../src/data/products.json')
const CART_FILE = path.join(__dirname, '../src/data/cart.json')
const ORDERS_FILE = path.join(__dirname, '../src/data/orders.json')

// Helper functions
const readFile = (filePath) => {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

const writeFile = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

//register endpoint
app.post('/api/register', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'))

        // Find the highest existing ID
        const maxId = Math.max(...data.users.map(user => user.id), 0)

        const newUser = {
            id: maxId + 1,
            email: req.body.email,
            password: req.body.password,
            name: req.body.name,
            role: 'user',
            status: 'active'
        }

        // Check for existing email
        const existingUser = data.users.find(u => u.email === newUser.email)
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' })
        }

        data.users.push(newUser)
        fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2))

        res.status(201).json(newUser)
    } catch (error) {
        console.log('Registration error:', error)
        res.status(500).json({ message: 'Registration failed' })
    }
})


// Users endpoints
app.get('/api/users', (req, res) => {
    try {
        const users = readFile(USERS_FILE)
        res.json(users.users)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.post('/api/users', (req, res) => {
    try {
        const users = readFile(USERS_FILE)
        const newUser = {
            id: users.users.length + 1,
            ...req.body,
            role: 'user',
            status: 'active',
            joinedDate: new Date().toISOString(),
            orders: []
        }
        users.users.push(newUser)
        writeFile(USERS_FILE, users)
        res.json(newUser)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.put('/api/users/:id', (req, res) => {
    try {
        const userId = parseInt(req.params.id)
        const { fullName, email, phone, address } = req.body

        // Read data using helper function
        const data = readFile(USERS_FILE)
        const userIndex = data.users.findIndex(u => u.id === userId)

        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' })
        }

        // Update user data while preserving existing fields
        data.users[userIndex] = {
            id: userId,
            email: email || data.users[userIndex].email,
            password: data.users[userIndex].password,
            role: data.users[userIndex].role,
            status: data.users[userIndex].status,
            fullName: fullName || data.users[userIndex].fullName,
            phone: phone || data.users[userIndex].phone,
            address: address || data.users[userIndex].address
        }

        // Write using helper function
        writeFile(USERS_FILE, data)

        console.log('Updated user in file:', data.users[userIndex])
        res.json(data.users[userIndex])

    } catch (error) {
        console.error('Update error:', error)
        res.status(500).json({ error: 'Update failed' })
    }
})

// Update user role endpoint
app.patch('/api/users/:id/role', (req, res) => {
    try {
        const userId = parseInt(req.params.id)
        const { role } = req.body
        const users = readFile(USERS_FILE)
        const userIndex = users.users.findIndex(u => u.id === userId)

        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' })
        }

        users.users[userIndex] = {
            ...users.users[userIndex],
            role
        }

        writeFile(USERS_FILE, users)
        res.json(users.users[userIndex])
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})


// Update user profile endpoint
app.patch('/api/users/:id/profile', (req, res) => {
    try {
        const userId = parseInt(req.params.id)
        const { fullName, email, phone, address } = req.body
        const data = readFile(USERS_FILE)

        const userIndex = data.users.findIndex(u => u.id === userId)
        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' })
        }

        // Update only the profile fields while preserving other user data
        data.users[userIndex] = {
            ...data.users[userIndex],
            fullName: fullName || data.users[userIndex].fullName,
            email: email || data.users[userIndex].email,
            phone: phone || data.users[userIndex].phone,
            address: address || data.users[userIndex].address
        }

        // Write the updated data back to the file
        writeFile(USERS_FILE, data)

        // Return the updated user object
        res.json(data.users[userIndex])
    } catch (error) {
        console.error('Profile update error:', error)
        res.status(500).json({ error: 'Failed to update profile' })
    }
})

// Update user status endpoint
app.patch('/api/users/:id/status', (req, res) => {
    try {
        const userId = parseInt(req.params.id)
        const { status } = req.body
        const users = readFile(USERS_FILE)
        const userIndex = users.users.findIndex(u => u.id === userId)

        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' })
        }

        users.users[userIndex] = {
            ...users.users[userIndex],
            status
        }

        writeFile(USERS_FILE, users)
        res.json(users.users[userIndex])
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Users DELETE endpoint with proper routing
app.delete('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id)
    const users = readFile(USERS_FILE)

    const userIndex = users.users.findIndex(u => u.id === userId)
    if (userIndex === -1) {
        return res.status(404).json({
            success: false,
            message: `User ${userId} not found`
        })
    }

    users.users.splice(userIndex, 1)
    writeFile(USERS_FILE, users)

    res.json({
        success: true,
        message: 'User deleted successfully',
        deletedId: userId,

    })
})


// Products endpoints
app.get('/api/check', (req, res) => {
    try {
        const data = readFile(PRODUCTS_FILE)
        res.json({
            path: PRODUCTS_FILE,
            products: data.products.map(p => p.id)
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.get('/api/products', (req, res) => {
    try {
        const data = readFile(PRODUCTS_FILE)
        res.json(data.products)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Products PUT endpoint for updating product details
app.put('/api/products/:id', (req, res) => {
    try {
        const productId = Number(req.params.id)
        const data = readFile(PRODUCTS_FILE)
        const productIndex = data.products.findIndex(p => Number(p.id) === productId)

        if (productIndex === -1) {
            return res.status(404).json({
                success: false,
                message: `Product ${productId} not found`
            })
        }

        // Update product with new data
        data.products[productIndex] = {
            ...data.products[productIndex],
            name: req.body.name,
            category: req.body.category,
            price: Number(req.body.price),
            stock: Number(req.body.stock),
            description: req.body.description,
            image: req.body.image
        }

        writeFile(PRODUCTS_FILE, data)
        res.json({
            success: true,
            data: data.products[productIndex]
        })
    } catch (error) {
        console.error('Update error:', error)
        res.status(500).json({ success: false, message: error.message })
    }
})

// New endpoint for updating product stock
app.put('/api/products/:id/stock', (req, res) => {
    try {
        const productId = Number(req.params.id)
        const quantity = Number(req.body.quantity)

        const data = readFile(PRODUCTS_FILE)
        const productIndex = data.products.findIndex(p => Number(p.id) === productId)

        if (productIndex === -1) {
            return res.status(404).json({
                success: false,
                message: `Product ${productId} not found`
            })
        }

        // Update stock quantity
        data.products[productIndex].stock = Math.max(0, data.products[productIndex].stock - quantity)

        // Save changes
        writeFile(PRODUCTS_FILE, data)

        res.json({
            success: true,
            data: data.products[productIndex]
        })
    } catch (error) {
        console.error('Update stock error:', error)
        res.status(500).json({ success: false, message: error.message })
    }
})


// Create new product endpoint
app.post('/api/products', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'))
        const newProduct = {
            id: data.products.length + 1,
            name: req.body.name,
            category: req.body.category,
            price: Number(req.body.price),
            stock: Number(req.body.stock),
            description: req.body.description,
            image: req.body.image || 'https://placehold.co/400x400'
        }

        data.products.push(newProduct)
        fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(data, null, 2))

        res.status(201).json(newProduct)
    } catch (error) {
        console.log('Add product error:', error)
        res.status(500).json({ message: 'Failed to add product' })
    }
})

//Delete product endpoint
app.delete('/api/products/:id', (req, res) => {
    try {
        const productId = Number(req.params.id)
        const data = readFile(PRODUCTS_FILE)
        const productIndex = data.products.findIndex(p => Number(p.id) === productId)

        if (productIndex === -1) {
            return res.status(404).json({
                success: false,
                message: `Product ${productId} not found`
            })
        }

        data.products.splice(productIndex, 1)
        writeFile(PRODUCTS_FILE, data)

        res.json({
            success: true,
            deletedId: productId


        })
    } catch (error) {
        console.error('Delete error:', error)
        res.status(500).json({ success: false, message: error.message })
    }
})

app.get('/api/products/search', (req, res) => {
    try {
        const searchQuery = req.query.q?.toLowerCase()
        const data = readFile(PRODUCTS_FILE)

        if (!searchQuery) {
            return res.json([])
        }

        const filteredProducts = data.products.filter(product =>
            product.name.toLowerCase().includes(searchQuery)
        )

        res.json(filteredProducts)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})


if (!fs.existsSync(CART_FILE)) {
    fs.writeFileSync(CART_FILE, JSON.stringify({ carts: [] }))
}

// Cart endpoints
app.post('/api/cart', (req, res) => {
    try {
        const carts = JSON.parse(fs.readFileSync(CART_FILE, 'utf8'))
        const { userId, ...itemData } = req.body

        let userCart = carts.carts.find(cart => cart.userId === userId)

        if (!userCart) {
            userCart = { userId, items: [] }
            carts.carts.push(userCart)
        }

        const existingItemIndex = userCart.items.findIndex(item => item.id === itemData.id)

        if (existingItemIndex !== -1) {
            userCart.items[existingItemIndex].quantity += itemData.quantity
        } else {
            userCart.items.push(itemData)
        }

        fs.writeFileSync(CART_FILE, JSON.stringify(carts, null, 2))

        // Return complete cart data
        res.json({
            items: userCart.items,
            totalCount: userCart.items.reduce((sum, item) => sum + Number(item.quantity), 0)
        })
    } catch (error) {
        console.log('Server cart error:', error)
        res.status(500).json({ items: [], totalCount: 0 })
    }
})

app.get('/api/cart/:userId', (req, res) => {
    try {
        const carts = JSON.parse(fs.readFileSync(CART_FILE, 'utf8'))
        const userCart = carts.carts.find(cart => cart.userId === parseInt(req.params.userId))
        res.json(userCart || { items: [] })
    } catch (error) {
        res.json({ items: [] })
    }
})

// Add this new endpoint for direct buy
app.post('/api/direct-buy', (req, res) => {
    try {
        const { userId, item, quantity } = req.body

        // Validate stock availability
        const products = readFile(PRODUCTS_FILE)
        const product = products.products.find(p => p.id === item.id)

        if (!product || product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Product out of stock or unavailable'
            })
        }

        // Create direct buy order
        const orders = readFile(ORDERS_FILE)
        const newOrder = {
            id: orders.orders.length + 1,
            userId,
            items: [{ ...item, quantity }],
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            directBuy: true
        }

        // Update product stock
        product.stock -= quantity
        writeFile(PRODUCTS_FILE, products)

        // Save order
        orders.orders.push(newOrder)
        writeFile(ORDERS_FILE, orders)

        res.status(201).json({
            success: true,
            order: newOrder
        })
    } catch (error) {
        console.error('Direct buy error:', error)
        res.status(500).json({
            success: false,
            message: 'Failed to process direct buy'
        })
    }
})


app.delete('/api/cart/:userId/:itemId', (req, res) => {
    try {
        const carts = JSON.parse(fs.readFileSync(CART_FILE, 'utf8'))
        const userCart = carts.carts.find(cart => cart.userId === parseInt(req.params.userId))

        if (userCart) {
            userCart.items = userCart.items.filter(item => item.id !== parseInt(req.params.itemId))
            fs.writeFileSync(CART_FILE, JSON.stringify(carts, null, 2))
        }

        res.json(userCart || { items: [] })
    } catch (error) {
        res.status(200).json({ items: [] })
    }
})

app.put('/api/cart/:userId/:itemId', (req, res) => {
    try {
        const carts = JSON.parse(fs.readFileSync(CART_FILE, 'utf8'))
        const userCart = carts.carts.find(cart => cart.userId === parseInt(req.params.userId))

        if (userCart) {
            const item = userCart.items.find(item => item.id === parseInt(req.params.itemId))
            if (item) {
                item.quantity = req.body.quantity
                fs.writeFileSync(CART_FILE, JSON.stringify(carts, null, 2))
            }
        }

        res.json(userCart || { items: [] })
    } catch (error) {
        res.status(200).json({ items: [] })
    }
})

app.delete('/api/cart/:userId', (req, res) => {
    try {
        const carts = JSON.parse(fs.readFileSync(CART_FILE, 'utf8'))
        const cartIndex = carts.carts.findIndex(cart => cart.userId === parseInt(req.params.userId))

        if (cartIndex !== -1) {
            carts.carts[cartIndex].items = []
            fs.writeFileSync(CART_FILE, JSON.stringify(carts, null, 2))
        }

        res.json({ items: [] })
    } catch (error) {
        res.status(200).json({ items: [] })
    }
})

// Initialize orders.json if it doesn't exist
if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify({ orders: [] }))
}

// Orders endpoints
app.get('/api/orders', (req, res) => {
    try {
        const orders = readFile(ORDERS_FILE)
        const userId = req.query.userId

        if (userId) {
            const userOrders = orders.orders.filter(order => order.userId === parseInt(userId))
            res.json(userOrders)
        } else {
            res.json(orders.orders)
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.patch('/api/orders/:id', (req, res) => {
    try {
        const orderId = parseInt(req.params.id)
        const orders = readFile(ORDERS_FILE)
        const orderIndex = orders.orders.findIndex(o => o.id === orderId)

        if (orderIndex === -1) {
            return res.status(404).json({
                success: false,
                message: `Order ${orderId} not found`
            })
        }

        // Update only the status and updatedAt fields
        orders.orders[orderIndex] = {
            ...orders.orders[orderIndex],
            status: req.body.status,
            updatedAt: new Date().toISOString()
        }

        writeFile(ORDERS_FILE, orders)
        res.json(orders.orders[orderIndex])
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})


app.post('/api/orders', (req, res) => {
    try {
        const orders = readFile(ORDERS_FILE)
        const newOrder = {
            id: orders.orders.length + 1,
            ...req.body,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        orders.orders.push(newOrder)
        writeFile(ORDERS_FILE, orders)
        res.status(201).json(newOrder)
    } catch (error) {
        console.log('Create order error:', error)
        res.status(500).json({ message: 'Failed to create order' })
    }
})

app.get('/api/orders/:id', (req, res) => {
    try {
        const orders = readFile(ORDERS_FILE)
        const order = orders.orders.find(o => o.id === parseInt(req.params.id))

        if (!order) {
            return res.status(404).json({ message: 'Order not found' })
        }

        res.json(order)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.put('/api/orders/:id', (req, res) => {
    try {
        const orderId = parseInt(req.params.id)
        const orders = readFile(ORDERS_FILE)
        const orderIndex = orders.orders.findIndex(o => o.id === orderId)

        if (orderIndex === -1) {
            return res.status(404).json({
                success: false,
                message: `Order ${orderId} not found`
            })
        }

        orders.orders[orderIndex] = {
            ...orders.orders[orderIndex],
            ...req.body,
            updatedAt: new Date().toISOString()
        }

        writeFile(ORDERS_FILE, orders)
        res.json(orders.orders[orderIndex])
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.delete('/api/orders/:id', (req, res) => {
    try {
        const orderId = parseInt(req.params.id)
        const orders = readFile(ORDERS_FILE)
        const orderIndex = orders.orders.findIndex(o => o.id === orderId)

        if (orderIndex === -1) {
            return res.status(404).json({
                success: false,
                message: `Order ${orderId} not found`
            })
        }

        orders.orders.splice(orderIndex, 1)
        writeFile(ORDERS_FILE, orders)

        res.json({
            success: true,
            message: 'Order deleted successfully',
            deletedId: orderId
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
    console.log(`Users file: ${USERS_FILE}`)
    console.log(`Products file: ${PRODUCTS_FILE}`)
    console.log(`Cart file: ${CART_FILE}`)
    console.log(`Orders file: ${ORDERS_FILE}`)
})

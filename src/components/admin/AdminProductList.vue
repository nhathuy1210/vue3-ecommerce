<template>
     <div class="admin-products">
        <div class="content-header">
            <h2>Product Management</h2>
            <div class="header-actions">
                <div class="search-bar">
                    <input 
                        type="text" 
                        v-model="searchQuery" 
                        placeholder="Search products..."
                        @input="filterProducts"
                    >
                </div>
                <button class="add-button" @click="showAddModal = true">
                    <i class="fas fa-plus"></i> Add New Product
                </button>
            </div>
        </div>
  
      <div class="products-table">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in filteredProducts" :key="product.id">
              <td><img :src="product.image" :alt="product.name"></td>
              <td>{{ product.name }}</td>
              <td>{{ product.category }}</td>
              <td>${{ product.price }}</td>
              <td>{{ product.stock }}</td>
              <td>
  <button @click="editProduct(product)" class="edit-btn">
    <i class="fas fa-edit"></i> Edit
  </button>
  <button @click="deleteProduct(product.id)" class="delete-btn">
    <i class="fas fa-trash-alt"></i> Delete
  </button>
</td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Add/Edit Product Modal -->
      <div v-if="showAddModal || showEditModal" class="modal">
        <div class="modal-content">
          <h3>{{ showEditModal ? 'Edit Product' : 'Add New Product' }}</h3>
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label>Name</label>
              <input type="text" v-model="productForm.name" required>
            </div>
            
            <div class="form-group">
              <label>Category</label>
              <select v-model="productForm.category" required>
                <option v-for="cat in categories" :key="cat" :value="cat">
                  {{ cat }}
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Price</label>
              <input type="number" v-model="productForm.price" step="0.01" required>
            </div>
            
            <div class="form-group">
              <label>Stock</label>
              <input type="number" v-model="productForm.stock" required>
            </div>
            
            <div class="form-group">
              <label>Description</label>
              <textarea v-model="productForm.description" required></textarea>
            </div>
            
            <div class="form-group">
              <label>Image URL</label>
              <input type="url" v-model="productForm.image" required>
            </div>
            
            <div class="modal-actions">
              <button type="submit">
                {{ showEditModal ? 'Update' : 'Add' }} Product
              </button>
              <button type="button" @click="closeModal">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
 <script setup>
 import { ref, computed, onMounted } from 'vue'
 import { useStore } from 'vuex'
 
 const store = useStore()
 const showAddModal = ref(false)
 const showEditModal = ref(false)
 const searchQuery = ref('')
 const loading = ref(false)
 
 const productForm = ref({
   id: null,
   name: '',
   category: '',
   price: 0,
   stock: 0,
   description: '',
   image: ''
 })
 
 const products = computed(() => store.getters['product/getAllProducts'])
 const categories = computed(() => store.getters['product/getAllCategories'])
 
 const filteredProducts = computed(() => {
   if (!searchQuery.value) return products.value
   return products.value.filter(product => 
     product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
     product.category.toLowerCase().includes(searchQuery.value.toLowerCase())
   )
 })
 
 const editProduct = (product) => {
   // Ensure we create a new object with all properties
   productForm.value = {
     id: product.id,
     name: product.name,
     category: product.category,
     price: Number(product.price),
     stock: Number(product.stock),
     description: product.description,
     image: product.image
   }
   showEditModal.value = true
 }
 
 const deleteProduct = async (productId) => {
   if (!productId) {
     alert('Invalid product ID')
     return
   }
 
   if (confirm('Are you sure you want to delete this product?')) {
     loading.value = true
     try {
       const result = await store.dispatch('product/deleteProduct', Number(productId))
       if (result && result.success) {
         alert('Product deleted successfully')
         window.location.reload();  
         // Refresh the products list
         await store.dispatch('product/fetchProducts')
    
       } else {
         throw new Error('Failed to delete product')
         
       }
     } catch (error) {
       console.error('Delete failed:', error)
       alert(`Failed to delete product: ${error.message}`)
     
     } finally {
       loading.value = false
     }
   }
 }
 
 const handleSubmit = async () => {
   if (!productForm.value.name || !productForm.value.category) {
     alert('Please fill in all required fields')
     return
   }
 
   loading.value = true
   try {
     if (showEditModal.value) {
       const result = await store.dispatch('product/updateProduct', {
         ...productForm.value,
         id: Number(productForm.value.id),
         price: Number(productForm.value.price),
         stock: Number(productForm.value.stock)
       })
       if (result) {
         alert('Product updated successfully')
         await store.dispatch('product/fetchProducts')
  
       }
     } else {
       await store.dispatch('product/addProduct', {
         ...productForm.value,
         price: Number(productForm.value.price),
         stock: Number(productForm.value.stock)
       })
       alert('Product added successfully')
       window.location.reload();  
     }
     closeModal()
   } catch (error) {
     console.error('Submit failed:', error)
     alert(`Failed to save product: ${error.message}`)
   } finally {
     loading.value = false
   }
 }
 
 const closeModal = () => {
   showAddModal.value = false
   showEditModal.value = false
   productForm.value = {
     id: null,
     name: '',
     category: '',
     price: 0,
     stock: 0,
     description: '',
     image: ''
   }
 }
 
 onMounted(async () => {
    loading.value = true
    try {
        await store.dispatch('product/fetchProducts')
    } catch (error) {
        console.error('Failed to fetch products:', error)
    } finally {
        loading.value = false
    }
})
 </script>
 
 <style scoped>
.admin-products {
    background: #f8f9fa;
    min-height: 100%;
    padding: 24px;
}

.content-header {
    margin-bottom: 24px;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.content-header h2 {
    color: #2c3e50;
    font-size: 1.5rem;
    margin-bottom: 16px;
}

.header-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
}

.search-bar {
    flex: 1;
    max-width: 400px;
}

.search-bar input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    font-size: 0.9rem;
    transition: all 0.3s ease;
}

.search-bar input:focus {
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52,152,219,0.1);
    outline: none;
}

.add-button {
    background: #3498db;
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
}

.add-button:hover {
    background: #2980b9;
    transform: translateY(-1px);
}

.products-table {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    overflow: hidden;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th {
    background: #f8f9fa;
    padding: 16px;
    text-align: left;
    font-weight: 600;
    color: #2c3e50;
    border-bottom: 2px solid #e9ecef;
}

td {
    padding: 16px;
    border-bottom: 1px solid #e9ecef;
    vertical-align: middle;
}

td img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 4px;
    border: 1px solid #e9ecef;
}

td button {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-right: 8px;
    font-weight: 500;
}

td button:first-child {
    background: #3498db;
    color: white;
}

td button:last-child {
    background: #e74c3c;
    color: white;
}

td button:hover {
    opacity: 0.9;
    transform: translateY(-1px);
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 1.5rem;
    border-radius: 10px;
    width: 450px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.modal-content h3 {
    color: #2c3e50;
    font-size: 1.4rem;
    margin-bottom: 1.2rem;
    text-align: center;
    border-bottom: 2px solid #3498db;
    padding-bottom: 0.8rem;
}

.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    color: #2c3e50;
    font-weight: 600;
    font-size: 0.9rem;
    display: block;
    margin-bottom: 0.3rem;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 0.6rem;
    border: 2px solid #e9ecef;
    border-radius: 6px;
    font-size: 0.9rem;
    transition: all 0.2s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
    outline: none;
}

.form-group textarea {
    resize: vertical;
    min-height: 80px;
}

.modal-actions {
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid #e9ecef;
    display: flex;
    justify-content: flex-end;
    gap: 0.8rem;
}

.modal-actions button {
    padding: 0.6rem 1.2rem;
    border-radius: 6px;
    font-weight: 600;
    font-size: 0.9rem;
    transition: all 0.2s ease;
    border: none;
    cursor: pointer;
}

.modal-actions button[type="submit"] {
    background: #3498db;
    color: white;
    min-width: 100px;
}

.modal-actions button[type="button"] {
    background: #e9ecef;
    color: #2c3e50;
}

.modal-actions button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
    .header-actions {
        flex-direction: column;
        gap: 12px;
    }

    .search-bar {
        max-width: 100%;
    }

    td button {
        padding: 6px 12px;
        font-size: 0.8rem;
    }
}
</style>
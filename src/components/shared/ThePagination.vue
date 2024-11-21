<template>
    <div class="pagination">
      <button 
        :disabled="props.currentPage === 1"
        @click="emit('page-change', props.currentPage - 1)"
      >
        Previous
      </button>
      
      <span v-for="page in props.totalPages" :key="page">
        <button 
          :class="{ active: page === props.currentPage }"
          @click="emit('page-change', page)"
        >
          {{ page }}
        </button>
      </span>
      
      <button 
        :disabled="props.currentPage === props.totalPages"
        @click="emit('page-change', props.currentPage + 1)"
      >
        Next
      </button>
    </div>
  </template>
  
  <script setup>
 // 1. Import các API 
import { defineProps, defineEmits } from 'vue'

// 2. Định nghĩa props component
const props = defineProps({
  // Trang hiện tại
  currentPage: {
    type: Number,  // Kiểu số
    required: true // Bắt buộc phải truyền vào
  },
  // Tổng số trang
  totalPages: {
    type: Number,  // Kiểu số
    required: true // Bắt buộc phải truyền vào
  }
})

// 3. Định nghĩa events
const emit = defineEmits(['page-change']) // Event khi thay đổi trang

  </script>
<style>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
}

.pagination button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.pagination button:hover:not(:disabled) {
  background: #f0f0f0;
  border-color: #999;
}

.pagination button:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
  color: #999;
}

.pagination button.active {
  background: #3498db;
  color: white;
  border-color: #3498db;
}
</style>

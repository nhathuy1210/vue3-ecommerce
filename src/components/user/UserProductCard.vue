<template>
  <div class="product-card">
    <div class="product-image">
      <img :src="product.image" :alt="product.name">
    </div>
    <div class="product-info">
      <h3>{{ product.name }}</h3>
      <button @click="viewDetail" class="view-detail">View Detail</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const viewDetail = () => {
  router.push(`/products/${props.product.id}`)
}
</script>

<style scoped>
.product-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  height: 100%;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.product-image {
  position: relative;
  width: 100%;
  padding-top: 100%;
  overflow: hidden;
}

.product-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  padding: 24px;
  transform: translateY(100%);
  transition: transform 0.4s ease;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.product-card:hover .product-info {
  transform: translateY(0);
}

.product-info h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #ffffff;
  font-weight: 600;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}


.view-detail {
  width: 100%;
  padding: 12px 24px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.view-detail:hover {
  background: #2563eb;
  transform: translateY(-2px);
}

.view-detail:active {
  transform: scale(0.98) translateY(0);
}
</style>

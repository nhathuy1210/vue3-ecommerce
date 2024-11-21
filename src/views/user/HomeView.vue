<template>
  <div class="home-view">
    <!-- Banner Carousel -->
    <div class="banner-carousel">
      <div class="carousel-container" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
        <div class="carousel-slide" v-for="(banner, index) in banners" :key="index">
          <img :src="banner.image" :alt="banner.title">
        </div>
      </div>
      <div class="carousel-indicators">
        <span 
          v-for="(_, index) in banners" 
          :key="index"
          :class="{ active: currentSlide === index }"
          @click="goToSlide(index)"
        ></span>
      </div>
    </div>

    <!-- Product Sections -->
    <div class="product-sections container">
      <!-- Smartphones Section -->
      <section class="product-section">
        <div class="section-header">
          <h2>Smartphones</h2>
          <router-link to="/products?category=Smartphones" class="view-all">View All</router-link>
        </div>
        <div class="products-grid">
          <UserProductCard 
            v-for="product in smartphoneProducts" 
            :key="product.id" 
            :product="product"
          />
        </div>
      </section>

      <!-- Laptops Section -->
      <section class="product-section">
        <div class="section-header">
          <h2>Laptops</h2>
          <router-link to="/products?category=Laptops" class="view-all">View All</router-link>
        </div>
        <div class="products-grid">
          <UserProductCard 
            v-for="product in laptopProducts" 
            :key="product.id" 
            :product="product"
          />
        </div>
      </section>

      <!-- Tablets Section -->
      <section class="product-section">
        <div class="section-header">
          <h2>Tablets</h2>
          <router-link to="/products?category=Tablets" class="view-all">View All</router-link>
        </div>
        <div class="products-grid">
          <UserProductCard 
            v-for="product in tabletProducts" 
            :key="product.id" 
            :product="product"
          />
        </div>
      </section>

      <!-- Accessories Section -->
      <section class="product-section">
        <div class="section-header">
          <h2>Accessories</h2>
          <router-link to="/products?category=Accessories" class="view-all">View All</router-link>
        </div>
        <div class="products-grid">
          <UserProductCard 
            v-for="product in accessoryProducts" 
            :key="product.id" 
            :product="product"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, formatDate, defineExpose } from 'vue'
import { useStore } from 'vuex'
import UserProductCard from '@/components/user/UserProductCard.vue'
import { formatCurrency } from '@/utils/format'

defineExpose({ formatCurrency, formatDate })
const store = useStore()
const currentSlide = ref(0)
let slideInterval

const banners = [
  {
    image: '/images/banners/banner1.jpg',
    title: 'New iPhone Release'
  },
  {
    image: '/images/banners/banner2.jpg',
    title: 'Laptops Sale'
  },
  {
    image: '/images/banners/banner3.jpg',
    title: 'Accessories Deals'
  }
]

const goToSlide = (index) => {
  currentSlide.value = index
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % banners.length
}

onMounted(() => {
  slideInterval = setInterval(nextSlide, 5000)
})

onBeforeUnmount(() => {
  clearInterval(slideInterval)
})

const smartphoneProducts = computed(() => 
  store.getters['product/getProductsByCategory']('Smartphones').slice(0, 4)
)

const laptopProducts = computed(() => 
  store.getters['product/getProductsByCategory']('Laptops').slice(0, 4)
)

const tabletProducts = computed(() => 
  store.getters['product/getProductsByCategory']('Tablets').slice(0, 4)
)

const accessoryProducts = computed(() => 
  store.getters['product/getProductsByCategory']('Accessories').slice(0, 4)
)
</script>

<style scoped>
.home-view {
  margin-top: 90px;
  width: 100%;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.banner-carousel {
  position: relative;
  width: 100%;
  height: 500px;
  overflow: hidden;
  margin-bottom: 40px;
}

.carousel-container {
  display: flex;
  transition: transform 0.5s ease;
  height: 100%;
}

.carousel-slide {
  min-width: 100%;
  height: 100%;
}

.carousel-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10;
}

.carousel-indicators span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.carousel-indicators span.active {
  background: white;
  transform: scale(1.2);
}

.product-sections {
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 24px;
  color: #333;
}

.view-all {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.view-all:hover {
  text-decoration: underline;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .banner-carousel {
    height: 300px;
  }
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .banner-carousel {
    height: 200px;
  }
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>

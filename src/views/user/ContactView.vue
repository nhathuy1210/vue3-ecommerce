<template>
    <div class="contact-container">
      <!-- Hero Section -->
      <section class="contact-hero">
        <h1>Get in Touch</h1>
        <p>We'd love to hear from you. Our team is always here to help.</p>
      </section>
  
      <div class="contact-content">
        <!-- Contact Information -->
        <div class="contact-info">
          <div class="info-card">
            <i class="fas fa-map-marker-alt"></i>
            <h3>Visit Us</h3>
            <p>123 Tech Street</p>
            <p>Ho Chi Minh City, Vietnam</p>
          </div>
  
          <div class="info-card">
            <i class="fas fa-phone"></i>
            <h3>Call Us</h3>
            <p>+84 123 456 789</p>
            <p>Mon-Fri, 9am-6pm</p>
          </div>
  
          <div class="info-card">
            <i class="fas fa-envelope"></i>
            <h3>Email Us</h3>
            <p>support@techshop.com</p>
            <p>sales@techshop.com</p>
          </div>
        </div>
  
        <!-- Contact Form -->
        <div class="contact-form-container">
          <h2>Send us a Message</h2>
          <form @submit.prevent="handleSubmit" class="contact-form">
            <div class="form-group">
              <label for="name">Full Name</label>
              <input 
                type="text" 
                id="name" 
                v-model="formData.name" 
                required
                placeholder="Enter your full name"
              >
            </div>
  
            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                v-model="formData.email" 
                required
                placeholder="Enter your email"
              >
            </div>
  
            <div class="form-group">
              <label for="subject">Subject</label>
              <input 
                type="text" 
                id="subject" 
                v-model="formData.subject" 
                required
                placeholder="What is this about?"
              >
            </div>
  
            <div class="form-group">
              <label for="message">Message</label>
              <textarea 
                id="message" 
                v-model="formData.message" 
                required
                placeholder="Your message here..."
                rows="5"
              ></textarea>
            </div>
  
            <button type="submit" class="submit-btn">
              Send Message
              <i class="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </div>
  
      <!-- Map Section -->
      <div class="map-container">
        <h2>Our Location</h2>
        <div class="map">
          <!-- Add your map iframe here -->
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.2891350699677!2d106.69744147480567!3d10.789612989358593!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528cea91f6bdf%3A0x8e6d3a7b9c2e486!2sLandmark%2081!5e0!3m2!1sen!2s!4v1709174044570!5m2!1sen!2s"
            width="100%" 
            height="450" 
            style="border:0;" 
            allowfullscreen="" 
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const formData = ref({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  
  const handleSubmit = () => {
    console.log('Form submitted:', formData.value)

  }
  </script>
  
  <style scoped>
  .contact-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .contact-hero {
    text-align: center;
    padding: 80px 0;
    background: linear-gradient(135deg, #2980b9 0%, #2980b9 100%);
    color: white;
    border-radius: 20px;
    margin-bottom: 60px;
  }
  
  .contact-hero h1 {
    font-size: 3rem;
    margin-bottom: 20px;
  }
  
  .contact-content {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 40px;
    margin-bottom: 60px;
  }
  
  .contact-info {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .info-card {
    padding: 30px;
    background: #f8fafc;
    border-radius: 15px;
    text-align: center;
    transition: transform 0.3s ease;
  }
  
  .info-card:hover {
    transform: translateY(-5px);
  }
  
  .info-card i {
    font-size: 2rem;
    color: #2980b9;
    margin-bottom: 15px;
  }
  
  .contact-form-container {
    background: white;
    padding: 40px;
    border-radius: 15px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  label {
    display: block;
    margin-bottom: 8px;
    color: #4b5563;
    font-weight: 500;
  }
  
  input, textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
  }
  
  input:focus, textarea:focus {
    outline: none;
    border-color: #2980b9;
  }
  
  .submit-btn {
    width: 100%;
    padding: 15px;
    background: #2980b9;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
  
  .submit-btn:hover {
    background: #2980b9;

  }
  
  .map-container {
    margin-top: 60px;
  }
  
  .map-container h2 {
    text-align: center;
    margin-bottom: 30px;
  }
  
  @media (max-width: 768px) {
    .contact-content {
      grid-template-columns: 1fr;
    }
  
    .contact-hero h1 {
      font-size: 2rem;
    }
  
    .contact-form-container {
      padding: 20px;
    }
  }
  </style>
  
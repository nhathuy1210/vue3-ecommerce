<template>
    <div class="about-container">
      <!-- Hero Section -->
      <section class="hero">
        <h1>Welcome to Our Story</h1>
        <p class="subtitle">Creating Amazing Shopping Experiences Since 2024</p>
      </section>
  
      <!-- Mission Section -->
      <section class="mission">
        <div class="content-wrapper">
          <h2>Our Mission</h2>
          <p>We strive to provide the best technology products with exceptional service, making innovation accessible to everyone.</p>
          <div class="stats">
            <div class="stat-item">
              <span class="number">10K+</span>
              <span class="label">Happy Customers</span>
            </div>
            <div class="stat-item">
              <span class="number">1000+</span>
              <span class="label">Products</span>
            </div>
            <div class="stat-item">
              <span class="number">24/7</span>
              <span class="label">Support</span>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Team Section -->
      <section class="team">
        <h2>Meet Our Team</h2>
        <div class="team-grid">
          <div class="team-member">
            <img src="@/assets/team/ceo.jpg" alt="CEO">
            <h3>John Doe</h3>
            <p>CEO & Founder</p>
          </div>
          <div class="team-member">
            <img src="@/assets/team/cto.jpg" alt="CTO">
            <h3>Jane Smith</h3>
            <p>Chief Technology Officer</p>
          </div>
          <div class="team-member">
            <img src="@/assets/team/designer.jpg" alt="Designer">
            <h3>Mike Johnson</h3>
            <p>Lead Designer</p>
          </div>
        </div>
      </section>
  
      <!-- Values Section -->
      <section class="values">
        <h2>Our Values</h2>
        <div class="values-grid">
          <div class="value-item">
            <i class="fas fa-heart"></i>
            <h3>Customer First</h3>
            <p>Your satisfaction is our top priority</p>
          </div>
          <div class="value-item">
            <i class="fas fa-shield-alt"></i>
            <h3>Quality</h3>
            <p>We never compromise on product quality</p>
          </div>
          <div class="value-item">
            <i class="fas fa-sync"></i>
            <h3>Innovation</h3>
            <p>Constantly evolving to serve you better</p>
          </div>
        </div>
      </section>
  
      <!-- Contact CTA -->
      <section class="contact-cta">
        <h2>Ready to Join Our Journey?</h2>
        <p>Get in touch with us today</p>
        <router-link to="/contact" class="cta-button">Contact Us</router-link>
      </section>
    </div>
  </template>
  
  <style scoped>
  .about-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .hero {
    text-align: center;
    padding: 100px 0;
    background: linear-gradient(135deg, #2980b9 0%, #2478af 100%);
    color: white;
    border-radius: 20px;
    margin-bottom: 60px;
  }
  
  .hero h1 {
    font-size: 3.5rem;
    margin-bottom: 20px;
  }
  
  .subtitle {
    font-size: 1.5rem;
    opacity: 0.9;
  }
  
  section {
    margin-bottom: 80px;
  }
  
  h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 40px;
    color: #1f2937;
  }
  
  .stats {
    display: flex;
    justify-content: space-around;
    margin-top: 40px;
  }
  
  .stat-item {
    text-align: center;
  }
  
  .number {
    display: block;
    font-size: 2.5rem;
    font-weight: bold;
    color: #2980b9;
  }
  
  .label {
    color: #4b5563;
  }
  
  .team-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
    margin-top: 40px;
  }
  
  .team-member {
    text-align: center;
  }
  
  .team-member img {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 20px;
    border: 4px solid #2980b9;
  }
  
  .values-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
    margin-top: 40px;
  }
  
  .value-item {
    text-align: center;
    padding: 30px;
    background: #f9fafb;
    border-radius: 10px;
    transition: transform 0.3s ease;
  }
  
  .value-item:hover {
    transform: translateY(-5px);
  }
  
  .value-item i {
    font-size: 2.5rem;
    color: #2980b9;
    margin-bottom: 20px;
  }
  
  .contact-cta {
    text-align: center;
    padding: 80px 0;
    background: #f3f4f6;
    border-radius: 20px;
  }
  
  .cta-button {
    display: inline-block;
    padding: 15px 30px;
    background: #2980b9;
    color: white;
    text-decoration: none;
    border-radius: 8px;
    margin-top: 20px;
    transition: background 0.3s ease;
  }
  
  .cta-button:hover {
    background: #2980b9;
  }
  
  @media (max-width: 768px) {
    .hero h1 {
      font-size: 2.5rem;
    }
    
    .subtitle {
      font-size: 1.2rem;
    }
    
    .stats {
      flex-direction: column;
      gap: 30px;
    }
    
    .team-grid, .values-grid {
      grid-template-columns: 1fr;
    }
  }
  </style>
  
<script>
  import Header from './components/Header.svelte';
  import Infrastructure from './components/Infrastructure.svelte';
  import About from './components/About.svelte';
  import Ecosystem from './components/Ecosystem.svelte';
  import Contact from './components/Contact.svelte';
  import Footer from './components/Footer.svelte';
</script>

<div class="bg">
  <div class="floating-derp" style="top:12%;left:5%;animation-delay:0s;">😂</div>
  <div class="floating-derp" style="top:45%;left:92%;animation-delay:1.5s;font-size:22px;">😜</div>
  <div class="floating-derp" style="top:78%;left:3%;animation-delay:3s;font-size:20px;">🤪</div>
  <div class="floating-derp" style="top:20%;right:6%;animation-delay:0.8s;font-size:24px;">😛</div>
  <div class="floating-kibby" style="top:60%;left:8%;animation-delay:0.4s;">🐱</div>
  <div class="floating-kibby" style="top:30%;right:10%;animation-delay:2s;font-size:20px;">🐈</div>
  <div class="floating-kibby" style="top:85%;right:18%;animation-delay:1.2s;font-size:18px;">😸</div>
  <div class="floating-kibby" style="bottom:10%;left:20%;animation-delay:3.5s;">🐾</div>
</div>

<Header />
<main>
  <Infrastructure />
  <About />
  <Ecosystem />
  <Contact />
  <div class="photo-section">
    <img src="/Average.jpg" alt="Natalie Personal" class="personal-photo" />
    <p class="photo-caption">😸 professional kibby enjoyer 😸</p>
  </div>
</main>
<Footer />

<style>
  :global(*) {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :global(body) {
    font-family: 'Poppins', sans-serif;
    background: #0f001a;
    color: #ffffff;
    line-height: 1.7;
    min-height: 100vh;
    overflow-x: hidden;
  }

  :global(body::before) {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse at 15% 20%, rgba(85, 205, 252, 0.12) 0%, transparent 50%),
      radial-gradient(ellipse at 85% 30%, rgba(247, 168, 184, 0.12) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 80%, rgba(124, 58, 237, 0.10) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  .bg {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
  }

  @keyframes derp-float {
    0%, 100% { transform: translateY(0) scale(1); }
    25% { transform: translateY(-8px) scale(1.05) rotate(-3deg); }
    75% { transform: translateY(-4px) scale(0.95) rotate(3deg); }
  }

  .floating-derp {
    position: fixed;
    font-size: 28px;
    opacity: 0.15;
    pointer-events: none;
    z-index: 0;
    animation: derp-float 6s ease-in-out infinite;
  }

  .floating-kibby {
    position: fixed;
    font-size: 24px;
    opacity: 0.12;
    pointer-events: none;
    z-index: 0;
    animation: float 8s ease-in-out infinite;
  }

  main {
    max-width: 1000px;
    margin: -50px auto 60px;
    padding: 0 20px;
    position: relative;
    z-index: 10;
  }

  .photo-section {
    text-align: center;
    margin-top: 40px;
  }

  .personal-photo {
    width: 100%;
    max-width: 400px;
    border-radius: 24px;
    border: 2px solid rgba(255, 255, 255, 0.12);
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.3);
  }

  .photo-caption {
    margin-top: 12px;
    opacity: 0.5;
    font-size: 0.85rem;
  }
</style>

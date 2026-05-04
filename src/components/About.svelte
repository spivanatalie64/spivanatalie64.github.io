<section id="about" class="glass-card">
  <h2><i class="fas fa-microchip"></i> The Architect's Log 🏳️‍⚧️</h2>
  <p>I'm a <strong>trans woman</strong>, Linux architect, professional derp, and co-creator of AcreetionOS. My life is a testament to 99.9% uptime — not just in the systems I build, but in my own survival and evolution. 🐱🌈</p>

  <div class="subsection">
    <h3 style="color:#55cdfc;"><i class="fas fa-arrow-right"></i> The Oklahoma Escape 🌪️</h3>
    <p>Trapped in an environment that sought to break me, I executed a critical system migration. Moving from <strong>Stillwater, Oklahoma</strong> to <strong>Spokane, Washington</strong> wasn't just a relocation — it was a life-saving escape. Today I thrive in a culture that boosts me up, turning my unique neuroimmune profile into a masterclass in redundancy and resilience. <span class="derp-inline">😤</span></p>
  </div>

  <div class="subsection">
    <h3 style="color:#f7a8b8;"><i class="fas fa-arrow-right"></i> Forged with Family 👨‍👧</h3>
    <p>AcreetionOS was built from the ground up by my father, <strong>Darren Clift</strong>, and me. We don't wait for results — we chisel away at the circle until it's a square. 🐱‍👤</p>
  </div>
</section>

<style>
  .glass-card {
    background: rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 24px;
    padding: 32px;
    margin-bottom: 28px;
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.3);
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
    overflow: hidden;
  }

  .glass-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #55cdfc, #f7a8b8, #7c3aed, #f7a8b8, #55cdfc);
    background-size: 200% 100%;
    animation: shimmer 4s linear infinite;
  }

  @keyframes shimmer {
    0% { background-position: 0% 0%; }
    100% { background-position: 200% 0%; }
  }

  .glass-card:hover {
    border-color: rgba(255, 255, 255, 0.25);
    transform: translateY(-4px);
    box-shadow: 0 12px 56px rgba(0, 0, 0, 0.4);
  }

  h2 {
    font-family: 'Quicksand', sans-serif;
    font-size: 1.9rem;
    color: #f7a8b8;
    margin-bottom: 18px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .subsection {
    margin-top: 20px;
  }

  .subsection h3 {
    margin-bottom: 10px;
    font-size: 1.2rem;
  }

  .derp-inline {
    display: inline-block;
    animation: derp-float 3s ease-in-out infinite;
  }

  @keyframes derp-float {
    0%, 100% { transform: translateY(0) scale(1); }
    25% { transform: translateY(-8px) scale(1.05) rotate(-3deg); }
    75% { transform: translateY(-4px) scale(0.95) rotate(3deg); }
  }

  @media (max-width: 768px) {
    h2 { font-size: 1.5rem; }
    .glass-card { padding: 24px; }
  }
</style>

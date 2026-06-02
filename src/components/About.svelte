<section id="about">
  <h2><i class="fas fa-terminal"></i> About</h2>
  <div class="card">
    <p>
      I'm a co-creator of AcreetionOS and infrastructure architect.
      I specialize in Cloudflare backend optimization, distributed systems,
      and building resilient open-source infrastructure.
    </p>
    <div class="stats">
      <div class="stat">
        <span class="stat-value">99.9%</span>
        <span class="stat-label">Uptime</span>
      </div>
      <div class="stat">
        <span class="stat-value">72+</span>
        <span class="stat-label">Global Nodes</span>
      </div>
      <div class="stat">
        <span class="stat-value">10+</span>
        <span class="stat-label">Active Projects</span>
      </div>
      <div class="stat">
        <span class="stat-value">6.x</span>
        <span class="stat-label">Acreetion Kernel</span>
      </div>
    </div>
  </div>
</section>

<style>
  section {
    margin-bottom: 32px;
  }

  h2 {
    font-size: 1.6rem;
    font-weight: 700;
    color: #c084fc;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  h2 i {
    font-size: 1.2rem;
    color: #7c3aed;
  }

  .card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 12px;
    padding: 28px;
  }

  p {
    color: #a1a1aa;
    font-size: 0.95rem;
    line-height: 1.8;
    max-width: 720px;
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-top: 24px;
  }

  .stat {
    background: rgba(124, 58, 237, 0.06);
    border: 1px solid rgba(124, 58, 237, 0.12);
    border-radius: 10px;
    padding: 16px;
    text-align: center;
  }

  .stat-value {
    display: block;
    font-size: 1.4rem;
    font-weight: 700;
    color: #c084fc;
  }

  .stat-label {
    display: block;
    font-size: 0.75rem;
    color: #71717a;
    margin-top: 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  @media (max-width: 600px) {
    .stats {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>

<script>
  let { compact = false } = $props();
</script>

<section id="contact">
  <h2><i class="fas fa-envelope"></i> Contact</h2>
  <div class="card">
    <div class="social-grid" class:compact>
      <a href="https://github.com/spivanatalie64" class="btn-social" target="_blank">
        <i class="fab fa-github"></i> GitHub
      </a>
      <a href="https://gitlab.acreetionos.org/natalie" class="btn-social" target="_blank">
        <i class="fab fa-gitlab"></i> GitLab
      </a>
      <a href="https://x.com/spiva4spiva" class="btn-social" target="_blank">
        <i class="fab fa-twitter"></i> X / Twitter
      </a>
      <a href="https://blog.natalie.acreetionos.org" class="btn-social" target="_blank">
        <i class="fas fa-pen"></i> Blog
      </a>
      <a href="https://acreetionos.org" class="btn-social" target="_blank">
        <i class="fas fa-globe"></i> AcreetionOS
      </a>
      <a href="https://discord.gg/acreetionos" class="btn-social" target="_blank">
        <i class="fab fa-discord"></i> Discord
      </a>
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

  .social-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 10px;
  }

  .social-grid.compact {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 8px;
  }

  .btn-social {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: rgba(124, 58, 237, 0.08);
    color: #e1e1e6;
    text-decoration: none;
    padding: 12px 14px;
    border-radius: 8px;
    border: 1px solid rgba(124, 58, 237, 0.12);
    transition: all 0.15s;
    font-weight: 500;
    font-size: 0.85rem;
  }

  .btn-social:hover {
    background: rgba(124, 58, 237, 0.18);
    border-color: rgba(192, 132, 252, 0.3);
    color: #c084fc;
    transform: translateY(-1px);
  }

  @media (max-width: 600px) {
    .social-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>

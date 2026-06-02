<section id="infrastructure">
  <h2><i class="fas fa-cloud"></i> Infrastructure</h2>
  <div class="card">
    <p>
      I design and maintain the backbone infrastructure for AcreetionOS — 
      from Cloudflare edge optimization to a global mirror network spanning 
      72+ nodes. My focus is on reliability, performance, and zero-downtime 
      operations.
    </p>
    <div class="grid">
      <div class="item">
        <i class="fas fa-globe"></i>
        <div>
          <strong>Cloudflare Backend</strong>
          <span>Edge optimization, Workers, DNS, DDoS mitigation</span>
        </div>
      </div>
      <div class="item">
        <i class="fas fa-network-wired"></i>
        <div>
          <strong>Mirror Network</strong>
          <span>72+ global nodes for ISO distribution</span>
        </div>
      </div>
      <div class="item">
        <i class="fas fa-shield-alt"></i>
        <div>
          <strong>Security &amp; Monitoring</strong>
          <span>CVE tracking, health checks, auto-remediation</span>
        </div>
      </div>
      <div class="item">
        <i class="fas fa-box"></i>
        <div>
          <strong>Flatpak Repository</strong>
          <span>FlatFree — community Flatpak distribution</span>
        </div>
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
    margin-bottom: 24px;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .item {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 10px;
    padding: 18px;
    transition: all 0.15s;
  }

  .item:hover {
    border-color: rgba(192, 132, 252, 0.2);
    background: rgba(124, 58, 237, 0.04);
  }

  .item i {
    font-size: 1.3rem;
    color: #c084fc;
    margin-top: 2px;
    flex-shrink: 0;
  }

  .item strong {
    display: block;
    font-size: 0.9rem;
    color: #e1e1e6;
    margin-bottom: 2px;
  }

  .item span {
    display: block;
    font-size: 0.8rem;
    color: #71717a;
  }

  @media (max-width: 600px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }
</style>

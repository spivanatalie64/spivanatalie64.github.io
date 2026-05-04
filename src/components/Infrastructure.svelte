<section id="infrastructure" class="glass-card">
  <h2><i class="fas fa-server"></i> AcreetionOS Infrastructure <span class="uptime-badge pulse">99.9% Uptime</span></h2>
  <p>I handle the <strong>heavy lifting</strong> for the AcreetionOS backbone. From Cloudflare optimization to decentralized node management, I ensure our systems are as resilient as they are open.</p>
  <div class="infra-status">
    <div class="status-item">
      <strong>Primary Role</strong>
      <span>Infrastructure Lead</span>
    </div>
    <div class="status-item">
      <strong>Backend Layer</strong>
      <span>Cloudflare Expert</span>
    </div>
    <div class="status-item">
      <strong>Distribution</strong>
      <span>Kernel &amp; SysArch</span>
    </div>
    <div class="status-item">
      <strong>Node Status</strong>
      <span style="color:#2dd4bf;">SYNCED 🟢</span>
    </div>
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

  h2 i {
    font-size: 1.4rem;
  }

  .uptime-badge {
    background: linear-gradient(135deg, #2dd4bf, #0d9488);
    color: #0f001a;
    padding: 4px 14px;
    border-radius: 50px;
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-left: 8px;
  }

  .pulse {
    animation: pulse-animation 2s infinite;
  }

  @keyframes pulse-animation {
    0% { box-shadow: 0 0 0 0 rgba(45, 212, 191, 0.4); }
    100% { box-shadow: 0 0 0 20px rgba(45, 212, 191, 0); }
  }

  .infra-status {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
    margin-top: 18px;
  }

  .status-item {
    background: rgba(0, 0, 0, 0.25);
    padding: 16px;
    border-radius: 16px;
    border-left: 4px solid #7c3aed;
    transition: all 0.3s ease;
  }

  .status-item:hover {
    background: rgba(0, 0, 0, 0.35);
    border-left-color: #f7a8b8;
    transform: translateX(4px);
  }

  .status-item strong {
    display: block;
    color: #fbc7d4;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 4px;
  }

  .status-item span {
    font-family: 'Fira Code', monospace;
    font-size: 1.05rem;
  }

  @media (max-width: 768px) {
    h2 { font-size: 1.5rem; }
    .glass-card { padding: 24px; }
  }
</style>

<script>
  const githubRepos = [
    'acreetionos', 'acreetionos32', 'acreetionos-archive-uploader', 'acreetionos-blog',
    'AcreetionOS-Cinnamon-Wayland', 'AcreetionOS-Cinnamon-X11', 'AcreetionOS-Cinnamon-XLibre',
    'acreetionos-code.github.io', 'acreetionos-flasher', 'acreetionos-gnome',
    'acreetionos-hyprland', 'AcreetionOS-Mate', 'acreetionos-newsletter', 'AcreetionOS-Tracker',
    'aiden-desktop', 'arttulos', 'cinderfox', 'ISO', 'Linux-Mint-Ports', 'llehs-emong', 'mdg',
    'messengerpwat', 'oglo', 'OVSC', 'qt-calculator', 'ScrapeC', 'spivanatalie64.github.io',
    'Trans_Tracker_101', 'Ace', 'git'
  ];

  const gitlabRepos = [
    'yacfs-tools', 'yacfs-replicate', 'yacfs-metrics', 'acreetionos-memory-manager',
    'acreetion-appstore', 'acreetionos-archive-uploader', 'acreetionos-flasher',
    'acreetionos-newsletter', 'acreetionos-news-tracker', 'acreetionos-website',
    'arttulos-site', 'crosspost',
    'qt-calculator', 'TrumpOS', 'Trans_Tracker_101',
    'spivanatalie64.github.io', 'OVSC', 'oglo', 'Linux-Mint-Ports', 'ISO', 'arttulos',
    'AcreetionOS-Tracker', 'acreetionos-gnome', 'acreetionos-code.github.io', 'acreetionos',
    'cinderfox', 'mdg', 'llehs-emong', 'AcreetionOS-Mate', 'ovsc-core', 'ovsc-sidecar',
    'ovsc-watcher', 'ovsc-host', 'X11aw', 'scrapec', 'AcreetionOSCloud', 'messengerpwat',
    'RiseupVPN-OpenVPN', 'acreetionos-terminal', 'aiden-desktop', 'calamares-config',
    'cinnamon-themes', 'root-distribution', 'thunderos', 'openrouter-tui'
  ];

  const featured = [
    { name: 'AcreetionOS', desc: 'Arch Linux distribution, Cinnamon desktop', url: 'https://acreetionos.org', icon: 'fa-linux', color: '#c084fc' },
    { name: 'YAcFS', desc: 'Yet Another common File System', url: '#docs', icon: 'fa-database', color: '#7c3aed' },
    { name: 'AcreetionOS Immutable', desc: 'Replacement for ArttulOS — immutable Arch with atomic updates', url: 'https://acreetionos.org/immutable/', icon: 'fa-shield', color: '#2ecc71' },
    { name: 'FlatFree', desc: 'Community Flatpak repository, free and open for everyone', url: 'https://flatfree.pages.dev', icon: 'fa-cube', color: '#2ecc71' },
    { name: 'Ion ROM', desc: 'Open-source Android ROM', url: 'https://spivanatalie64.github.io/ion-website/', icon: 'fa-mobile-alt', color: '#55cdfc' },
    { name: 'OVSC', desc: 'Orchestrated Virtual Server Cloud', url: 'https://gitlab.acreetionos.org/natalie/OVSC', icon: 'fa-cloud', color: '#2dd4bf' },
    { name: 'Mirror Network', desc: '72+ active nodes worldwide', url: '#', icon: 'fa-globe-americas', color: '#2dd4bf' },
    { name: 'MessengerPWA', desc: 'Messenger progressive web app', url: 'https://gitlab.acreetionos.org/natalie/messengerpwat', icon: 'fa-comment', color: '#fbbf24' },
    { name: 'Blog', desc: 'AcreetionOS updates and dev logs', url: 'https://blog.natalie.acreetionos.org', icon: 'fa-pen', color: '#fbbf24' },
  ];
</script>

<section id="ecosystem">
  <h2><i class="fas fa-project-diagram"></i> Projects</h2>
  <div class="card">
    <div class="featured-grid">
      {#each featured as repo}
        <a href={repo.url} target={repo.url.startsWith('http') ? '_blank' : ''} class="featured-node" style="--accent:{repo.color};">
          <i class="fas {repo.icon}"></i>
          <div>
            <strong>{repo.name}</strong>
            <span>{repo.desc}</span>
          </div>
        </a>
      {/each}
    </div>

    <div class="repo-section">
      <h3><i class="fab fa-github"></i> GitHub</h3>
      <div class="repo-grid">
        {#each githubRepos as repo}
          <a href="https://github.com/spivanatalie64/{repo}" target="_blank" class="repo-chip">
            {repo}
          </a>
        {/each}
      </div>
    </div>

    <div class="repo-section">
      <h3><i class="fab fa-gitlab"></i> GitLab</h3>
      <div class="repo-grid">
        {#each gitlabRepos as repo}
          <a href="https://gitlab.acreetionos.org/natalie/{repo}" target="_blank" class="repo-chip">
            {repo}
          </a>
        {/each}
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

  .featured-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 10px;
  }

  .featured-node {
    display: flex;
    align-items: center;
    gap: 12px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 10px;
    padding: 14px 16px;
    text-decoration: none;
    color: inherit;
    transition: all 0.15s;
  }

  .featured-node:hover {
    border-color: var(--accent, #7c3aed);
    background: color-mix(in srgb, var(--accent, #7c3aed) 8%, transparent);
  }

  .featured-node i {
    font-size: 1.2rem;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    flex-shrink: 0;
    color: var(--accent, #7c3aed);
    background: color-mix(in srgb, var(--accent, #7c3aed) 12%, transparent);
  }

  .featured-node strong {
    display: block;
    font-size: 0.85rem;
    color: #e1e1e6;
  }

  .featured-node span {
    display: block;
    font-size: 0.75rem;
    color: #71717a;
    margin-top: 1px;
  }

  .repo-section {
    margin-top: 28px;
    padding-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
  }

  .repo-section h3 {
    font-size: 0.95rem;
    color: #c084fc;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .repo-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .repo-chip {
    padding: 4px 12px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 6px;
    color: #a1a1aa;
    text-decoration: none;
    font-size: 0.78rem;
    transition: all 0.15s;
  }

  .repo-chip:hover {
    background: rgba(124, 58, 237, 0.1);
    border-color: rgba(124, 58, 237, 0.2);
    color: #e1e1e6;
  }

  @media (max-width: 600px) {
    .featured-grid {
      grid-template-columns: 1fr;
    }
  }
</style>

<script>
  let { repos: externalRepos = null, onselect } = $props();

  let sidebarOpen = $state(false);
  let search = $state('');
  let githubRepos = $state([]);
  let gitlabRepos = $state([]);
  let filteredGithub = $state([]);
  let filteredGitlab = $state([]);
  let loaded = $state(false);

  function toggleSidebar() { sidebarOpen = !sidebarOpen; if (sidebarOpen) fetchRepos(); }
  function closeSidebar() { sidebarOpen = false; }

  async function fetchRepos() {
    if (loaded && !externalRepos) return;
    if (externalRepos && externalRepos.length > 0) {
      processRepos(externalRepos);
      return;
    }
    try {
      const results = await Promise.allSettled([
        fetch('https://api.github.com/users/spivanatalie64/repos?per_page=100&sort=updated').then(r => r.ok ? r.json() : []),
        fetch('https://api.github.com/orgs/AcreetionOS-Code/repos?per_page=100&sort=updated').then(r => r.ok ? r.json() : []),
        fetch('https://gitlab.acreetionos.org/api/v4/users/natalie/projects?per_page=100').then(r => r.ok ? r.json() : []),
        fetch('https://gitlab.acreetionos.org/api/v4/users/darren/projects?per_page=100').then(r => r.ok ? r.json() : []),
      ]);
      const all = [];
      if (results[0].status === 'fulfilled' && Array.isArray(results[0].value)) all.push(...results[0].value.map(r => normalize(r, 'GitHub')));
      if (results[1].status === 'fulfilled' && Array.isArray(results[1].value)) all.push(...results[1].value.map(r => normalize(r, 'GitHub')));
      if (results[2].status === 'fulfilled' && Array.isArray(results[2].value)) all.push(...results[2].value.map(r => normalize(r, 'GitLab')));
      if (results[3].status === 'fulfilled' && Array.isArray(results[3].value)) all.push(...results[3].value.map(r => normalize(r, 'GitLab')));
      const deduped = all.filter((r, i, a) => a.findIndex(x => x.name === r.name) === i);
      processRepos(deduped);
    } catch {}
    loaded = true;
  }

  function normalize(r, source) {
    return {
      name: r.name || r.path || 'unknown',
      description: r.description || 'No description',
      language: r.language || null,
      stars: r.stargazers_count ?? r.star_count ?? 0,
      forks: r.forks_count ?? r.forks ?? 0,
      updated: r.updated_at || r.last_activity_at || null,
      url: r.html_url || r.web_url || '#',
      issues_url: r.html_url ? r.html_url + '/issues' : null,
      source,
    };
  }

  function processRepos(list) {
    githubRepos = list.filter(r => r.source === 'GitHub');
    gitlabRepos = list.filter(r => r.source === 'GitLab');
    applyFilter();
  }

  function applyFilter() {
    filteredGithub = search
      ? githubRepos.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || (r.description && r.description.toLowerCase().includes(search.toLowerCase())))
      : githubRepos;
    filteredGitlab = search
      ? gitlabRepos.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || (r.description && r.description.toLowerCase().includes(search.toLowerCase())))
      : gitlabRepos;
  }

  function selectRepo(repo) {
    closeSidebar();
    if (onselect) onselect(new CustomEvent('select', { detail: repo }));
  }

  function handleKeydown(e) { if (e.key === 'Escape') closeSidebar(); }

  function onSearchInput() { applyFilter(); }
</script>

<svelte:window onkeydown={handleKeydown} />

<header>
  <div class="header-inner">
    <button class="hamburger" onclick={toggleSidebar} aria-label="Menu" aria-expanded={sidebarOpen}>
      <span></span><span></span><span></span>
    </button>
    <div class="brand">
      <div class="avatar">
        <img src="/Business.png" alt="Natalie Spiva" />
      </div>
      <div>
        <h1>Natalie Spiva</h1>
        <p class="title">Co-Creator • AcreetionOS</p>
      </div>
    </div>
    <nav>
      <a href="#about">About</a>
      <a href="#infrastructure">Infrastructure</a>
      <a href="#ecosystem">Projects</a>
      <a href="#contact">Contact</a>
      <a href="https://acreetionos.org" target="_blank" class="external">AcreetionOS <i class="fas fa-external-link-alt"></i></a>
      <a href="/resume.pdf" target="_blank" class="external">Resume <i class="fas fa-file-pdf"></i></a>
    </nav>
  </div>
</header>

{#if sidebarOpen}
  <div class="sidebar-overlay" onclick={closeSidebar}></div>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h2><i class="fas fa-project-diagram"></i> Projects</h2>
      <button class="sidebar-close" onclick={closeSidebar}><i class="fas fa-times"></i></button>
    </div>
    <div class="sidebar-search">
      <i class="fas fa-search"></i>
      <input type="text" placeholder="Search projects..." bind:value={search} oninput={onSearchInput} />
    </div>
    <div class="sidebar-body">
      <div class="sidebar-group">
        <div class="sidebar-group-title"><i class="fab fa-github"></i> GitHub ({filteredGithub.length})</div>
        {#if filteredGithub.length === 0}
          <div class="sidebar-empty">No projects</div>
        {:else}
          {#each filteredGithub as repo}
            <button class="sidebar-item" onclick={() => selectRepo(repo)}>
              <strong>{repo.name}</strong>
              <span class="sidebar-item-desc">{(repo.description || '').slice(0, 60)}</span>
            </button>
          {/each}
        {/if}
      </div>
      <div class="sidebar-group">
        <div class="sidebar-group-title"><i class="fab fa-gitlab"></i> GitLab ({filteredGitlab.length})</div>
        {#if filteredGitlab.length === 0}
          <div class="sidebar-empty">No projects</div>
        {:else}
          {#each filteredGitlab as repo}
            <button class="sidebar-item" onclick={() => selectRepo(repo)}>
              <strong>{repo.name}</strong>
              <span class="sidebar-item-desc">{(repo.description || '').slice(0, 60)}</span>
            </button>
          {/each}
        {/if}
      </div>
    </div>
  </aside>
{/if}

<style>
  header { padding: 20px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.06); margin-bottom: 8px; }
  .header-inner { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
  .hamburger { display: flex; flex-direction: column; justify-content: center; gap: 5px; background: none; border: none; cursor: pointer; width: 34px; height: 34px; padding: 4px; flex-shrink: 0; border-radius: 6px; transition: background 0.15s; }
  .hamburger:hover { background: rgba(255, 255, 255, 0.04); }
  .hamburger span { display: block; width: 20px; height: 2px; background: #a1a1aa; border-radius: 2px; }
  .hamburger:hover span { background: #e1e1e6; }
  .brand { display: flex; align-items: center; gap: 16px; flex-shrink: 0; }
  .avatar { width: 52px; height: 52px; border-radius: 50%; overflow: hidden; border: 2px solid rgba(192, 132, 252, 0.3); flex-shrink: 0; }
  .avatar img { width: 100%; height: 100%; object-fit: cover; }
  h1 { font-size: 1.3rem; font-weight: 700; color: #e1e1e6; line-height: 1.2; }
  .title { font-size: 0.8rem; color: #7c3aed; font-weight: 500; }
  nav { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
  nav a { color: #a1a1aa; text-decoration: none; font-size: 0.85rem; font-weight: 500; padding: 8px 14px; border-radius: 8px; transition: all 0.15s; }
  nav a:hover { color: #e1e1e6; background: rgba(255, 255, 255, 0.04); }
  nav a.external { color: #c084fc; }
  nav a.external:hover { background: rgba(192, 132, 252, 0.1); }
  nav a i { font-size: 0.75rem; margin-left: 4px; }
  .sidebar-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5); z-index: 999; animation: fadeIn 0.15s ease; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .sidebar { position: fixed; top: 0; left: 0; bottom: 0; width: 320px; max-width: 90vw; background: #0a0a0f; border-right: 1px solid rgba(255, 255, 255, 0.06); z-index: 1000; display: flex; flex-direction: column; animation: slideIn 0.2s ease; overflow: hidden; }
  @keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }
  .sidebar-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.06); flex-shrink: 0; }
  .sidebar-header h2 { font-size: 1rem; color: #c084fc; margin: 0; display: flex; align-items: center; gap: 8px; }
  .sidebar-header h2 i { font-size: 0.9rem; }
  .sidebar-close { background: none; border: none; color: #71717a; font-size: 1.1rem; cursor: pointer; padding: 4px; border-radius: 4px; transition: color 0.15s; }
  .sidebar-close:hover { color: #e1e1e6; }
  .sidebar-search { display: flex; align-items: center; gap: 8px; padding: 12px 20px; background: rgba(255, 255, 255, 0.02); border-bottom: 1px solid rgba(255, 255, 255, 0.04); flex-shrink: 0; }
  .sidebar-search i { color: #52525b; font-size: 0.85rem; }
  .sidebar-search input { background: none; border: none; outline: none; color: #e1e1e6; font-size: 0.85rem; width: 100%; font-family: inherit; }
  .sidebar-search input::placeholder { color: #52525b; }
  .sidebar-body { flex: 1; overflow-y: auto; padding-bottom: 20px; }
  .sidebar-group { padding: 12px 0; }
  .sidebar-group + .sidebar-group { border-top: 1px solid rgba(255, 255, 255, 0.04); }
  .sidebar-group-title { padding: 4px 20px 8px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #52525b; display: flex; align-items: center; gap: 6px; }
  .sidebar-group-title i { font-size: 0.75rem; }
  .sidebar-item { display: block; width: 100%; text-align: left; background: none; border: none; border-left: 2px solid transparent; padding: 10px 20px; cursor: pointer; transition: all 0.12s; font-family: inherit; }
  .sidebar-item:hover { background: rgba(124, 58, 237, 0.06); border-left-color: #7c3aed; }
  .sidebar-item strong { display: block; font-size: 0.82rem; color: #e1e1e6; font-weight: 500; }
  .sidebar-item-desc { display: block; font-size: 0.72rem; color: #52525b; margin-top: 1px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .sidebar-empty { padding: 20px; text-align: center; color: #52525b; font-size: 0.8rem; }
  @media (max-width: 700px) {
    .header-inner { flex-direction: column; align-items: flex-start; gap: 12px; }
    nav { width: 100%; gap: 2px; }
    nav a { font-size: 0.78rem; padding: 6px 10px; }
  }
</style>

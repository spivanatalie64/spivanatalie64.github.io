<script>
  let { onselect } = $props();

  let githubPersonal = $state([]);
  let githubOrg = $state([]);
  let gitlabNatalie = $state([]);
  let gitlabDarren = $state([]);
  let loading = $state(true);
  let error = $state(null);
  let search = $state('');

  $effect(() => {
    const fetchAll = async () => {
      loading = true;
      error = null;
      const results = await Promise.allSettled([
        fetch('https://api.github.com/users/spivanatalie64/repos?per_page=100&sort=updated').then(r => { if (!r.ok) throw new Error('GitHub personal fetch failed'); return r.json(); }),
        fetch('https://api.github.com/orgs/AcreetionOS-Code/repos?per_page=100&sort=updated').then(r => { if (!r.ok) throw new Error('GitHub org fetch failed'); return r.json(); }),
        fetch('https://gitlab.acreetionos.org/api/v4/users/natalie/projects?per_page=100').then(r => { if (!r.ok) throw new Error('GitLab natalie fetch failed'); return r.json(); }),
        fetch('https://gitlab.acreetionos.org/api/v4/users/darren/projects?per_page=100').then(r => { if (!r.ok) throw new Error('GitLab darren fetch failed'); return r.json(); }),
      ]);

      if (results[0].status === 'fulfilled') githubPersonal = results[0].value;
      else console.warn(results[0].reason);
      if (results[1].status === 'fulfilled') githubOrg = results[1].value;
      else console.warn(results[1].reason);
      if (results[2].status === 'fulfilled') gitlabNatalie = results[2].value;
      else console.warn(results[2].reason);
      if (results[3].status === 'fulfilled') gitlabDarren = results[3].value;
      else console.warn(results[3].reason);

      const allFailed = results.every(r => r.status === 'rejected');
      if (allFailed) error = 'Could not load projects from any source. Please try again later.';
      loading = false;
    };

    fetchAll();
  });

  function normalizeRepo(repo, source) {
    return {
      name: repo.name || repo.path || 'unknown',
      description: repo.description || 'No description',
      language: repo.language || repo.primaryLanguage || null,
      stars: repo.stargazers_count ?? repo.star_count ?? 0,
      forks: repo.forks_count ?? repo.forks ?? 0,
      updated: repo.updated_at || repo.last_activity_at || repo.updatedAt || null,
      created: repo.created_at || repo.createdAt || null,
      url: repo.html_url || repo.web_url || repo.url || '#',
      issues_url: repo.html_url ? repo.html_url + '/issues' : null,
      source,
    };
  }

  let githubRepos = $derived(
    [...githubPersonal.map(r => normalizeRepo(r, 'GitHub')), ...githubOrg.map(r => normalizeRepo(r, 'GitHub'))]
      .filter((repo, idx, self) => self.findIndex(r => r.name === repo.name) === idx)
  );

  let gitlabRepos = $derived(
    [...gitlabNatalie.map(r => normalizeRepo(r, 'GitLab')), ...gitlabDarren.map(r => normalizeRepo(r, 'GitLab'))]
      .filter((repo, idx, self) => self.findIndex(r => r.name === repo.name) === idx)
  );

  let allRepos = $derived([...githubRepos, ...gitlabRepos]);

  let filteredGithub = $derived(
    search ? githubRepos.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || (r.description && r.description.toLowerCase().includes(search.toLowerCase()))) : githubRepos
  );
  let filteredGitlab = $derived(
    search ? gitlabRepos.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || (r.description && r.description.toLowerCase().includes(search.toLowerCase()))) : gitlabRepos
  );
  let filteredAll = $derived(
    search ? allRepos.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || (r.description && r.description.toLowerCase().includes(search.toLowerCase()))) : allRepos
  );

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    const days = Math.floor(diff / 86400000);
    if (days < 1) return 'today';
    if (days < 30) return days + 'd ago';
    if (days < 365) return Math.floor(days / 30) + 'mo ago';
    return Math.floor(days / 365) + 'y ago';
  }

  function selectRepo(repo) {
    if (onselect) onselect(new CustomEvent('select', { detail: repo }));
  }
</script>

<section id="ecosystem">
  <h2><i class="fas fa-project-diagram"></i> Projects</h2>
  <p class="section-sub">Click any project to see its details.</p>

  <div class="card">
    <div class="search-bar">
      <i class="fas fa-search"></i>
      <input type="text" placeholder="Search projects..." bind:value={search} />
    </div>

    {#if loading}
      <div class="loading">
        <i class="fas fa-spinner fa-pulse"></i> Loading projects...
      </div>
    {:else if error}
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i> {error}
      </div>
    {:else}
      <div class="tab-bar">
        <input type="radio" name="project-tab" id="tab-all" checked />
        <label for="tab-all">All Projects ({filteredAll.length})</label>
        <input type="radio" name="project-tab" id="tab-github" />
        <label for="tab-github"><i class="fab fa-github"></i> GitHub ({filteredGithub.length})</label>
        <input type="radio" name="project-tab" id="tab-gitlab" />
        <label for="tab-gitlab"><i class="fab fa-gitlab"></i> GitLab ({filteredGitlab.length})</label>
      </div>

      <div class="tab-content" id="panel-all">
        {#if filteredAll.length === 0}
          <div class="empty">No projects match your search.</div>
        {:else}
          <div class="repo-list">
            {#each filteredAll as repo}
              <button onclick={() => selectRepo(repo)} class="repo-item">
                <div class="repo-top">
                  <strong class="repo-name">{repo.name}</strong>
                  <span class="repo-source" class:github={repo.source === 'GitHub'} class:gitlab={repo.source === 'GitLab'}>{repo.source}</span>
                </div>
                <p class="repo-desc">{repo.description}</p>
                <div class="repo-meta">
                  {#if repo.language}
                    <span class="lang"><i class="fas fa-circle"></i> {repo.language}</span>
                  {/if}
                  <span><i class="fas fa-star"></i> {repo.stars}</span>
                  {#if repo.forks}
                    <span><i class="fas fa-code-branch"></i> {repo.forks}</span>
                  {/if}
                  {#if repo.updated}
                    <span><i class="fas fa-clock"></i> {formatDate(repo.updated)}</span>
                  {/if}
                </div>
              </button>
            {/each}
          </div>
        {/if}
      </div>

      <div class="tab-content" id="panel-github">
        {#if filteredGithub.length === 0}
          <div class="empty">No GitHub projects match your search.</div>
        {:else}
          <div class="repo-list">
            {#each filteredGithub as repo}
              <button onclick={() => selectRepo(repo)} class="repo-item">
                <div class="repo-top">
                  <strong class="repo-name">{repo.name}</strong>
                </div>
                <p class="repo-desc">{repo.description}</p>
                <div class="repo-meta">
                  {#if repo.language}
                    <span class="lang"><i class="fas fa-circle"></i> {repo.language}</span>
                  {/if}
                  <span><i class="fas fa-star"></i> {repo.stars}</span>
                  {#if repo.updated}
                    <span><i class="fas fa-clock"></i> {formatDate(repo.updated)}</span>
                  {/if}
                </div>
              </button>
            {/each}
          </div>
        {/if}
      </div>

      <div class="tab-content" id="panel-gitlab">
        {#if filteredGitlab.length === 0}
          <div class="empty">No GitLab projects match your search.</div>
        {:else}
          <div class="repo-list">
            {#each filteredGitlab as repo}
              <button onclick={() => selectRepo(repo)} class="repo-item">
                <div class="repo-top">
                  <strong class="repo-name">{repo.name}</strong>
                </div>
                <p class="repo-desc">{repo.description}</p>
                <div class="repo-meta">
                  {#if repo.language}
                    <span class="lang"><i class="fas fa-circle"></i> {repo.language}</span>
                  {/if}
                  <span><i class="fas fa-star"></i> {repo.stars}</span>
                  {#if repo.updated}
                    <span><i class="fas fa-clock"></i> {formatDate(repo.updated)}</span>
                  {/if}
                </div>
              </button>
            {/each}
          </div>
        {/if}
      </div>
    {/if}
  </div>
</section>

<style>
  section { margin-bottom: 32px; }
  .section-sub { font-size: 0.85rem; color: #71717a; margin: -12px 0 16px; }
  h2 { font-size: 1.6rem; font-weight: 700; color: #c084fc; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
  h2 i { font-size: 1.2rem; color: #7c3aed; }
  .card { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 28px; }
  .search-bar { display: flex; align-items: center; gap: 10px; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 8px 14px; margin-bottom: 20px; }
  .search-bar i { color: #71717a; font-size: 0.9rem; }
  .search-bar input { background: none; border: none; outline: none; color: #e1e1e6; font-size: 0.9rem; width: 100%; font-family: inherit; }
  .search-bar input::placeholder { color: #52525b; }
  .loading { text-align: center; padding: 40px 0; color: #a1a1aa; font-size: 0.9rem; }
  .loading i { margin-right: 8px; }
  .error-message { text-align: center; padding: 40px 0; color: #f87171; font-size: 0.9rem; }
  .error-message i { margin-right: 8px; }
  .empty { text-align: center; padding: 40px 0; color: #71717a; font-size: 0.9rem; }
  .tab-bar { display: flex; gap: 4px; margin-bottom: 16px; background: rgba(255, 255, 255, 0.03); border-radius: 8px; padding: 4px; }
  .tab-bar input { display: none; }
  .tab-bar label { flex: 1; text-align: center; padding: 8px 12px; border-radius: 6px; font-size: 0.82rem; color: #71717a; cursor: pointer; transition: all 0.15s; user-select: none; }
  .tab-bar label:hover { color: #a1a1aa; background: rgba(255, 255, 255, 0.03); }
  .tab-bar input:checked + label { background: rgba(124, 58, 237, 0.15); color: #c084fc; font-weight: 600; }
  .tab-bar label i { margin-right: 4px; }
  .tab-content { display: none; }
  #tab-all:checked ~ #panel-all, #tab-github:checked ~ #panel-github, #tab-gitlab:checked ~ #panel-gitlab { display: block; }
  .repo-list { display: flex; flex-direction: column; gap: 8px; }
  .repo-item { display: block; width: 100%; text-align: left; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 14px 16px; text-decoration: none; color: inherit; cursor: pointer; transition: all 0.15s; font-family: inherit; font-size: inherit; }
  .repo-item:hover { border-color: rgba(124, 58, 237, 0.2); background: rgba(124, 58, 237, 0.05); }
  .repo-top { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
  .repo-name { font-size: 0.88rem; color: #e1e1e6; font-weight: 600; }
  .repo-source { font-size: 0.68rem; padding: 1px 7px; border-radius: 4px; font-weight: 500; }
  .repo-source.github { background: rgba(110, 84, 148, 0.15); color: #a78bfa; }
  .repo-source.gitlab { background: rgba(226, 116, 51, 0.15); color: #fb923c; }
  .repo-desc { font-size: 0.78rem; color: #71717a; margin: 0 0 6px 0; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .repo-meta { display: flex; gap: 14px; font-size: 0.72rem; color: #52525b; }
  .repo-meta i { margin-right: 3px; font-size: 0.65rem; }
  .repo-meta .lang i { color: #7c3aed; }
  .repo-meta .fa-star { color: #fbbf24; }
  .repo-meta .fa-clock { color: #71717a; }
  @media (max-width: 600px) { .tab-bar label { font-size: 0.75rem; padding: 6px 8px; } .repo-meta { flex-wrap: wrap; gap: 8px; } }
</style>

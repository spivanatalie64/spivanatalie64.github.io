<script>
  import Header from './components/Header.svelte';
  import Infrastructure from './components/Infrastructure.svelte';
  import About from './components/About.svelte';
  import Ecosystem from './components/Ecosystem.svelte';
  import ProjectDetail from './components/ProjectDetail.svelte';
  import Contact from './components/Contact.svelte';
  import Footer from './components/Footer.svelte';

  let allRepos = $state([]);
  let selectedProject = $state(null);
  let ready = $state(false);

  function normalizeRepo(r, source) {
    return {
      name: r.name || r.path || 'unknown',
      description: r.description || 'No description',
      language: r.language || r.primaryLanguage || null,
      stars: r.stargazers_count ?? r.star_count ?? 0,
      forks: r.forks_count ?? r.forks ?? 0,
      updated: r.updated_at || r.last_activity_at || null,
      created: r.created_at || r.createdAt || null,
      url: r.html_url || r.web_url || '#',
      issues_url: r.html_url ? r.html_url + '/issues' : null,
      source,
    };
  }

  function loadRepoFromHash() {
    const hash = window.location.hash;
    const match = hash.match(/^#project\/(.+)/);
    if (match) {
      const repoName = decodeURIComponent(match[1]);
      const repo = allRepos.find(r => r.name === repoName);
      if (repo) {
        selectedProject = repo;
        return;
      }
    }
    selectedProject = null;
  }

  function navigateToProject(repo) {
    selectedProject = repo;
    history.pushState(null, '', '#project/' + encodeURIComponent(repo.name));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleBack() {
    selectedProject = null;
    history.pushState(null, '', '/');
  }

  function handleRepoClick(event) {
    navigateToProject(event.detail);
  }

  $effect(() => {
    const fetchAll = async () => {
      const results = await Promise.allSettled([
        fetch('https://api.github.com/users/spivanatalie64/repos?per_page=100&sort=updated').then(r => r.json()),
        fetch('https://api.github.com/orgs/AcreetionOS-Code/repos?per_page=100&sort=updated').then(r => r.json()),
        fetch('https://gitlab.acreetionos.org/api/v4/users/natalie/projects?per_page=100').then(r => r.json()),
        fetch('https://gitlab.acreetionos.org/api/v4/users/darren/projects?per_page=100').then(r => r.json()),
      ]);

      const repos = [];
      if (results[0].status === 'fulfilled') repos.push(...results[0].value.map(r => normalizeRepo(r, 'GitHub')));
      if (results[1].status === 'fulfilled') repos.push(...results[1].value.map(r => normalizeRepo(r, 'GitHub')));
      if (results[2].status === 'fulfilled') repos.push(...results[2].value.map(r => normalizeRepo(r, 'GitLab')));
      if (results[3].status === 'fulfilled') repos.push(...results[3].value.map(r => normalizeRepo(r, 'GitLab')));

      allRepos = repos.filter((r, i, a) => a.findIndex(x => x.name === r.name) === i);
      ready = true;

      loadRepoFromHash();
    };

    fetchAll();

    const onHash = () => {
      if (ready) loadRepoFromHash();
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  });
</script>

<div class="app">
  <Header repos={allRepos} onselect={handleRepoClick} />
  <main>
    {#if selectedProject}
      <ProjectDetail project={selectedProject} onback={handleBack} />
    {:else}
      <About />
      <Infrastructure />
      <Ecosystem repos={allRepos} onselect={handleRepoClick} />
      <Contact />
    {/if}
  </main>
  <Footer />
</div>

<style>
  :global(*) { box-sizing: border-box; margin: 0; padding: 0; }
  :global(body) {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    background: #0a0a0f;
    color: #e1e1e6;
    line-height: 1.7;
    min-height: 100vh;
  }
  .app { max-width: 960px; margin: 0 auto; padding: 0 24px; }
  main { padding: 40px 0 60px; }
</style>

<script>
  import Header from './components/Header.svelte';
  import Infrastructure from './components/Infrastructure.svelte';
  import About from './components/About.svelte';
  import Ecosystem from './components/Ecosystem.svelte';
  import ProjectDetail from './components/ProjectDetail.svelte';
  import Contact from './components/Contact.svelte';
  import Footer from './components/Footer.svelte';
  import { REPOS_API_URL } from './config.js';

  let allRepos = $state([]);
  let selectedProject = $state(null);
  let ready = $state(false);

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
      try {
        const res = await fetch(REPOS_API_URL);
        if (!res.ok) throw new Error(`Worker returned ${res.status}`);
        const data = await res.json();
        allRepos = data.repos || [];
      } catch (err) {
        console.error('Failed to fetch repos from worker:', err);
        allRepos = [];
      }
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

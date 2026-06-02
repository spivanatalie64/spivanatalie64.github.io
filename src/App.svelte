<script>
  import Header from './components/Header.svelte';
  import Infrastructure from './components/Infrastructure.svelte';
  import About from './components/About.svelte';
  import Ecosystem from './components/Ecosystem.svelte';
  import ProjectDetail from './components/ProjectDetail.svelte';
  import Contact from './components/Contact.svelte';
  import Footer from './components/Footer.svelte';

  let selectedProject = $state(null);

  function handleProjectSelect(event) {
    selectedProject = event.detail;
    history.pushState(null, '', '#project');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleBack() {
    selectedProject = null;
    history.pushState(null, '', '/');
  }

  function checkHash() {
    if (!window.location.hash.startsWith('#project')) {
      selectedProject = null;
    }
  }

  $effect(() => {
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  });
</script>

<div class="app">
  <Header onselect={handleProjectSelect} />
  <main>
    {#if selectedProject}
      <ProjectDetail project={selectedProject} onback={handleBack} />
    {:else}
      <About />
      <Infrastructure />
      <Ecosystem onselect={handleProjectSelect} />
      <Contact />
    {/if}
  </main>
  <Footer />
</div>

<style>
  :global(*) {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :global(body) {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    background: #0a0a0f;
    color: #e1e1e6;
    line-height: 1.7;
    min-height: 100vh;
  }

  .app {
    max-width: 960px;
    margin: 0 auto;
    padding: 0 24px;
  }

  main {
    padding: 40px 0 60px;
  }
</style>

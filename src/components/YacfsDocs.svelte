<script>
  import { marked } from 'marked';
  import { onMount } from 'svelte';

  let docContent = '';
  let docTitle = 'YAcFS — Yet Another common File System';
  let sidebarOpen = false;
  let currentDoc = 'overview';

  const docs = {
    overview: '/docs/yacfs/README.md',
    architecture: '/docs/yacfs/architecture.md',
    usage: '/docs/yacfs/usage.md',
    performance: '/docs/yacfs/performance.md',
    api: '/docs/yacfs/api.md',
    contributing: '/docs/yacfs/contributing.md'
  };

  function stripFrontmatter(md) {
    return md.replace(/^---[\s\S]*?---\n*/, '');
  }

  function fixRelativeLinks(html, docKey) {
    return html
      .replace(/href="([^"]*\.md)"/g, (m, p1) => {
        if (p1.startsWith('http')) return m;
        const key = Object.keys(docs).find(k => docs[k].endsWith('/' + p1));
        if (key) return `href="javascript:void(0)" data-doc="${key}"`;
        return m;
      })
      .replace(/src="([^"]*)"/g, (m, p1) => {
        if (p1.startsWith('http') || p1.startsWith('/')) return m;
        return `src="/docs/yacfs/${p1}"`;
      });
  }

  async function loadDoc(key) {
    currentDoc = key;
    try {
      const resp = await fetch(docs[key]);
      const md = await resp.text();
      const cleaned = stripFrontmatter(md);
      let html = marked.parse(cleaned);
      html = fixRelativeLinks(html, key);
      docContent = html;
      docTitle = key.charAt(0).toUpperCase() + key.slice(1);
    } catch (e) {
      docContent = `<p class="error">Failed to load documentation.</p>`;
    }
  }

  function handleNavClick(e) {
    const link = e.target.closest('[data-doc]');
    if (link) {
      e.preventDefault();
      loadDoc(link.dataset.doc);
    }
  }

  onMount(() => {
    loadDoc('overview');
    document.addEventListener('click', handleNavClick);
    return () => document.removeEventListener('click', handleNavClick);
  });
</script>

<div class="docs-layout">
  <button class="sidebar-toggle" on:click={() => sidebarOpen = !sidebarOpen}>
    <i class="fas fa-bars"></i> Docs Menu
  </button>

  <nav class="docs-sidebar" class:open={sidebarOpen}>
    <div class="sidebar-header">
      <h3>YAcFS Docs</h3>
    </div>
    <ul>
      <li><a href="javascript:void(0)" data-doc="overview" class:active={currentDoc === 'overview'}>Overview</a></li>
      <li><a href="javascript:void(0)" data-doc="architecture" class:active={currentDoc === 'architecture'}>Architecture</a></li>
      <li><a href="javascript:void(0)" data-doc="usage" class:active={currentDoc === 'usage'}>Usage Guide</a></li>
      <li><a href="javascript:void(0)" data-doc="performance" class:active={currentDoc === 'performance'}>Performance</a></li>
      <li><a href="javascript:void(0)" data-doc="api" class:active={currentDoc === 'api'}>Developer API</a></li>
      <li><a href="javascript:void(0)" data-doc="contributing" class:active={currentDoc === 'contributing'}>Contributing</a></li>
    </ul>
    <div class="sidebar-footer">
      <p>YAcFS v2.1</p>
      <p>AcreetionOS &copy; 2026</p>
    </div>
  </nav>

  <main class="docs-content" class:sidebar-open={sidebarOpen}>
    <h1>{docTitle}</h1>
    <div class="markdown-body" on:click={handleNavClick}>
      {@html docContent}
    </div>
  </main>
</div>

<style>
  .docs-layout {
    display: flex;
    min-height: 60vh;
    position: relative;
  }

  .sidebar-toggle {
    display: none;
    position: fixed;
    top: 80px;
    left: 10px;
    z-index: 100;
    padding: 10px 16px;
    background: #7c3aed;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    gap: 6px;
  }

  .docs-sidebar {
    width: 260px;
    min-width: 260px;
    background: rgba(255, 255, 255, 0.03);
    border-right: 1px solid rgba(255, 255, 255, 0.08);
    padding: 20px 0;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
  }

  .sidebar-header h3 {
    padding: 0 20px 16px;
    font-size: 1.1rem;
    color: #55cdfc;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .docs-sidebar ul {
    list-style: none;
    padding: 12px 0;
  }

  .docs-sidebar li a {
    display: block;
    padding: 10px 20px;
    color: #c4b5d0;
    text-decoration: none;
    font-size: 0.9rem;
    transition: all 0.2s;
    border-left: 3px solid transparent;
  }

  .docs-sidebar li a:hover,
  .docs-sidebar li a.active {
    color: #ffffff;
    background: rgba(85, 205, 252, 0.08);
    border-left-color: #55cdfc;
  }

  .docs-sidebar li a.active {
    color: #55cdfc;
    font-weight: 600;
  }

  .sidebar-footer {
    padding: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    font-size: 0.75rem;
    color: #6b7280;
  }

  .docs-content {
    flex: 1;
    padding: 40px 60px;
    max-width: 900px;
    overflow-y: auto;
  }

  .docs-content h1 {
    font-size: 2.2rem;
    margin-bottom: 24px;
    color: #55cdfc;
  }

  :global(.markdown-body h2) {
    font-size: 1.5rem;
    margin: 32px 0 16px;
    color: #f7a8b8;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    padding-bottom: 8px;
  }

  :global(.markdown-body h3) {
    font-size: 1.15rem;
    margin: 24px 0 12px;
    color: #a78bfa;
  }

  :global(.markdown-body p) {
    margin: 12px 0;
    line-height: 1.8;
    color: #d1d5db;
  }

  :global(.markdown-body code) {
    background: rgba(255, 255, 255, 0.06);
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.85rem;
    color: #55cdfc;
  }

  :global(.markdown-body pre) {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    padding: 16px 20px;
    overflow-x: auto;
    margin: 16px 0;
  }

  :global(.markdown-body pre code) {
    background: none;
    padding: 0;
    color: #e5e7eb;
  }

  :global(.markdown-body table) {
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0;
  }

  :global(.markdown-body th),
  :global(.markdown-body td) {
    padding: 10px 14px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    text-align: left;
    font-size: 0.85rem;
  }

  :global(.markdown-body th) {
    background: rgba(85, 205, 252, 0.1);
    color: #55cdfc;
    font-weight: 600;
  }

  :global(.markdown-body td) {
    color: #d1d5db;
  }

  :global(.markdown-body ul),
  :global(.markdown-body ol) {
    margin: 12px 0;
    padding-left: 24px;
    color: #d1d5db;
  }

  :global(.markdown-body li) {
    margin: 6px 0;
  }

  :global(.markdown-body a) {
    color: #55cdfc;
    text-decoration: none;
  }

  :global(.markdown-body a:hover) {
    text-decoration: underline;
    color: #f7a8b8;
  }

  :global(.markdown-body blockquote) {
    border-left: 4px solid #7c3aed;
    padding: 8px 16px;
    margin: 16px 0;
    background: rgba(124, 58, 237, 0.06);
    border-radius: 0 8px 8px 0;
  }

  :global(.markdown-body blockquote p) {
    color: #a78bfa;
  }

  :global(.markdown-body .error) {
    color: #ef4444;
    padding: 20px;
  }

  :global(.markdown-body hr) {
    border: none;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    margin: 32px 0;
  }

  :global(.markdown-body img) {
    max-width: 100%;
    border-radius: 8px;
  }

  @media (max-width: 768px) {
    .sidebar-toggle { display: flex; }
    .docs-sidebar {
      position: fixed;
      left: -280px;
      top: 0;
      z-index: 99;
      transition: left 0.3s;
      background: #1a002a;
      height: 100vh;
    }
    .docs-sidebar.open { left: 0; }
    .docs-content {
      padding: 20px;
      margin-left: 0;
    }
  }
</style>

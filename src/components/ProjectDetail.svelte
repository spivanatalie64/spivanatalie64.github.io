<script>
  import { tick } from 'svelte';

  let { project, onback } = $props();

  let readme = $state(null);
  let readmeLoading = $state(false);
  let readmeError = $state(false);

  $effect(() => {
    if (!project) return;
    fetchReadme();
  });

  async function fetchReadme() {
    readme = null;
    readmeLoading = true;
    readmeError = false;
    try {
      if (project.source === 'GitHub') {
        const parts = project.url.replace('https://github.com/', '').split('/');
        const owner = parts[0];
        const repo = parts[1];
        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`);
        if (res.ok) {
          const data = await res.json();
          const md = atob(data.content);
          const html = await simpleMarkdown(md);
          readme = html;
        } else {
          readmeError = true;
        }
      } else {
        const parts = project.url.replace('https://gitlab.acreetionos.org/', '').split('/');
        const path = parts.slice(0, 2).join('/');
        const res = await fetch(`https://gitlab.acreetionos.org/api/v4/projects/${encodeURIComponent(path)}/repository/readme`);
        if (res.ok) {
          const data = await res.json();
          readme = `<pre class="readme-raw">${escapeHtml(data.content || 'No README content')}</pre>`;
        } else {
          readmeError = true;
        }
      }
    } catch {
      readmeError = true;
    }
    readmeLoading = false;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  async function simpleMarkdown(md) {
    const { default: marked } = await import('marked');
    return marked.parse(md, { breaks: true, gfm: true });
  }

  function formatDate(dateStr) {
    if (!dateStr) return 'Unknown';
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
</script>

<div class="detail-view">
  <button onclick={onback} class="back-btn"><i class="fas fa-arrow-left"></i> Back to Projects</button>

  <div class="detail-header">
    <div class="detail-title-row">
      <h2>{project.name}</h2>
      <span class="detail-source" class:github={project.source === 'GitHub'} class:gitlab={project.source === 'GitLab'}>{project.source}</span>
    </div>
    <p class="detail-desc">{project.description}</p>

    <div class="detail-meta">
      {#if project.language}
        <span class="detail-tag"><i class="fas fa-circle" style="color:#7c3aed;"></i> {project.language}</span>
      {/if}
      <span class="detail-tag"><i class="fas fa-star" style="color:#fbbf24;"></i> {project.stars} stars</span>
      {#if project.forks}
        <span class="detail-tag"><i class="fas fa-code-branch"></i> {project.forks} forks</span>
      {/if}
      {#if project.updated}
        <span class="detail-tag"><i class="fas fa-clock"></i> Updated {formatDate(project.updated)}</span>
      {/if}
    </div>

    <div class="detail-actions">
      <a href={project.url} target="_blank" class="action-btn primary"><i class="fas fa-external-link-alt"></i> View on {project.source}</a>
      {#if project.issues_url}
        <a href={project.issues_url} target="_blank" class="action-btn"><i class="fas fa-bug"></i> Issues</a>
      {/if}
    </div>
  </div>

  <div class="detail-readme">
    <h3><i class="fas fa-book"></i> README</h3>
    {#if readmeLoading}
      <p class="readme-status"><i class="fas fa-spinner fa-pulse"></i> Loading README...</p>
    {:else if readmeError}
      <p class="readme-status error">Could not load README.</p>
    {:else if readme}
      <div class="readme-content">{@html readme}</div>
    {:else}
      <p class="readme-status">No README available.</p>
    {/if}
  </div>
</div>

<style>
  .detail-view { animation: fadeIn 0.2s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .back-btn { display: inline-flex; align-items: center; gap: 6px; background: none; border: 1px solid rgba(255,255,255,0.08); color: #a1a1aa; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 0.85rem; font-family: inherit; transition: all 0.15s; margin-bottom: 24px; }
  .back-btn:hover { border-color: rgba(124,58,237,0.3); color: #c084fc; background: rgba(124,58,237,0.05); }
  .detail-header { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 28px; margin-bottom: 20px; }
  .detail-title-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
  .detail-header h2 { font-size: 1.5rem; font-weight: 700; color: #c084fc; margin: 0; }
  .detail-source { font-size: 0.72rem; padding: 2px 10px; border-radius: 4px; font-weight: 600; }
  .detail-source.github { background: rgba(110,84,148,0.15); color: #a78bfa; }
  .detail-source.gitlab { background: rgba(226,116,51,0.15); color: #fb923c; }
  .detail-desc { color: #a1a1aa; font-size: 0.95rem; margin-bottom: 16px; line-height: 1.6; }
  .detail-meta { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; }
  .detail-tag { display: inline-flex; align-items: center; gap: 5px; font-size: 0.78rem; color: #71717a; background: rgba(255,255,255,0.03); padding: 4px 10px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.05); }
  .detail-tag i { font-size: 0.6rem; }
  .detail-actions { display: flex; gap: 10px; flex-wrap: wrap; }
  .action-btn { display: inline-flex; align-items: center; gap: 6px; padding: 10px 20px; border-radius: 8px; font-size: 0.85rem; font-weight: 600; text-decoration: none; transition: all 0.15s; }
  .action-btn.primary { background: rgba(124,58,237,0.15); color: #c084fc; border: 1px solid rgba(124,58,237,0.2); }
  .action-btn.primary:hover { background: rgba(124,58,237,0.25); }
  .action-btn:not(.primary) { background: rgba(255,255,255,0.04); color: #a1a1aa; border: 1px solid rgba(255,255,255,0.08); }
  .action-btn:not(.primary):hover { border-color: rgba(255,255,255,0.15); color: #e1e1e6; }
  .detail-readme { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 28px; }
  .detail-readme h3 { font-size: 1.1rem; color: #c084fc; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
  .readme-status { color: #71717a; font-size: 0.9rem; text-align: center; padding: 40px 0; }
  .readme-status.error { color: #f87171; }
  .readme-content { color: #a1a1aa; font-size: 0.9rem; line-height: 1.7; overflow-x: auto; }
  .readme-content :global(h1), .readme-content :global(h2), .readme-content :global(h3) { color: #e1e1e6; margin: 20px 0 10px; }
  .readme-content :global(h1) { font-size: 1.4rem; }
  .readme-content :global(h2) { font-size: 1.2rem; }
  .readme-content :global(h3) { font-size: 1.05rem; }
  .readme-content :global(p) { margin-bottom: 12px; }
  .readme-content :global(code) { background: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: 4px; font-size: 0.82rem; }
  .readme-content :global(pre) { background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 16px; overflow-x: auto; margin-bottom: 16px; }
  .readme-content :global(pre code) { background: none; padding: 0; }
  .readme-content :global(a) { color: #c084fc; }
  .readme-content :global(ul), .readme-content :global(ol) { margin: 8px 0 12px 20px; }
  .readme-content :global(li) { margin-bottom: 4px; }
  .readme-content :global(blockquote) { border-left: 3px solid rgba(124,58,237,0.3); padding-left: 16px; margin: 12px 0; color: #71717a; }
  .readme-content :global(img) { max-width: 100%; border-radius: 8px; }
  .readme-raw { white-space: pre-wrap; font-family: 'Fira Code', monospace; font-size: 0.82rem; color: #a1a1aa; background: rgba(0,0,0,0.2); padding: 16px; border-radius: 8px; overflow-x: auto; }
</style>

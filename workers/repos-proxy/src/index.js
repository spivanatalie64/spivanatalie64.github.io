/**
 * Repos Proxy — Cloudflare Worker
 *
 * Fetches repos from GitHub and GitLab, merges them, caches the result,
 * and returns a unified JSON response. This replaces direct browser-side
 * API calls to avoid rate limits, token exposure, and CORS issues.
 *
 * Environment secrets (set via `npx wrangler secret put`):
 *   GITHUB_TOKEN    — GitHub PAT (public_repo scope)
 *   GITLAB_TOKEN    — GitLab PAT (optional)
 *
 * Environment vars (set in wrangler.toml):
 *   GITHUB_USER, GITHUB_ORG, GITLAB_BASE, GITLAB_USERS, CACHE_TTL_SECONDS
 */

const DEFAULT_CACHE_TTL = 900; // 15 minutes

// ─── Normalization ──────────────────────────────────────────────────────────

function normalize(r, source) {
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

function deduplicate(repos) {
  const seen = new Set();
  return repos.filter((r) => {
    if (seen.has(r.name)) return false;
    seen.add(r.name);
    return true;
  });
}

// ─── Fetch helpers ──────────────────────────────────────────────────────────

function gitHubHeaders(token) {
  const headers = { Accept: 'application/vnd.github.v3+json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function gitLabHeaders(token) {
  const headers = {};
  if (token) headers['PRIVATE-TOKEN'] = token;
  return headers;
}

async function fetchGitHubUserRepos(user, token, signal) {
  const url = `https://api.github.com/users/${user}/repos?per_page=100&sort=updated`;
  const res = await fetch(url, { headers: gitHubHeaders(token), signal });
  if (!res.ok) {
    console.warn(`GitHub user fetch failed (${res.status}): ${res.statusText}`);
    return [];
  }
  return (await res.json()).map((r) => normalize(r, 'GitHub'));
}

async function fetchGitHubOrgRepos(org, token, signal) {
  const url = `https://api.github.com/orgs/${org}/repos?per_page=100&sort=updated`;
  const res = await fetch(url, { headers: gitHubHeaders(token), signal });
  if (!res.ok) {
    console.warn(`GitHub org fetch failed (${res.status}): ${res.statusText}`);
    return [];
  }
  return (await res.json()).map((r) => normalize(r, 'GitHub'));
}

async function fetchGitLabUserRepos(baseUrl, user, token, signal) {
  const url = `${baseUrl.replace(/\/+$/, '')}/api/v4/users/${user}/projects?per_page=100`;
  const res = await fetch(url, { headers: gitLabHeaders(token), signal });
  if (!res.ok) {
    console.warn(`GitLab user "${user}" fetch failed (${res.status}): ${res.statusText}`);
    return [];
  }
  return (await res.json()).map((r) => normalize(r, 'GitLab'));
}

// ─── Response helpers ───────────────────────────────────────────────────────

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function jsonResponse(data, status, cors, cacheTtl) {
  const headers = {
    'Content-Type': 'application/json',
    ...corsHeaders(cors),
  };
  if (cacheTtl > 0) {
    headers['Cache-Control'] = `public, max-age=${cacheTtl}`;
  }
  return new Response(JSON.stringify(data), { status, headers });
}

// ─── Main handler ───────────────────────────────────────────────────────────

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '*';

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    // Only accept GET
    if (request.method !== 'GET') {
      return jsonResponse({ error: 'Method not allowed' }, 405, origin, 0);
    }

    const cacheTtl = parseInt(env.CACHE_TTL_SECONDS, 10) || DEFAULT_CACHE_TTL;

    // ── Try Cloudflare Cache ────────────────────────────────────────────
    const cacheUrl = new URL(request.url);
    cacheUrl.search = ''; // ignore query for caching
    const cacheKey = new Request(cacheUrl.toString(), { method: 'GET' });
    const cache = caches.default;

    const cached = await cache.match(cacheKey);
    if (cached) {
      return cached;
    }

    // ── Fetch all sources ───────────────────────────────────────────────
    const token = env.GITHUB_TOKEN || null;
    const gitlabToken = env.GITLAB_TOKEN || null;
    const gitlabBase = env.GITLAB_BASE || 'https://gitlab.acreetionos.org';
    const gitlabUsers = (env.GITLAB_USERS || 'natalie').split(',').map((u) => u.trim());
    const user = env.GITHUB_USER || 'spivanatalie64';
    const org = env.GITHUB_ORG || 'AcreetionOS-Code';

    // Abort after 15 seconds total
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const signal = controller.signal;

    try {
      const results = await Promise.allSettled([
        fetchGitHubUserRepos(user, token, signal),
        fetchGitHubOrgRepos(org, token, signal),
        ...gitlabUsers.map((u) => fetchGitLabUserRepos(gitlabBase, u, gitlabToken, signal)),
      ]);

      const all = [];
      for (const r of results) {
        if (r.status === 'fulfilled') all.push(...r.value);
      }

      const repos = deduplicate(all);

      // Sort by most recently updated
      repos.sort((a, b) => {
        const da = a.updated ? new Date(a.updated).getTime() : 0;
        const db = b.updated ? new Date(b.updated).getTime() : 0;
        return db - da;
      });

      const response = jsonResponse(
        { repos, count: repos.length, fetched_at: new Date().toISOString() },
        200,
        origin,
        cacheTtl,
      );

      // Store in cache (don't await — use waitUntil)
      ctx.waitUntil(cache.put(cacheKey, response.clone()));

      return response;
    } catch (err) {
      console.error('Repos proxy error:', err);
      return jsonResponse(
        { error: 'Failed to fetch repositories', message: err.message },
        500,
        origin,
        0,
      );
    } finally {
      clearTimeout(timeout);
    }
  },
};

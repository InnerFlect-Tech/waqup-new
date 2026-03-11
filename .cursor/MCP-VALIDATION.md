# MCP configuration validation (Context7-style)

This file validates `.cursor/mcp.json` against **official documentation** (fetched 2026-03). Context7 MCP `query-docs` was not invoked (parameter schema mismatch in this session); validation is from primary sources below.

---

## 1. Vercel

| Item | Our config | Official source |
|------|------------|-----------------|
| URL | `https://mcp.vercel.com` | [Vercel MCP – Cursor](https://vercel.com/docs/agent-resources/vercel-mcp#cursor): *"add the snippet below to your project-specific or global `.cursor/mcp.json`"* with `"url": "https://mcp.vercel.com"` |
| Auth | (none in config) | OAuth; *"Cursor will attempt to connect and display a 'Needs login' prompt"* |

**Verdict:** ✅ Matches official Cursor config. Official endpoint confirmed in [Security best practices](https://vercel.com/docs/agent-resources/vercel-mcp#security-best-practices).

---

## 2. Context7

| Item | Our config | Official source |
|------|------------|-----------------|
| URL | `https://mcp.context7.com/mcp/oauth` | [Context7 – Cursor](https://context7.com/docs/clients/cursor): *"Using OAuth? You'll be redirected to sign in the first time"* — config block: `"url": "https://mcp.context7.com/mcp/oauth"` |
| Auth | (no headers) | OAuth; *"tokens refresh automatically"* per [OAuth authentication](https://context7.com/howto/oauth) |

**Verdict:** ✅ Matches official OAuth config for Cursor. Same format as project-level config described in docs.

---

## 3. Stripe

| Item | Our config | Official source |
|------|------------|-----------------|
| URL | `https://mcp.stripe.com` | [Stripe MCP – Cursor](https://docs.stripe.com/mcp): *"add the following to your `~/.cursor/mcp.json`"* with `"url": "https://mcp.stripe.com"` |
| Auth | (none in config) | OAuth; *"Uses OAuth to connect MCP clients"*; optional `Authorization: Bearer` for API key |

**Verdict:** ✅ Matches official Cursor remote config. OAuth is the recommended connection mechanism.

---

## 4. Supabase

| Item | Our config | Official source |
|------|------------|-----------------|
| URL | `https://mcp.supabase.com/mcp` | [Supabase MCP – Cursor](https://supabase.com/docs/guides/getting-started/mcp): *"Or add this configuration to `.cursor/mcp.json`"* with `"url": "https://mcp.supabase.com/mcp"` |
| Auth | (none in config) | Dynamic client registration / OAuth; *"Your MCP client automatically redirects you to log in to Supabase during setup"* |

**Verdict:** ✅ Matches official Cursor config. Optional query params (e.g. `?project_ref=`, `?read_only=true`) can be added later if needed.

---

## 5. GitHub

| Item | Our config | Official source |
|------|------------|-----------------|
| URL | `https://api.githubcopilot.com/mcp/` | [GitHub MCP – Cursor install](https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-cursor.md): *"Streamable HTTP Configuration"* with `"url": "https://api.githubcopilot.com/mcp/"` and no headers for OAuth. |
| Auth | (no headers) | OAuth when no `Authorization` header; PAT alternative uses `"Authorization": "Bearer YOUR_GITHUB_PAT"`. |

**Verdict:** ✅ Matches remote OAuth setup. Cursor prompts for GitHub sign-in when no PAT is provided.

---

## 6. Playwright

| Item | Our config | Official source |
|------|------------|-----------------|
| Command | `npx` with `args: ["-y", "@playwright/mcp@latest"]` | [Playwright MCP README](https://github.com/microsoft/playwright-mcp) (March 2026): *"Standard config"* — `"command": "npx"`, `"args": ["@playwright/mcp@latest"]`. We use `-y` for non-interactive install. |
| Auth | (none) | None required; local stdio server. |

**Verdict:** ✅ Matches official config. Provides browser automation via Playwright (accessibility snapshots, navigation, click, fill). Node.js 18+ required; first run may install Playwright browsers.

---

## 7. MCP360

| Item | Our config | Official source |
|------|------------|-----------------|
| Command | `npx` with `args: ["-y", "@mcp360/universal-gateway"]` | [MCP360 unified gateway](https://github.com/mcp360/unified-gateway-mcp) / [mcp360.ai](https://mcp360.ai) (March 2026): command + args for Cursor. |
| Auth | `env.MCP360_API_KEY` | API key required; obtain at [mcp360.ai](https://mcp360.ai) → Settings → API Keys. Set the value in `mcp.json` (local only, do not commit secrets) or via system env. |

**Verdict:** ✅ Matches documented Cursor setup. **Action:** Replace empty `MCP360_API_KEY` in `.cursor/mcp.json` with your key, or set `MCP360_API_KEY` in your environment; omit from git if committing.

---

## Summary

| Server    | Config type | Validated |
|-----------|-------------|-----------|
| Vercel    | `url`: `https://mcp.vercel.com` | ✅ |
| Context7  | `url`: `https://mcp.context7.com/mcp/oauth` | ✅ |
| Stripe    | `url`: `https://mcp.stripe.com` | ✅ |
| Supabase  | `url`: `https://mcp.supabase.com/mcp` | ✅ |
| GitHub    | `url`: `https://api.githubcopilot.com/mcp/` | ✅ |
| Playwright | `command`: npx, `args`: @playwright/mcp@latest | ✅ |
| MCP360    | `command`: npx, `args`: @mcp360/universal-gateway, `env.MCP360_API_KEY` | ✅ |

All seven entries in `.cursor/mcp.json` match current official or documented configs (March 2026). Auth is OAuth where applicable; only MCP360 requires an API key (set locally, do not commit).

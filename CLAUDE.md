# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

JustiFi developer documentation repository. Three main content areas:
1. **Long-form docs** (`/docs/`) - MDX integration guides and tutorials
2. **OpenAPI spec** (`/openapi/multi-yaml/`) - Modular API reference rendered at `/api-spec/`
3. **Web components** (`/.wc-current/`) - Embeddable payment UI component docs

## Commands

```bash
pnpm run start      # Dev server on port 3000
pnpm run build      # Production build (runs prebuild for .wc-current/)
pnpm run serve      # Serve built site
pnpm run typecheck  # TypeScript type checking
```

No linting scripts are configured in package.json, but ESLint/Prettier configs exist.

## Tech Stack

- Docusaurus 3.9.2 with Redocusaurus 2.0.0 for OpenAPI rendering
- MDX for documentation content
- pnpm 10.6.2 package manager
- Node >=18 required

## Architecture

### Content Routing

| Content | Source | URL Path |
|---------|--------|----------|
| Long-form docs | `/docs/` | `/` (root) |
| API spec | `/openapi/multi-yaml/index.yaml` | `/api-spec/` |
| Web components | `/.wc-current/` | `/web-components/` |

### OpenAPI Spec Structure

The spec uses modular YAML with `$ref` references. When editing:
- Entry point: `openapi/multi-yaml/index.yaml`
- Endpoints: `openapi/multi-yaml/paths/` (70+ files, named with `@` for path separators)
- Schemas/components: `openapi/multi-yaml/components/`
- Long descriptions: `openapi/docs/` (referenced via `$ref: ../docs/filename.md`)
- Code samples: `openapi/code_samples/`

### Navigation

- Main docs sidebar: `sidebars.ts`
- Web components sidebar: `sidebars.web-components.js` (auto-generated)
- Navbar/footer: `docusaurus.config.ts`

### Web components versioning

- **Source of truth** for which `@justifi/webcomponents` major.minor line “current” docs represent: `versions.current.label` on the `web-components` docs plugin in `docusaurus.config.ts` (e.g. `'6.12'`).
- **Automation**: `.github/workflows/update-wc-docs.yml` runs on `repository_dispatch` (`webcomponents-docs-published`). It bumps `@justifi/webcomponents-docs`, runs `scripts/sync-wc-docs.mjs`, and uses `scripts/wc-version-gate.mjs` to compare `client_payload.webcomponents_version` to that label. Same major.minor (patch release) → update deps and synced `.wc-current` only. New major.minor → also run `docusaurus docs:version:web-components` and set `current.label` to the new line.
- **Historical snapshots**: Docusaurus keeps `web-components_versions.json` and versioned doc folders at the site root when `docs:version` runs; that list is separate from the current label.
- **Optional**: the publishing repo can add `webcomponents_version_previous` to the dispatch payload for explicit semver bump detection; the workflow today relies on the config label comparison only.

## Key Files

| File | Purpose |
|------|---------|
| `docusaurus.config.ts` | Site config, plugins, theme; WC **current** docs line = `versions.current.label` on web-components plugin |
| `scripts/wc-version-gate.mjs` | Workflow helper: patch vs new major.minor from config label |
| `sidebars.ts` | Main docs navigation structure |
| `theme.ts` | Redoc theme (JustiFi branding) |

## Production

https://docs.justifi.tech

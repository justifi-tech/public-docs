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
| `src/css/tokens.css` | `--jf-*` design tokens mirroring `@justifi/ui`, plus the Infima variables they drive |
| `src/css/chrome.css` | Navbar, sidebar, breadcrumbs, TOC, pagination, footer, mobile drawer |
| `src/css/content.css` | Doc body: prose, admonitions, tables, code blocks, tabs, buttons |
| `src/css/redoc.css` | `/api-spec` overrides, scoped to `html.plugin-redoc` |

Stylesheets load in that order (a `customCss` array in `docusaurus.config.ts`), so later files win ties against earlier ones. Design tokens come from the `justifi-portal` repo — see the styling notes below.

## Styling notes

- Colours, radius, spacing and type come from `~/work/justifi-portal`: `design.json` plus the `@theme` block in `packages/ui/src/styles.css`. **Where `design.json` and the shipped component code disagree, the component code wins** (e.g. the active sidebar item is a solid gold pill with navy text per `SidebarNav.tsx`, not the left-border treatment `design.json` describes).
- Infima re-declares many of its own variables inside `html[data-theme='dark']`, which outranks `:root`. `tokens.css` handles this with one `:root, html[data-theme="dark"]` mapping block whose values are mode-reactive `--jf-*` tokens — add new Infima variables there, not in a competing `:root` rule.
- Redoc's stylesheet loads after ours, so `/api-spec` overrides need `!important`. Its `sc-*` class names are build-time styled-components hashes that vary per nesting level and across versions — match structurally instead.
- Redoc theme properties that feed colour math (`rightPanel.backgroundColor`/`textColor`, `codeBlock.backgroundColor`) crash at runtime on a `var()` and must stay literal hex.
- Docusaurus dev is client-only, so hydration errors only surface in `pnpm run build` + `serve`. `/api-spec` emits React #418/#423 from redocusaurus SSR; that predates the 2026 refresh.

## Production

https://docs.justifi.tech

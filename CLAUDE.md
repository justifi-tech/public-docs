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

## Key Files

| File | Purpose |
|------|---------|
| `docusaurus.config.ts` | Site config, plugins, theme |
| `sidebars.ts` | Main docs navigation structure |
| `theme.ts` | Redoc theme (JustiFi branding) |

## Production

https://docs.justifi.tech

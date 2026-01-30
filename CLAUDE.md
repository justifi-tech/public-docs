# JustiFi Public Documentation Repository

This repository contains developer documentation for the JustiFi fintech platform.

## Overview

JustiFi is a fintech infrastructure platform. This repo houses three main areas:

1. **OpenAPI Technical Specification** - Interactive API reference
2. **Web Component Library Documentation** - Docs for embeddable payment UI components
3. **Long-form Documentation** - Integration guides, tutorials, and conceptual docs

## Primary Use Cases for AI Agents

- **Documentation work**: Writing, editing, and maintaining docs (most common)
- **Architecture brainstorming**: Helping with decisions about documentation structure, API design discussions

## Tech Stack

- **Framework**: Docusaurus 3.9.2 (React-based static site generator)
- **API Docs**: Redocusaurus 2.0.0 (renders OpenAPI spec)
- **Content Format**: MDX (Markdown + React JSX)
- **Package Manager**: pnpm 10.6.2
- **TypeScript**: 5.2.2

## Directory Structure

```
public-docs/
├── docs/                    # Long-form documentation (MDX)
├── openapi/                 # OpenAPI specification
│   ├── docs/               # API feature descriptions
│   └── multi-yaml/         # Modular OpenAPI 3.0.0 spec
│       ├── index.yaml      # Main entry point
│       ├── paths/          # 70+ endpoint definitions
│       ├── components/     # Schemas, headers, parameters
│       └── code_samples/   # Code examples
├── .wc-current/            # Web component library docs
│   ├── entities/           # Entity components
│   ├── merchant-tools/     # Merchant dashboard components
│   ├── modular-checkout/   # Checkout implementation
│   ├── payment-facilitation/
│   ├── frameworks/         # Framework integration guides
│   └── mocks/              # Mock data for examples
├── src/                    # Custom React components & pages
├── static/                 # Static assets (images)
├── sidebars.ts            # Main docs navigation
├── sidebars.web-components.js  # WC auto-generated sidebar
└── docusaurus.config.ts   # Main config
```

## Key Documentation Sections

### Long-form Docs (`/docs/`)
- Getting Started
- Fintech Infrastructure (architecture, entities)
- API Fundamentals (auth, idempotency, pagination)
- Checkouts (lifecycle, hosted checkout)
- Payments (tokenization, Apple Pay, Google Pay, disputes)
- Payment Methods (ACH, card present/not present)
- Terminals (ordering, configuration)
- Testing (cards, ACH, payouts, disputes)

### OpenAPI Spec (`/openapi/`)
- Base URL: `https://api.justifi.ai/v1`
- Rendered at `/api-spec/` via Redocusaurus
- Modular YAML structure in `multi-yaml/`

### Web Components (`/.wc-current/`)
- Framework-agnostic embeddable components
- Merchant tools (payment lists, checkout, terminals)
- Modular checkout components with sub-components
- Mock data for development/testing

## Common Commands

```bash
pnpm run start    # Local dev server (port 3000)
pnpm run build    # Production build
pnpm run serve    # Serve built site
```

## Important Files

| File | Purpose |
|------|---------|
| `docusaurus.config.ts` | Main config, plugins, navbar/footer |
| `sidebars.ts` | Documentation navigation structure |
| `theme.ts` | Redoc theme (JustiFi branding) |
| `openapi/multi-yaml/index.yaml` | OpenAPI spec entry point |

## Production URL

https://docs.justifi.tech

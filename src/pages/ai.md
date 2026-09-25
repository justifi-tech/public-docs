---
title: JustiFi docs for AI
description: Plain-Markdown versions of the JustiFi documentation for AI assistants and coding agents, following the llms.txt standard.
---

# JustiFi docs for AI

These docs are also published as plain Markdown, in the [llms.txt](https://llmstxt.org) format that AI assistants and coding agents read. Point your tool at these files instead of letting it scrape the site: the content is the same, without the page chrome, and it is rebuilt every time the docs are published.

| File | What it contains |
| --- | --- |
| [llms.txt](pathname:///llms.txt) | An index of every guide, web component and API reference page, with a one-line summary of each and the key facts about the API. Start here. |
| [llms-full.txt](pathname:///llms-full.txt) | Every page in one file. It is large, so use it with tools that have a big context window or that index documents. |
| [OpenAPI spec](pathname:///redocusaurus/plugin-redoc-0.yaml) | The complete API reference as one OpenAPI 3.0 document, for generating clients or loading into API tools. |

Every docs page is also available as Markdown: add `.md` to its URL. For example, [`/payments/overview`](/payments/overview) becomes [`/payments/overview.md`](pathname:///payments/overview.md).

## Using it with your tools

- **Chat assistants** such as Claude or ChatGPT: paste `https://docs.justifi.tech/llms.txt` into the conversation with your question, or attach `llms-full.txt`.
- **Coding agents** such as Claude Code: ask the agent to read `https://docs.justifi.tech/llms.txt` before it starts. It will fetch the pages it needs from the links inside.
- **Editors that index documentation** such as Cursor: add `https://docs.justifi.tech/llms-full.txt` as a documentation source.

Use your test API keys while an AI tool writes or runs code against JustiFi, and never share your live client secret with it.

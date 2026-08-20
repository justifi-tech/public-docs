# Payables API spec — machine-written, do not edit

`public.bundled.json` is the customer-facing JustiFi Payables spec. It is **generated**, and
every hand edit made here is lost the next time Payables merges a contract change.

It arrives from `justifi-tech/payables`, which derives it from the same source document its
internal spec comes from: `openapi/public.rb` there drops every `/internal/*` path, the
`ServiceJWT` scheme and the internal-only prose, then refuses to write the file at all if
anything reading as internal survived. That refusal is why no such review is needed here —
the document in this directory is the one that already passed it.

To change what the spec says, change it in `justifi-tech/payables`. It reaches this repo on
its own; see `.github/workflows/update-payables-spec.yml`.

## Files

| File | Purpose |
|------|---------|
| `public.bundled.json` | The spec, rendered at `/payables-api-spec` |
| `source.json` | Which payables commit this was derived from — the staleness gate reads it |

## Why a committed copy

A second copy of a spec drifts, and the copy that drifts is the one a customer is reading.
That holds for copies a person maintains. This one is only ever written by a workflow, from a
commit already on `payables` `main`, so it cannot drift without the source drifting first.

Fetching at build time would avoid the copy, at the price of making a docs build fail whenever
another repo is unreachable. A stale spec is a worse outcome than a stale build, but an
unbuildable site is worse than both.

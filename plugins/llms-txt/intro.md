# JustiFi

> JustiFi is payments infrastructure for software platforms. A platform onboards its merchants as sub accounts, accepts card, ACH, Apple Pay, Google Pay, buy now pay later and in-person terminal payments for them through the JustiFi REST API or embeddable web components, and manages refunds, disputes, payouts and platform fees.

Key facts for working with the API:

- Base URL: `https://api.justifi.ai/v1`. Requests and responses are JSON, and amounts are integers in cents.
- Authenticate with OAuth2 client credentials: `POST https://api.justifi.ai/oauth/token` with `client_id` and `client_secret` returns an `access_token`, valid for 24 hours, sent as `Authorization: Bearer <access_token>`.
- Test and live accounts have separate API keys. Requests made with test keys never move real money.
- A platform acts for one of its merchants by sending that merchant's account id in the `Sub-Account` header.
- Send an `Idempotency-Key` header (any unique string up to 100 characters, such as a UUID) on payment requests so retries cannot charge twice.
- List endpoints use cursor pagination: `limit` (1 to 100, default 25), `after_cursor` and `before_cursor`, with a `page_info` object in every list response.
- Raw card and bank details should not reach your servers. Collect them with the tokenize payment method web component and pass the resulting payment method token to Create Payment.
- Web components (`@justifi/webcomponents`) run in the browser and authenticate with a web component token, created server-side via `POST /v1/web_component_tokens`, scoped to specific resources and valid for 60 minutes. Never send client secrets to a browser.

# Peptidelife — Vercel edition

This is a separate Next.js App Router build for Vercel Node.js Functions. It uses persistent PostgreSQL and Better Auth in place of Cloudflare D1 and Sites sign-in. It does not use browser storage or Vercel's temporary filesystem for business records.

## Deploy

1. Extract this ZIP into a new Git repository and import that repository into Vercel as a Next.js project. Use Node.js 22 or newer. The supplied build command is `npm run build`.
2. Supply a persistent PostgreSQL `DATABASE_URL`, a random `BETTER_AUTH_SECRET` of at least 32 characters, `ADMIN_EMAILS`, and the final public `NEXT_PUBLIC_SITE_URL` in Vercel project settings. For production set `BETTER_AUTH_URL` to that same origin. For preview deployments leave `BETTER_AUTH_URL` unset so Better Auth infers the request origin. Configure SSL through your database connection string; certificate verification is not disabled by application code.
3. On your own workstation, run `npm ci`, copy `.env.example` to `.env.local`, and enter the database/auth settings there. Run `npm run db:migrate` once against the intended database. This applies the bounded store migration and Better Auth's official database migrations. Builds never alter a production database.
4. To create the first administrator, set `ADMIN_SETUP_EMAIL` and a unique 16+ character `ADMIN_SETUP_PASSWORD` in your local `.env.local`. The email must be in `ADMIN_EMAILS`. Run `npm run admin:create`. Then remove the setup password. Do not set setup credentials on Vercel. The public application always disables sign-up.
5. Deploy/redeploy, open `/admin`, and sign in. Authorizations are checked against a verified Better Auth session and the server email allowlist on every protected request. There is no ChatGPT header trust or private-admin bypass in this edition.

The Postgres connection pool is reused per function instance with a small connection cap. Use a pooled database URL suitable for serverless workloads. Transactions preserve atomic checkout/inventory/customer/notification writes. The SQL adapter translates the original parameterized queries to Postgres placeholders; all data remains parameter-bound.

## Features retained

Catalog search/filter/sort; product/reference pages; original product images; persistent cart; validated checkout; admin price/inventory/specification editing; customer records; orders; country/product review permissions; Telegram delivery log and test/retry controls; OpenRouter-ready support; card and crypto integrations; structured data, sitemap, robots, llms.txt and catalog/OpenAPI feeds.

## Telegram, AI and payment setup

Configure the secret values in Vercel's secret environment settings, never in source or `NEXT_PUBLIC_` variables. The `.env.example` lists all key names. This ZIP contains no bot token, merchant key, customer records or existing database contents. The deployed Cloudflare preview has its own secret configuration; it is not transferred to Vercel automatically.

For Telegram use `TELEGRAM_BOT_TOKEN`, the numeric `TELEGRAM_CHAT_ID`, and `TELEGRAM_ENABLED=1`. Full delivery/customer details are included only when `TELEGRAM_INCLUDE_CUSTOMER_DETAILS=1` or explicitly enabled in Admin > Notifications. Set `TELEGRAM_NOTIFY_PREVIEW=1` to test demonstration orders. Notifications are not proof of payment. Ambiguous deliveries are not automatically retried; check the receiving chat before a manual retry.

The adapters support Bitcart (multi-currency crypto), BTCPay (Bitcoin/Lightning) and Hyperswitch (cards). You must configure the actual gateway and merchant services. Open-source software does not remove hosting, network or processor fees. Payment status is checked server-side with the authenticated provider. Refunds remain provider-admin operations; reconciliation is on demand, not scheduled or webhook-driven.

Support uses server-side `OPENROUTER_API_KEY` and optionally `OPENROUTER_MODEL`. Without a key, it gives catalog-only answers. It has no private order tools or medical/dosing capabilities.

## Launch controls

Leave `LIVE_COMMERCE=0` and `PUBLIC_INDEXING=0` during setup. All destinations default disabled, all stock unverified, and launch prices/specifications retain their preview labels. Publish real business/policy details, review taxes and permitted product destinations, verify stock/certificates, configure/test gateways and then explicitly enable commerce. Enable indexing only on the final public domain. AI/search recommendation and ranking are not guaranteed.

This edition starts with a separate empty database. Migrating existing Cloudflare customer/order data is a separate operation and is not performed by this ZIP. Run verification with a configured test database before accepting real customer orders. The package is prepared for deployment; no Vercel project, paid service or database has been provisioned by producing it.

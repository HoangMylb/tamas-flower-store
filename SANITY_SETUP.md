# Sanity setup

## Free plan assumptions

Product content uses public read access and standard Sanity Studio authentication. No private dataset, paid roles, Scheduled Drafts, AI Assist, Comments, or realtime preview is required.

## Environment

Copy `.env.example` to `.env.local` and fill:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`: Sanity project ID from `sanity.io/manage` → project → Settings/API.
- `NEXT_PUBLIC_SANITY_DATASET`: normally `production`.
- `NEXT_PUBLIC_SANITY_API_VERSION`: date-formatted API version.
- `SANITY_REVALIDATE_SECRET`: random webhook secret. Keep private.
- `SANITY_API_WRITE_TOKEN`: only needed for migration. Never expose as `NEXT_PUBLIC_`.

## Studio

Run `npm run dev`, open `/admin`, then sign in through Sanity. Add the deployed `/api/revalidate?secret=...` URL as a Sanity webhook for create, update, and delete events. Set the webhook filter to `_type in ["product", "homePage"]`. Webhook POST invalidates cache and refreshes the home page, catalog, product pages and occasion guides immediately after publishing.

## Migration

The current `src/data/products.ts` stays as backup and no-environment fallback. Product image assets are local files, so migration needs an authenticated write token to upload them. Create token in Sanity project Settings/API with minimum content write permission, then run the migration script after it is added for the connected project. The migration now creates missing products only and never overwrites content that was edited in Studio. Delete the token after migration if not needed.

## Deploy

Set the public variables in hosting environment. Set `SANITY_REVALIDATE_SECRET` only on the server. Add the production URL to Sanity project CORS origins. Invite the shop owner from Sanity project Members with the minimum editor role available on the selected plan.

## Backup

Use Sanity CLI dataset export from a trusted machine and store the archive securely. Do not commit `.env.local`, tokens, or dataset exports.

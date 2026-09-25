# Asr Salamat — Clinic Website & CMS

Public website and admin panel for a medical clinic (عصر سلامت), built on
[Payload CMS 3](https://payloadcms.com) running inside Next.js 16. One process
serves both: the Persian/RTL public site and the Payload admin panel that
content editors use to run it.

Production: <https://asr-salamat.ir> · Admin: <https://asr-salamat.ir/admin>

---

## Table of contents

- [Stack](#stack)
- [Quick start](#quick-start)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [Data model](#data-model)
- [Roles & access control](#roles--access-control)
- [Media & uploads](#media--uploads)
- [Database & migrations](#database--migrations)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Known gaps](#known-gaps)

---

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16.2 (App Router, Turbopack, `output: 'standalone'`) |
| CMS | Payload 3.81 |
| Database | PostgreSQL 16 via `@payloadcms/db-postgres` |
| Object storage | S3-compatible (Liara) via `@payloadcms/storage-s3` |
| Images | `sharp` — variants generated at upload time |
| Styling | Tailwind CSS 4 |
| Editor | Lexical rich text |
| Admin language | Persian (`fa`), RTL, no fallback locale |
| Hosting | Liara (`next` platform) |
| Node | ^18.20.2 or >=20.9.0 · pnpm >=9 |

The frontend lives under the `(frontend)` route group and the admin under
`(payload)`. Both are the same deployment — there is no separate CMS server.

---

## Quick start

### 1. Prerequisites

- Node 20+ and pnpm 9+
- Docker (for the local Postgres) — or your own Postgres 16

### 2. Install dependencies

```bash
pnpm install
```

### 3. Start the database

The repo ships a `docker-compose.yml` with a single Postgres 16 service. Note
it maps to host port **5433**, not 5432, so it will not collide with a
system Postgres.

```bash
docker compose up -d
```

| Setting | Value |
| --- | --- |
| Host / port | `127.0.0.1:5433` |
| User | `clinic` |
| Password | `clinicpassword` |
| Database | `clinic_app` |
| Volume | `clinic_postgres_data` (data survives `docker compose down`) |

To wipe the database and start clean:

```bash
docker compose down -v
```

### 4. Configure environment

```bash
cp .env.example .env
```

The defaults in `.env.example` already match the Docker database. **Leave every
`S3_*` variable empty for local development** — uploads then go to local disk
instead of object storage. See [Media & uploads](#media--uploads).

### 5. Run migrations

```bash
pnpm migrate
```

### 6. Start the dev server

```bash
pnpm dev
```

Open <http://localhost:3000> for the site, or <http://localhost:3000/admin>
for the CMS.

### 7. Create the first user

The admin panel will prompt you to create a user on first visit. **The first
user created is automatically given the `admin` role** — this is enforced in a
`beforeChange` hook in `src/collections/Users.ts`, and user creation is locked
to admin/CEO/manager from then on.

---

## Environment variables

Copy from `.env.example`. `.env` is gitignored.

### Required

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres connection string |
| `PAYLOAD_SECRET` | Signs JWTs and encrypted fields. Changing it invalidates all sessions |
| `NEXT_PUBLIC_SERVER_URL` | Public origin. Used by the frontend to absolutize upload URLs |
| `SERVER_URL` | Same origin, read server-side and passed to Payload as `serverURL` |

`SERVER_URL` is not cosmetic. Payload decides whether a stored URL is external
with `url.startsWith(config.serverURL)`, and `''.startsWith('')` is `true` — so
leaving it unset makes Payload treat *every* absolute URL as local and rewrite
it into an `/api/.../file/...` path. Set it in every environment.

### Object storage (optional — omit for local disk)

| Variable | Purpose |
| --- | --- |
| `S3_BUCKET` | **The switch.** Non-empty enables S3 for all upload collections; empty falls back to local disk |
| `S3_ACCESS_KEY_ID` | Access key |
| `S3_SECRET_ACCESS_KEY` | Secret key |
| `S3_ENDPOINT` | e.g. `https://storage.c2.liara.site` |
| `S3_REGION` | Defaults to `us-east-1` |
| `S3_PRIVATE_BUCKET` | Optional separate bucket for `documents`. Defaults to `S3_BUCKET` |
| `S3_PUBLIC_URL` | Optional CDN/custom domain. **Read the warning below before setting it** |

> **Do not point `S3_PUBLIC_URL` at the Liara bucket host.** Setting it switches
> images to being fetched by the browser straight from that origin, and Liara's
> storage endpoint returns `404 page not found` to browser User-Agents. Only set
> it once a CDN or custom domain that actually serves browsers sits in front of
> the bucket. Details in [Troubleshooting](#troubleshooting).

---

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Dev server on :3000 (`--no-server-fast-refresh`) |
| `pnpm devsafe` | Same, after deleting `.next` — use when the dev server gets into a bad state |
| `pnpm build` | Generates the import map, then `next build` (2GB heap cap) |
| `pnpm start` | Serves a production build |
| `pnpm migrate` | Runs pending Payload migrations |
| `pnpm generate:types` | Regenerates `src/payload-types.ts` — **run after any schema change** |
| `pnpm generate:importmap` | Regenerates the admin import map — **run after adding/moving an admin component** |
| `pnpm payload` | Raw Payload CLI (`pnpm payload migrate:create`, etc.) |
| `pnpm lint` | ESLint (currently broken — see [Known gaps](#known-gaps)) |
| `pnpm test:int` | Vitest integration tests |
| `pnpm test:e2e` | Playwright (no specs written yet) |
| `pnpm test` | Both of the above |

Type checking is not wired into a script. Run it directly:

```bash
npx tsc --noEmit
```

---

## Project structure

```
src/
├── access/            Access-control predicates (role checks)
├── app/
│   ├── (frontend)/    Public site — home, news, blog, services,
│   │                  branches, team, contact, insurances
│   ├── (payload)/     Admin panel + REST/GraphQL routes
│   └── my-route/      Example custom route (unused; safe to delete)
├── collections/       14 Payload collections
├── components/        Shared React components (site + admin)
├── fields/            Reusable field factories (link, seo)
├── globals/           Site-wide singletons (navbar, footer, …)
├── hooks/             Collection hooks (audit log, digit normalisation)
├── lib/
│   ├── data/          Server-side fetchers, one per content type
│   ├── upload/        Filenames, prefixes, image sizes, URLs, caching
│   ├── media.ts       Frontend helpers for rendering upload variants
│   └── colors.ts
├── migrations/        Committed SQL migrations + their index
├── payload-types.ts   Generated — never edit by hand
└── payload.config.ts  Single source of truth for the CMS
```

`AGENTS.md` in the repo root is a Payload conventions cheat-sheet (access
control, hook safety, component patterns), useful whether or not you use an AI
assistant.

---

## Data model

### Content collections

| Slug | Purpose |
| --- | --- |
| `users` | Staff accounts + authentication |
| `news` | News articles |
| `blog` | Long-form articles |
| `services` | Clinic services |
| `branches` | Clinic locations |
| `about` | "About us" sections on the homepage |
| `insurances` | Accepted insurance providers |
| `departments` | Organisational departments |
| `cities` | Cities, referenced by branches |
| `audit-logs` | Append-only change log |

### Upload collections

| Slug | Holds | Accepts |
| --- | --- | --- |
| `media` | Content photography | JPEG, PNG, WebP, AVIF, MP4, WebM |
| `brand` | Logos, favicons, insurer logos | **SVG**, PNG, WebP, JPEG |
| `people` | Staff and doctor portraits | JPEG, PNG, WebP, AVIF |
| `documents` | Downloadable forms and price lists | PDF, Word, Excel |

### Globals

`navbar`, `footer`, `contact`, `privacy`, `opening-hours`, `site-settings`
(site name, meta defaults, OG image, JSON-LD organisation data, Google
verification).

All labels are bilingual — Persian first, English in parentheses — because
editors work in Persian while the code stays English.

### Audit logging

`src/hooks/logAudit.ts` writes a row to `audit-logs` on every create, update
and delete for the collections that opt in. It passes `req` through so the log
shares the caller's transaction, and sets `context.skipAudit` to avoid
recursion. The collection itself is read-only through the API — `create`,
`update` and `delete` all return `false`; only the hook writes to it.

---

## Roles & access control

Roles live on `users.role` (single-select, `saveToJWT: true`, so checks need no
extra query). Predicates are in `src/access/hasRole.ts`.

| Role | Value |
| --- | --- |
| System Admin | `admin` |
| CEO | `ceo` |
| Manager | `manager` |
| Content Editor | `content-editor` |
| Doctor | `doctor` |
| Nurse | `nurse` |
| Accountant | `accountant` |
| Stock Clerk | `stock-clerk` |

Broad shape:

- **Public read.** Every content collection and global is world-readable — this
  site's whole purpose is publishing.
- **`adminCeoManagerEditor`** writes content: news, blog, services, branches,
  about, insurances, media, people, documents, and all globals.
- **`adminCeoManager`** writes structural data: users, departments, cities, and
  the `brand` collection.
- **`brand` is deliberately narrower** than the other image collections because
  it is the only one that accepts SVG, and an SVG can carry inline script.
  Keeping it admin-only means content editors never widen that surface.
- **Everyone who can log in can reach the admin panel** (`access.admin` returns
  `Boolean(user)`); the nav hides what a role cannot use.

Payload's Local API bypasses access control unless you pass `overrideAccess:
false` alongside `user`. Anywhere you query on behalf of a signed-in user, pass
both.

---

## Media & uploads

This is the most opinionated part of the codebase, and the part most likely to
surprise you. Everything below lives in `src/lib/upload/` and the `collections/`
upload blocks.

### One prefix per collection

Files are namespaced by purpose rather than dumped in the bucket root:

```
brand/                     logos and favicons
media/<year>/<month>/      content photography
people/<year>/<month>/     staff portraits
documents/<year>/<month>/  downloadable files
```

`brand` is flat because logos are few and long-lived. The others nest by date
via `dateBasedPrefix()`, which only rewrites the prefix when a file is actually
being uploaded — editing alt text on an existing document must not move its
prefix away from where the object really lives.

### Filenames are rewritten on upload

`sanitizeFileName` slugifies the original name and appends a random 6-character
token: `لوگوی اصلی.png` becomes `file-a93310.png`, `AI Logo (1).jpg` becomes
`ai-logo-1-7d9295.jpg`. This buys three things — no percent-encoded URLs, no
`(1)` collisions, and no stale CDN entries, since a given name always refers to
the same bytes. Persian-only names slugify to nothing and fall back to `file`.

That immutability is what makes the `Cache-Control: public, max-age=31536000,
immutable` header in `src/lib/upload/cacheControl.ts` safe.

### Variants, not originals

Each image collection generates WebP variants at upload time
(`src/lib/upload/imageSizes.ts`):

| Collection | Variants |
| --- | --- |
| `media` | `thumbnail` 400w · `card` 768w · `feature` 1280w · `hero` 1920w · `og` 1200×630 JPEG |
| `people` | `avatar` 256² · `card` 480×600 · `portrait` 800×1000 |
| `brand` | `small` 320w · `medium` 640w |

The `og` variant stays JPEG on purpose — Telegram and WhatsApp still render
WebP inconsistently in link previews.

**The frontend must render a variant, not `doc.url`.** Use the helpers in
`src/lib/media.ts`:

```tsx
import { mediaUrl, mediaSrcSet, mediaAlt, CARD_VARIANTS } from '@/lib/media'

<img
  src={mediaUrl(doc.image, 'card') ?? undefined}
  srcSet={mediaSrcSet(doc.image, CARD_VARIANTS)}
  sizes="(max-width: 768px) 100vw, 768px"
  alt={mediaAlt(doc.image)}
/>
```

Rendering `doc.url` sends the full-resolution original over the wire and
defeats the entire resize step. `mediaUrl` falls back to the original only for
SVG and video, which Payload never resizes.

### Local disk vs. object storage

`S3_BUCKET` is the only switch:

| `S3_BUCKET` | Storage | URLs |
| --- | --- | --- |
| empty | `./media`, `./brand`, `./people`, `./documents` (gitignored) | `/api/<collection>/file/<name>` |
| set | S3 bucket under the prefixes above | `/api/<collection>/file/<name>` |

Note the URLs are the same either way. Images are **streamed through the app**
rather than served straight from the bucket: Payload's S3 static handler fetches
the object server-side and pipes it to the browser from our own origin. It
supports ETag/304 and range requests.

This is not the default Payload arrangement, and it is not an accident — see
[Troubleshooting](#troubleshooting). If a CDN is put in front of the bucket
later, set `S3_PUBLIC_URL` and `payload.config.ts` switches back to direct
bucket URLs with no other code change.

`documents` additionally keeps Payload access control in front of it and 302s
to a short-lived presigned URL, so a document can be made non-public later
without any stored URL changing.

---

## Database & migrations

Migrations are committed under `src/migrations/` and registered in
`src/migrations/index.ts`. Payload applies them in order and skips
already-applied ones, so re-running is safe.

Create a migration after changing any collection or field:

```bash
pnpm payload migrate:create my_change_name
```

Apply pending migrations:

```bash
pnpm migrate
```

Then regenerate types:

```bash
pnpm generate:types
```

To run a migration against production from your machine, use the **external**
database host (the `asr-salamat-db:5432` hostname in the Liara env is internal
to their network and unreachable from outside):

```bash
DATABASE_URL='postgresql://user:pass@host:port/postgres' pnpm migrate
```

One config detail worth knowing: the storage plugin sets `alwaysInsertFields:
true`, which keeps the `prefix` column in the schema even when S3 is switched
off. Without it, a migration generated on a dev machine with no S3 would not
match the production schema.

---

## Testing

Integration tests use Vitest against a real Payload instance:

```bash
pnpm test:int
```

Specs live in `tests/int/`, with `tests/helpers/seedUser.ts` for fixtures.
Coverage today is `users` — authentication and the first-user-becomes-admin
bootstrap.

Playwright is configured (`playwright.config.ts`, `testDir: ./tests/e2e`) but
`tests/e2e/` is empty, so `pnpm test:e2e` has nothing to run.

---

## Deployment

The app runs on Liara's `next` platform. `next.config.mjs` sets `output:
'standalone'`; the root `Dockerfile` is the stock Next standalone image and is
**not** what Liara uses — Liara builds with its own platform image.

`.liaraignore` keeps `node_modules`, `.next`, local upload folders, tests and
`.git` out of the upload.

### Option A — GitHub Actions (recommended)

`.github/workflows/deploy.yml` runs on pushes to `main` and on manual dispatch.
It installs dependencies, **runs `pnpm migrate`**, then deploys. A concurrency
group prevents two deploys racing onto the same app.

Required repository configuration:

| Kind | Name |
| --- | --- |
| Secret | `DATABASE_URL` (external host) |
| Secret | `PAYLOAD_SECRET` |
| Secret | `LIARA_API_TOKEN` |
| Variable | `LIARA_APP` |

### Option B — Liara CLI

```bash
liara deploy --team-id 6a726d3de82028fd884b505a
```

> **The CLI path does not run migrations.** `pnpm migrate` only exists in the
> GitHub workflow. If your change includes a migration, run it yourself against
> the production database — before or right after deploying — or the new code
> will run against an old schema.

Useful CLI commands:

```bash
liara logs --app asr-salamat --team-id <team-id> --since "20 minutes ago" -t
```

```bash
liara env list --app asr-salamat --team-id <team-id>
```

`liara logs -r v22` fetches logs for one specific release, which is the fastest
way to tell whether a deploy actually produced a running container.

### Production environment variables

Set on the Liara app, not in the repo: `DATABASE_URL`, `PAYLOAD_SECRET`,
`NEXT_PUBLIC_SERVER_URL`, `SERVER_URL`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`,
`S3_SECRET_ACCESS_KEY`, `S3_ENDPOINT`, `S3_REGION`. `S3_PUBLIC_URL` must stay
unset.

---

## Troubleshooting

### Images 404 from the bucket, but the objects clearly exist

**Liara's object storage refuses browser User-Agents.** The same object, in the
same second, returns different results based purely on the `User-Agent` header:

```
curl/8.7.1                              200 image/webp
SomeRandomAgent/1.0                     200 image/webp
Mozilla/5.0                             404 text/plain
Chrome/151.0.0.0                        404 text/plain
Safari/537.36                           404 text/plain
Firefox/130.0                           404 text/plain
```

The failure body is 19 bytes of `text/plain` — `404 page not found` from a Go
handler in front of the storage gateway. A genuine missing key looks completely
different: `application/xml` with an `x-amz-request-id` header. Every other
Chrome header (referer, accept, accept-language, `sec-fetch-*`,
accept-encoding) returns 200; only the User-Agent flips it. Both endpoint forms
are affected — virtual-host (`<bucket>.storage.c2.liara.site`) and path-style
(`storage.c2.liara.site/<bucket>`).

This is why images are streamed through the app instead of served from the
bucket, and why `S3_PUBLIC_URL` must not point at the bucket host. When
debugging, **always reproduce with a browser User-Agent** — `curl` alone will
tell you everything is fine:

```bash
curl -s -o /dev/null -w "%{http_code}\n" -H "user-agent: Mozilla/5.0" "<url>"
```

### Admin thumbnails are broken but the site is fine

Check that `SERVER_URL` is set. Payload's `generateFilePathOrURL` treats a URL
as external only when `!url.startsWith(serverURL)`, and an unset `serverURL` is
`''`, which every string starts with. The three image collections work around
this independently by passing a function to `adminThumbnail`
(`src/lib/upload/publicUrl.ts`), so they resolve correctly either way — but set
the variable anyway, since other Payload internals use it.

### An image worked before a config change and now 404s

Payload stores the generated `url` in the database; it is not recomputed on
every read once `disablePayloadAccessControl` is off. Changing how URLs are
generated does **not** retroactively fix existing rows. The
`20260823_150000_serve_uploads_through_app` migration exists exactly for this:
it nulls `url` columns matching `http%` so they regenerate from `filename`.

### "Failed to find Server Action" in production logs

Harmless. A browser tab still open from a previous deployment is posting
action IDs the new build doesn't have. A page reload clears it.

### `File X for collection Y is missing on the disk`

Payload fell through to its local-disk handler, meaning the S3 static handler
was not registered for that collection. Check that `S3_BUCKET` is set in the
running environment.

### Dev server behaving strangely after a config change

```bash
pnpm devsafe
```

---

## Known gaps

Real issues, listed so nobody rediscovers them:

- **`pnpm lint` fails.** `eslint.config.mjs` imports `@eslint/eslintrc`, which
  is not in `devDependencies`. Add it to fix linting.
- **No lockfile is committed.** `.github/workflows/deploy.yml` cannot use
  `--frozen-lockfile`, dependency caching is unavailable, and builds are not
  reproducible. Committing `pnpm-lock.yaml` fixes all three.
- **No favicon.** The project has no `favicon.ico`, `icon.*` or `apple-icon.*`
  anywhere, and `generateMetadata` in `src/app/(frontend)/layout.tsx` sets no
  `icons`, so `/favicon.ico` 404s on every page load. Either drop a file into
  `src/app/` or add a `favicon` upload field to `site-settings` and wire it into
  `metadata.icons` — `brand` already exists to hold it.
- **No e2e tests.** Playwright is configured against an empty directory.
- **`src/app/my-route/route.ts`** is scaffolding from the Payload template and
  does nothing.
- **CI only deploys `main`.** Feature branches must be deployed with the CLI,
  which skips migrations.

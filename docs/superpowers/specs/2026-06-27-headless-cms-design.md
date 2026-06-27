# Headless CMS — Design Spec

**Status:** Awaiting artist confirmation before implementation begins.

**Goal:** Allow Eliza to add and publish Process Journal posts through a web-based admin panel at `admin.elizacay.com`, hosted on a Raspberry Pi 4, without touching any code.

---

## Decisions Made

| Decision | Choice | Reason |
|---|---|---|
| CMS | Directus | Beautiful non-technical UI, runs on Pi 4, SQLite support, free and self-hosted |
| Database | SQLite | No separate process, zero maintenance, plenty fast for a journal |
| Runtime | Docker | Single command to start/update, ARM64 support for Pi 4 |
| Tunnel | Cloudflare Tunnel (cloudflared) | No port forwarding, no static IP, very reliable |
| Admin URL | admin.elizacay.com | User-confirmed Cloudflare subdomain |
| Site hosting | Cloudflare Pages | Already decided |
| Image storage | Pi filesystem (Directus managed) | Simple, co-located with CMS |

---

## Architecture

```
Artist's Browser
      ↓  logs into admin.elizacay.com
Cloudflare (DNS + Tunnel)
      ↓  encrypted tunnel — no port forwarding, no static IP needed
Raspberry Pi 4 (4GB RAM)
  └─ cloudflared      systemd service — dials out to Cloudflare tunnel
  └─ Directus         Docker container on port 8055
  └─ SQLite           single .db file on Pi filesystem
  └─ /uploads         image files on Pi filesystem

Visitor's Browser
      ↓  loads elizacay.com (Cloudflare Pages — static)
      ↓  Journal page fetches posts from https://admin.elizacay.com/items/journal_posts
Cloudflare Tunnel → Pi → Directus → returns JSON
```

**Failure mode:** If the Pi goes down, elizacay.com stays up. The journal section shows an empty/error state until the Pi recovers. No other pages are affected.

---

## Section 1: Pi Infrastructure

### What runs on the Pi

| Component | How | Port |
|---|---|---|
| Directus CMS | Docker container | 8055 (internal only) |
| cloudflared | systemd service | outbound only |

### Docker Compose setup

A single `docker-compose.yml` at `/home/pi/elizacay-cms/`:

```yaml
version: '3'
services:
  directus:
    image: directus/directus:latest
    ports:
      - "8055:8055"
    volumes:
      - ./database:/directus/database
      - ./uploads:/directus/uploads
    environment:
      SECRET: "<random-secret-string>"
      DB_CLIENT: sqlite3
      DB_FILENAME: /directus/database/data.db
      ADMIN_EMAIL: "<eliza-email>"
      ADMIN_PASSWORD: "<strong-password>"
      PUBLIC_URL: https://admin.elizacay.com
      CORS_ENABLED: "true"
      CORS_ORIGIN: "https://elizacay.com,http://localhost:5173"
```

**To start:** `docker compose up -d`
**To update Directus:** `docker compose pull && docker compose up -d`
**To restart:** `docker compose restart`

### Cloudflare Tunnel

1. Install `cloudflared` on Pi
2. Authenticate with Cloudflare account
3. Create tunnel: `cloudflared tunnel create elizacay-cms`
4. Configure tunnel to route `admin.elizacay.com` → `http://localhost:8055`
5. Run as systemd service so it starts automatically on Pi boot

Config file at `~/.cloudflared/config.yml`:
```yaml
tunnel: <tunnel-id>
credentials-file: /home/pi/.cloudflared/<tunnel-id>.json
ingress:
  - hostname: admin.elizacay.com
    service: http://localhost:8055
  - service: http_status:404
```

---

## Section 2: Directus Content Model

### Collection: `journal_posts`

| Field | Type | Notes |
|---|---|---|
| `id` | integer | Auto, primary key |
| `status` | string | `published` or `draft` — built into Directus |
| `date_created` | datetime | Auto-set by Directus |
| `title` | string | Required |
| `slug` | string | Required, unique — used for future individual post URLs |
| `date` | date | The post date (artist can backdate) |
| `image` | file (relation) | Uploaded through Directus, stored in /uploads on Pi |
| `body` | text | Long-form, plain text or WYSIWYG (Directus has a built-in editor) |

### Permissions

| Role | Access |
|---|---|
| Administrator (Eliza) | Full CRUD on all collections |
| Public (website visitors) | Read-only on `journal_posts` where `status = published` |

Public read access means the React site can fetch posts without an API key — no secrets needed in the frontend.

### How Eliza adds a post

1. Go to `admin.elizacay.com` in any browser
2. Log in with her email + password
3. Click **Journal Posts → Create New**
4. Fill in: Title, Date, Body, upload an Image
5. Set Status to **Published**
6. Save — post appears on the site within seconds

---

## Section 3: React Site Changes

### New environment variable

Add to Cloudflare Pages environment settings:
```
VITE_CMS_URL=https://admin.elizacay.com
```

Add to `.env.example`:
```
# Directus CMS URL (self-hosted on Raspberry Pi)
VITE_CMS_URL=
```

### API call

The Journal page replaces its static data import with a fetch:

```
GET https://admin.elizacay.com/items/journal_posts
  ?filter[status][_eq]=published
  &sort=-date
  &fields=id,title,slug,date,body,image.id
```

Response shape per post:
```json
{
  "id": 1,
  "title": "Bell Flower Study — work in progress",
  "slug": "bell-flower-study-wip",
  "date": "2026-06-27",
  "body": "Working on a new bell flower piece today...",
  "image": { "id": "uuid-string" }
}
```

Image URL constructed as:
```
https://admin.elizacay.com/assets/{image.id}?width=800
```

Directus serves images with on-the-fly resizing via the `?width=` parameter.

### Files to modify

| File | Change |
|---|---|
| `src/pages/Journal.jsx` | Replace static `JOURNAL_POSTS` import with `useEffect` fetch to Directus API. Add loading and error states. |
| `src/data/journal.js` | Keep as fallback — show static sample post if `VITE_CMS_URL` is not set (mirrors the existing Shopify pattern) |
| `.env.example` | Add `VITE_CMS_URL=` |

### States to handle in Journal.jsx

| State | What to show |
|---|---|
| Loading | Subtle loading indicator (match site style) |
| Loaded, posts exist | Journal card grid |
| Loaded, no posts | "Nothing here yet — check back soon." |
| Error (Pi down) | "Couldn't load posts — try again later." |
| VITE_CMS_URL not set | Static fallback from `journal.js` (dev/preview mode) |

---

## Open Questions

These do not need to be answered before implementation — just decisions to make during setup:

1. **Artist login credentials** — what email and password should the Directus admin account use? (Set during initial Pi setup — not stored in code)
2. **Pi OS** — Raspberry Pi OS (64-bit recommended for Docker ARM64 images) or another Linux distro?
3. **SD card or SSD?** — An external SSD via USB is recommended for reliability if image uploads will accumulate over time. SD cards can fail under frequent write load.
4. **Backups** — the SQLite `.db` file and `/uploads` folder should be backed up periodically. Options: rsync to another machine, Cloudflare R2, or a scheduled copy to Google Drive.

---

## Implementation Scope (when ready)

This splits naturally into two independent tracks:

**Track A — Pi setup (manual/infrastructure):**
1. Install Docker on Pi
2. Create `docker-compose.yml` and start Directus
3. Install and configure `cloudflared`, set up systemd service
4. Add `admin.elizacay.com` DNS record in Cloudflare pointing to tunnel
5. Log into Directus admin, create `journal_posts` collection and fields
6. Configure public role permissions

**Track B — React site (code changes):**
1. Update `Journal.jsx` to fetch from Directus API with loading/error states
2. Add `VITE_CMS_URL` to `.env.example`
3. Set `VITE_CMS_URL` in Cloudflare Pages environment settings
4. Remove or keep `journal.js` static fallback

Track A must be complete before Track B can be tested end-to-end, but Track B can be coded independently using the static fallback.

---

*This spec is complete and ready for implementation when the artist confirms they want this feature. To proceed: invoke `superpowers:writing-plans` against this document.*

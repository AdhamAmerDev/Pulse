# Self-hosting Pulse

Pulse runs as a Node.js app with PostgreSQL. You can run both on one machine. Docker is optional.

## What you need

- Node.js 20 or newer
- PostgreSQL 14 or newer
- A hostname and HTTPS if other websites will send events to the server

## Install Pulse

Clone the repository, enter the folder, and install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
copy .env.example .env.local
```

Use `cp .env.example .env.local` on macOS or Linux.

Update `.env.local` with your database and login details:

```env
DATABASE_URL=postgresql://pulse_user:password@localhost:5432/pulse
AUTH_SECRET=your-random-session-secret
SETUP_EMAIL=you@example.com
SETUP_PASSWORD=your-initial-password
NEXT_PUBLIC_APP_URL=https://pulse.example.com
CRON_SECRET=your-random-cleanup-secret
```

`NEXT_PUBLIC_TEST_SITE_INGEST_KEY` is only needed for the built-in test page. It is not needed for normal sites created in the dashboard.

For `AUTH_SECRET` and `CRON_SECRET`, generate random values with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Keep `.env.local` out of git.

## Set up the database

Create an empty PostgreSQL database, then run:

```bash
npm run db:migrate
```

Create the first dashboard user:

```bash
node scripts/createUser.ts
```

Build and start Pulse:

```bash
npm run build
npm start
```

The dashboard is available at `/login`.

## Add tracking

1. Sign in.
2. Click **Add site**.
3. Copy the generated script into the website.
4. Open the website and check its dashboard for the event.

The Pulse server must be reachable from the tracked website. `/api/event` allows cross-origin event requests; dashboard and settings endpoints require authentication.

The repository also contains `test-site/` for a quick cross-origin check. It is published through GitHub Pages. Enter the Pulse URL, site ID, and ingest key on the page instead of committing them to the test site.

## Retention

Retention is set per site in `/dashboard/settings`. Pulse does not run scheduled tasks by itself, so set up the machine running Pulse to call this endpoint once a day:

```text
GET https://pulse.example.com/api/cron/retention
Authorization: Bearer CRON_SECRET_VALUE
```

On Windows, Using Task Scheduler create a daily task that runs PowerShell:

```powershell
Invoke-WebRequest -Method GET -Uri "http://localhost:3000/api/cron/retention" -Headers @{ Authorization = "Bearer CRON_SECRET_VALUE" }
```

On Linux, add a daily cron entry or systemd timer. The app must be running when the request is made.

## Updates and backups

Back up PostgreSQL before updating. Then run:

```bash
npm install
npm run db:migrate
npm run build
npm start
```

Retention deletion cannot be undone. Make sure you have a backup and test restoring it.

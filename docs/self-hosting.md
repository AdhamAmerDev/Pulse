# Self-hosting Pulse

Pulse is a self-hosted analytics app built with Node.js and PostgreSQL. You can run both on the same machine. Docker is optional.

## Requirements

- Node.js 20+
- PostgreSQL 14+
- A machine to run Pulse on

You don't need a cloud server to use Pulse. Your data stays in the PostgreSQL database on the machine running Pulse.

If you're only testing Pulse locally, `localhost` is enough.

If you want websites on other machines or the internet to send events to Pulse, your Pulse server needs to be reachable from those websites. HTTPS is recommended, and is required in practice when the tracked website is served over HTTPS because browsers can block HTTP requests as mixed content.

## Install

Clone the repository and install the dependencies:

```bash
npm install
```

Create your environment file:

```bash
copy .env.example .env.local
```

On macOS/Linux:

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
DATABASE_URL=postgresql://pulse_user:password@localhost:5432/pulse

AUTH_SECRET=your-random-session-secret

SETUP_EMAIL=you@example.com
SETUP_PASSWORD=your-initial-password

NEXT_PUBLIC_APP_URL=https://pulse.example.com

CRON_SECRET=your-random-cleanup-secret
```

`NEXT_PUBLIC_TEST_SITE_INGEST_KEY` is only used by the built-in test page. Normal sites get their ingest keys from the dashboard.

Generate random values for `AUTH_SECRET` and `CRON_SECRET` with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Don't commit `.env.local`.

## Database setup

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

You can now open:

```text
http://localhost:3000/login
```

## Add a website

After logging in:

1. Go to **Add site**.
2. Enter the website details.
3. Copy the tracking script.
4. Add it to the website.
5. Open the website and check the site's dashboard.

The script is loaded from your Pulse server, so events are sent back to that same Pulse instance.

For example:

```html
<script
  src="https://pulse.example.com/pulse.js"
  data-site="SITE_ID"
  data-key="SITE_INGEST_KEY"
></script>
```

The above sends events to:

```text
https://pulse.example.com/api/event
```

`/api/event` accepts cross-origin requests so Pulse can track websites hosted on different domains. Dashboard and settings endpoints still require authentication.

## Testing with Cloudflare Tunnel

If you're running Pulse on your own PC and want to test it with a website hosted somewhere else, Cloudflare Tunnel is an easy way to temporarily expose your local server over HTTPS.

This is useful for testing GitHub Pages, for example.

### Install cloudflared

Download `cloudflared` from Cloudflare:

https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/downloads/

Check that it works:

```bash
cloudflared --version
```

### Run Pulse

Start Pulse normally:

```bash
npm start
```

Assuming it's running on:

```text
http://localhost:3000
```

Open another terminal and run:

```bash
cloudflared tunnel --url http://localhost:3000
```

You'll get a temporary URL similar to:

```text
https://some-random-name.trycloudflare.com
```

Keep that terminal running.

You can now use that URL as the Pulse server URL:

```html
<script
  src="https://some-random-name.trycloudflare.com/pulse.js"
  data-site="SITE_ID"
  data-key="SITE_INGEST_KEY"
></script>
```

The request flow is:

```text
Website
  ↓
Cloudflare Tunnel
  ↓
localhost:3000
  ↓
Pulse
  ↓
PostgreSQL
```

Quick Tunnels are for testing and development. The URL is temporary and will change when you create a new tunnel.

For a permanent setup, use a stable hostname with HTTPS.

## Retention

Retention is configured per site from:

```text
/dashboard/settings
```

Pulse doesn't run the retention job automatically. Set up a daily request to:

```text
GET https://pulse.example.com/api/cron/retention
Authorization: Bearer CRON_SECRET_VALUE
```

On Windows, you can use Task Scheduler with PowerShell:

```powershell
Invoke-WebRequest `
  -Method GET `
  -Uri "http://localhost:3000/api/cron/retention" `
  -Headers @{ Authorization = "Bearer CRON_SECRET_VALUE" }
```

If Pulse is running behind a public hostname, replace the `localhost` URL with that hostname.

On Linux, use cron or a systemd timer.

Pulse needs to be running when the request is made.

## Updates and backups

Back up your PostgreSQL database before updating.

Then:

```bash
npm install
npm run db:migrate
npm run build
npm start
```

Retention deletes data permanently, so make sure your backups work before enabling it.

## Self-hosted

That's basically it.

Your Pulse instance runs wherever you choose to run it, and the websites you track send their analytics back to that instance.

```text
Your machine
├── Pulse
└── PostgreSQL

          ↑
          │
       analytics
          │
          │
     Your websites
```

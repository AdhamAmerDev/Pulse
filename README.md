# Pulse

Pulse is self-hosted analytics for your websites. It keeps the data in your PostgreSQL database and gives you a small dashboard for page views, visitors, pages, referrers, devices, and activity over time.

Your data stays in your PostgreSQL database. The tracking script does not use cookies.

## Setup

You need:

- Node.js 20 or newer
- PostgreSQL 14 or newer

Install the dependencies and create your local environment file:

```bash
npm install
copy .env.example .env.local
```

On macOS or Linux, use `cp .env.example .env.local` instead.

Fill in `.env.local`. You need a PostgreSQL URL, an auth secret, and the setup email and password. `CRON_SECRET` is used by the retention cleanup task.

Generate random secrets with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Set up the database and build the app:

```bash
npm run db:migrate
npm run build
```

Create the first user:

```bash
node scripts/createUser.ts
```

Start Pulse:

```bash
npm start
```

Go to `http://localhost:3000/login` and sign in.

See [docs/self-hosting.md](docs/self-hosting.md) for updates, backups, and the retention cleanup task.

## Add tracking

Create a site in the dashboard and copy its script into the website:

```html
<script
  src="https://your-pulse-host.example/pulse.js"
  data-site="SITE_ID"
  data-key="INGEST_KEY"
></script>
```

The ingest key is sent to the browser with each event. It is not your dashboard password.

Run the app locally to see the dashboard at `/dashboard`.

## Test from GitHub Pages

The `test-site/` folder is a small cross-origin test page. The GitHub Actions workflow publishes it when changes reach `main`.

Open the Pages URL from the workflow deployment and enter your Pulse server URL, site ID, and ingest key. The Pulse server must be reachable over HTTPS. The page does not contain a shared ingest key.

## License

Pulse is available under the MIT License. See [LICENSE](LICENSE).

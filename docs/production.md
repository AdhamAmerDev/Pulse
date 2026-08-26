# Production notes

## Environment

Copy `.env.example` to `.env.local`, then replace the placeholders:

- `DATABASE_URL`: PostgreSQL connection string.
- `AUTH_SECRET`: a random secret used to sign sessions.
- `SETUP_EMAIL` and `SETUP_PASSWORD`: used only by the initial user setup script.
- `CRON_SECRET`: a separate random secret used only by the retention endpoint.

Generate random secrets with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Do not commit environment files or database credentials.

## Database

Run migrations before starting the application:

```bash
npm run db:migrate
npm run build
npm start
```

Back up PostgreSQL separately from the app. Retention deletion is permanent.

## Retention cleanup

Site owners choose retention in `/dashboard/settings`. Call this endpoint at least once a day:

```text
GET https://your-pulse-host.example/api/cron/retention
Authorization: Bearer YOUR_CRON_SECRET
```

The endpoint supports `GET` and `POST`. It returns the number of deleted events. A missing or placeholder `CRON_SECRET` returns `401`.

For a local Windows installation, create a daily Task Scheduler action that runs:

```powershell
Invoke-WebRequest -Method GET -Uri http://localhost:3000/api/cron/retention -Headers @{ Authorization = "Bearer YOUR_CRON_SECRET" }
```

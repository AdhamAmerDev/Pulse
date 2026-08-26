# Contributing

Thanks for taking a look at Pulse.

## Before you start

For a larger change, open an issue first so it can be discussed. Small fixes and documentation changes can go straight into a pull request.

## Local setup

```bash
npm install
copy .env.example .env.local
npm run db:migrate
npm run lint
npm run build
```

Use `cp .env.example .env.local` on macOS or Linux. Keep local secrets in `.env.local`; do not commit environment files.

## Pull requests

- Keep changes focused.
- Say what changed and how you tested it.
- Add or update tests when behavior changes.
- Run `npm run lint` and `npm run build` before opening the pull request.
- Do not include real database credentials, session secrets, ingest keys, or tracking data.

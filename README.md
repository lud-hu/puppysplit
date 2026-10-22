# Puppysplit 🐶

Puppysplit is an app that allows you to easily split costs in a group of people e.g. when being on a weekend skiing trip or climbing holiday.
It originated in a test project for a web stack based on HTMX. It still a proof of concept so the code may not be as nice as it could get and it's pretty simple in functionality for now.

This repo is based on the BETH stack:
https://github.com/ethanniser/the-beth-stack

Technologies used:
Bun, Elysia, Turso, HTMX
Also: tailwind, drizzle, hyperscript and fly.io

# TO RUN LOCALLY

1. Clone this repo

2. Install [Bun](https://bun.sh)

3. Run `bun install` to install dependencies

4. Create a database with [Turso](https://turso.tech) and add the connection url and token to a `.env` file in the root of this project

5. Run `bun run db:migrate` to apply the database schema (also migrates databases from the old `debts` naming)

6. Run `bun run dev` to start the dev server

# TO DEPLOY TO FLY

The web app deploys to the existing Fly app `puppysplit`, configured in `fly.toml`.

## GitHub Actions

The [Deploy web app workflow](.github/workflows/deploy.yml) runs on pushes to `main`, including merged PRs. You can also run it from the Actions tab with **Run workflow**, selecting `main`; other branches are skipped. Deployments run one at a time and build the existing Dockerfile remotely on Fly, including the Tailwind CSS bundle.

In this repository's **Settings → Secrets and variables → Actions → New repository secret**, add:

| Secret name | Value |
| --- | --- |
| `FLY_API_TOKEN` | An app-scoped deploy token generated with `fly tokens create deploy --app puppysplit` from an authenticated Fly CLI. |

No GitHub Actions variables or database secrets are required. Set the token before merging this workflow; replace the secret when the token expires or is rotated.

## Runtime database credentials

`DATABASE_URL` and `DATABASE_AUTH_TOKEN` belong in the Fly app's runtime secrets, not GitHub Actions. If they are already configured, leave them as they are. For a first-time setup, configure them manually:

```sh
fly secrets set DATABASE_URL='<your url>' DATABASE_AUTH_TOKEN='<your token>' --app puppysplit
```

Automated deployments do not set or overwrite these secrets. They do not run migrations, schema pushes, seeds, or resets. The deploy command explicitly uses `--skip-release-command`, so Fly release commands are skipped even if one is added to `fly.toml` later. The Dockerfile builds CSS and starts the web server without running database tools.

Schema changes remain a separate manual operation: back up the production database and run `bun run db:migrate` from a trusted local checkout with the intended database credentials before deploying code that requires the new schema. Keep database commands out of build, install, and server startup hooks.

## Manual web app deployment

With the [Fly CLI](https://fly.io/docs/hands-on/install-flyctl/) installed and authenticated, run:

```sh
fly deploy --app puppysplit --config fly.toml --remote-only --skip-release-command
```

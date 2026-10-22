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

# MCP SERVER

The web app includes a Streamable HTTP MCP endpoint at `/mcp`. Connect a remote
MCP client with a URL that configures an existing puppy and its payer:

```text
https://puppysplit.fly.dev/mcp?puppyId=<puppy-id>&userId=<user-id>
```

For local development use `http://localhost:3000` as the base URL. The puppy ID is
in its existing share link (`/puppies/<puppy-id>`). `userId` is the positive numeric
ID of an existing member. At the bottom of the puppy page, **Connect with MCP**
lets you choose the payer and copy the configured MCP link or full JSON config.
The generated URL uses the site's current origin, including for local development.
Each connection fixes these two IDs; they are not tool arguments. A
client that supports a `url` entry in `mcpServers` can use, for example:

```json
{
  "mcpServers": {
    "puppysplit": {
      "url": "https://puppysplit.fly.dev/mcp?puppyId=YOUR_PUPPY_ID&userId=YOUR_USER_ID"
    }
  }
}
```

Other clients may call the transport `http` or `streamable-http`; use their remote
server configuration with the same URL. This is a stateless Streamable HTTP
endpoint, not a legacy SSE endpoint or a local stdio command. It shares the web
app's database configuration and needs no new secrets or migrations.

| Tool | Behavior |
| --- | --- |
| `get_puppy` | Puppy title and ID, member IDs/names, and the configured payer. |
| `list_expenses` | All expenses in the configured puppy, newest first, with payer and participants. |
| `get_settlement` | Suggested settlement transfers using the web app's calculation; no writes. |
| `add_expense` | Record an expense paid by the configured user. |

The app now calls debts **expenses**. For example, call `add_expense` with:

```json
{ "title": "Dinner", "amount": 30 }
```

`amount` is the total in euros. By default it is split equally among all current
members, including the payer. Supply `participantIds`, for example `[1, 2]`, to
split only among those members. Use `get_puppy` to see their IDs. Empty lists,
duplicate IDs, members of other puppies, nonpositive amounts, and attempts to
supply a different puppy or payer are rejected. The configured puppy and payer
membership are checked on every tool call.

In the web form, choose **Specific people** under **split between** and check one
or more members to share an expense. Only those members owe a share; the payer
does not need to be a participant. **All members** remains the default. An empty
selection is rejected, and a failed request keeps the entered expense for retrying.

The MCP server exposes no tools to create puppies, delete puppies or expenses,
manage users, rename puppies, or edit expenses. Repeating `add_expense` records
another expense; clients should not automatically retry an uncertain write.

Access follows the existing app's share-link model: **treat the puppy ID and full
MCP URL as secrets**. Anyone with the puppy ID can access the puppy and configure
any of its members as payer, just as in the web app. `userId` selects the payer;
it does not authenticate that person. There is no additional bearer-token or
OAuth layer. Use HTTPS for remote connections. Cross-origin browser requests are
rejected, and MCP responses are not cached.

Run `bun test` and `bun run typecheck` to check the implementation. The MCP tests
use the official client to negotiate and call tools through the HTTP endpoint,
covering configuration, membership, input validation, client isolation, and the
absence of destructive tools.

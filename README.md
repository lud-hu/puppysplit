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

5. Run `bun run db:push` to push the database schema to your database

6. Run `bun run dev` to start the dev server

# TO DEPLOY TO FLY

1. Install the [Fly CLI](https://fly.io/docs/hands-on/install-flyctl/)

2. Run `fly launch`

3. Run `fly secrets set DATABASE_URL=<your url>` & `fly secrets set DATABASE_AUTH_TOKEN=<your token>`

4. Generate the tailwind css file with `bun run tw`

5. Run `fly deploy`

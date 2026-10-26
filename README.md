# openEBench-nuxt

OpenEBench web frontend, built with [Nuxt 4](https://nuxt.com) (Vue 3, Pinia, Nuxt UI), authenticated against Keycloak through [`@sidebase/nuxt-auth`](https://sidebase.io/nuxt-auth).

## Requirements

- Node.js `>=24.22.1 <25` and npm `>=12.2.1 <13` (see `engines` in [package.json](package.json))

## Getting started

```bash
# install dependencies (also runs `nuxt prepare`)
npm ci

# create your local environment file and set NUXT_AUTH_SECRET
cp .env.example .env

# dev server with hot reload at http://localhost:3001
npm run dev
```

### Useful scripts

| Command             | What it does                               |
| ------------------- | ------------------------------------------ |
| `npm run build`     | Production build into `.output/`           |
| `npm run preview`   | Preview the production build               |
| `npm test`          | Unit tests (Vitest)                        |
| `npm run coverage`  | Tests with coverage                        |
| `npm run lint`      | ESLint (`npm run lint:fix` to apply fixes) |
| `npm run format`    | Prettier                                   |
| `npm run typecheck` | `nuxt prepare` + `vue-tsc`                 |

`npm run typecheck`, `npm run lint` (0 errors) and the unit tests all pass. Keep it that way: avoid `any` (`@typescript-eslint/no-explicit-any` is an error), and when you change a component prop, update every call site.

## Authentication

Login uses Keycloak (public client, PKCE) via NuxtAuth with the `authjs` provider. The handler lives in [server/api/auth/[...].ts](server/api/auth/[...].ts) and the module is configured in the `auth` block of [nuxt.config.ts](nuxt.config.ts).

Relevant environment variables:

| Variable                                                | Purpose                                                          |
| ------------------------------------------------------- | ---------------------------------------------------------------- |
| `NUXT_AUTH_SECRET`                                      | Signs and encrypts the session cookies. **Required at runtime.** |
| `AUTH_ORIGIN` / `APP_BASE_URL`                          | Public origin of the app. Auth URLs are `<origin>/api/auth/...`. |
| `KEYCLOAK_HOST`, `KEYCLOAK_REALM`, `KEYCLOAK_CLIENT_ID` | Keycloak server, realm and client.                               |

### Authentication secret

`NUXT_AUTH_SECRET` is only needed when the app runs (it is not needed to build the image). Generate one per environment with `openssl rand -hex 32` and never commit it.

- Locally: put `NUXT_AUTH_SECRET=...` in a git-ignored `.env` (see [.env.example](.env.example)); the local compose files fall back to a dev-only value.
- Deployed (test2, preprod, sandbox): add it to each service in the [oeb-docker-compose](https://github.com/inab/oeb-docker-compose) repo, reading a different value per environment from the VM's `.env`:

  ```yaml
  environment:
    - NUXT_AUTH_SECRET=${AUTH_SECRET_TEST2}
  ```

  Set it on the VM **before** the new image is pulled, otherwise authentication fails in that environment. Changing the value signs all users out once.

## Auto deployment

Images are built by GitHub Actions workflows in [.github/workflows](.github/workflows), all using [Dockerfile.production](Dockerfile.production), and pushed to `ghcr.io/inab/openebench-nuxt-v3`:

| Push to branch           | Workflow                                                       | Image tag  |
| ------------------------ | -------------------------------------------------------------- | ---------- |
| `main` (and any git tag) | [image-publishing.yml](.github/workflows/image-publishing.yml) | `:test2`   |
| `preprod`                | [docker-preprod.yml](.github/workflows/docker-preprod.yml)     | `:preprod` |
| `sandbox`                | [docker-sandbox.yml](.github/workflows/docker-sandbox.yml)     | `:sandbox` |

The `main` workflow also runs the unit tests before building. On the VM, [Watchtower](https://containrrr.dev/watchtower/) detects the new tag and recreates the container.

### Runtime configuration (test2, preprod, sandbox)

The image is identical for every environment. URLs, Keycloak realm/client, etc. are **not** compiled in: the browser fetches `/config.json` before any API or Keycloak call, and the server reads the same file at start-up. The file is [config/config.json](config/config.json) (defaults = test2), located at `/app/config/config.json` in the container (override the path with `OEB_CONFIG_FILE`). To reconfigure an instance, bind-mount your own file read-only over it:

```yaml
volumes:
  - ./config/preprod.json:/app/config/config.json:ro
```

or with `docker run`:

```bash
docker run --rm -ti -e NUXT_AUTH_SECRET=<secret> \
  -v $PWD/preprod.json:/app/config/config.json:ro \
  -p 3000:3000 ghcr.io/inab/openebench-nuxt-v3:preprod
```

The same trick works for any file baked into the image, e.g. replacing the logo:

```bash
docker run --rm -ti -e NUXT_AUTH_SECRET=<secret> \
  -v $PWD/my_logo.png:/app/.output/public/_nuxt/opeb_logo.k4Txqcx6.gif:ro \
  -p 3000:3000 ghcr.io/inab/openebench-nuxt-v3:test2
```

(the hash in the logo file name changes between builds; check `.output/public/_nuxt/`).

#### Environment mapping

| Environment   | Branch    | Image tag     | Config file mounted at `/app/config/config.json`                                                               |
| ------------- | --------- | ------------- | -------------------------------------------------------------------------------------------------------------- |
| Production    | `main`    | `:test2`      | [config/config.json](config/config.json) (built into the image, no mount needed)                               |
| Preprod       | `preprod` | `:preprod`    | `preprod.json`: your own copy of [config/config.json](config/config.json) with preprod values, mounted over it |
| Sandbox       | `sandbox` | `:sandbox`    | `sandbox.json`: your own copy of [config/config.json](config/config.json) with sandbox values, mounted over it |
| Local compose | -         | built locally | [config/local.json](config/local.json)                                                                         |
| Devci         | -         | built locally | [config/devci.json](config/devci.json) (via `OEB_CONFIG_FILE`)                                                 |

Keep one file per environment next to the compose file on its VM, each with that environment's `BASE_URL`, `AUTH_ORIGIN`, Keycloak realm and API URLs.

#### Applying a change to the config file

The browser gets the new values on the next page reload, but the server (login, staged API proxy) reads the file only at start-up, so restart the container after editing:

```bash
# docker compose (run in the folder with the compose file)
docker compose restart app            # service name: app in this repo's docker-compose.yml

# plain docker
docker restart <container-name>

# check what the running instance is using
curl -s http://localhost:3000/config.json
docker exec <container-name> cat /app/config/config.json
```

If your editor saves by replacing the file and the container still shows the old content, recreate it instead: `docker compose up -d --force-recreate app`. Hard-reload the browser (Ctrl+Shift+R) if the page still looks stale. Keys are those of `runtimeConfig.public` in [nuxt.config.ts](nuxt.config.ts) (`BASE_URL`, `AUTH_ORIGIN`, `KEYCLOAK_HOST`, `KEYCLOAK_REALM`, `KEYCLOAK_CLIENT_ID`, `SCIENTIFIC_SERVICE_URL(_API)`, `MONITORING.baseURL`...); missing keys fall back to the built-in defaults, and a missing/invalid file falls back to all defaults. The file is public, so never put secrets in it: `NUXT_AUTH_SECRET` and the SMTP settings stay environment variables. Changes are picked up after restarting the container (see below). The docker compose files for the oeb landscape are in <https://github.com/inab/oeb-docker-compose>.

## Project structure

| Directory              | Contents                                        |
| ---------------------- | ----------------------------------------------- |
| `app/`                 | Pages, components, layouts, plugins, middleware |
| `server/`              | Nitro API routes (auth, staged data, email)     |
| `stores/`              | Pinia stores                                    |
| `types/`, `constants/` | Shared types and constants                      |
| `tests/`               | Vitest unit tests                               |

# Local development with Docker (devci)

[docker-compose.devci.yml](docker-compose.devci.yml) runs the dev server in a container with the repository mounted at `/app` (so edits are picked up by hot reload) and `node_modules` kept in a Docker volume.

```bash
docker compose -f docker-compose.devci.yml up
```

Set `DEV_UID` and `DEV_GID` in your `.env` (see [.env.example](.env.example); get the values with `id -u` and `id -g`). The container then runs as your user, so files it creates (`.nuxt`, `node_modules`) are not owned by root. If they are missing, the container runs as root and you will hit permission errors; in that case fix the ownership with `sudo chown -R "$USER": .nuxt` and remove the `node-modules-volume` volume.

- Nuxt is available at <http://localhost:3001>. Use this URL to log in: the auth origin is set to it.
- An nginx proxy (see [nginx.conf.devci](nginx.conf.devci)) is available at <http://localhost:8080>.
- `NUXT_AUTH_SECRET` is read from your environment or `.env`; otherwise a dev-only value is used.

## Adding new dependencies

With docker compose running, run in a separate terminal:

```bash
DEPENDENCIES=mynewdependency docker compose -f docker-compose.devci.yml run npm_install_deps
docker compose -f docker-compose.devci.yml restart nuxt
```

This updates [package.json](package.json) and [package-lock.json](package-lock.json). Check the output for peer dependency conflicts; if the new package breaks things, roll back both files and try another version.

## Uninstalling dependencies

```bash
DEPENDENCIES=mydependency docker compose -f docker-compose.devci.yml run npm_uninstall_deps
docker compose -f docker-compose.devci.yml restart nuxt
```

## Running custom `npm run` commands

Any script from [package.json](package.json) can be run inside the container with `NPM_RUN`. By default it runs `lint:fix`:

```bash
# check only
NPM_RUN=lint docker compose -f docker-compose.devci.yml run npm_run

# apply fixes
docker compose -f docker-compose.devci.yml run npm_run

# other scripts, e.g. the unit tests
NPM_RUN="test -- --run" docker compose -f docker-compose.devci.yml run npm_run
```

## Known vulnerabilities

Run `npm audit` with the Node.js and npm versions specified in [package.json](package.json) to check the current lockfile. Last checked 2026-10-26, it reports **6 high-severity package findings**, all propagated from one underlying transitive advisory:

| Vulnerable package | Advisory                                                                                                          | Dependency path                                         |
| ------------------ | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `node-forge` 1.4.0 | [GHSA-86w9-cpqp-85rv](https://github.com/advisories/GHSA-86w9-cpqp-85rv) (RSA PKCS#1 v1.5 signature verification) | `nuxt` / `@sidebase/nuxt-auth` > `nitropack` > `listhen` > `node-forge` |

The six count is npm's affected-package entries (`nuxt`, `@nuxt/nitro-server`, `@sidebase/nuxt-auth`, `nitropack`, `listhen` and `node-forge`), not six separate advisories. `npm audit fix` updates compatible dependencies and clears the previously reported low-severity `serialize-javascript` finding, but cannot fix this high-severity issue: `listhen` already accepts `node-forge` `^1.4.0`, and 1.4.0 is currently the latest published version while still in the advisory's affected range.

Do **not** use `npm audit fix --force`: npm proposes downgrading `@sidebase/nuxt-auth` to 0.3.2 (and Nuxt to 4.1.3), which are breaking, older releases and do not constitute a safe dependency update. Re-run `npm audit` after an upstream `node-forge` release outside the affected range or an upstream dependency change.

## Outdated dependencies

`npm outdated` (checked 2026-10-22) lists only these packages after updating the rest:

| Package                  | Current       | Latest | Decision                                                                                                                                                                               |
| ------------------------ | ------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `typescript`             | 6.0.3         | 7.0.2  | **Stay on 6.x.** `@typescript-eslint/*` (pulled in by `@nuxt/eslint`) declares the peer range `>=4.8.4 <6.1.0`, so 7 is not supported yet. Revisit when typescript-eslint supports it. |
| `vue-observe-visibility` | 2.0.0-alpha.1 | 1.0.0  | **Keep.** npm reports 1.0.0 as "latest" only because 2.0.0-alpha.1 is a prerelease; this is not a real update.                                                                         |

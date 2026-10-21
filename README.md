# openEBench-nuxt

OpenEBench web frontend, built with [Nuxt 4](https://nuxt.com) (Vue 3, Pinia, Nuxt UI), authenticated against Keycloak through [`@sidebase/nuxt-auth`](https://sidebase.io/nuxt-auth).

## Requirements

- Node.js `>=22.23.2 <23` and npm `>=12.0.2 <13` (see `engines` in [package.json](package.json))

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

| Command             | What it does                                    |
| ------------------- | ----------------------------------------------- |
| `npm run build`     | Production build into `.output/`                |
| `npm run preview`   | Preview the production build                    |
| `npm test`          | Unit tests (Vitest)                             |
| `npm run coverage`  | Tests with coverage                             |
| `npm run lint`      | ESLint (`npm run lint:fix` to apply fixes)      |
| `npm run format`    | Prettier                                        |
| `npm run typecheck` | `nuxt prepare` + `vue-tsc` (see the note below) |

> The project currently has a large number of known type errors, so `npm run typecheck` does not pass yet. They are being fixed progressively.

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

The environment-specific values (URLs, Keycloak realm...) are `ARG`/`ENV` entries in the Dockerfile. The docker compose files for the oeb landscape are in <https://github.com/inab/oeb-docker-compose>.

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
# use your own ids so files created by the container are not owned by root
export DEV_UID=$(id -u) DEV_GID=$(id -g)

docker compose -f docker-compose.devci.yml up
```

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

`npm audit` currently reports 10 high severity findings (last checked 2026-10-21). All are **transitive** and **no fixed version exists yet**:

| Package      | Advisory                                                                                                          | Reached through                                                |
| ------------ | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `braces`     | [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) (DoS on deeply nested patterns)          | `nitropack` > `globby` > `fast-glob` > `micromatch` > `braces` |
| `node-forge` | [GHSA-86w9-cpqp-85rv](https://github.com/advisories/GHSA-86w9-cpqp-85rv) (RSA PKCS#1 v1.5 signature verification) | `nitropack` > `listhen` > `node-forge`                         |

`nuxt`, `@nuxt/nitro-server` and `@sidebase/nuxt-auth` are listed by `npm audit` only because they depend on `nitropack`.

- Both vulnerable packages are already at their latest published version, so overrides cannot help.
- `npm audit fix --force` suggests downgrading `@sidebase/nuxt-auth` to 0.3.2: **do not run it**.
- They are used by build and dev tooling (glob matching and the dev server's TLS helper), not in the request handling of the production server.
- To clear them: wait for an upstream `nitropack` release that drops or updates these dependencies, then update and re-run `npm audit`.

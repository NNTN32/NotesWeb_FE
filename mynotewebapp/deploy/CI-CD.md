# Frontend image pipeline

Workflow: `.github/workflows/fe.yml` at the repository root. Commands run in `mynotewebapp`.

## Release flow

1. PRs and `codex/*` / `feature/*` pushes run frozen Yarn install, lint, non-empty unit tests, Vite build and Docker smoke. No environment credentials are used.
2. A merged PR on current `main` runs validation again. Only main can access the GitHub environment **ProductFE**. Direct main commits fail the merged-PR release policy.
3. Publish a unique candidate tag to `nntn/notesweb-fe`: `sha-<commit>-<run>-<attempt>`, for amd64 and arm64. Pull and smoke both architectures using the published digest. A failed candidate never deploys or updates `latest`.
4. Update Dokploy app `fe` to the tested digest and Docker provider, preserving runtime environment, networking and registry settings. Disable Git autodeploy so source pushes cannot bypass CI.
5. Wait for the matching deployment to finish, verify `/version.json` against the release SHA, then run public HTTP checks for 120 seconds. Promote the same digest to `latest` only after success. Production remains pinned to its digest.

## Configuration

All three secrets currently live in **ProductFE**:

| Secret | Purpose |
| --- | --- |
| `DOCKERHUB_USERNAME` | `nntn` |
| `DOCKERHUB_TOKEN` | Docker Hub PAT with read/write; no delete required |
| `DOKPLOY_API_KEY` | Read app/deployments and update/deploy app `fe` |

The key name does not scope Dokploy permissions; restrict the owning account where supported. Keep ProductFE deployment branches limited to `main`. Do not expose credentials to PR jobs.

Optional environment variables override `DOKPLOY_URL`, `DOKPLOY_APPLICATION_ID`, and `FE_PUBLIC_URL`. Defaults point to the existing FE app and `https://nhannotes.id.vn`. Docker Hub repository must exist; private images additionally require pull credentials in the Dokploy Docker provider.

## Evidence and recovery

Actions artifacts retain unit/image reports for 14 days, release digest + architecture smoke for 30 days, and deployment identity/previous image for 90 days. Download the reports before investigating. No secrets or full Dokploy responses are logged.

An API response or Dokploy `done` alone is insufficient. The workflow also requires the expected public revision, health, SPA deep links, static cache/missing-asset behavior and anonymous auth response. It fails on API/deploy/smoke errors or timeout. Public checks do not prove Swarm task convergence or authenticated business flows; verify those separately in Dokploy when investigating a release.

On failure, inspect the recorded deployment and Swarm rollback status before retrying. If the previous image is a known good compatible digest, select it in Dokploy Docker provider and deploy, then verify its revision and smoke again. Do not clear browser storage, volumes or change routing to roll back code. First migration from Git has no previous registry digest: preserve the old Swarm image/rollback target until the first image release is verified. Automatic application-level rollback is not implemented.

Staging promotion and real-account E2E remain separate follow-up work. This pipeline targets the existing single production environment; Notes/Tasks remain local.

## Local verification

From repository root:

```sh
docker build -t notesweb-fe:review --build-arg REVISION=local mynotewebapp
node mynotewebapp/scripts/ci/smoke-image.mjs notesweb-fe:review local
```

The smoke harness creates and removes its own API mock, FE container and Docker network. Production smoke never supplies user credentials.

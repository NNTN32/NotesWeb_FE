# Frontend image pipeline

Workflow: `.github/workflows/fe.yml` at the repository root. Commands run in `mynotewebapp`. Runtime: [CapRover](CAPROVER.md).

## Release flow

1. PRs and `codex/*` / `feature/*` pushes run frozen Yarn install, lint, non-empty unit tests, Vite build and Docker smoke. No environment credentials are used.
2. A merged PR on current `main` runs validation again. Only main can access the GitHub environment **ProductFE**. Direct main commits fail the merged-PR release policy.
3. Publish a unique candidate tag `sha-<commit>-<run>-<attempt>` to the private `ghcr.io/nntn32/notesweb-fe` for amd64 and arm64, using the run's own `GITHUB_TOKEN` (`packages: write`). Pull and smoke both architectures by digest. A failed candidate never deploys or updates `latest`.
4. Ask CapRover (app `notesweb-fe`, deploy token only) to deploy the tested digest. The request is detached so Cloudflare's 100-second proxy limit cannot cut it.
5. Wait for `/version.json` to report the release SHA, then run public HTTP checks for 120 seconds. Promote the same digest to `latest` only after success.

## Configuration

**ProductFE** (deployment branches: `main` only) holds one secret:

| Secret | Purpose |
| --- | --- |
| `CAPROVER_APP_TOKEN` | Deploy token of CapRover app `notesweb-fe`; it can start a deploy of that app only (dashboard → app → Deployment) |

Target, app and public URL are fixed in `scripts/ci/deploy.mjs`. CapRover pulls from GHCR with its own classic GitHub token limited to `read:packages` (CapRover → Cluster → Docker Registries). Do not mix FE and BE tokens.

## Evidence and recovery

Artifacts retain unit/image reports for 14 days, release digest + architecture smoke for 30 days, and `deployment.json` (new/previous digest, status, rollback outcome) for 90 days. No tokens or CapRover responses are logged.

If the new revision does not pass the public checks, CD redeploys the previous `latest` digest and requires a different revision to pass the same checks (`rollback: passed`); the run stays red. `no_previous_release` or `manual_required`: open the CapRover dashboard → `notesweb-fe` → Deployment, redeploy the last good version or `ghcr.io/nntn32/notesweb-fe@<digest from the last green deployment-report>`, then verify `/version.json` and smoke. Do not clear browser storage or change routing to roll back code. BE has its own ProductBE pipeline and token.

## Local verification

From repository root:

```sh
docker build -t notesweb-fe:review --build-arg REVISION=local mynotewebapp
node mynotewebapp/scripts/ci/smoke-image.mjs notesweb-fe:review local
```

The smoke harness creates and removes its own API mock, FE container and Docker network. Production smoke never supplies user credentials.

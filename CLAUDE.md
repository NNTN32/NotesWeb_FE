# Repository working rules

App and detailed rules: [mynotewebapp/CLAUDE.md](mynotewebapp/CLAUDE.md). Follow those rules for every change. Run lint, unit tests and build in `mynotewebapp/` before committing. Production recovery: [CD runbook](mynotewebapp/deploy/CI-CD.md).

Keep the Lightsail Malaysia target, immutable image deployment and ProductFE main-only credential boundary. No OrbStack fallback. Preserve current data/env/networks on rollback; do not mix FE and BE CapRover deploy tokens. Production deploys require user authorization and passed release gates.

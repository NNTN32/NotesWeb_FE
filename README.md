# NotesWeb frontend

React 19 / Vite app: [development, structure and release process](mynotewebapp/README.md). See [working rules](CLAUDE.md) and [CD recovery runbook](mynotewebapp/deploy/CI-CD.md).

Production: Dokploy on Lightsail Malaysia, Cloudflare DNS/proxy + origin TLS. GitHub Actions deploys a tested immutable digest to the fixed FE app through ProductFE. OrbStack is retired; it is never a CD fallback. Backend has a separate ProductBE pipeline and rollback contract.

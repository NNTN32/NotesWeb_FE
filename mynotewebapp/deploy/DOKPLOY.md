# Dokploy runtime · Lightsail Malaysia

Production: `notesweb-my-01`, Malaysia `ap-southeast-5`, Ubuntu 24.04, 4 GB / 2 vCPU / 80 GB. Dokploy runs locally on node `ip-172-26-24-177` (`172.26.24.177`). Static IPv4 `56.69.208.25`; Cloudflare proxied DNS + origin TLS Full strict. OrbStack/Tunnel is retired, preserved only for recovery.

| Setting | Production value |
| --- | --- |
| Dokploy endpoint | `https://dokploy.nhannotes.id.vn` |
| FE application | `fe` · `8fELziSraH6PTTo6FS2OB` |
| FE service | `nnnoteswebapp-fe-yqegwe` |
| Provider | Docker image pinned by digest; Git autodeploy disabled |
| FE network / port | `notesweb-app` / container 80; no public host binding |
| API_UPSTREAM | `http://nnnoteswebapp-notesserver-oubfhi:8081` |
| Health | `/healthz`; Swarm start-first, parallelism 1, failure rollback, monitor 120 seconds |
| Public URL | `https://nhannotes.id.vn` |

Browser → Cloudflare → origin Traefik → FE/Nginx → same-origin `/api` → BE. FE and BE share `notesweb-app`; BE/PG/Redis/RabbitMQ share the private data network. Do not attach FE/proxy to the private database network. Keep DB/queue/admin ports closed; SSH uses Lightsail browser SSH.

The Nginx proxy preserves method, URI, query and auth/cookie contracts. Do not strip `/api` or use localhost as the backend hostname. `/healthz` proves only FE availability; check BE readiness and public API contracts separately. Notes/Tasks remain local pending a lossless sync contract.

[CI/CD evidence and recovery](CI-CD.md): deploy the tested digest, verify public revision and smoke, retain previous digest and data. A public-smoke failure does not automatically revert FE; inspect native Swarm rollback and explicitly redeploy the known-good digest if needed. No old DB restore over new writes.

Build images in GitHub Actions, not on the 4 GB VM. Never embed secrets in VITE_* or the browser bundle. Preserve HTML no-cache, immutable hashed assets, missing asset 404 and anonymous API security checks. Encrypted off-VM backup and external monitoring → Discord complement Dokploy monitoring. This single VM has no HA guarantee; the 24-hour soak was waived.

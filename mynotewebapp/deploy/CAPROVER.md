# CapRover runtime · Lightsail Malaysia

Production: VM `notesweb-my-02-caprover`, Malaysia `ap-southeast-5`, Ubuntu 24.04, 4 GB / 2 vCPU / 80 GB, CapRover 1.15.1 on single-node Docker Swarm. The Lightsail firewall accepts 80/443 only from Cloudflare ranges and SSH only from the owner's IP; Cloudflare proxied DNS + Origin CA certificate, Full (strict).

| Setting | Production value |
| --- | --- |
| CapRover dashboard / API | `https://captain.nhannotes.id.vn` (admin password + per-app deploy tokens) |
| FE app | `notesweb-fe` · custom domain `nhannotes.id.vn` |
| Image | `ghcr.io/nntn32/notesweb-fe@sha256:…` (private GHCR, pulled with a read-only registry credential) |
| Container port | 80; no host binding |
| API_UPSTREAM | `http://server:8081` (BE app `server` on the CapRover overlay network) |
| Health | image `HEALTHCHECK` on `/healthz` |
| TLS | per-app nginx template serves `/nginx-shared/origin.pem`; never enable Let's Encrypt behind Cloudflare |

Browser → Cloudflare → CapRover nginx → FE/Nginx → same-origin `/api` → BE. PostgreSQL, Redis and RabbitMQ are CapRover apps without domains or published ports. Keep DB/queue/admin ports closed.

The Nginx proxy preserves method, URI, query and auth/cookie contracts. Do not strip `/api` or use localhost as the backend hostname. `/healthz` proves only FE availability; check BE readiness and public API contracts separately. Notes/Tasks remain local pending a lossless sync contract.

Build images in GitHub Actions, not on the 4 GB VM. Never embed secrets in VITE_* or the browser bundle. Preserve HTML no-cache, immutable hashed assets, missing asset 404 and anonymous API security checks. This single VM has no HA guarantee.

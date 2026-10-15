# FE / BE API contract

Reviewed on 2026-10-05 against local BE controllers in `NotesWebApp/notesWeb` and live OpenAPI at `https://server.nhannotes.id.vn/v3/api-docs`. Local source establishes behavior; OpenAPI confirms routes and request schemas, not successful authentication.

## Authentication implemented by FE

All paths below use the same-origin `/api` proxy. Cookies are sent by the browser. Never put the rotation secret into browser storage or code. Access tokens live only in memory; decoded JWT claims supply display metadata, never authorization decisions.

| Action | Method and path | Request | Response / FE behavior |
| --- | --- | --- | --- |
| Register | POST `/api/auth/register` | `{username, email, password}` | HTTP 200 text, no token. FE then signs in with the same username/password. If sign-in fails, tell the user the account was created and offer the Sign in selector. Do not retry registration. |
| Queue login | POST `/api/auth/login` | `{username, password}` | `{sessionId, status: "PENDING"}`. Email is not the login identifier. |
| Complete login | GET `/api/auth/login/result/{sessionId}` | No body | HTTP 202/PENDING: poll once per second. HTTP 200 `{status:"success", accessToken, userID}`: establish session. Server sets HttpOnly `rotation_secret` cookie and consumes the result once. |
| Restore / renew | POST `/api/auth/refresh` | HttpOnly cookie | `{accessToken, status:"SUCCESS"}`. Share one in-flight refresh within a tab. An obsolete response must not restore a session after logout or a new login. |
| Logout | POST `/api/auth/logout` | HttpOnly cookie | Server revokes the session and expires the cookie. Clear FE session only after success; show retryable failure otherwise. Local notes/tasks remain. |

Login polling is limited to 30 attempts and 45 seconds overall, including network time. Closing or replacing the form aborts requests and delays. Prevent duplicate form submission. Do not automatically repeat POST login/register after network failures.

Google/Apple are not supported by the current BE controller/OpenAPI. Their buttons have been removed until an actual OAuth contract exists.

The legacy persistent `token` storage entry is removed. A page reload uses refresh instead. A 403 must not cause a generic redirect/logout: it can mean denied permission rather than an expired session.

## Backend gaps affecting authentication

- The login consumer publishes failed credentials/system failures only to WebSocket; it does not write a FAIL result for HTTP polling. FE therefore cannot distinguish wrong credentials from a missing/slow result; it reports an unconfirmed login after the bounded timeout. BE should persist terminal failures with a TTL for the existing result endpoint.
- The local Redis session expires after 300 seconds, independently of JWT expiry. FE renews at least every two minutes while mounted, or 30 seconds before access expiry (minimum delay five seconds). Browser suspension may still expire the server session, requiring a fresh login.
- Production must set `app.secure-cookie=true` through BE configuration so the rotation cookie is Secure over HTTPS. The FE production Nginx proxy also enforces Secure, HttpOnly and SameSite=Lax on `rotation_secret`; direct BE clients still require the BE setting. See [Nginx proxy_cookie_flags](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_cookie_flags).
- Refresh/login identity currently comes from JWT claims `sub`, `userId`, `type: "Access"`, `exp`. There is no profile endpoint. BE remains the source of authority.

## Notes / Todo / Weekly Plan integration prerequisites

These views remain local. Do not silently upload an existing notebook or overwrite local drafts with server data after login. A future migration needs explicit import choice, account-isolated caches, visible request failures, and a way to recover local originals.

| API currently in BE | Gap relative to FE |
| --- | --- |
| POST `/notes/creates`, PUT `/notes/update/{noteID}` | Returns HTTP 202 queue acceptance, not persisted completion. Create does not return a note ID or operation ID. Need terminal completion/failure contract and idempotency before reporting server save success. |
| GET `/notes/listNotes`, GET `/notes/{noteID}`, DELETE `/notes/delete/{noteID}` | Root `/notes` prefix differs from auth proxy. Agree a dedicated proxy mapping that does not intercept the FE `/todo` page route. Scope caches to account. |
| POST `/todo/createList`, PUT `/todo/listUpdate/{idList}` | Payload only `{heading, purport}`. FE requires text, date, slot, priority and completion. Agree lossless schema before replacing local data. |
| PUT `/todo/update/{todoID}` | Review whether markDone can restore incomplete state; FE supports toggling both ways. |
| GET `/todo/listUser/{userId}`, DELETE `/todo/delete/{idList}?idUser=...` | PR #50 validates authenticated ownership; supplied owner IDs must match the principal. |

Do not change the BE from this FE chat. Once the missing contracts are implemented and deployed by BE, update this document and add contract tests before enabling cloud sync.

## Validation

Node tests cover queue-to-result flow, bounded polling, malformed/failed result, abort, registration without token, JWT display metadata and existing note/task models. Lint and production build are required before deploy. Live authentication with a real account, cookie renewal and logout still need an end-to-end check; no production test account is created automatically.


## Compatibility review: BE PR #50 (2026-10-15)

Reviewed against BE branch `codex/be-security-pr1`, commit `2ecd1bd69015b085a7181fcd68dc47bfa3acb7ca`, and FE main `df23166`. PR: https://github.com/NNTN32/NotesWebApp/pull/50. Neither deployment nor production traffic is part of this review.

The current frontend has no STOMP/SockJS dependency, WebSocket connection or login-result subscription. Authentication already uses HTTP polling, including when anonymous STOMP is denied. Notes, tasks and weekly planning still store data locally. This change does not introduce realtime connections or upload existing local data.

- Registration sends only username, email and password; the server assigns USER. Client-provided role/status/session metadata are not forwarded.
- Login posts credentials once, polls the opaque session ID and establishes an in-memory session only from the terminal HTTP success. There is no anonymous WebSocket fallback. Pending responses remain bounded and cancellation remains supported.
- Refresh/logout use the same-origin HttpOnly cookie endpoints without an Authorization header. Business requests use the current in-memory Access token. Rotation tokens are rejected by session parsing and cannot replace that Access token.
- Cookie behavior is enforced by the browser and existing Nginx proxy; adapter tests do not claim to exercise browser cookie delivery. Invalid credentials may still time out because the legacy BE consumer does not persist terminal failures for HTTP polling; this pre-existing BE gap remains open.
- CORS allowlist defaults in PR #50 include `http://localhost:5173` and `https://nhannotes.id.vn`. Other frontend origins require explicit BE configuration. Current FE auth uses the same-origin `/api` proxy.

When realtime notification integration is implemented, connect only after login, send `Authorization: Bearer <Access token>` in the STOMP CONNECT native headers (never a query parameter), and subscribe only to `/user/queue/reminder` and `/user/queue/note-updates`. Do not subscribe to `/queue/**`, `/topic/**`, `/user/<another-user>/**` or `/user/queue/login-result`; client SEND frames are denied. Reconnect with a fresh token after renewal and disconnect on logout/account change. A same-origin `/ws` proxy and a user-visible notification contract must be added before enabling that feature; they are absent today.

`tests/pr50Compatibility.test.js` exercises the real Axios client/interceptor plus auth API/session functions against an isolated adapter matching PR #50's HTTP response shapes. It checks login without WebSocket, minimal registration, current Access headers across refresh/logout, rejected Rotation tokens and denied/pending HTTP results. It is a transport contract regression suite, not a browser end-to-end or live broker test.

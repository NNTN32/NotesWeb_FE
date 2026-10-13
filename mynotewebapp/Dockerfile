# The Vite bundle is platform-independent; run Node natively rather than under QEMU.
FROM --platform=$BUILDPLATFORM node:22-alpine AS build
WORKDIR /app
RUN corepack enable && corepack prepare yarn@1.22.22 --activate
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build
ARG REVISION=local
RUN node -e 'const fs=require("node:fs"); const revision=process.argv[1]; if (!/^(local|[a-f0-9]{40})$/.test(revision)) process.exit(1); fs.writeFileSync("dist/version.json", JSON.stringify({revision})+"\n")' "$REVISION"

FROM nginx:stable-alpine AS runtime
ARG REVISION=local
LABEL org.opencontainers.image.revision=$REVISION
RUN apk add --no-cache ca-certificates
COPY deploy/default.conf.template /etc/nginx/templates/default.conf.template
COPY deploy/15-validate-api-upstream.sh /docker-entrypoint.d/15-validate-api-upstream.sh
RUN chmod +x /docker-entrypoint.d/15-validate-api-upstream.sh
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/healthz || exit 1

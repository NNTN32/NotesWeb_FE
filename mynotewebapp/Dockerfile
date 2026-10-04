FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable && corepack prepare yarn@1.22.22 --activate
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM nginx:stable-alpine AS runtime
RUN apk add --no-cache ca-certificates
COPY deploy/default.conf.template /etc/nginx/templates/default.conf.template
COPY deploy/15-validate-api-upstream.sh /docker-entrypoint.d/15-validate-api-upstream.sh
RUN chmod +x /docker-entrypoint.d/15-validate-api-upstream.sh
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/healthz || exit 1

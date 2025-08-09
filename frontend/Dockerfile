# syntax=docker/dockerfile:1
FROM oven/bun:1 as build
WORKDIR /app
COPY package.json package-lock.json* bun.lockb* .npmrc* ./
RUN [ -f package-lock.json ] && npm ci || bun install
COPY . .
RUN bun run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

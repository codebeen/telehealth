FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache openssl
RUN corepack enable && corepack prepare pnpm@10.23.0 --activate

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm prisma generate
RUN pnpm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache openssl
RUN corepack enable && corepack prepare pnpm@10.23.0 --activate

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile --prod=false

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

EXPOSE 3001

CMD ["pnpm", "run", "start:railway"]

FROM node:20-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm

COPY package*.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN npm install -g pnpm

# Install production dependencies only
COPY package*.json pnpm-lock.yaml* ./
RUN pnpm install --prod --frozen-lockfile

# Copy build files and assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["pnpm", "run", "start"]

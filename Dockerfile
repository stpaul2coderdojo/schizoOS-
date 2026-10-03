# ==============================================================================
# Vayu Vaidya • Wallmiki Production Dockerfile
# Standard Container (Google Cloud Run, AWS ECS/Fargate, Docker Compose)
# ==============================================================================

# Stage 1: Build the frontend and bundle the backend
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy full application source code
COPY . .

# Run production build:
# 1. Vite compiles React 19 SPA into /dist
# 2. esbuild bundles server.ts into dist/server.cjs
RUN npm run build

# Stage 2: Minimalist production runtime
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install only production dependencies
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi

# Copy compiled frontend and bundled server from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

# Expose standard container port
EXPOSE 3000

# Start compiled CommonJS server
CMD ["node", "dist/server.cjs"]

# syntax=docker/dockerfile:1.5
FROM oven/bun:1.2.19-debian AS runner

WORKDIR /app

# Install system libraries required by native modules like argon2
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    libstdc++6 \
    ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Copy dependency manifests first for better layer caching
COPY package.json ./

# Install only production dependencies
# (falls back gracefully if there is no lockfile in this subproject)
RUN bun install --production

# Copy application source
COPY . .

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["bun", "run", "start"]

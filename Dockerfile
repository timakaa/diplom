FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Copy and make startup script executable
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Expose port
EXPOSE 3000

# Use the startup script as entrypoint
ENTRYPOINT ["/app/start.sh"]

# Default command (can be overridden in docker-compose)
CMD ["pnpm", "dev:cron"] 
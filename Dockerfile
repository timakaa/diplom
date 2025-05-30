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

# Build the project
RUN pnpm build

# Expose port
EXPOSE 3000

# Start command
CMD ["pnpm", "start:cron"] 
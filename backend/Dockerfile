FROM node:20-alpine AS builder

# Create app directory
WORKDIR /app

# Install all dependencies (including dev) and build
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Production image: prune dev deps for smaller image
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 5000

# Start backend in production
CMD ["npm", "start"]

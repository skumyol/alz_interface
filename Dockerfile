# Use Node.js 18 LTS as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install Expo CLI globally
RUN npm install -g @expo/cli

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose port for Expo dev server
EXPOSE 19000 19001 19002

# Set environment variables
ENV NODE_ENV=production
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S expo -u 1001
RUN chown -R expo:nodejs /app
USER expo

# Start the Expo development server
CMD ["npx", "expo", "start", "--web", "--host", "0.0.0.0"]

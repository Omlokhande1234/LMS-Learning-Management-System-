# Stage 1: Use a specific Node.js version for reproducible builds
FROM node:18.18.2-alpine3.18

# Create a non-root user and group for security
# This is a critical security best practice for production
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --ingroup nodejs nodejs

# Set the working directory
WORKDIR /app

# Copy package files and install production-only dependencies
# Using 'npm ci' is faster and more reliable for automated builds.
# The '--omit=dev' flag skips devDependencies, keeping the image small.
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the rest of the application source code
COPY . .

# Change ownership of the app directory to the non-root user
RUN chown -R nodejs:nodejs /app

# Switch to the non-root user
USER nodejs

# Expose the port the server will run on.
# This should match the PORT variable in your .env file
EXPOSE 10000

# Command to start the server.
# Ensure your start script is correct (e.g., 'app.js', 'server.js', etc.)
CMD [ "node", "index.js" ]


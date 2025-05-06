FROM node:20.13.1-alpine3.18

# Set working directory
WORKDIR /app

# Create a non-root user
RUN adduser -D appuser

# Copy everything and set ownership
COPY --chown=appuser:appuser . .

# Set registry config for GitHub/npm
RUN echo registry=https://registry.npmjs.org/ >> /root/.npmrc && \
    echo @420cry:registry=https://npm.pkg.github.com/ >> /root/.npmrc

# Read GitHub token from Docker secret
RUN --mount=type=secret,id=github_token \
    sh -c 'GITHUB_TOKEN=$(cat /run/secrets/github_token) && \
    echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" >> /root/.npmrc'

# Install and build as root
RUN npm install && npm run build

# Fix permissions so non-root user can access everything
RUN chown -R appuser:appuser /app && \
    chown -R appuser:appuser .next

# Expose port
EXPOSE 3000

# Run as non-root
USER appuser

# Start the app (no re-build)
CMD ["npm", "run", "start-dev"]

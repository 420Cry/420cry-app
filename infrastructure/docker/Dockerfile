FROM node:20.13.1-alpine3.18

# Set the working directory
WORKDIR /app

# Create a non-root user and set ownership for the app directory
RUN adduser -D appuser
RUN chown -R appuser:appuser /app

# Copy the application code
COPY . /app

# Use Docker secrets to handle the GitHub token
RUN echo registry=https://registry.npmjs.org/ >> ~/.npmrc
RUN echo @420cry:registry=https://npm.pkg.github.com/ >> ~/.npmrc

# Debug: Write the GitHub token to a temporary file (for inspection inside the container)
RUN --mount=type=secret,id=github_token \
    GITHUB_TOKEN=$(cat /run/secrets/github_token) && \
    echo "GitHub token is written to /tmp/github_token.txt" && \
    echo ${GITHUB_TOKEN} > /tmp/github_token.txt

# Install project dependencies
RUN npm install

# Build the Next.js app 
RUN npm run build

# Expose the application's port
EXPOSE 3000

# Switch to the non-root user
USER appuser

# Start the Next.js application
CMD ["npm", "run", "start"]

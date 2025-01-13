# Use the Bun base image
FROM oven/bun:1.1.36-alpine

# Install git and other necessary dependencies
RUN apk add --no-cache git openssh

# Set the working directory
WORKDIR /app

# Copy the application code
COPY . /app

# Use Docker secrets to handle the GitHub token (avoid hardcoding the token)
RUN --mount=type=secret,id=github_token \
    GITHUB_TOKEN=$(cat /run/secrets/github_token) && \
    echo registry=https://registry.npmjs.org/ >> ~/.npmrc && \
    echo @420cry:registry=https://npm.pkg.github.com/ >> ~/.npmrc && \
    echo //npm.pkg.github.com/:_authToken=${GITHUB_TOKEN} >> ~/.npmrc

# Install dependencies using Bun (instead of npm)
RUN bun install

# Build the Next.js app using Bun
RUN bun run build

# Expose the application's port
EXPOSE 3000

# Start the Next.js application using Bun
CMD ["bun", "run", "next", "start"]
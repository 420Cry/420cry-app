FROM node:18-bullseye-slim

# Set the working directory
WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y \
  curl bash git unzip && \
  npm install --global corepack

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash

# Add Bun to PATH
ENV PATH="/root/.bun/bin:$PATH"

# Copy application files
COPY . .

# Install dependencies
RUN bun install

# Build Next.js app
RUN bun run next build

# Expose the app's port
EXPOSE 3000

# Start the Next.js app
CMD ["bun", "run", "next", "start"]

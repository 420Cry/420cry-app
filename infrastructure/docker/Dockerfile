# Use the official Bun image
FROM jarredsumner/bun:latest

# Set the working directory
WORKDIR /app

# Copy package.json and bun.lockb
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN bun next build

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js application
CMD ["bun", "next", "start"]
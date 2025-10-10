FROM node:24.10.0-alpine

WORKDIR /app

RUN adduser -D appuser

# Install dependencies only; source code will be mounted at runtime
COPY package*.json ./
COPY --chown=appuser:appuser .npmrc* ./

# Setup private registry with GitHub token
RUN --mount=type=secret,id=github_token \
    sh -c 'GITHUB_TOKEN=$(cat /run/secrets/github_token) && \
    echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" >> /root/.npmrc && \
    npm install'

EXPOSE 3000

USER appuser

CMD ["npm", "run", "dev"]

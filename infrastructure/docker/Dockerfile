FROM node:18-alpine

WORKDIR /app

RUN adduser -D appuser

COPY --chown=appuser:appuser . .

RUN echo registry=https://registry.npmjs.org/ >> /root/.npmrc && \
    echo @420cry:registry=https://npm.pkg.github.com/ >> /root/.npmrc

RUN --mount=type=secret,id=github_token \
    sh -c 'GITHUB_TOKEN=$(cat /run/secrets/github_token) && \
    echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" >> /root/.npmrc'

RUN npm install && npm run build && \
    chown -R appuser:appuser /app/.next

EXPOSE 3000

USER appuser

CMD ["npm", "run", "start-dev"]

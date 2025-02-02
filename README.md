# 420cry-app

This is a Next 420cry application.

## Preparation

1. **Add Development Hosts to the `/etc/hosts` File**:

   - On **Linux/macOS**, add the following lines to your `/etc/hosts` file.
   - On **Windows**, add them to the `C:\Windows\System32\drivers\etc\hosts` file.

   Add the following lines to the file:

   ```bash
   127.0.0.1 app.420.crypto.test
   ```

2. **Copy .env.example to .env**:

   ```bash
   cp .env.example .env
   ```

3. **Access Private NPM Package**:
   We use a private npm package. To access the package, follow these steps:
   - Obtain your token from https://github.com/settings/tokens with the `write:packages` permission.
   - Run the following command to set your NPM token:

```bash
gh auth login --scopes read:packages
```

After authenticating, you can add the token to your environment variables by running:

```bash
export GITHUB_TOKEN=$(gh auth token)
```

❕If you do not wish to use the GitHub CLI, you can authenticate using creating a PAT [here](https://github.com/settings/tokens) and add the token by using the following command (ensure the PAT token has the scope `read:packages`):

```bash
export GITHUB_TOKEN=<your token>
```

After authenticating you can install the dependencies using:
`bash  
    npm i
    `

## Installation

1. Build the Next application:
   ```bash
   npm run build
   ```
2. Run the server:

   ```bash
   npm run dev
   ```

3. Run lint:

```bash
npm run lint
```

reformat

```bash
npm run lint:fix
```

### With Docker

1. Shutdown the dev server docker compose for this project.

   ```bash
   docker compose down
   ```

2. Build and start application in production mode.

   ```bash
   GITHUB_TOKEN=$(gh auth token) docker compose build
   ```

3. Start the application in DEV mode.
   ```bash
   docker-compose up -d
   ```

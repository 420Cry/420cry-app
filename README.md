# 420Cry Next JS APP

## Contents

- [Setup](#setup)
- [Development](#development)
  - [Testing](#testing)
- [Production](#production)
  - [Without Docker](#without-docker)
  - [With Docker](#with-docker)
- [FAQ](#faq)

## Setup
**Add Development Hosts to the `/etc/hosts` File**:
    * On **Linux/macOS**, add the following lines to your `/etc/hosts` file.
    * On **Windows**, add them to the `C:\Windows\System32\drivers\etc\hosts` file.

    Add the following lines to the file:
    ```bash
    127.0.0.1 420.app.crypto.test
    ```

***The package manager that is used for this project is [Bun](https://bun.sh/).***

Install the dependencies using:

```bash
bun install
```

## Development

Start the development server on `http://localhost:3000`:

```bash
bun run dev
```

Run the linter:

```bash
bun run lint
```

### Testing

## Production
### Without Docker

Build the application for production:

```bash
bun run build
```

Locally preview production build:

```bash
bun run preview
```

### With Docker
We can build the application using Docker in the same way as we do for production.

1. Shutdown the dev server docker compose for this project.
    ```bash
    cd ~/projects/420/app/ 
    docker compose down
    ```

2. Build and start application in production mode.
    ```bash
    GITHUB_TOKEN=$(gh auth token) docker compose -f docker-compose.production-mode.yaml up --build -d
    ```
   
3. The application is available on `app.dotweb.test`.

#### Return to development mode
1. Shutdown the production mode application.
    ```bash
    docker compose down
    ```
   
2. Start the application in DEV mode.
    ```bash
    docker compose up -d
   ```
   
#### Debug in production mode
The debug is a bit hard in the production mode because you need after every change that you want to test need to run the build.

1. Shutdown the containers.
   ```bash
    docker compose down
   ```
   
2. Do every change that you need to test from your editor as normal.

3. Rebuild and start application in production mode.
    ```bash
    GITHUB_TOKEN=$(gh auth token) docker compose -f docker-compose.production-mode.yaml up --build -d
    ```
   
4. Follow the same process as many times as you want.

## FAQ

### How do I log out of GitHub?

Do so by removing the token from your environment variables and logging out of the GitHub CLI:

```bash
unset GITHUB_TOKEN && gh auth logout
```

# 420cry-app

This is a Next 420cry application.
## Prerequisites

- Bun 1.1.22

## Preparation

1. **Add Development Hosts to the `/etc/hosts` File**:
    * On **Linux/macOS**, add the following lines to your `/etc/hosts` file.
    * On **Windows**, add them to the `C:\Windows\System32\drivers\etc\hosts` file.

    Add the following lines to the file:
    ```bash
    127.0.0.1 app.420.crypto.test
    ```
2. **Copy .env.example to .env**:
    ```bash
    cp .env.example .env
    ```
## Installation

1. Clone the repository
2. Install dependencies:
    ```bash
    bun install
    ```
3. Build the Next application:
    ```bash
    bun run build
    ```
4. Run the server:
    ```bash
    bun run dev
    ```

4. Run lint:
    ```bash
    bun run lint
    ```


5. Run Test:
    ```bash
    bun run test
    ```
### With Docker
1. Shutdown the dev server docker compose for this project.
    ```bash
    docker compose down
    ```

2. Build and start application in production mode.
    ```bash
    docker compose build
    ```

3. Start the application in DEV mode.
    ```bash
    docker compose up -d
   ```
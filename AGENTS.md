# AI Assistant & Agent Guidelines: Docker Compose First Policy

## ⚠️ Mandatory Execution Directive

**CRITICAL RULE:** All application commands, scripts, tests, builds, and package installations **MUST be executed inside Docker Compose containers**. 

**DO NOT** run Python (`python`, `pip`, `pytest`, `uvicorn`) or Node.js (`npm`, `npx`, `node`) directly on the host system.

Executing tasks within the designated containerized environments guarantees:
1. Exact parity between development, testing, and production runtimes.
2. Protection of host system stability and prevention of dependency pollution.
3. Proper configuration of network aliases (`backend:8000`), volumes, and environment variables.

---

## 🏗️ Services Architecture

| Service | Container Name / Role | Ports | Working Directory | Key Mounts (via `compose.override.yaml`) |
| :--- | :--- | :--- | :--- | :--- |
| **`backend`** | FastAPI, SQLite, Python 3.11 | `8000:8000` | `/app` | `./backend` → `/app/backend`<br>`./data` → `/app/data`<br>`./logs` → `/app/logs` |
| **`frontend`** | Next.js 16 (Turbopack), Node 20 | `3000:3000` | `/app` | `./frontend` → `/app`<br>`/app/node_modules`<br>`/app/.next` |

---

## 📋 Command Execution Reference

When executing commands or advising the user on commands, always format them as Docker Compose operations:

### 1. Stack Lifecycle
- **Start the environment (detached):**
  ```bash
  docker compose up -d
  ```
- **Rebuild and restart containers (after updating `pyproject.toml` or `package.json`):**
  ```bash
  docker compose up -d --build
  ```
- **Stop the environment:**
  ```bash
  docker compose down
  ```
- **Inspect service status:**
  ```bash
  docker compose ps
  ```
- **Stream logs:**
  ```bash
  docker compose logs -f backend
  docker compose logs -f frontend
  ```

---

### 2. Backend Commands (`backend` service)
*Use `docker compose exec backend <command>` when containers are running, or `docker compose run --rm backend <command>` if stopped.*

- **Run Python tests:**
  ```bash
  docker compose exec backend pytest
  ```
- **Run mock detection / main application:**
  ```bash
  docker compose exec backend python -m backend.main --mode mock
  ```
- **Execute Python one-liners / scripts:**
  ```bash
  docker compose exec backend python -c "from backend.database import Database; db = Database(); print(db.get_stats())"
  ```
- **Install / inspect dependencies:**
  ```bash
  docker compose exec backend pip list
  docker compose exec backend pip install <package_name>
  ```
- **Interactive container shell:**
  ```bash
  docker compose exec backend /bin/bash
  ```

---

### 3. Frontend Commands (`frontend` service)
*Use `docker compose exec frontend <command>` when containers are running, or `docker compose run --rm frontend <command>` if stopped.*

- **Run linting / formatting checks:**
  ```bash
  docker compose exec frontend npm run lint
  ```
- **Run frontend tests:**
  ```bash
  docker compose exec frontend npm test
  ```
- **Install / manage npm packages:**
  ```bash
  docker compose exec frontend npm install <package_name>
  ```
- **Run production build verification:**
  ```bash
  docker compose exec frontend npm run build
  ```
- **Interactive container shell:**
  ```bash
  docker compose exec frontend /bin/sh
  ```

---

## ⚡ Development & Hot-Reloading

- **Live Code Sync:** Files in `./backend` and `./frontend` are bind-mounted into the containers. Changes made on the host take effect immediately without rebuilding the image.
- **FastAPI Backend:** Runs with `--reload` enabled in local development mode.
- **Next.js Frontend:** Runs with Next.js Turbopack dev server and `WATCHPACK_POLLING=true` enabled for optimal hot module replacement (HMR).
- **Persistent Data:** SQLite databases and event logs are stored in `./data` and `./logs` on the host, preserving state across container rebuilds.

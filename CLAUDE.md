# AI Rules & Context

Please refer to and strictly adhere to [AGENTS.md](./AGENTS.md).

## Critical Rule
Always run all application, backend, and frontend commands via **Docker Compose**:
- Backend commands: `docker compose exec backend <cmd>` (or `docker compose run --rm backend <cmd>`)
- Frontend commands: `docker compose exec frontend <cmd>` (or `docker compose run --rm frontend <cmd>`)
- Never run `python`, `pip`, `pytest`, `npm`, or `node` directly on the host system.

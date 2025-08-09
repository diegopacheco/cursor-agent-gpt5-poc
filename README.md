## Coaching App

### Stack
- Frontend: Bun + Vite + React + TypeScript
- Backend: Go + Gin + MySQL
- Infra: Docker Compose

### Run with Docker
Prereqs: Docker and Docker Compose

Commands:
```
bash start.sh
```
This starts MySQL, backend on 8080, and frontend on 5173.

### Local Dev
- Frontend: `cd frontend && bunx vite`
- Backend: `cd backend && MYSQL_DSN="root:root@tcp(127.0.0.1:3306)/coaching?parseTime=true" go run ./cmd/server`

### Tests
- Frontend: `cd frontend && npm test`
- Backend: `cd backend && go test ./...`

### Database
- Schema: `db/schema.sql`
- Data volume: `db/mysql_data/` (gitignored)


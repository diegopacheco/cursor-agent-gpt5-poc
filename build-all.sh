#!/usr/bin/env bash
set -euo pipefail
bash backend/build.sh
cd frontend && npm ci || npm install && npm run build && cd - >/dev/null
docker build -t coaching-backend:latest backend
docker build -t coaching-frontend:latest frontend

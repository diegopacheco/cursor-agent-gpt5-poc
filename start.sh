#!/usr/bin/env bash
set -euo pipefail
if ! command -v docker >/dev/null 2>&1; then echo "docker is required"; exit 1; fi
if ! command -v docker compose >/dev/null 2>&1 && ! command -v docker-compose >/dev/null 2>&1; then echo "docker compose is required"; exit 1; fi
mkdir -p db/mysql_data
if command -v docker compose >/dev/null 2>&1; then docker compose up --build; else docker-compose up --build; fi

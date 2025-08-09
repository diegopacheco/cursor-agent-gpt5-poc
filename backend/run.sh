#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
: "${PORT:=8080}"
: "${MYSQL_DSN:=root:root@tcp(127.0.0.1:3306)/coaching?parseTime=true}"
./bin/backend || (go build -o bin/backend ./cmd/server && ./bin/backend)

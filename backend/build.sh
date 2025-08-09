#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
go fmt ./...
go mod tidy
go build -o bin/backend ./cmd/server

#!/usr/bin/env bash
set -euo pipefail

# Backend: build and test
pushd backend >/dev/null
bash build.sh
go test ./...
popd >/dev/null

# Frontend: install deps, run tests, and build without requiring Bun
mkdir -p frontend/public
if [ -f logo-app.png ]; then
	cp -f logo-app.png frontend/public/logo-app.png
fi
pushd frontend >/dev/null
npm ci || npm install
npm test --silent || { echo "Frontend tests failed"; exit 1; }
npx vite build
popd >/dev/null

# Docker images
docker build -t coaching-backend:latest backend
docker build -t coaching-frontend:latest frontend

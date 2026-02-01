# Makefile for HomeLab Helper

.PHONY: dev dev-backend dev-frontend install deploy

# Install all dependencies
install:
	npm install
	cd frontend && npm install

# Run backend (Wrangler) and frontend (Vite) in parallel
# Note: On Windows, you may need a shell that supports '&' or use 'start'
dev:
	npx concurrently "npm run dev" "cd frontend && npm run dev"

# Run only backend
dev-backend:
	npm run dev

# Run only frontend
dev-frontend:
	cd frontend && npm run dev

# Build frontend
build-frontend:
	cd frontend && npm run build

# Deploy backend
deploy-backend:
	npm run deploy

# Deploy frontend (Pages)
deploy-frontend: build-frontend
	npx wrangler pages deploy frontend/dist

# Clean up build artifacts and temp files
clean:
	rm -rf dist
	rm -rf frontend/dist
	rm -rf .wrangler
	rm -rf node_modules
	rm -rf frontend/node_modules

.PHONY: help install dev build serve typecheck clean

help:
	@echo "Available commands:"
	@echo "  make install    - Install dependencies"
	@echo "  make dev        - Start the Vite dev server on port 8000 (hot reload)"
	@echo "  make build      - Build and prerender the site into dist/"
	@echo "  make serve      - Build, then serve dist/ on port 8000 (production check)"
	@echo "  make typecheck  - Run TypeScript with no emit"
	@echo "  make clean      - Remove build output and .DS_Store files"

install:
	@npm install

dev:
	@npm run dev

build:
	@npm run build

# Serves the real prerendered output, which is what GitHub Pages deploys.
serve:
	@npm run serve

typecheck:
	@npm run typecheck

clean:
	@rm -rf dist dist-ssr
	@find . -type f -name '.DS_Store' -not -path './node_modules/*' -delete
	@echo "Cleaned build output and temporary files"

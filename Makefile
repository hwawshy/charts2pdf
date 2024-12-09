.PHONY: *

vite-dev:
	docker run --rm -it -v $(shell pwd)/app:/app -p 5173:5173 -w /app node:22-alpine npm run dev

vite-build: vite-build-server vite-build-client

vite-build-server:
	docker exec -it php npm run build:server

vite-build-client:
	docker exec -it php npm run build

vite-server:
	docker run --rm -it -v $(shell pwd)/app:/app -p 5175:5175 -w /app -e NODE_ENV=development node:22-alpine node server.js
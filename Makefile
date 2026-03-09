include .env
export

.PHONY: up down logs db-shell

## up: Start all services in detached mode
up:
	docker compose up -d --build

## down: Stop and remove all containers (data volumes are preserved)
down:
	docker compose down

## logs: Tail logs for all services (Ctrl+C to exit)
logs:
	docker compose logs -f

## db-shell: Open a psql shell inside the postgres container
db-shell:
	docker compose exec postgres psql -U $(POSTGRES_USER) -d $(POSTGRES_DB)

build:
	docker compose build

up:
	docker compose -f docker-compose.yml up -d --build

up-prod:
	docker compose -f docker-compose.prod.yml up -d --build

logs:
	docker compose logs -f be

logs-wk:
	docker compose logs -f wk

restart:
	docker compose down && docker compose build && docker compose up -d

down:
	docker compose down

down-v:
	docker compose down -v

ps:
	docker compose ps
build:
	docker compose build

up:
	docker compose -f docker-compose.yml up -d --build

up-prod:
	docker compose -f docker-compose.prod.yml up -d --build

logs:
	docker compose logs -f be

logs-bk:
	docker compose logs -f bk

restart:
	docker compose down && docker compose build && docker compose up -d

down:
	docker compose down

ps:
	docker compose ps
# FinTracker

FinTracker - монорепозиторий персонального финансового трекера.

Проект состоит из:
- backend: REST API на Go + chi
- frontend: Next.js приложение (App Router)
- postgres: база данных PostgreSQL в Docker Compose

## Технологии

### Backend
- Go 1.25
- chi v5
- cors middleware
- slog (структурированные логи)
- PostgreSQL 16

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript 5 (strict)
- Tailwind CSS v3
- TanStack Query v5
- Zustand (auth)
- Axios
- React Hook Form + Zod
- Vitest + Testing Library

## Структура репозитория

```text
.
├── backend/
│   ├── cmd/api/main.go
│   ├── internal/
│   │   ├── config/
│   │   ├── domain/
│   │   ├── http/
│   │   └── repo/
├── frontend/
│   ├── app/
│   ├── src/
│   └── __tests__/
├── docker-compose.yml
├── Makefile
└── .env.example
```

## Быстрый старт (Docker)

### 1. Подготовить env

Скопируйте шаблон окружения и заполните секреты:

```bash
cp .env.example .env
```

Минимально обязательно поменять:
- `POSTGRES_PASSWORD`
- `JWT_SECRET`

### 2. Поднять сервисы

```bash
make up
```

Запустятся сервисы:
- postgres: `localhost:5432`
- backend: `http://localhost:8080`
- frontend: `http://localhost:5173`

### 3. Проверить здоровье backend

```bash
curl -i http://localhost:8080/health
```

Ожидается `HTTP/1.1 200 OK`.

### Полезные команды

```bash
make logs      # логи всех сервисов
make down      # остановить контейнеры
make db-shell  # psql внутри контейнера postgres
```

## Запуск без Docker (локально)

## Backend

```bash
cd backend
go run ./cmd/api
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

По умолчанию frontend будет доступен на `http://localhost:3000`.

Важно: в Docker Compose frontend работает на `5173`, а CORS в backend сейчас разрешает origin `http://localhost:5173`.

## Переменные окружения

Источник правды: `.env.example`.

Ключевые переменные:
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DB`
- `DB_HOST`
- `DB_PORT`
- `DB_SSLMODE`
- `HTTP_HOST`
- `BACKEND_PORT`
- `FRONTEND_PORT`
- `JWT_SECRET`
- `APP_ENV`
- `NEXT_PUBLIC_API_URL`

Пример для frontend API:
- `NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1`

## API

Базовый префикс API: `/api/v1`

Маршруты:
- `/api/v1/accounts` (GET, POST)
- `/api/v1/accounts/{id}` (GET, PUT, DELETE)
- `/api/v1/transactions` (GET, POST)
- `/api/v1/transactions/{id}` (GET, PUT, DELETE)
- `/health` (GET)

Текущее состояние:
- роуты подключены
- хендлеры `accounts` и `transactions` пока возвращают `501 Not Implemented`
- endpoint `/auth/login` пока не реализован в backend (но вызывается frontend)

## Frontend страницы

- `/login`
- `/dashboard`
- `/accounts`
- `/accounts/[id]`
- `/transactions`

## Проверки качества

### Frontend

```bash
cd frontend
npm run lint
npm run typecheck
npm run test
```

### Backend

```bash
cd backend
go build ./...
go vet ./...
go test ./...
```

## Текущие ограничения

- Сервисный слой backend (`handler -> service -> repo`) в процессе реализации.
- Полный auth flow (JWT login endpoint + middleware) в процессе реализации.
- Часть UI работает с реальным API-клиентом, но зависит от незавершенных backend endpoint-ов.

## Лицензия

Лицензия не указана.

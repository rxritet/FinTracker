# FinTracker Copilot Instructions

## 1) Контекст проекта
FinTracker - персональный финансовый трекер.

Монорепо:
- backend (Go 1.25, chi v5, PostgreSQL)
- frontend (Next.js 14+ App Router, TypeScript 5, Tailwind v3)
- docker-compose.yml
- Makefile
- .env.example

Go module:
- github.com/yourusername/fintracker-backend

## 2) Неприкосновенные правила
- Не коммитить напрямую в main, только через PR.
- Не хардкодить секреты, только env.
- Не менять docker-compose.yml и Makefile без инфраструктурной необходимости.
- Любые изменения должны проходить проверки: lint -> typecheck -> tests.
- Коммит-префиксы: feat:, fix:, refactor:, test:, chore:, docs:.
- Комментарии в PR и пояснения в коде писать на русском.

## 3) Источник правды по env
Главный файл: .env.example в корне.

Ключевые переменные:
- POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB
- DB_HOST=postgres, DB_PORT=5432, DB_SSLMODE=disable
- HTTP_HOST=0.0.0.0, BACKEND_PORT=8080, FRONTEND_PORT=3000
- JWT_SECRET
- APP_ENV=local|dev|prod
- NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1

## 4) Docker/оркестрация
- Сервисы: postgres, backend, frontend.
- postgres:16-alpine + healthcheck pg_isready.
- backend depends_on postgres (service_healthy).
- frontend depends_on backend.
- Использовать именованный volume: fintracker_postgres_data.
- При смене фронтенд-стека синхронизировать FRONTEND_PORT и frontend/Dockerfile.dev.

## 5) Backend: архитектура и правила
Стек:
- Go 1.25
- Router: github.com/go-chi/chi/v5
- CORS: github.com/go-chi/cors
- DB: PostgreSQL 16
- Auth: JWT (secret из JWT_SECRET)
- Config: internal/config

Слои:
- handler -> service -> repo
- В хендлерах не держать бизнес-логику.
- Интерфейсы объявлять на стороне потребителя (service/handler), не в repo.

Обязательные правила:
- Для IO-функций первым аргументом передавать context.Context.
- Ошибки не игнорировать через _. 
- Конфиг читать только через config.Load().
- Логирование - log/slog, структурированное.
- Все ответы API в JSON.

API и формат ошибок:
- Base path: /api/v1
- Error envelope: { "error": string, "code": string }
- Коды: NOT_FOUND, INVALID_INPUT, UNAUTHORIZED, FORBIDDEN, INTERNAL

SQL/DB правила:
- Только параметризованные запросы ($1, $2, ...).
- Деньги хранить в NUMERIC(18,2), не float.
- FK для дочерних сущностей с ON DELETE CASCADE.
- Операция transfer должна быть транзакционной.

## 6) Frontend: архитектура и правила
Стек (строго):
- Next.js 14+ (App Router only)
- TypeScript 5 (strict, без any)
- Tailwind CSS v3
- Zustand (только auth)
- TanStack Query v5 (все data fetching)
- Axios
- React Hook Form + Zod
- lucide-react

Запрещено:
- Redux, MobX, SWR
- MUI, Chakra, Ant Design, Shadcn (если явно не попросили)

Правила кода:
- 'use client' только там, где нужен браузерный API/стейт.
- Не использовать useEffect для загрузки данных.
- Типизировать props и return values.
- Денежные значения всегда форматировать через Intl.NumberFormat с явной currency.
- Каждый список обязан иметь состояния: loading (Skeleton), empty, error.
- Не использовать any / as unknown / @ts-ignore без аргументированного комментария.

Auth/client правила:
- Токен хранить под ключом ft_access_token.
- На 401: clearToken + redirect на /login.
- Базовый URL API: process.env.NEXT_PUBLIC_API_URL ?? '/api/v1'.

## 7) Контроль качества
Frontend minimum gate:
- npx tsc --noEmit -> 0 errors
- npx eslint . --max-warnings 0 -> 0 warnings
- Smoke-тест минимум по одному на страницу (Vitest + Testing Library)
- Без console.error в браузере
- Responsive минимум для 375px и 1280px

Backend minimum gate:
- go build ./... -> 0 errors
- go vet ./... -> 0 warnings
- golangci-lint run -> 0 errors
- Табличные тесты сервисов
- GET /health -> 200

## 8) Приоритеты реализации
Backend:
1. Подключить pgx/v5, инициализировать пул в main.
2. Добавить миграции в backend/migrations.
3. Реализовать AccountRepo (CRUD).
4. Реализовать TransactionRepo (CRUD + transfer в транзакции).
5. Добавить AccountService и TransactionService.
6. Подключить сервисы в handlers.
7. Добавить login + JWT middleware.
8. Добавить тесты сервисов через моки.

Frontend:
1. Поддерживать структуру App Router.
2. Держать src/types/index.ts синхронизированным с backend domain.
3. Использовать API-layer (чистые async функции) + Query hooks.
4. Довести страницы: /login, /dashboard, /accounts, /accounts/[id], /transactions.
5. Поддерживать smoke-тесты на каждую страницу.

Infrastructure:
1. Обновить frontend/Dockerfile.dev под Next.js (порт 3000).
2. Синхронизировать FRONTEND_PORT в .env.example (если меняется).
3. Синхронизировать CORS backend под актуальный frontend origin.

## 9) Практика изменений
- Делать минимально необходимый diff, без лишних рефакторингов.
- При фиче, затрагивающей API, обновлять backend и frontend контракт одновременно.
- Перед финалом всегда запускать релевантные проверки.
- Если есть конфликт требований, приоритет: безопасность -> корректность -> DX.

# node-concurrency-api

A small Express API that demonstrates how to scale CPU-bound work in Node:
the process is clustered across CPU cores, and heavy per-request work is pushed
onto a pool of worker threads so the event loop stays responsive.

## Stack

- Express 5 + TypeScript (ESM, run with `tsx`)
- Prisma 7 with PostgreSQL
- Node `cluster` for multi-process scaling, `worker_threads` for CPU work
- pino for logging, PM2 for process management

## How it works

- `cluster.ts` forks one worker process per CPU core and restarts any that die
  unexpectedly.
- `WorkerPool` keeps a fixed set of worker threads and a bounded queue. Requests
  that need heavy computation (`/users/:id/report`) or password hashing
  (`/users/heavy`) hand the job to a free worker; the pool rejects with a 503
  once the queue is full.
- OS-specific behaviour (worker script paths, shutdown signals, cluster
  scheduling) is handled through `src/utils/platform.ts` so the same code runs
  on Windows, Linux, and macOS.

## Getting started

Requires Node 20+ and a PostgreSQL database.

```bash
npm install
cp .env.example .env        # then fill in the values
npx prisma migrate dev      # set up the schema
npm run dev                 # start with reload on http://localhost:3000
```

To run the clustered build under PM2:

```bash
npm run build
pm2 start ecosystem.config.cjs
```

Or bring up the app and database together with Docker:

```bash
docker compose up --build
```

## Configuration

Set these in `.env` (see `.env.example`):

| Variable           | Description                          | Default       |
| ------------------ | ------------------------------------ | ------------- |
| `DATABASE_URL`     | PostgreSQL connection string         | —             |
| `PORT`             | HTTP port                            | `3000`        |
| `NODE_ENV`         | `development` / `production`         | `development` |
| `WORKERS_COUNT`    | Worker threads per pool              | `4`           |
| `THREAD_POOL_SIZE` | Max queued jobs before a 503         | `4`           |

## Endpoints

| Method | Path                 | Description                                       |
| ------ | -------------------- | ------------------------------------------------ |
| GET    | `/users`             | List all users                                   |
| POST   | `/users`             | Create a user                                    |
| POST   | `/users/heavy`       | Create a user, hashing the password in a worker  |
| GET    | `/users/:id/report`  | Run a CPU-heavy report job on a worker thread    |
| DELETE | `/users/:id`         | Delete a user                                    |
| GET    | `/health`            | Process stats (pid, thread id, memory, uptime)   |

## Scripts

- `npm run dev` — start in watch mode
- `npm run build` — compile to `dist/`
- `npm start` — run the compiled build
- `npm run lint` — run ESLint

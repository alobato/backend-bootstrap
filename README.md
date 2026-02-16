# Backend Bootstrap

A production-ready Node.js backend template with **GraphQL**, **REST API**, **PostgreSQL**, and **JWT authentication**. Use this as a starting point for your own projects—replace the example entities (authors, books, categories, publishers) with your domain models.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![GraphQL](https://img.shields.io/badge/GraphQL-Apollo-311C87.svg)](https://www.apollographql.com/)
[![Drizzle ORM](https://img.shields.io/badge/ORM-Drizzle-orange.svg)](https://orm.drizzle.team/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791.svg)](https://www.postgresql.org/)

---

## Features

- **Dual API**: GraphQL (Apollo Server) + REST (Express)
- **Database**: Drizzle ORM + PostgreSQL
- **Auth**: JWT (header or cookie), bcrypt password hashing
- **Validation**: Zod schemas for REST and services
- **TypeScript**: Strict mode, ESM

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Language | TypeScript |
| API | Express 5 |
| GraphQL | Apollo Server 5, graphql-ws |
| ORM | Drizzle ORM |
| Database | PostgreSQL |
| Validation | Zod |
| Auth | JWT, bcryptjs |

---

## Prerequisites

- **Node.js** 20+
- **pnpm** (or npm/yarn)
- **PostgreSQL** 14+

---

## Quick Start

```bash
# Clone the repository
git clone <your-repo-url>
cd backend-bootstrap

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL, JWT_SECRET, etc.

# Push schema to database
pnpm db:push

# Run in development
pnpm dev
```

### `db:push` vs `db:generate` + `db:migrate`

| | **`db:push`** | **`db:generate` + `db:migrate`** |
|---|---|---|
| **What it does** | Compares code schema with DB and applies changes directly | Generates SQL migration files and then applies them to DB |
| **Files** | Doesn't create/use `.sql` files | Generates files in `drizzle/*.sql` |
| **History** | No versioned history | Versioned migration history |
| **When to use** | Fast development, prototyping | Production, CI/CD, large teams |

Use `pnpm db:push` for dev. For production, prefer `pnpm db:generate` (generates `.sql` files) and `pnpm db:migrate` (applies to DB).

---

Server runs at `http://localhost:8000`.

- **GraphQL**: `http://localhost:8000/graphql`
- **REST API v1**: `http://localhost:8000/api/v1/`
- **Health**: `http://localhost:8000/health`

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | Secret for JWT signing | `supersecret` |
| `PORT` | HTTP port | `8000` |
| `MASTER_PASSWORD` | Optional bypass for login (dev) | - |

---

## Authentication & Context

### Token (JWT)

Login returns a JWT signed with `JWT_SECRET`, valid for 7 days. The token can be sent in two ways:

- **Header**: `Authorization: Bearer <token>`
- **Cookie**: `auth-token` (HttpOnly, set automatically on login)

The JWT payload contains only the `sub` (subject). Do not store sensitive data in the token.

### Password digest

Passwords are never stored in plain text. On user creation/update:

- The plain text password is hashed with **bcrypt** (10 rounds)
- Only the hash is persisted in the `password` column of the `users` table

On login, `bcrypt.compare()` verifies if the provided password matches the hash. Optionally, `MASTER_PASSWORD` in `.env` allows bypass in development environment.

### sub (subject)

The `sub` is a unique user identifier (UUID, generated on signup). It:

- Is stored in the `users` table and included in the JWT payload
- Identifies the user without exposing email or other data in the token
- Is used to fetch the user from the DB when the token is validated (`UserService.getUserBySub`)

Flow: valid token → extract `sub` → fetch user from DB → complete user available in context.

### GraphQL Context

The context is created **on each request** in `src/context.ts`:

1. Reads the token from the `Authorization` header or `auth-token` cookie
2. Validates the token and extracts the `sub`
3. Fetches the user from the DB by `sub`
4. Returns `{ user, res }` — `user` is `null` if there's no valid token

In resolvers, use `context.user` to check authentication. The `@auth(role: "admin")` directive protects fields that require login and/or a specific role.

---

## Project Structure

```
src/
├── index.ts              # App entry, Express + Apollo setup
├── context.ts            # GraphQL context (user from JWT)
├── db/
│   ├── index.ts          # DB connection, drizzle instance
│   └── schema.ts         # Drizzle tables & relations
├── services/
│   ├── index.ts          # Service exports
│   ├── schemas.ts        # Zod schemas for validation
│   ├── UserService.ts    # Auth-related (keep or extend)
│   └── *Service.ts       # Domain services (replace)
├── graphql/
│   ├── index.ts          # Schema assembly
│   ├── directives/       # Custom directives (e.g. @auth)
│   ├── resolvers/        # GraphQL resolvers (replace)
│   └── __generated__/    # Codegen output (resolvers-types, schema.graphql)
├── routes/
│   ├── index.ts          # Route mounting
│   ├── health.ts         # Health check (keep)
│   └── v1/               # REST v1 endpoints (replace)
└── utils/
    └── jwt.ts            # JWT sign/verify
```

---

## What to Customize

This is a **bootstrap** project. The example entities (authors, books, categories, publishers, users) are placeholders. Replace them with your own domain.

### 1. Database schema (`src/db/schema.ts`)

- Add, remove, or change tables.
- Keep `users` if you use JWT auth, or adapt it.
- Run `pnpm db:push` or `pnpm db:generate` after changes.

### 2. Zod schemas (`src/services/schemas.ts`)

- Add schemas for each create/update/search operation.
- Use `.describe()` for better AI/LLM hints.

### 3. Services (`src/services/*.ts`)

- One file per domain entity.
- Encapsulate DB logic; used by both GraphQL and REST.
- Use Zod types: `z.infer<typeof YourSchema>`.

### 4. GraphQL resolvers (`src/graphql/resolvers/*.ts`)

- One file per entity (e.g. `Author.ts`, `Book.ts`).
- Export `typeDefs` and `resolvers`.
- Register in `src/graphql/resolvers/index.ts`.

### 5. REST routes (`src/routes/v1/*.ts`)

- Add route files per resource.
- Validate with Zod, call services, return JSON.
- Mount in `src/routes/v1/index.ts`.

### 6. Context (`src/context.ts`)

- Adjust if your user model or auth flow changes.

---

## GraphQL Codegen

### What it does

[GraphQL Code Generator](https://the-guild.dev/graphql/codegen) generates TypeScript types from your GraphQL schema and operations. It provides:

- **`resolvers-types.ts`**: Typed resolvers based on the schema.
- **`schema.graphql`**: Introspected schema file (used by GraphQLSP for IDE support).

### How to run

1. Start the server: `pnpm dev`
2. In another terminal: `pnpm run generate`

The codegen config (`codegen.ts`) uses the live schema at `http://localhost:8000/graphql`, so the server must be running.

### Config (`codegen.ts`)

```ts
schema: "http://localhost:8000/graphql",
generates: {
  "./src/graphql/__generated__/resolvers-types.ts": { ... },
  "./src/graphql/__generated__/schema.graphql": { ... },
}
```

Regenerate after changing type definitions or resolvers.

---

## Architecture & Layers

```
┌─────────────────────────────────────────────────────────────┐
│  API Layer                                                   │
│  • REST (Express routes)  • GraphQL (Apollo resolvers)       │
│  • Request parsing, validation, HTTP response                │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  Service Layer                                               │
│  • Business logic                                            │
│  • Zod validation                                            │
│  • Orchestrates DB access                                    │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  Data Layer                                                  │
│  • Drizzle ORM                                               │
│  • Schema, queries, migrations                               │
└─────────────────────────────────────────────────────────────┘
```

| Layer | Responsibility |
|-------|----------------|
| **API** | Parse requests, validate input, call services, format responses |
| **Service** | Business rules, validation (Zod), transactions |
| **Data** | Schema, queries, relations; no business logic here |

---

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Run with hot reload (tsx --watch) |
| `pnpm build` | Compile TypeScript to `dist/` |
| `pnpm start` | Run compiled `dist/index.js` |
| `pnpm db:push` | Push schema changes to DB |
| `pnpm db:generate` | Generate Drizzle migrations |
| `pnpm db:migrate` | Run migrations |
| `pnpm db:studio` | Open Drizzle Studio |
| `pnpm generate` | Run GraphQL Codegen (server must be running) |

---

## Example API Usage

### GraphQL

```graphql
query {
  authors {
    id
    firstName
    lastName
  }
}

mutation {
  createAuthor(input: { firstName: "Jane", lastName: "Doe" }) {
    id
    firstName
    lastName
  }
}
```

### REST

```bash
# List authors
curl http://localhost:8000/api/v1/authors

# Create author
curl -X POST http://localhost:8000/api/v1/authors \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Jane","lastName":"Doe"}'
```

---

## Contributing

Contributions are welcome. Please open an issue or PR.

---

## License

ISC

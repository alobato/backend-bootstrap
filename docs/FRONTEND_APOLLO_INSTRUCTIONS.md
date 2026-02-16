# Frontend Instructions: Apollo Client

This document provides instructions for an AI (or developer) to implement a frontend that consumes the backend GraphQL API using **Apollo Client**. The backend runs at `http://localhost:8000` and exposes GraphQL at `http://localhost:8000/graphql`.

---

## 1. Tech Stack

- **React** (or framework of choice; these instructions are React-oriented).
- **Apollo Client** (`@apollo/client`) for GraphQL: cache, queries, mutations, and local state if needed.
- **TypeScript** for type safety. Prefer generated types from the schema (e.g. GraphQL Code Generator).
- **GraphQL Code Generator** (optional but recommended): generate typed hooks and types from the backend schema (introspection or schema file).

All user-facing text, comments, and code strings must be in **English**.

---

## 2. Backend API Summary

- **GraphQL endpoint**: `http://localhost:8000/graphql`
- **Auth**: JWT sent either as:
  - **Header**: `Authorization: Bearer <token>`
  - **Cookie**: `auth-token` (HttpOnly; set by the server on login, sent automatically with `credentials: "include"`)
- **CORS**: Backend allows `http://localhost:3000` with `credentials: true`. Use the same origin for dev and send credentials on every request.
- **Auth flow**: `login(email, password)` mutation returns a `User` and sets the `auth-token` cookie; `logout` mutation clears it. Query `me` returns the current user or `null` if not authenticated. Some fields use `@auth(role: "admin")`.

---

## 3. Available GraphQL API (Resolvers)

All operations and types the backend exposes. Use these in your Apollo Client queries and mutations.

### 3.1 Queries

| Query | Arguments | Returns | Notes |
|-------|-----------|---------|--------|
| `ping` | — | `Boolean!` | Requires `@auth(role: "admin")`. |
| `me` | — | `User` | Current user or `null` if not authenticated. |
| `authors` | — | `[Author!]!` | List all authors. |
| `author` | `id: ID!` | `Author` | Single author by ID. |
| `searchAuthors` | `query: String!` | `[Author!]!` | Search by name. |
| `books` | — | `[Book!]!` | List all books. |
| `book` | `id: ID!` | `Book` | Single book by ID (includes `publisher`, `authors`, `categories` via type resolvers). |
| `searchBooks` | `query: String!` | `[Book!]!` | Search by title, ISBN, or description. |
| `categories` | — | `[Category!]!` | List all categories. |
| `category` | `id: ID!` | `Category` | Single category by ID. |
| `searchCategories` | `query: String!` | `[Category!]!` | Search by name. |
| `publishers` | — | `[Publisher!]!` | List all publishers. |
| `publisher` | `id: ID!` | `Publisher` | Single publisher by ID. |
| `searchPublishers` | `query: String!` | `[Publisher!]!` | Search by name. |

### 3.2 Mutations

| Mutation | Arguments | Returns | Notes |
|----------|-----------|---------|--------|
| `ping` | — | `Boolean!` | No auth required. |
| `login` | `email: String!`, `password: String!` | `User!` | Sets `auth-token` cookie on success. |
| `logout` | — | `Boolean!` | Clears auth cookie. |
| `createAuthor` | `input: CreateAuthorInput!` | `Author!` | |
| `updateAuthor` | `id: ID!`, `input: UpdateAuthorInput!` | `Author!` | |
| `createBook` | `input: CreateBookInput!` | `Book!` | |
| `updateBook` | `id: ID!`, `input: UpdateBookInput!` | `Book!` | |
| `addAuthorsToBook` | `bookId: ID!`, `authorIds: [Int!]!` | `BookAuthorResult!` | |
| `removeAuthorsFromBook` | `bookId: ID!`, `authorIds: [Int!]!` | `BookAuthorResult!` | |
| `addCategoriesToBook` | `bookId: ID!`, `categoryIds: [Int!]!` | `BookAuthorResult!` | |
| `removeCategoriesFromBook` | `bookId: ID!`, `categoryIds: [Int!]!` | `BookAuthorResult!` | |
| `createCategory` | `input: CreateCategoryInput!` | `Category!` | |
| `updateCategory` | `id: ID!`, `input: UpdateCategoryInput!` | `Category!` | |
| `createPublisher` | `input: CreatePublisherInput!` | `Publisher!` | |
| `updatePublisher` | `id: ID!`, `input: UpdatePublisherInput!` | `Publisher!` | |

### 3.3 Types (object types, full SDL)

Use these definitions for selection sets, TypeScript interfaces, or codegen. All IDs are strings in GraphQL.

```graphql
directive @auth(role: String) on FIELD_DEFINITION

scalar GraphQLJSON

type User {
  id: ID!
  email: String!
  name: String!
  role: String!
}

type Author {
  id: ID!
  firstName: String!
  lastName: String!
  birthDate: String
  biography: String
  nationality: String
  createdAt: String!
  updatedAt: String!
}

type Book {
  id: ID!
  title: String!
  isbn: String
  publicationDate: String
  price: String
  description: String
  pageCount: Int
  language: String
  publisherId: Int
  publisher: Publisher
  authors: [Author!]!
  categories: [Category!]!
  createdAt: String!
  updatedAt: String!
}

type BookAuthorResult {
  success: Boolean!
  message: String!
  addedCount: Int
  removedCount: Int
}

type Category {
  id: ID!
  name: String!
  description: String
  createdAt: String!
  updatedAt: String!
}

type Publisher {
  id: ID!
  name: String!
  address: String
  city: String
  country: String
  website: String
  createdAt: String!
  updatedAt: String!
}
```

### 3.4 Inputs (mutations, full SDL)

```graphql
input CreateAuthorInput {
  firstName: String!
  lastName: String!
  birthDate: String
  biography: String
  nationality: String
}

input UpdateAuthorInput {
  firstName: String
  lastName: String
  birthDate: String
  biography: String
  nationality: String
}

input CreateBookInput {
  title: String!
  isbn: String
  publicationDate: String
  price: String
  description: String
  pageCount: Int
  language: String
  publisherId: Int
  authorIds: [Int!]
  categoryIds: [Int!]
}

input UpdateBookInput {
  title: String
  isbn: String
  publicationDate: String
  price: String
  description: String
  pageCount: Int
  language: String
  publisherId: Int
  authorIds: [Int!]
  categoryIds: [Int!]
}

input CreateCategoryInput {
  name: String!
  description: String
}

input UpdateCategoryInput {
  name: String
  description: String
}

input CreatePublisherInput {
  name: String!
  address: String
  city: String
  country: String
  website: String
}

input UpdatePublisherInput {
  name: String
  address: String
  city: String
  country: String
  website: String
}
```

### 3.5 Custom scalar

- **GraphQLJSON** – arbitrary JSON; use where the schema expects this scalar.

---

## 4. Apollo Client Setup

### 4.1 Dependencies

- `@apollo/client` – Apollo Client (includes React hooks, cache, link).
- `graphql` – GraphQL language and types.
- Optional: `@graphql-codegen/cli`, `@graphql-codegen/client-preset` (or similar) for codegen.

### 4.2 Client Configuration

- **HTTP link**: Point to `http://localhost:8000/graphql` (or env variable `VITE_GRAPHQL_URI` / `NEXT_PUBLIC_GRAPHQL_URI` etc.).
- **Auth**: If the app stores the token in memory or localStorage (in addition to or instead of the cookie), set the `Authorization: Bearer <token>` header on each request via an auth link (e.g. `setContext`). If using cookie-only auth, ensure **credentials** are sent:
  - `fetchOptions: { credentials: "include" }` in `HttpLink` (or equivalent so cookies are sent to the backend).
- **Cache**: Use `InMemoryCache`. Normalize by `id` and type (or use recommended defaults). If the backend uses relay-style IDs, you can use `possibleTypes` or key fields accordingly.

Example structure (conceptual):

```ts
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URI ?? "http://localhost:8000/graphql",
  credentials: "include", // send cookies (auth-token)
});

const authLink = setContext((_, { headers }) => {
  const token = getToken(); // from memory, localStorage, or leave null if using cookie only
  return {
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
```

- Wrap the app (or route tree) with `ApolloProvider` and pass this `client`.

---

## 5. Authentication Flow

- **Login**: Call `login` mutation with `email` and `password`. On success, the server sets the `auth-token` cookie. If the client also stores the token (e.g. for the Authorization header), save it after a successful response.
- **Logout**: Call `logout` mutation; the server clears the cookie. Clear any client-side token and redirect to login if needed.
- **Current user**: Use the `me` query. Run it after app load (e.g. in a layout or auth guard). If `me` returns `null`, treat the user as unauthenticated; show login or redirect.
- **Protected routes**: If `me` is null, redirect to login. For admin-only UI, check `me.role === "admin"` (or use the same role the backend expects in `@auth(role: "admin")`).
- **Errors**: On 401/403 or GraphQL errors indicating “unauthorized”, clear token/cookie state and redirect to login.

---

## 6. GraphQL Usage Patterns

- **Queries**: Use `useQuery` for fetching data. Handle `loading`, `error`, and `data`. Use variables for arguments (e.g. `author(id: $id)`).
- **Mutations**: Use `useMutation`. On success, either refetch relevant queries (e.g. `refetchQueries: ["Me", "Authors"]`) or update the cache (e.g. `cache.modify` / `cache.writeQuery`) so the UI stays in sync.
- **IDs**: Backend often exposes IDs as strings in GraphQL (e.g. `id: ID!`). Pass them as strings in variables; the backend converts to numbers where needed.
- **Errors**: Use `onError` or the mutation/query `error` to show user-friendly messages. Map backend error codes/messages (e.g. `FORBIDDEN`, “Invalid email and/or password”) to English messages in the UI.
- **Loading and empty states**: Always handle loading and empty lists so the UI is clear and accessible.

---

## 7. Code Generation (Recommended)

- Use **GraphQL Code Generator** with the backend schema (introspection from `http://localhost:8000/graphql` or a downloaded `schema.graphql`).
- Generate TypeScript types and React hooks (e.g. `useMeQuery`, `useLoginMutation`) so that:
  - Query and mutation variables and result types are typed.
  - Components use the generated hooks instead of raw `useQuery`/`useMutation` with hand-written document strings (optional but recommended).
- Keep generated files in a dedicated folder (e.g. `src/graphql/__generated__/` or `src/__generated__/`) and do not edit them by hand; regenerate when the backend schema changes.

---

## 8. Project Structure (Suggested)

- `src/apollo/` – client creation, links, possibly auth helpers.
- `src/graphql/` – hand-written queries and mutations (`.graphql` or `gql` in `.ts` files); codegen output can live under `src/graphql/__generated__/` or similar.
- `src/features/` or `src/pages/` – feature-based or page-based modules that use the generated hooks and Apollo hooks.
- `src/auth/` or `src/context/` – auth state, “current user” from `me`, login/logout handlers, and route guards.
- Environment: `VITE_GRAPHQL_URI` (or equivalent) for the GraphQL endpoint; ensure dev server runs on the origin allowed by the backend (e.g. `http://localhost:3000`).

---

## 9. Checklist for Implementation

- [ ] Apollo Client created with `HttpLink` to backend GraphQL URL and `credentials: "include"` (and optional auth header if storing token).
- [ ] App wrapped in `ApolloProvider`.
- [ ] Login mutation and logout mutation integrated; cookie (and optional token) handled correctly.
- [ ] `me` query used to determine auth state and user info; protected routes redirect when `me` is null.
- [ ] All queries/mutations use variables where needed; loading and error states handled in the UI.
- [ ] User-facing strings, comments, and error messages in English.
- [ ] Optional: GraphQL Code Generator configured and typed hooks used across the app.

This document is the single source of instructions for building the frontend with Apollo Client against this backend. Follow it when generating or modifying frontend code.

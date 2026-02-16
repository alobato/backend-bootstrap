---
name: drizzle-postgresql-schema
description: Create and manage Drizzle ORM schemas for PostgreSQL in an up-to-date way. Use when you need to define tables, columns, data types, constraints, indexes, relations, enums, sequences, or views for PostgreSQL. Includes a complete cheatsheet with practical examples of all Drizzle ORM features for PostgreSQL.
---

# Drizzle PostgreSQL Schema Cheatsheet

Complete guide for creating up-to-date Drizzle ORM schemas for PostgreSQL with practical examples.

## When to Use

- Create new tables and columns
- Define data types, constraints, and indexes
- Configure relationships between tables
- Create enums, sequences, and views
- Organize schemas across multiple files
- Migrate from other ORMs to Drizzle

## Basic Structure

```typescript
import { pgTable, integer, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 256 }).notNull(),
  email: varchar().notNull().unique(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});
```

> **Note**: When generating schemas, always include brief comments in English explaining the purpose of tables, columns, and relationships.

## Data Types

```typescript
import {
  // Integers
  integer,      // INTEGER / INT / INT4
  smallint,     // SMALLINT / INT2
  bigint,       // BIGINT / INT8
  serial,       // SERIAL / SERIAL4 (auto-increment 4 bytes)
  smallserial,  // SMALLSERIAL / SERIAL2 (auto-increment 2 bytes)
  bigserial,    // BIGSERIAL / SERIAL8 (auto-increment 8 bytes)
  
  // Text
  text,         // TEXT (variable, unlimited)
  varchar,      // VARCHAR(n) / CHARACTER VARYING(n)
  char,         // CHAR(n) / CHARACTER(n)
  
  // Boolean
  boolean,      // BOOLEAN
  
  // Binary
  bytea,        // BYTEA
  
  // Decimal numbers
  numeric,      // NUMERIC(precision, scale) / DECIMAL
  decimal,      // Alias of NUMERIC
  real,         // REAL / FLOAT4 (4 bytes)
  doublePrecision, // DOUBLE PRECISION / FLOAT8 (8 bytes)
  
  // JSON
  json,         // JSON (textual)
  jsonb,        // JSONB (binary)
  
  // UUID
  uuid,         // UUID
  
  // Date and Time
  date,         // DATE
  time,         // TIME / TIMETZ (with or without timezone)
  timestamp,    // TIMESTAMP / TIMESTAMPTZ (with or without timezone)
  interval,     // INTERVAL
  
  // Geometric
  point,        // POINT
  line,         // LINE
  
  // Enum
  pgEnum,       // ENUM (enumerated type)
} from "drizzle-orm/pg-core";
```

### Important Notes on Types

- **timestamp with timezone**: Use `timestamp({ withTimezone: true })` for TIMESTAMPTZ
- **time with timezone**: Use `time({ withTimezone: true })` for TIMETZ
- **serial vs identity**: `serial()` is a convenience, but `integer().generatedAlwaysAsIdentity()` is more modern
- **bigint mode**: Use `bigint({ mode: 'number' })` for values between 2^31 and 2^53
- **numeric/decimal**: They are equivalent, `decimal` is an alias of `numeric`
- **point and line**: Have special modes (`tuple`/`xy` for point, `tuple`/`abc` for line)

### Specific Type Examples

#### Serial Types

```typescript
// Serial (4 bytes, auto-increment)
id: serial().primaryKey()

// Smallserial (2 bytes, auto-increment)
id: smallserial().primaryKey()

// Bigserial (8 bytes, auto-increment)
id: bigserial().primaryKey()
// or with number mode for large values
id: bigserial({ mode: 'number' }).primaryKey()
```

#### Bigint

```typescript
// Default BIGINT (returns bigint)
value: bigint({ mode: 'bigint' })

// BIGINT as number (for values between 2^31 and 2^53)
value: bigint({ mode: 'number' })
```

#### Timestamp with Timezone

```typescript
// TIMESTAMP without timezone
createdAt: timestamp()

// TIMESTAMPTZ (with timezone)
createdAt: timestamp({ withTimezone: true })

// With precision and timezone
createdAt: timestamp({ precision: 6, withTimezone: true })

// TypeScript inference modes
createdAt: timestamp({ mode: "date" })      // Returns Date
createdAt: timestamp({ mode: "string" })    // Returns string
```

#### Time

```typescript
// TIME without timezone
startTime: time()

// TIME with timezone
startTime: time({ withTimezone: true })

// With precision
startTime: time({ precision: 6 })
```

#### Interval

```typescript
// Simple INTERVAL
duration: interval()

// INTERVAL with specific field
duration: interval({ fields: 'day' })
duration: interval({ fields: 'month' })

// INTERVAL with precision and field
duration: interval({ fields: 'month', precision: 6 })
```

#### Date

```typescript
// Simple DATE
birthDate: date()

// TypeScript inference modes
birthDate: date({ mode: "date" })    // Returns Date
birthDate: date({ mode: "string" })   // Returns string
```

#### Numeric/Decimal

```typescript
// NUMERIC without precision
price: numeric()

// NUMERIC with precision
price: numeric({ precision: 10 })

// NUMERIC with precision and scale
price: numeric({ precision: 10, scale: 2 })

// Inference modes
price: numeric({ mode: 'number' })   // Returns number
price: numeric({ mode: 'bigint' })   // Returns bigint
price: numeric({ mode: 'string' })   // Returns string

// DECIMAL (alias of NUMERIC)
price: decimal({ precision: 10, scale: 2 })
```

#### JSON/JSONB

```typescript
// Simple JSON
metadata: json()

// JSONB (recommended for performance)
metadata: jsonb()

// With TypeScript type
metadata: jsonb().$type<{ foo: string; bar: number }>()

// With default
metadata: jsonb().default({ foo: "bar" })
```

#### UUID

```typescript
// Simple UUID
id: uuid()

// UUID with automatic generation
id: uuid().defaultRandom()

// UUID with specific value
id: uuid().default('a0ee-bc99-9c0b-4ef8-bb6d-6bb9-bd38-0a11')
```

#### Point (Geometric)

```typescript
// Tuple mode [x, y]
location: point()  // Returns [number, number]

// Object mode { x, y }
location: point({ mode: 'xy' })  // Returns { x: number, y: number }
```

#### Line (Geometric)

```typescript
// Tuple mode [a, b, c]
line: line()  // Returns [number, number, number]

// Object mode { a, b, c }
line: line({ mode: 'abc' })  // Returns { a: number, b: number, c: number }
```

#### Text/Varchar with Enum

```typescript
// Type inference with enum (does not validate at runtime)
status: text({ enum: ["active", "inactive"] })
status: varchar({ enum: ["active", "inactive"] })
```

## Constraints and Modifiers

### Primary Key

```typescript
// With serial (convenience)
id: serial().primaryKey()

// With identity column (more modern)
id: integer().primaryKey().generatedAlwaysAsIdentity()
id: integer().primaryKey().generatedByDefaultAsIdentity()

// Identity with custom options
id: integer().primaryKey().generatedAlwaysAsIdentity({ 
  startWith: 1000,
  increment: 1 
})
```

**Identity Columns**: `generatedAlwaysAsIdentity()` always generates values (does not allow manual insertion), while `generatedByDefaultAsIdentity()` allows manual values. Both support sequence options like `startWith` and `increment`.

### Not Null

```typescript
name: varchar().notNull()
```

### Default Values

```typescript
// Static value
status: varchar().default("active")
count: integer().default(42)

// SQL as default
count: integer().default(sql`42::integer`)

// PostgreSQL function
createdAt: timestamp().defaultNow()
uuid: uuid().defaultRandom()

// Custom runtime function ($default or $defaultFn are equivalent)
slug: varchar().$default(() => generateUniqueString(16))
id: text().$defaultFn(() => createId())

// Automatic update ($onUpdate or $onUpdateFn are equivalent)
updatedAt: timestamp().defaultNow().$onUpdate(() => new Date())
updateCounter: integer().default(sql`1`).$onUpdateFn(() => sql`${table.updateCounter} + 1`)
```

**Note**: `$default()` and `$defaultFn()` are aliases - use either one. The same applies to `$onUpdate()` and `$onUpdateFn()`. These values are generated at runtime and do not affect `drizzle-kit` behavior.

### Unique

```typescript
email: varchar().unique()
// or
email: varchar().notNull().unique()
```

### Check Constraints

```typescript
import { check } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  age: integer(),
}, (table) => ({
  ageCheck: check("age_check", sql`${table.age} >= 18`),
}));
```

## Indexes

### Simple Index

```typescript
export const users = pgTable("users", {
  email: varchar(),
  name: varchar(),
}, (table) => ({
  emailIdx: index("email_idx").on(table.email),
  nameIdx: index("name_idx").on(table.name),
}));
```

### Unique Index

```typescript
export const users = pgTable("users", {
  email: varchar(),
  slug: varchar(),
}, (table) => ({
  emailUniqueIdx: uniqueIndex("email_unique_idx").on(table.email),
  slugUniqueIdx: uniqueIndex("slug_unique_idx").on(table.slug),
}));
```

### Composite Index

```typescript
export const posts = pgTable("posts", {
  userId: integer(),
  status: varchar(),
  createdAt: timestamp(),
}, (table) => ({
  userStatusIdx: index("user_status_idx").on(table.userId, table.status),
}));
```

### Partial Index

```typescript
export const users = pgTable("users", {
  email: varchar(),
  deletedAt: timestamp(),
}, (table) => ({
  activeEmailIdx: index("active_email_idx")
    .on(table.email)
    .where(sql`${table.deletedAt} IS NULL`),
}));
```

## Foreign Keys

### Simple Reference

```typescript
import { AnyPgColumn } from "drizzle-orm/pg-core";

export const posts = pgTable("posts", {
  id: integer().primaryKey(),
  userId: integer("user_id").references(() => users.id),
});
```

### Reference with Custom Name

```typescript
export const posts = pgTable("posts", {
  id: integer().primaryKey(),
  userId: integer("user_id").references(() => users.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
});
```

### Explicit Foreign Key

```typescript
import { foreignKey } from "drizzle-orm/pg-core";

export const posts = pgTable("posts", {
  id: integer().primaryKey(),
  userId: integer("user_id"),
  authorId: integer("author_id"),
}, (table) => ({
  userFk: foreignKey({
    columns: [table.userId],
    foreignColumns: [users.id],
    name: "posts_user_id_fkey",
  }),
  authorFk: foreignKey({
    columns: [table.authorId],
    foreignColumns: [users.id],
    name: "posts_author_id_fkey",
  }),
}));
```

### Foreign Key Actions

```typescript
userId: integer().references(() => users.id, {
  onDelete: "cascade",    // CASCADE, SET NULL, SET DEFAULT, RESTRICT, NO ACTION
  onUpdate: "cascade",
})
```

## Enums

```typescript
import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["admin", "user", "guest"]);

export const users = pgTable("users", {
  id: integer().primaryKey(),
  role: userRoleEnum().default("guest"),
});
```

## Sequences

```typescript
import { pgSequence, serial } from "drizzle-orm/pg-core";

export const userIdSeq = pgSequence("user_id_seq");

export const users = pgTable("users", {
  id: integer().primaryKey().default(sql`nextval('${userIdSeq.name}')`),
  // or simply
  id: serial().primaryKey(),
});
```

## Schemas

```typescript
import { pgSchema } from "drizzle-orm/pg-core";

export const customSchema = pgSchema("custom");

export const users = customSchema.table("users", {
  id: integer().primaryKey(),
  name: varchar(),
});
```

## Views

### Simple View

```typescript
import { pgView } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const activeUsers = pgView("active_users").as((qb) => {
  return qb
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
    })
    .from(users)
    .where(sql`${users.deletedAt} IS NULL`);
});
```

### Materialized View

```typescript
import { pgMaterializedView } from "drizzle-orm/pg-core";

export const userStats = pgMaterializedView("user_stats").as((qb) => {
  return qb
    .select({
      userId: posts.userId,
      postCount: sql<number>`count(*)`.as("post_count"),
    })
    .from(posts)
    .groupBy(posts.userId);
});
```

## Relations

### One-to-Many

```typescript
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: integer().primaryKey(),
  name: varchar(),
});

export const posts = pgTable("posts", {
  id: integer().primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: varchar(),
});

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
}));
```

### Many-to-Many

```typescript
export const users = pgTable("users", {
  id: integer().primaryKey(),
  name: varchar(),
});

export const posts = pgTable("posts", {
  id: integer().primaryKey(),
  title: varchar(),
});

export const usersToPosts = pgTable("users_to_posts", {
  userId: integer("user_id").references(() => users.id),
  postId: integer("post_id").references(() => posts.id),
});

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(usersToPosts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  users: many(usersToPosts),
}));
```

### Self-Referencing

```typescript
import { AnyPgColumn } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: integer().primaryKey(),
  name: varchar(),
  inviteeId: integer("invitee_id").references((): AnyPgColumn => users.id),
});
```

## Column Aliases

### Snake Case in DB, Camel Case in TS

```typescript
export const users = pgTable("users", {
  id: integer(),
  firstName: varchar("first_name"),  // DB: first_name, TS: firstName
  lastName: varchar("last_name"),    // DB: last_name, TS: lastName
  createdAt: timestamp("created_at"), // DB: created_at, TS: createdAt
});
```

### Automatic Casing

```typescript
// In connection file
import { drizzle } from "drizzle-orm/node-postgres";

const db = drizzle({
  connection: process.env.DATABASE_URL,
  casing: "snake_case", // Automatically maps camelCase -> snake_case
});

// In schema
export const users = pgTable("users", {
  id: integer(),
  firstName: varchar(), // Will be mapped to first_name in DB
  lastName: varchar(),  // Will be mapped to last_name in DB
});
```

## Reusable Timestamps

```typescript
// columns.helpers.ts
import { timestamp } from "drizzle-orm/pg-core";

export const timestamps = {
  createdAt: timestamp({ withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp({ withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp({ withTimezone: true }),
};

// users.ts
import { pgTable, integer, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "./columns.helpers";

export const users = pgTable("users", {
  id: integer().primaryKey(),
  name: varchar(),
  ...timestamps,
});
```

## Schema Organization

### Single Schema

```
src/
└── db/
    └── schema.ts
```

```typescript
// drizzle.config.ts
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
});
```

### Multiple Schemas

```
src/
└── db/
    └── schema/
        ├── users.ts
        ├── posts.ts
        └── comments.ts
```

```typescript
// drizzle.config.ts
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema", // Folder, not file
});
```

## Complete Example

```typescript
import { pgEnum, pgTable, integer, varchar, text, timestamp, index, uniqueIndex } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { AnyPgColumn } from "drizzle-orm/pg-core";

// Helper function to generate unique strings (example)
function generateUniqueString(length: number = 12): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let uniqueString = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uniqueString += characters[randomIndex];
  }
  return uniqueString;
}

// Enum for user roles
export const userRoleEnum = pgEnum("user_role", ["admin", "user", "guest"]);

// Users table
export const users = pgTable(
  "users",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    firstName: varchar("first_name", { length: 256 }),
    lastName: varchar("last_name", { length: 256 }),
    email: varchar().notNull().unique(),
    role: userRoleEnum().default("guest"),
    inviteeId: integer("invitee_id").references((): AnyPgColumn => users.id),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    emailIdx: index("email_idx").on(table.email),
  })
);

// Posts table
export const posts = pgTable(
  "posts",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    slug: varchar().$default(() => generateUniqueString(16)),
    title: varchar({ length: 256 }),
    content: text(),
    userId: integer("user_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    slugUniqueIdx: uniqueIndex("slug_unique_idx").on(table.slug),
    userIdIdx: index("user_id_idx").on(table.userId),
  })
);

// Comments table
export const comments = pgTable("comments", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  text: text().notNull(),
  postId: integer("post_id").references(() => posts.id, {
    onDelete: "cascade",
  }),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  posts: many(posts),
  comments: many(comments),
  invitee: one(users, {
    fields: [users.inviteeId],
    references: [users.id],
  }),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
}));
```

## Important Tips

1. **Always export tables**: Drizzle-Kit needs to import all tables to generate migrations
2. **Use PostgreSQL types**: Always use `pgTable` and types from `drizzle-orm/pg-core` for PostgreSQL
3. **Circular references**: Use `(): AnyPgColumn => table.id` for self-references
4. **Timestamp mode**: Use `{ mode: "date" }` or `{ mode: "string" }` to control the TypeScript type returned
5. **Timezone**: Use `{ withTimezone: true }` in timestamps for TIMESTAMPTZ
6. **Validation**: Combine with Zod/Valibot for runtime validation if needed
7. **Comments**: Always include brief comments in English when generating schemas to explain the purpose of tables, columns, and relationships

## Additional Resources

- Official documentation: https://orm.drizzle.team/docs/sql-schema-declaration
- Data types: https://orm.drizzle.team/docs/column-types
- Relations: https://orm.drizzle.team/docs/relations
- Migrations: https://orm.drizzle.team/docs/migrations

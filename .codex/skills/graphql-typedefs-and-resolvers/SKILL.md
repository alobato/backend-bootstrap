---
name: graphql-typedefs-and-resolvers
description: Create GraphQL type definitions and resolvers following the project's established patterns. Use when you need to create new GraphQL resolvers, type definitions, queries, mutations, or extend existing GraphQL schema. Includes patterns for pagination, filtering, sorting, authentication, and database operations using Drizzle ORM.
---

# GraphQL TypeDefs and Resolvers Guide

Complete guide for creating GraphQL type definitions and resolvers following the project's established patterns.

## When to Use

- Create new GraphQL resolvers for entities
- Define GraphQL types, queries, and mutations
- Implement pagination, filtering, and sorting
- Add authentication and authorization to resolvers
- Extend existing GraphQL schema
- Create input types for mutations

## Basic Structure

Each resolver file should follow this structure:

```typescript
import { /* drizzle-orm imports */ } from "drizzle-orm";
import { gql } from "graphql-tag";
import type { GraphQLContext } from "../../context.js";
import { db } from "../../db/index.js";
import { /* table imports */ } from "../../db/schema.js";

// TypeDefs: Type + Queries + Mutations related
export const typeDefs = gql`
  type EntityName {
    id: ID!
    field1: String
    field2: Int
    createdAt: String
    updatedAt: String
  }

  extend type Query {
    entities(/* filters */): EntitiesResult!
    entity(id: ID!): EntityName
  }

  extend type Mutation {
    createEntity(input: CreateEntityInput!): EntityName!
    updateEntity(id: ID!, input: UpdateEntityInput!): EntityName!
    deleteEntity(id: ID!): Boolean!
  }

  input CreateEntityInput {
    field1: String!
    field2: Int
  }

  input UpdateEntityInput {
    field1: String
    field2: Int
  }
`;

// Resolvers: All operations related to EntityName
export const resolvers = {
  EntityName: {
    // Field resolvers (if needed)
  },
  Query: {
    entities: async (_, args, context) => {
      // Implementation
    },
    entity: async (_, { id }, context) => {
      // Implementation
    },
  },
  Mutation: {
    createEntity: async (_, { input }, context) => {
      // Implementation
    },
    updateEntity: async (_, { id, input }, context) => {
      // Implementation
    },
    deleteEntity: async (_, { id }, context) => {
      // Implementation
    },
  },
};
```

## Key Patterns

### 1. File Organization

- **One file per entity**: Each resolver should be in its own file (e.g., `Author.ts`, `Book.ts`, `Category.ts`)
- **Location**: Place files in `src/graphql/resolvers/`
- **Naming**: Use PascalCase matching the entity name
- **Exports**: Each file must export `typeDefs` and `resolvers`

### 2. Type Definitions

#### Basic Type Definition

```typescript
export const typeDefs = gql`
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
`;
```

#### Extending Query and Mutation

Always use `extend type Query` and `extend type Mutation`:

```typescript
extend type Query {
  authors(/* args */): AuthorsResult!
  author(id: ID!): Author
}

extend type Mutation {
  createAuthor(input: CreateAuthorInput!): Author!
  updateAuthor(id: ID!, input: UpdateAuthorInput!): Author!
  deleteAuthor(id: ID!): Boolean!
}
```

#### Input Types

Create separate input types for mutations:

```typescript
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
```

### 3. Pagination Pattern

For list queries, use a pagination result type:

```typescript
type AuthorsResult {
  results: [Author!]!
  totalCount: Int!
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
}
```

Query implementation:

```typescript
Query: {
  authors: async (
    _: any,
    args: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: string;
      nationality?: string;
    },
  ) => {
    const page = args.page ?? 1;
    const limit = args.limit ?? 10;
    const offset = (page - 1) * limit;

    // Build conditions array (authors table has no deletedAt; use isNull(authors.deletedAt) if your table has)
    const conditions: any[] = [];

    // Add filters if provided
    if (args.nationality) {
      conditions.push(eq(authors.nationality, args.nationality));
    }

    // Get total count
    const totalCountResult = await db
      .select({ count: count() })
      .from(authors)
      .where(conditions.length ? and(...conditions) : undefined);

    const totalCount = totalCountResult[0]?.count ?? 0;

    // Determine sorting
    let orderByClause: any;
    if (args.sortBy && args.sortOrder) {
      if (args.sortBy === "firstName" && args.sortOrder === "DESC") {
        orderByClause = desc(authors.firstName);
      } else if (args.sortBy === "firstName") {
        orderByClause = asc(authors.firstName);
      } else {
        orderByClause = desc(authors.createdAt); // default
      }
    } else {
      orderByClause = desc(authors.createdAt);
    }

    // Fetch paginated results
    const results = await db
      .select()
      .from(authors)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      results,
      totalCount,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  },
}
```

### 4. Filtering Patterns

#### String Filtering (ILIKE)

```typescript
if (args.firstName) {
  conditions.push(ilike(authors.firstName, `%${args.firstName}%`));
}
```

#### Exact Match Filtering

```typescript
if (args.nationality) {
  conditions.push(eq(authors.nationality, args.nationality));
}
```

#### Null/Not Null Filtering

```typescript
// Soft delete pattern (ex.: tabela categories com deletedAt)
const conditions = [isNull(categories.deletedAt)];

// Or explicit null check
if (args.includeDeleted === false) {
  conditions.push(isNull(categories.deletedAt));
}
```

### 5. Sorting Patterns

```typescript
let orderByClause: any;
if (args.sortBy && args.sortOrder) {
  if (args.sortBy === "firstName" && args.sortOrder === "DESC") {
    orderByClause = desc(authors.firstName);
  } else if (args.sortBy === "firstName") {
    orderByClause = asc(authors.firstName);
  } else if (args.sortBy === "createdAt" && args.sortOrder === "DESC") {
    orderByClause = desc(authors.createdAt);
  } else {
    orderByClause = asc(authors.createdAt);
  }
} else {
  orderByClause = desc(authors.createdAt); // default
}
```

### 6. Authentication Pattern

For resolvers that require authentication:

```typescript
import type { GraphQLContext } from "../../context.js";

Query: {
  myBooks: async (_: any, _args: any, context: GraphQLContext) => {
    if (!context.user) {
      throw new Error("Não autenticado");
    }

    const userId = context.user.id;
    // Use userId in query (ex.: livros favoritos ou criados pelo usuário)
  },
}

Mutation: {
  createBook: async (
    _: any,
    args: { input: { title: string; /* outros campos */ } },
    context: GraphQLContext,
  ) => {
    if (!context.user) {
      throw new Error("Não autenticado");
    }

    const userId = context.user.id;
    // Use userId when creating/updating if the entity has ownership
  },
}
```

### 7. Single Entity Query

```typescript
Query: {
  author: async (_: any, { id }: { id: string }) => {
    const [result] = await db
      .select()
      .from(authors)
      .where(eq(authors.id, parseInt(id, 10)))
      .limit(1);
    
    return result;
  },
}
```

### 8. Create Mutation

```typescript
Mutation: {
  createAuthor: async (
    _: any,
    args: { input: { firstName: string; lastName: string; biography?: string } },
    context: GraphQLContext,
  ) => {
    // Check authentication if needed
    if (!context.user) {
      throw new Error("Não autenticado");
    }

    const now = new Date().toISOString();

    const [result] = await db
      .insert(authors)
      .values({
        firstName: args.input.firstName,
        lastName: args.input.lastName,
        biography: args.input.biography ?? null,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return result;
  },
}
```

### 9. Update Mutation

```typescript
Mutation: {
  updateAuthor: async (
    _: any,
    args: { id: string; input: { firstName?: string; lastName?: string; biography?: string } },
    context: GraphQLContext,
  ) => {
    // Check authentication if needed
    if (!context.user) {
      throw new Error("Não autenticado");
    }

    const id = parseInt(args.id, 10);
    const now = new Date().toISOString();

    // Build update object with only provided fields
    const updateData: any = {
      updatedAt: now,
    };

    if (args.input.firstName !== undefined) {
      updateData.firstName = args.input.firstName;
    }
    if (args.input.lastName !== undefined) {
      updateData.lastName = args.input.lastName;
    }
    if (args.input.biography !== undefined) {
      updateData.biography = args.input.biography;
    }

    const [result] = await db
      .update(authors)
      .set(updateData)
      .where(eq(authors.id, id))
      .returning();

    if (!result) {
      throw new Error("Autor não encontrado");
    }

    return result;
  },
}
```

### 10. Delete Mutation (Soft Delete Pattern)

```typescript
Mutation: {
  deleteCategory: async (
    _: any,
    args: { id: string },
    context: GraphQLContext,
  ) => {
    if (!context.user) {
      throw new Error("Não autenticado");
    }

    const id = parseInt(args.id, 10);

    // Soft delete (tabela com deletedAt)
    await db
      .update(categories)
      .set({ deletedAt: new Date().toISOString() })
      .where(eq(categories.id, id));

    return true;
  },
}
```

### 11. Hard Delete Pattern

```typescript
Mutation: {
  deleteAuthor: async (
    _: any,
    args: { id: string },
    context: GraphQLContext,
  ) => {
    if (!context.user) {
      throw new Error("Não autenticado");
    }

    const id = parseInt(args.id, 10);

    // Verificar se existe antes de deletar
    const [author] = await db
      .select()
      .from(authors)
      .where(eq(authors.id, id))
      .limit(1);

    if (!author) {
      throw new Error("Autor não encontrado");
    }

    await db.delete(authors).where(eq(authors.id, id));

    return true;
  },
}
```

## Common Drizzle ORM Imports

```typescript
import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  isNull,
  isNotNull,
  // ... other operators
} from "drizzle-orm";
```

## Registering Resolvers

After creating a resolver file, register it in `src/graphql/resolvers/index.ts`:

```typescript
import * as Author from "./Author.js";
import * as Book from "./Book.js";
import * as Category from "./Category.js";
import * as Publisher from "./Publisher.js";

export const resolvers = [
  scalars,
  common,
  Author,
  Book,
  Category,
  Publisher,
];

export const definitions: { resolvers?: object; typeDefs?: DocumentNode }[] = resolvers;
```

## Complete Example: Simple Entity

```typescript
import { eq, isNull } from "drizzle-orm";
import { gql } from "graphql-tag";
import type { GraphQLContext } from "../../context.js";
import { db } from "../../db/index.js";
import { categories } from "../../db/schema.js";

export const typeDefs = gql`
  type Category {
    id: ID!
    name: String!
    description: String
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    categories: [Category!]!
    category(id: ID!): Category
  }

  extend type Mutation {
    createCategory(input: CreateCategoryInput!): Category!
    updateCategory(id: ID!, input: UpdateCategoryInput!): Category!
    deleteCategory(id: ID!): Boolean!
  }

  input CreateCategoryInput {
    name: String!
    description: String
  }

  input UpdateCategoryInput {
    name: String
    description: String
  }
`;

export const resolvers = {
  Category: {},
  Query: {
    categories: async () => {
      return await db
        .select()
        .from(categories)
        .where(isNull(categories.deletedAt));
    },
    category: async (_: any, { id }: { id: string }) => {
      const [result] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, parseInt(id, 10)))
        .limit(1);
      return result;
    },
  },
  Mutation: {
    createCategory: async (
      _: any,
      args: { input: { name: string; description?: string } },
    ) => {
      const now = new Date().toISOString();
      const [result] = await db
        .insert(categories)
        .values({
          name: args.input.name,
          description: args.input.description || null,
          createdAt: now,
          updatedAt: now,
        })
        .returning();
      return result;
    },
    updateCategory: async (
      _: any,
      args: { id: string; input: { name?: string; description?: string } },
    ) => {
      const id = parseInt(args.id, 10);
      const now = new Date().toISOString();
      const updateData: any = { updatedAt: now };

      if (args.input.name !== undefined) {
        updateData.name = args.input.name;
      }
      if (args.input.description !== undefined) {
        updateData.description = args.input.description;
      }

      const [result] = await db
        .update(categories)
        .set(updateData)
        .where(eq(categories.id, id))
        .returning();

      if (!result) {
        throw new Error("Category not found");
      }

      return result;
    },
    deleteCategory: async (_: any, args: { id: string }) => {
      const id = parseInt(args.id, 10);
      await db
        .update(categories)
        .set({ deletedAt: new Date().toISOString() })
        .where(eq(categories.id, id));
      return true;
    },
  },
};
```

## Best Practices

1. **Always use `extend type`**: Use `extend type Query` and `extend type Mutation` instead of defining them from scratch
2. **Soft delete by default**: Include `isNull(table.deletedAt)` in list queries unless explicitly needed
3. **Type safety**: Use TypeScript types for resolver arguments
4. **Error handling**: Throw meaningful errors with Portuguese messages (matching project convention)
5. **Authentication**: Check `context.user` for protected operations
6. **Timestamps**: Always set `createdAt` and `updatedAt` when creating/updating
7. **ID parsing**: Convert string IDs to numbers using `parseInt(id, 10)`
8. **Default values**: Use nullish coalescing (`??`) for optional parameters
9. **Return single items**: Use `.limit(1)` and destructure `[result]` for single entity queries
10. **Pagination defaults**: Use `page = 1` and `limit = 10` as defaults

## Common Mistakes to Avoid

- ❌ Don't define `type Query` or `type Mutation` directly - use `extend type`
- ❌ Don't forget to register the resolver in `index.ts`
- ❌ Don't forget to filter by `deletedAt` in list queries
- ❌ Don't use `any` for context - use `GraphQLContext`
- ❌ Don't forget to parse string IDs to numbers
- ❌ Don't forget to check authentication for protected operations
- ❌ Don't forget to set `updatedAt` on updates
- ❌ Don't return arrays directly from single entity queries - use `.limit(1)` and destructure

---
name: services-and-schemas
description: Create service classes and Zod validation schemas following the project's established patterns. Use when you need to create new business logic services, validation schemas, database operations, or extend existing services. Includes patterns for CRUD operations, soft delete handling, error handling, and type-safe service methods using Drizzle ORM and Zod.
---

# Services and Schemas Guide

Complete guide for creating service classes and Zod validation schemas following the project's established patterns.

## When to Use

- Create new business logic services
- Define Zod validation schemas for service inputs
- Implement database operations using Drizzle ORM
- Add CRUD operations for entities
- Handle soft delete patterns
- Create type-safe service methods
- Implement search and filtering functionality

## Basic Structure

### Service File Structure

```typescript
import { /* drizzle-orm imports */ } from "drizzle-orm";
import type { z } from "zod";
import { db, notDeleted } from "../db/index.js";
import { /* table imports */ } from "../db/schema.js";
import type { /* schema imports */ } from "./schemas.js";

export const EntityService = {
  async methodName(input: z.infer<typeof SchemaName>) {
    // Implementation
  },
};
```

### Schema File Structure

```typescript
import { z } from "zod";

export const EntityActionSchema = z.object({
  field1: z.string().describe("Description of field1"),
  field2: z.number().optional().describe("Description of field2"),
});
```

## Key Patterns

### 1. Schema Definitions (schemas.ts)

#### Basic Schema

```typescript
import { z } from "zod";

export const CreateEntitySchema = z.object({
  name: z.string().describe("The name of the entity"),
  description: z.string().optional().describe("Optional description"),
});
```

#### Schema with Enums and Arrays

```typescript
export const AddAuthorsToBookSchema = z.object({
  bookId: z
    .number()
    .describe("The unique numeric ID of the book. MUST be extracted from the user request."),
  authorIds: z
    .array(z.number())
    .describe("Array of author IDs to associate with the book"),
});

// Exemplo com enum (ex.: idioma do livro)
export const CreateBookSchema = z.object({
  title: z.string().describe("The title of the book"),
  language: z
    .enum(["pt", "en", "es", "fr"])
    .optional()
    .describe("Language of the book"),
  // ... outros campos
});
```

#### Schema with Number IDs

```typescript
export const BlockEntitySchema = z.object({
  entityId: z.number().describe("The unique numeric ID of the entity. MUST be extracted from the user request."),
  reason: z.string().optional().describe("Reason for blocking the entity"),
});
```

#### Schema Best Practices

- Use `.describe()` for all fields to help LLMs/AI understand the purpose
- Include "MUST be extracted from the user request" for IDs and codes that come from user input
- Use `.optional()` for optional fields
- Use `.number()` for numeric IDs
- Use `.string()` for text fields and codes
- Use `.enum()` for fixed value sets
- Use `.record(z.any(), z.any())` for JSON objects

### 2. Service Structure

#### Basic Service Pattern

```typescript
import { eq } from "drizzle-orm";
import type { z } from "zod";
import { db, notDeleted } from "../db/index.js";
import { entities } from "../db/schema.js";
import type { CreateEntitySchema } from "./schemas.js";

export const EntityService = {
  async createEntity(input: z.infer<typeof CreateEntitySchema>) {
    const { name, description } = input;
    const now = new Date().toISOString();

    const [result] = await db
      .insert(entities)
      .values({
        name,
        description: description || null,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return result;
  },
};
```

### 3. Common Imports

```typescript
// Drizzle ORM operators
import {
  and,      // Combine multiple conditions
  eq,       // Equality comparison
  ilike,    // Case-insensitive LIKE
  or,       // OR conditions
  isNull,   // NULL check
  isNotNull,// NOT NULL check
  desc,     // DESC ordering
  asc,      // ASC ordering
  count,    // Count aggregation
} from "drizzle-orm";

// Database and helpers
import { db, notDeleted } from "../db/index.js";

// Schema tables
import { entities } from "../db/schema.js";

// Zod types
import type { z } from "zod";
import type { EntitySchema } from "./schemas.js";
```

### 4. Get by ID Pattern

```typescript
export const EntityService = {
  async getEntityById(id: number) {
    const [entity] = await db
      .select()
      .from(entities)
      .where(and(eq(entities.id, id), notDeleted(entities)))
      .limit(1);

    return entity || null;
  },
};
```

**Key points:**
- Use `limit(1)` for single entity queries
- Destructure `[entity]` from result array
- Use `notDeleted(table)` helper for soft delete filtering
- Return `null` if not found (not `undefined`)

### 5. Search Pattern

```typescript
export const EntityService = {
  async searchEntities(query: string) {
    const searchPattern = `%${query}%`;
    const results = await db
      .select()
      .from(entities)
      .where(
        and(
          or(
            ilike(entities.name, searchPattern),
            ilike(entities.description, searchPattern)
          ),
          notDeleted(entities)
        )
      )
      .limit(5);

    return results;
  },
};
```

**Key points:**
- Use `ilike()` for case-insensitive search
- Wrap search term with `%` for partial matching
- Use `or()` to search across multiple fields
- Combine with `and()` and `notDeleted()`
- Limit results for search (typically 5-10)

### 6. Create Pattern

```typescript
export const EntityService = {
  async createEntity(input: z.infer<typeof CreateEntitySchema>) {
    const { name, description } = input;
    const now = new Date().toISOString();

    const [result] = await db
      .insert(entities)
      .values({
        name,
        description: description || null,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return result;
  },
};
```

**Key points:**
- Always set `createdAt` and `updatedAt` with ISO string timestamps
- Use `|| null` for optional fields
- Use `.returning()` to get the inserted record
- Destructure `[result]` from returned array

### 7. Update Pattern

```typescript
export const EntityService = {
  async updateEntity(id: number, input: z.infer<typeof UpdateEntitySchema>) {
    const [entity] = await db
      .select()
      .from(entities)
      .where(and(eq(entities.id, id), notDeleted(entities)))
      .limit(1);

    if (!entity) {
      throw new Error(`Entity with ID ${id} not found`);
    }

    const now = new Date().toISOString();

    const [updated] = await db
      .update(entities)
      .set({
        ...input,
        updatedAt: now,
      })
      .where(eq(entities.id, id))
      .returning();

    return updated;
  },
};
```

**Key points:**
- Check existence before updating
- Always update `updatedAt` timestamp
- Use `.returning()` to get updated record
- Throw descriptive errors if entity not found

### 8. Block/Unblock Pattern

```typescript
export const EntityService = {
  async blockEntity(input: z.infer<typeof BlockEntitySchema>) {
    const { entityId, reason } = input;

    // Find entity
    const [entity] = await db
      .select()
      .from(entities)
      .where(and(eq(entities.id, entityId), notDeleted(entities)))
      .limit(1);

    if (!entity) {
      throw new Error(`Entity with ID ${entityId} not found`);
    }

    // Set expiration date (block)
    const expiresAt = new Date().toISOString();
    await db
      .update(entities)
      .set({ expiresAt })
      .where(eq(entities.id, entityId));

    // Return success response
    return {
      success: true,
      message: `Entity ${entity.name} (ID: ${entityId}) blocked successfully`,
      entity: { ...entity, expiresAt },
    };
  },

  async unblockEntity(input: z.infer<typeof UnblockEntitySchema>) {
    const { entityId } = input;

    const [entity] = await db
      .select()
      .from(entities)
      .where(and(eq(entities.id, entityId), notDeleted(entities)))
      .limit(1);

    if (!entity) {
      throw new Error(`Entity with ID ${entityId} not found`);
    }

    // Remove expiration date (unblock)
    await db
      .update(entities)
      .set({ expiresAt: null })
      .where(eq(entities.id, entityId));

    return {
      success: true,
      message: `Entity ${entity.name} (ID: ${entityId}) unblocked successfully`,
      entity: { ...entity, expiresAt: null },
    };
  },
};
```

**Key points:**
- Use `expiresAt` field for blocking/unblocking
- Set `expiresAt` to ISO string timestamp to block
- Set `expiresAt` to `null` to unblock
- Return object with `success`, `message`, and updated entity
- Include entity name in success message

### 9. Complex Operations with Related Entities

```typescript
export const CategoryService = {
  async removeCategoryFromAllBooks(input: z.infer<typeof GetCategorySchema>) {
    const { categoryId } = input;

    // Find category
    const [category] = await db
      .select()
      .from(categories)
      .where(and(eq(categories.id, categoryId), notDeleted(categories)))
      .limit(1);

    if (!category) {
      throw new Error(`Category with ID ${categoryId} not found`);
    }

    // Remove category from all books (junction table)
    const links = await db
      .select()
      .from(bookCategories)
      .where(eq(bookCategories.categoryId, categoryId));

    for (const link of links) {
      await db
        .delete(bookCategories)
        .where(
          and(
            eq(bookCategories.bookId, link.bookId),
            eq(bookCategories.categoryId, categoryId)
          )
        );
    }

    return {
      success: true,
      message: `Category ${category.name} (ID: ${categoryId}) removed from ${links.length} book(s)`,
      category: { ...category },
    };
  },
};
```

**Key points:**
- Query related entities using foreign key relationships (e.g. junction tables like `bookCategories`)
- Loop through related entities to perform operations (delete, update, etc.)
- Use `notDeleted()` for main entity when the table has soft delete
- Maintain consistency across related operations

### 10. Error Handling Pattern

```typescript
export const EntityService = {
  async getEntity(input: z.infer<typeof GetEntitySchema>) {
    const { entityCode } = input;

    let entity: Entity | null = null;
    try {
      const result = await db
        .select()
        .from(entities)
        .where(and(eq(entities.code, entityCode), notDeleted(entities)))
        .limit(1);

      entity = result[0] as Entity;
    } catch (error) {
      console.error("ERRO CRÍTICO ao buscar entity no banco:", error);
      if (typeof error === "object" && error !== null) {
        console.error("Detalhes do erro:", JSON.stringify(error, null, 2));
      }
      throw new Error(
        `Erro de banco de dados ao buscar entidade: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    if (!entity) {
      throw new Error(`Entity with code ${entityCode} not found`);
    }

    return entity;
  },
};
```

**Key points:**
- Use try-catch for database operations that might fail
- Log errors with context
- Throw descriptive errors
- Check for null/undefined after database operations

### 11. Service Return Patterns

#### Simple Entity Return

```typescript
return entity || null;
```

#### Success Response Pattern

```typescript
return {
  success: true,
  message: `Operation completed successfully`,
  entity: updatedEntity,
};
```

#### Array Return

```typescript
return results; // Array of entities
```

### 12. Type Inference from Schema

Always use Zod type inference for service method parameters:

```typescript
async methodName(input: z.infer<typeof SchemaName>) {
  // input is now fully typed
}
```

### 13. Table Type Inference

For complex operations, infer types from Drizzle tables:

```typescript
type Entity = typeof entities.$inferSelect;
type NewEntity = typeof entities.$inferInsert;

export const EntityService = {
  async methodName(): Promise<Entity | null> {
    // Use Entity type
  },
};
```

## Complete Examples

### Example 1: Simple CRUD Service

```typescript
// schemas.ts
import { z } from "zod";

export const CreateCategorySchema = z.object({
  name: z.string().describe("The name of the category"),
  description: z.string().optional().describe("Optional description"),
});

export const UpdateCategorySchema = z.object({
  name: z.string().optional().describe("The name of the category"),
  description: z.string().optional().describe("Optional description"),
});

// CategoryService.ts
import { and, eq } from "drizzle-orm";
import type { z } from "zod";
import { db, notDeleted } from "../db/index.js";
import { categories } from "../db/schema.js";
import type { CreateCategorySchema, UpdateCategorySchema } from "./schemas.js";

export const CategoryService = {
  async getCategoryById(id: number) {
    const [category] = await db
      .select()
      .from(categories)
      .where(and(eq(categories.id, id), notDeleted(categories)))
      .limit(1);

    return category || null;
  },

  async createCategory(input: z.infer<typeof CreateCategorySchema>) {
    const { name, description } = input;
    const now = new Date().toISOString();

    const [result] = await db
      .insert(categories)
      .values({
        name,
        description: description || null,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return result;
  },

  async updateCategory(id: number, input: z.infer<typeof UpdateCategorySchema>) {
    const [category] = await db
      .select()
      .from(categories)
      .where(and(eq(categories.id, id), notDeleted(categories)))
      .limit(1);

    if (!category) {
      throw new Error(`Category with ID ${id} not found`);
    }

    const now = new Date().toISOString();
    const updateData: any = { updatedAt: now };

    if (input.name !== undefined) {
      updateData.name = input.name;
    }
    if (input.description !== undefined) {
      updateData.description = input.description;
    }

    const [updated] = await db
      .update(categories)
      .set(updateData)
      .where(eq(categories.id, id))
      .returning();

    return updated;
  },
};
```

### Example 2: Service with Search

```typescript
// schemas.ts
export const SearchAuthorsSchema = z.object({
  query: z.string().describe("Search query for author name"),
});

// AuthorService.ts
import { and, ilike, or } from "drizzle-orm";
import type { z } from "zod";
import { db, notDeleted } from "../db/index.js";
import { authors } from "../db/schema.js";
import type { SearchAuthorsSchema } from "./schemas.js";

export const AuthorService = {
  async searchAuthors(input: z.infer<typeof SearchAuthorsSchema>) {
    const { query } = input;
    const searchPattern = `%${query}%`;

    const results = await db
      .select()
      .from(authors)
      .where(
        and(
          or(
            ilike(authors.firstName, searchPattern),
            ilike(authors.lastName, searchPattern)
          ),
          notDeleted(authors)
        )
      )
      .limit(10);

    return results;
  },
};
```

## Best Practices

1. **Always use `notDeleted()`**: Include `notDeleted(table)` in queries unless you explicitly need deleted records
2. **Type safety**: Use `z.infer<typeof Schema>` for all service method parameters
3. **Error messages**: Use descriptive error messages in Portuguese (matching project convention)
4. **Timestamps**: Always set `createdAt` and `updatedAt` with ISO string timestamps
5. **Null handling**: Use `|| null` for optional fields, return `null` (not `undefined`) when entity not found
6. **Single entity queries**: Always use `.limit(1)` and destructure `[result]` for single entity queries
7. **Schema descriptions**: Include `.describe()` in all Zod schema fields
8. **Import types**: Use `type` keyword when importing Zod schemas: `import type { Schema } from "./schemas.js"`
9. **Table aliases**: Use aliases when importing multiple tables: `import { users as usersTable } from "../db/schema.js"`
10. **Return patterns**: Use consistent return patterns (entity, success object, or array)

## Common Mistakes to Avoid

- ❌ Don't forget to use `notDeleted()` in queries
- ❌ Don't forget to set `createdAt` and `updatedAt` timestamps
- ❌ Don't return `undefined` - use `null` instead
- ❌ Don't forget `.limit(1)` for single entity queries
- ❌ Don't forget to destructure `[result]` from `.returning()`
- ❌ Don't use `any` types - use Zod inference instead
- ❌ Don't forget to check entity existence before update/delete operations
- ❌ Don't forget `.describe()` in Zod schemas
- ❌ Don't import schemas without `type` keyword when only using for types
- ❌ Don't forget to handle optional fields with `|| null`

## File Organization

- **Schemas**: All Zod schemas go in `src/services/schemas.ts`
- **Services**: Each service goes in its own file: `src/services/EntityService.ts`
- **Naming**: Services use PascalCase: `EntityService`, schemas use PascalCase with "Schema" suffix: `EntityActionSchema`

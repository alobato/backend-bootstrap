import { relations } from "drizzle-orm";
import { foreignKey, index, integer, numeric, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
// Users table (for auth/context)
export const users = pgTable("users", {
    id: serial().primaryKey().notNull(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    role: varchar({ length: 50 }).notNull().default("user"),
    sub: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 255 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull(),
}, (table) => [
    index("users_email_idx").on(table.email),
    index("users_sub_idx").on(table.sub),
]);
// Authors table
export const authors = pgTable("authors", {
    id: serial().primaryKey().notNull(),
    firstName: varchar("first_name", { length: 255 }).notNull(),
    lastName: varchar("last_name", { length: 255 }).notNull(),
    birthDate: timestamp("birth_date", { withTimezone: true }),
    biography: text(),
    nationality: varchar({ length: 100 }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull(),
}, (table) => [index("authors_name_idx").on(table.firstName, table.lastName)]);
// Publishers table
export const publishers = pgTable("publishers", {
    id: serial().primaryKey().notNull(),
    name: varchar({ length: 255 }).notNull(),
    address: text(),
    city: varchar({ length: 100 }),
    country: varchar({ length: 100 }),
    website: varchar({ length: 255 }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull(),
});
// Categories table
export const categories = pgTable("categories", {
    id: serial().primaryKey().notNull(),
    name: varchar({ length: 100 }).notNull().unique(),
    description: text(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull(),
});
// Books table
export const books = pgTable("books", {
    id: serial().primaryKey().notNull(),
    title: varchar({ length: 255 }).notNull(),
    isbn: varchar({ length: 13 }).unique(),
    publicationDate: timestamp("publication_date", { withTimezone: true }),
    price: numeric({ precision: 10, scale: 2 }),
    description: text(),
    pageCount: integer("page_count"),
    language: varchar({ length: 50 }),
    publisherId: integer("publisher_id"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull(),
}, (table) => [
    foreignKey({
        columns: [table.publisherId],
        foreignColumns: [publishers.id],
        name: "books_publisher_id_fkey",
    }),
    index("books_title_idx").on(table.title),
    index("books_isbn_idx").on(table.isbn),
    index("books_publisher_id_idx").on(table.publisherId),
]);
// Junction table: Books and Authors (Many-to-Many)
export const bookAuthors = pgTable("book_authors", {
    bookId: integer("book_id").notNull(),
    authorId: integer("author_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull(),
}, (table) => [
    foreignKey({
        columns: [table.bookId],
        foreignColumns: [books.id],
        name: "book_authors_book_id_fkey",
    }),
    foreignKey({
        columns: [table.authorId],
        foreignColumns: [authors.id],
        name: "book_authors_author_id_fkey",
    }),
]);
// Junction table: Books and Categories (Many-to-Many)
export const bookCategories = pgTable("book_categories", {
    bookId: integer("book_id").notNull(),
    categoryId: integer("category_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull(),
}, (table) => [
    foreignKey({
        columns: [table.bookId],
        foreignColumns: [books.id],
        name: "book_categories_book_id_fkey",
    }),
    foreignKey({
        columns: [table.categoryId],
        foreignColumns: [categories.id],
        name: "book_categories_category_id_fkey",
    }),
]);
// Relations
// Authors relations
export const authorsRelations = relations(authors, ({ many }) => ({
    books: many(bookAuthors),
}));
// Publishers relations
export const publishersRelations = relations(publishers, ({ many }) => ({
    books: many(books),
}));
// Categories relations
export const categoriesRelations = relations(categories, ({ many }) => ({
    books: many(bookCategories),
}));
// Books relations
export const booksRelations = relations(books, ({ one, many }) => ({
    publisher: one(publishers, {
        fields: [books.publisherId],
        references: [publishers.id],
    }),
    authors: many(bookAuthors),
    categories: many(bookCategories),
}));
// BookAuthors relations (junction table)
export const bookAuthorsRelations = relations(bookAuthors, ({ one }) => ({
    book: one(books, {
        fields: [bookAuthors.bookId],
        references: [books.id],
    }),
    author: one(authors, {
        fields: [bookAuthors.authorId],
        references: [authors.id],
    }),
}));
// BookCategories relations (junction table)
export const bookCategoriesRelations = relations(bookCategories, ({ one }) => ({
    book: one(books, {
        fields: [bookCategories.bookId],
        references: [books.id],
    }),
    category: one(categories, {
        fields: [bookCategories.categoryId],
        references: [categories.id],
    }),
}));
// Users relations
export const usersRelations = relations(users, () => ({}));
//# sourceMappingURL=schema.js.map
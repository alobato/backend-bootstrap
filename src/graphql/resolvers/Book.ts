import { eq, inArray } from "drizzle-orm";
import { gql } from "graphql-tag";

import { db } from "../../db/index.js";
import { authors, bookAuthors, bookCategories, categories, publishers } from "../../db/schema.js";
import { BookService } from "../../services/BookService.js";

export const typeDefs = gql`
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

  extend type Query {
    books: [Book!]!
    book(id: ID!): Book
    searchBooks(query: String!): [Book!]!
  }

  extend type Mutation {
    createBook(input: CreateBookInput!): Book!
    updateBook(id: ID!, input: UpdateBookInput!): Book!
    addAuthorsToBook(bookId: ID!, authorIds: [Int!]!): BookAuthorResult!
    removeAuthorsFromBook(bookId: ID!, authorIds: [Int!]!): BookAuthorResult!
    addCategoriesToBook(bookId: ID!, categoryIds: [Int!]!): BookAuthorResult!
    removeCategoriesFromBook(bookId: ID!, categoryIds: [Int!]!): BookAuthorResult!
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
`;

export const resolvers = {
  Book: {
    publisher: async (parent: { publisherId: number | null }) => {
      if (!parent.publisherId) return null;
      const [p] = await db.select().from(publishers).where(eq(publishers.id, parent.publisherId)).limit(1);
      return p ?? null;
    },
    authors: async (parent: { id: number }) => {
      const links = await db.select().from(bookAuthors).where(eq(bookAuthors.bookId, parent.id));
      if (links.length === 0) return [];
      const authorIds = links.map((l) => l.authorId);
      return db.select().from(authors).where(inArray(authors.id, authorIds));
    },
    categories: async (parent: { id: number }) => {
      const links = await db.select().from(bookCategories).where(eq(bookCategories.bookId, parent.id));
      if (links.length === 0) return [];
      const categoryIds = links.map((l) => l.categoryId);
      return db.select().from(categories).where(inArray(categories.id, categoryIds));
    },
  },
  Query: {
    books: async () => {
      return BookService.getAllBooks();
    },
    book: async (_: unknown, { id }: { id: string }) => {
      return BookService.getBookById(parseInt(id, 10));
    },
    searchBooks: async (_: unknown, { query }: { query: string }) => {
      return BookService.searchBooks({ query });
    },
  },
  Mutation: {
    createBook: async (_: unknown, args: { input: Parameters<typeof BookService.createBook>[0] }) => {
      return BookService.createBook(args.input);
    },
    updateBook: async (_: unknown, args: { id: string; input: Parameters<typeof BookService.updateBook>[1] }) => {
      const id = parseInt(args.id, 10);
      return BookService.updateBook(id, args.input);
    },
    addAuthorsToBook: async (_: unknown, args: { bookId: string; authorIds: number[] }) => {
      return BookService.addAuthorsToBook({
        bookId: parseInt(args.bookId, 10),
        authorIds: args.authorIds,
      });
    },
    removeAuthorsFromBook: async (_: unknown, args: { bookId: string; authorIds: number[] }) => {
      return BookService.removeAuthorsFromBook({
        bookId: parseInt(args.bookId, 10),
        authorIds: args.authorIds,
      });
    },
    addCategoriesToBook: async (_: unknown, args: { bookId: string; categoryIds: number[] }) => {
      return BookService.addCategoriesToBook({
        bookId: parseInt(args.bookId, 10),
        categoryIds: args.categoryIds,
      });
    },
    removeCategoriesFromBook: async (_: unknown, args: { bookId: string; categoryIds: number[] }) => {
      return BookService.removeCategoriesFromBook({
        bookId: parseInt(args.bookId, 10),
        categoryIds: args.categoryIds,
      });
    },
  },
};

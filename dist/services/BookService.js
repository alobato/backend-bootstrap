import { and, eq, ilike, inArray, or } from "drizzle-orm";
import { db } from "../db/index.js";
import { bookAuthors, bookCategories, books } from "../db/schema.js";
export const BookService = {
    async getBookById(id) {
        const [book] = await db.select().from(books).where(eq(books.id, id)).limit(1);
        return book || null;
    },
    async getBook(input) {
        const { bookId } = input;
        return this.getBookById(bookId);
    },
    async searchBooks(input) {
        const { query } = input;
        const searchPattern = `%${query}%`;
        const results = await db
            .select()
            .from(books)
            .where(or(ilike(books.title, searchPattern), ilike(books.isbn, searchPattern), ilike(books.description, searchPattern)))
            .limit(10);
        return results;
    },
    async createBook(input) {
        const { title, isbn, publicationDate, price, description, pageCount, language, publisherId, authorIds, categoryIds } = input;
        const now = new Date().toISOString();
        // Create the book
        const [book] = await db
            .insert(books)
            .values({
            title,
            isbn: isbn || null,
            publicationDate: publicationDate ? new Date(publicationDate) : null,
            price: price !== undefined ? price : null,
            description: description || null,
            pageCount: pageCount || null,
            language: language || null,
            publisherId: publisherId || null,
            createdAt: now,
            updatedAt: now,
        })
            .returning();
        // Add authors if provided
        if (authorIds && authorIds.length > 0) {
            if (book && book.id !== undefined && book.id !== null) {
                await db.insert(bookAuthors).values(authorIds.map((authorId) => ({
                    bookId: book.id,
                    authorId,
                    createdAt: now,
                })));
            }
            else {
                throw new Error("Book record not found after insert; cannot add authors.");
            }
        }
        // Add categories if provided
        if (categoryIds && categoryIds.length > 0) {
            if (book && book.id !== undefined && book.id !== null) {
                await db.insert(bookCategories).values(categoryIds.map((categoryId) => ({
                    bookId: book.id,
                    categoryId,
                    createdAt: now,
                })));
            }
            else {
                throw new Error("Book record not found after insert; cannot add categories.");
            }
        }
        return book;
    },
    async updateBook(id, input) {
        const [book] = await db.select().from(books).where(eq(books.id, id)).limit(1);
        if (!book) {
            throw new Error(`Book with ID ${id} not found`);
        }
        const now = new Date().toISOString();
        const updateData = { updatedAt: now };
        if (input.title !== undefined) {
            updateData.title = input.title;
        }
        if (input.isbn !== undefined) {
            updateData.isbn = input.isbn || null;
        }
        if (input.publicationDate !== undefined) {
            updateData.publicationDate = input.publicationDate || null;
        }
        if (input.price !== undefined) {
            updateData.price = input.price || null;
        }
        if (input.description !== undefined) {
            updateData.description = input.description || null;
        }
        if (input.pageCount !== undefined) {
            updateData.pageCount = input.pageCount || null;
        }
        if (input.language !== undefined) {
            updateData.language = input.language || null;
        }
        if (input.publisherId !== undefined) {
            updateData.publisherId = input.publisherId || null;
        }
        const [updated] = await db.update(books).set(updateData).where(eq(books.id, id)).returning();
        // Update authors if provided
        if (input.authorIds !== undefined) {
            // Remove existing authors
            await db.delete(bookAuthors).where(eq(bookAuthors.bookId, id));
            // Add new authors
            if (input.authorIds.length > 0) {
                await db.insert(bookAuthors).values(input.authorIds.map((authorId) => ({
                    bookId: id,
                    authorId,
                    createdAt: now,
                })));
            }
        }
        // Update categories if provided
        if (input.categoryIds !== undefined) {
            // Remove existing categories
            await db.delete(bookCategories).where(eq(bookCategories.bookId, id));
            // Add new categories
            if (input.categoryIds.length > 0) {
                await db.insert(bookCategories).values(input.categoryIds.map((categoryId) => ({
                    bookId: id,
                    categoryId,
                    createdAt: now,
                })));
            }
        }
        return updated;
    },
    async addAuthorsToBook(input) {
        const { bookId, authorIds } = input;
        const [book] = await db.select().from(books).where(eq(books.id, bookId)).limit(1);
        if (!book) {
            throw new Error(`Book with ID ${bookId} not found`);
        }
        const now = new Date().toISOString();
        // Check which authors are already associated
        const existingAuthors = await db
            .select()
            .from(bookAuthors)
            .where(and(eq(bookAuthors.bookId, bookId), inArray(bookAuthors.authorId, authorIds)));
        const existingAuthorIds = existingAuthors.map((ea) => ea.authorId);
        const newAuthorIds = authorIds.filter((id) => !existingAuthorIds.includes(id));
        if (newAuthorIds.length > 0) {
            await db.insert(bookAuthors).values(newAuthorIds.map((authorId) => ({
                bookId,
                authorId,
                createdAt: now,
            })));
        }
        return {
            success: true,
            message: `Added ${newAuthorIds.length} author(s) to book "${book.title}"`,
            addedCount: newAuthorIds.length,
        };
    },
    async removeAuthorsFromBook(input) {
        const { bookId, authorIds } = input;
        const [book] = await db.select().from(books).where(eq(books.id, bookId)).limit(1);
        if (!book) {
            throw new Error(`Book with ID ${bookId} not found`);
        }
        await db.delete(bookAuthors).where(and(eq(bookAuthors.bookId, bookId), inArray(bookAuthors.authorId, authorIds)));
        return {
            success: true,
            message: `Removed ${authorIds.length} author(s) from book "${book.title}"`,
            removedCount: authorIds.length,
        };
    },
    async addCategoriesToBook(input) {
        const { bookId, categoryIds } = input;
        const [book] = await db.select().from(books).where(eq(books.id, bookId)).limit(1);
        if (!book) {
            throw new Error(`Book with ID ${bookId} not found`);
        }
        const now = new Date().toISOString();
        // Check which categories are already associated
        const existingCategories = await db
            .select()
            .from(bookCategories)
            .where(and(eq(bookCategories.bookId, bookId), inArray(bookCategories.categoryId, categoryIds)));
        const existingCategoryIds = existingCategories.map((ec) => ec.categoryId);
        const newCategoryIds = categoryIds.filter((id) => !existingCategoryIds.includes(id));
        if (newCategoryIds.length > 0) {
            await db.insert(bookCategories).values(newCategoryIds.map((categoryId) => ({
                bookId,
                categoryId,
                createdAt: now,
            })));
        }
        return {
            success: true,
            message: `Added ${newCategoryIds.length} category(ies) to book "${book.title}"`,
            addedCount: newCategoryIds.length,
        };
    },
    async removeCategoriesFromBook(input) {
        const { bookId, categoryIds } = input;
        const [book] = await db.select().from(books).where(eq(books.id, bookId)).limit(1);
        if (!book) {
            throw new Error(`Book with ID ${bookId} not found`);
        }
        await db.delete(bookCategories).where(and(eq(bookCategories.bookId, bookId), inArray(bookCategories.categoryId, categoryIds)));
        return {
            success: true,
            message: `Removed ${categoryIds.length} category(ies) from book "${book.title}"`,
            removedCount: categoryIds.length,
        };
    },
    async getBookAuthors(bookId) {
        const results = await db.select().from(bookAuthors).where(eq(bookAuthors.bookId, bookId));
        return results;
    },
    async getBookCategories(bookId) {
        const results = await db.select().from(bookCategories).where(eq(bookCategories.bookId, bookId));
        return results;
    },
    async getAllBooks() {
        const results = await db.select().from(books);
        return results;
    },
};
//# sourceMappingURL=BookService.js.map
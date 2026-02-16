import type { z } from "zod";
import type { AddAuthorsToBookSchema, AddCategoriesToBookSchema, CreateBookSchema, GetBookSchema, RemoveAuthorsFromBookSchema, RemoveCategoriesFromBookSchema, SearchBooksSchema, UpdateBookSchema } from "./schemas.js";
export declare const BookService: {
    getBookById(id: number): Promise<{
        id: number;
        title: string;
        isbn: string | null;
        publicationDate: Date | null;
        price: string | null;
        description: string | null;
        pageCount: number | null;
        language: string | null;
        publisherId: number | null;
        createdAt: string;
        updatedAt: string;
    } | null>;
    getBook(input: z.infer<typeof GetBookSchema>): Promise<{
        id: number;
        title: string;
        isbn: string | null;
        publicationDate: Date | null;
        price: string | null;
        description: string | null;
        pageCount: number | null;
        language: string | null;
        publisherId: number | null;
        createdAt: string;
        updatedAt: string;
    } | null>;
    searchBooks(input: z.infer<typeof SearchBooksSchema>): Promise<{
        id: number;
        title: string;
        isbn: string | null;
        publicationDate: Date | null;
        price: string | null;
        description: string | null;
        pageCount: number | null;
        language: string | null;
        publisherId: number | null;
        createdAt: string;
        updatedAt: string;
    }[]>;
    createBook(input: z.infer<typeof CreateBookSchema>): Promise<{
        id: number;
        createdAt: string;
        updatedAt: string;
        description: string | null;
        title: string;
        isbn: string | null;
        publicationDate: Date | null;
        price: string | null;
        pageCount: number | null;
        language: string | null;
        publisherId: number | null;
    } | undefined>;
    updateBook(id: number, input: z.infer<typeof UpdateBookSchema>): Promise<{
        id: number;
        title: string;
        isbn: string | null;
        publicationDate: Date | null;
        price: string | null;
        description: string | null;
        pageCount: number | null;
        language: string | null;
        publisherId: number | null;
        createdAt: string;
        updatedAt: string;
    } | undefined>;
    addAuthorsToBook(input: z.infer<typeof AddAuthorsToBookSchema>): Promise<{
        success: boolean;
        message: string;
        addedCount: number;
    }>;
    removeAuthorsFromBook(input: z.infer<typeof RemoveAuthorsFromBookSchema>): Promise<{
        success: boolean;
        message: string;
        removedCount: number;
    }>;
    addCategoriesToBook(input: z.infer<typeof AddCategoriesToBookSchema>): Promise<{
        success: boolean;
        message: string;
        addedCount: number;
    }>;
    removeCategoriesFromBook(input: z.infer<typeof RemoveCategoriesFromBookSchema>): Promise<{
        success: boolean;
        message: string;
        removedCount: number;
    }>;
    getBookAuthors(bookId: number): Promise<{
        bookId: number;
        authorId: number;
        createdAt: string;
    }[]>;
    getBookCategories(bookId: number): Promise<{
        bookId: number;
        categoryId: number;
        createdAt: string;
    }[]>;
    getAllBooks(): Promise<{
        id: number;
        title: string;
        isbn: string | null;
        publicationDate: Date | null;
        price: string | null;
        description: string | null;
        pageCount: number | null;
        language: string | null;
        publisherId: number | null;
        createdAt: string;
        updatedAt: string;
    }[]>;
};
//# sourceMappingURL=BookService.d.ts.map
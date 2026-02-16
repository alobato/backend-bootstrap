import { BookService } from "../../services/BookService.js";
export declare const typeDefs: import("graphql").DocumentNode;
export declare const resolvers: {
    Book: {
        publisher: (parent: {
            publisherId: number | null;
        }) => Promise<{
            id: number;
            name: string;
            address: string | null;
            city: string | null;
            country: string | null;
            website: string | null;
            createdAt: string;
            updatedAt: string;
        } | null>;
        authors: (parent: {
            id: number;
        }) => Promise<{
            id: number;
            firstName: string;
            lastName: string;
            birthDate: Date | null;
            biography: string | null;
            nationality: string | null;
            createdAt: string;
            updatedAt: string;
        }[]>;
        categories: (parent: {
            id: number;
        }) => Promise<{
            id: number;
            name: string;
            description: string | null;
            createdAt: string;
            updatedAt: string;
        }[]>;
    };
    Query: {
        books: () => Promise<{
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
        book: (_: unknown, { id }: {
            id: string;
        }) => Promise<{
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
        searchBooks: (_: unknown, { query }: {
            query: string;
        }) => Promise<{
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
    Mutation: {
        createBook: (_: unknown, args: {
            input: Parameters<typeof BookService.createBook>[0];
        }) => Promise<{
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
        updateBook: (_: unknown, args: {
            id: string;
            input: Parameters<typeof BookService.updateBook>[1];
        }) => Promise<{
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
        addAuthorsToBook: (_: unknown, args: {
            bookId: string;
            authorIds: number[];
        }) => Promise<{
            success: boolean;
            message: string;
            addedCount: number;
        }>;
        removeAuthorsFromBook: (_: unknown, args: {
            bookId: string;
            authorIds: number[];
        }) => Promise<{
            success: boolean;
            message: string;
            removedCount: number;
        }>;
        addCategoriesToBook: (_: unknown, args: {
            bookId: string;
            categoryIds: number[];
        }) => Promise<{
            success: boolean;
            message: string;
            addedCount: number;
        }>;
        removeCategoriesFromBook: (_: unknown, args: {
            bookId: string;
            categoryIds: number[];
        }) => Promise<{
            success: boolean;
            message: string;
            removedCount: number;
        }>;
    };
};
//# sourceMappingURL=Book.d.ts.map
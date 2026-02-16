import { AuthorService } from "../../services/AuthorService.js";
export declare const typeDefs: import("graphql").DocumentNode;
export declare const resolvers: {
    Author: {};
    Query: {
        authors: () => Promise<{
            id: number;
            firstName: string;
            lastName: string;
            birthDate: Date | null;
            biography: string | null;
            nationality: string | null;
            createdAt: string;
            updatedAt: string;
        }[]>;
        author: (_: unknown, { id }: {
            id: string;
        }) => Promise<{
            id: number;
            firstName: string;
            lastName: string;
            birthDate: Date | null;
            biography: string | null;
            nationality: string | null;
            createdAt: string;
            updatedAt: string;
        } | null>;
        searchAuthors: (_: unknown, { query }: {
            query: string;
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
    };
    Mutation: {
        createAuthor: (_: unknown, args: {
            input: Parameters<typeof AuthorService.createAuthor>[0];
        }) => Promise<{
            id: number;
            createdAt: string;
            updatedAt: string;
            firstName: string;
            lastName: string;
            birthDate: Date | null;
            biography: string | null;
            nationality: string | null;
        } | undefined>;
        updateAuthor: (_: unknown, args: {
            id: string;
            input: Parameters<typeof AuthorService.updateAuthor>[1];
        }) => Promise<{
            id: number;
            firstName: string;
            lastName: string;
            birthDate: Date | null;
            biography: string | null;
            nationality: string | null;
            createdAt: string;
            updatedAt: string;
        } | undefined>;
    };
};
//# sourceMappingURL=Author.d.ts.map
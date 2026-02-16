import { CategoryService } from "../../services/CategoryService.js";
export declare const typeDefs: import("graphql").DocumentNode;
export declare const resolvers: {
    Category: {};
    Query: {
        categories: () => Promise<{
            id: number;
            name: string;
            description: string | null;
            createdAt: string;
            updatedAt: string;
        }[]>;
        category: (_: unknown, { id }: {
            id: string;
        }) => Promise<{
            id: number;
            name: string;
            description: string | null;
            createdAt: string;
            updatedAt: string;
        } | null>;
        searchCategories: (_: unknown, { query }: {
            query: string;
        }) => Promise<{
            id: number;
            name: string;
            description: string | null;
            createdAt: string;
            updatedAt: string;
        }[]>;
    };
    Mutation: {
        createCategory: (_: unknown, args: {
            input: Parameters<typeof CategoryService.createCategory>[0];
        }) => Promise<{
            id: number;
            name: string;
            createdAt: string;
            updatedAt: string;
            description: string | null;
        } | undefined>;
        updateCategory: (_: unknown, args: {
            id: string;
            input: Parameters<typeof CategoryService.updateCategory>[1];
        }) => Promise<{
            id: number;
            name: string;
            description: string | null;
            createdAt: string;
            updatedAt: string;
        } | undefined>;
    };
};
//# sourceMappingURL=Category.d.ts.map
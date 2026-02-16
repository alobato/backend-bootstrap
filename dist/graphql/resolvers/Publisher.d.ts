import { PublisherService } from "../../services/PublisherService.js";
export declare const typeDefs: import("graphql").DocumentNode;
export declare const resolvers: {
    Publisher: {};
    Query: {
        publishers: () => Promise<{
            id: number;
            name: string;
            address: string | null;
            city: string | null;
            country: string | null;
            website: string | null;
            createdAt: string;
            updatedAt: string;
        }[]>;
        publisher: (_: unknown, { id }: {
            id: string;
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
        searchPublishers: (_: unknown, { query }: {
            query: string;
        }) => Promise<{
            id: number;
            name: string;
            address: string | null;
            city: string | null;
            country: string | null;
            website: string | null;
            createdAt: string;
            updatedAt: string;
        }[]>;
    };
    Mutation: {
        createPublisher: (_: unknown, args: {
            input: Parameters<typeof PublisherService.createPublisher>[0];
        }) => Promise<{
            id: number;
            name: string;
            createdAt: string;
            updatedAt: string;
            address: string | null;
            city: string | null;
            country: string | null;
            website: string | null;
        } | undefined>;
        updatePublisher: (_: unknown, args: {
            id: string;
            input: Parameters<typeof PublisherService.updatePublisher>[1];
        }) => Promise<{
            id: number;
            name: string;
            address: string | null;
            city: string | null;
            country: string | null;
            website: string | null;
            createdAt: string;
            updatedAt: string;
        } | undefined>;
    };
};
//# sourceMappingURL=Publisher.d.ts.map
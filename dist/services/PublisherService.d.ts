import type { z } from "zod";
import type { CreatePublisherSchema, GetPublisherSchema, SearchPublishersSchema, UpdatePublisherSchema } from "./schemas.js";
export declare const PublisherService: {
    getPublisherById(id: number): Promise<{
        id: number;
        name: string;
        address: string | null;
        city: string | null;
        country: string | null;
        website: string | null;
        createdAt: string;
        updatedAt: string;
    } | null>;
    getPublisher(input: z.infer<typeof GetPublisherSchema>): Promise<{
        id: number;
        name: string;
        address: string | null;
        city: string | null;
        country: string | null;
        website: string | null;
        createdAt: string;
        updatedAt: string;
    } | null>;
    searchPublishers(input: z.infer<typeof SearchPublishersSchema>): Promise<{
        id: number;
        name: string;
        address: string | null;
        city: string | null;
        country: string | null;
        website: string | null;
        createdAt: string;
        updatedAt: string;
    }[]>;
    createPublisher(input: z.infer<typeof CreatePublisherSchema>): Promise<{
        id: number;
        name: string;
        createdAt: string;
        updatedAt: string;
        address: string | null;
        city: string | null;
        country: string | null;
        website: string | null;
    } | undefined>;
    updatePublisher(id: number, input: z.infer<typeof UpdatePublisherSchema>): Promise<{
        id: number;
        name: string;
        address: string | null;
        city: string | null;
        country: string | null;
        website: string | null;
        createdAt: string;
        updatedAt: string;
    } | undefined>;
    getAllPublishers(): Promise<{
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
//# sourceMappingURL=PublisherService.d.ts.map
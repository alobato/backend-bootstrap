import type { z } from "zod";
import type { CreateAuthorSchema, GetAuthorSchema, SearchAuthorsSchema, UpdateAuthorSchema } from "./schemas.js";
export declare const AuthorService: {
    getAuthorById(id: number): Promise<{
        id: number;
        firstName: string;
        lastName: string;
        birthDate: Date | null;
        biography: string | null;
        nationality: string | null;
        createdAt: string;
        updatedAt: string;
    } | null>;
    getAuthor(input: z.infer<typeof GetAuthorSchema>): Promise<{
        id: number;
        firstName: string;
        lastName: string;
        birthDate: Date | null;
        biography: string | null;
        nationality: string | null;
        createdAt: string;
        updatedAt: string;
    } | null>;
    searchAuthors(input: z.infer<typeof SearchAuthorsSchema>): Promise<{
        id: number;
        firstName: string;
        lastName: string;
        birthDate: Date | null;
        biography: string | null;
        nationality: string | null;
        createdAt: string;
        updatedAt: string;
    }[]>;
    createAuthor(input: z.infer<typeof CreateAuthorSchema>): Promise<{
        id: number;
        createdAt: string;
        updatedAt: string;
        firstName: string;
        lastName: string;
        birthDate: Date | null;
        biography: string | null;
        nationality: string | null;
    } | undefined>;
    updateAuthor(id: number, input: z.infer<typeof UpdateAuthorSchema>): Promise<{
        id: number;
        firstName: string;
        lastName: string;
        birthDate: Date | null;
        biography: string | null;
        nationality: string | null;
        createdAt: string;
        updatedAt: string;
    } | undefined>;
    getAllAuthors(): Promise<{
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
//# sourceMappingURL=AuthorService.d.ts.map
import type { z } from "zod";
import type { CreateCategorySchema, GetCategorySchema, SearchCategoriesSchema, UpdateCategorySchema } from "./schemas.js";
export declare const CategoryService: {
    getCategoryById(id: number): Promise<{
        id: number;
        name: string;
        description: string | null;
        createdAt: string;
        updatedAt: string;
    } | null>;
    getCategory(input: z.infer<typeof GetCategorySchema>): Promise<{
        id: number;
        name: string;
        description: string | null;
        createdAt: string;
        updatedAt: string;
    } | null>;
    searchCategories(input: z.infer<typeof SearchCategoriesSchema>): Promise<{
        id: number;
        name: string;
        description: string | null;
        createdAt: string;
        updatedAt: string;
    }[]>;
    createCategory(input: z.infer<typeof CreateCategorySchema>): Promise<{
        id: number;
        name: string;
        createdAt: string;
        updatedAt: string;
        description: string | null;
    } | undefined>;
    updateCategory(id: number, input: z.infer<typeof UpdateCategorySchema>): Promise<{
        id: number;
        name: string;
        description: string | null;
        createdAt: string;
        updatedAt: string;
    } | undefined>;
    getAllCategories(): Promise<{
        id: number;
        name: string;
        description: string | null;
        createdAt: string;
        updatedAt: string;
    }[]>;
};
//# sourceMappingURL=CategoryService.d.ts.map
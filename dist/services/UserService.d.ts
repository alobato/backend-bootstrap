import type { z } from "zod";
import type { CreateUserSchema, UpdateUserSchema } from "./schemas.js";
export declare const UserService: {
    getUserBySub(sub: string): Promise<{
        id: number;
        name: string;
        email: string;
        role: string;
        sub: string;
        password: string;
        createdAt: string;
        updatedAt: string;
    } | null>;
    getUserById(id: number): Promise<{
        id: number;
        name: string;
        email: string;
        role: string;
        sub: string;
        password: string;
        createdAt: string;
        updatedAt: string;
    } | null>;
    getUserByEmail(email: string): Promise<{
        id: number;
        name: string;
        email: string;
        role: string;
        sub: string;
        password: string;
        createdAt: string;
        updatedAt: string;
    } | null>;
    createUser(input: z.infer<typeof CreateUserSchema>): Promise<{
        id: number;
        name: string;
        email: string;
        role: string;
        sub: string;
        password: string;
        createdAt: string;
        updatedAt: string;
    } | undefined>;
    updateUser(id: number, input: z.infer<typeof UpdateUserSchema>): Promise<{
        id: number;
        name: string;
        email: string;
        role: string;
        sub: string;
        password: string;
        createdAt: string;
        updatedAt: string;
    } | undefined>;
};
//# sourceMappingURL=UserService.d.ts.map
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
export const UserService = {
    async getUserBySub(sub) {
        if (!sub)
            return null;
        const [user] = await db.select().from(users).where(eq(users.sub, sub)).limit(1);
        return user ?? null;
    },
    async getUserById(id) {
        const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
        return user ?? null;
    },
    async getUserByEmail(email) {
        const normalized = email.trim().toLowerCase();
        const [user] = await db.select().from(users).where(eq(users.email, normalized)).limit(1);
        return user ?? null;
    },
    async createUser(input) {
        const { name, email, password, role } = input;
        const now = new Date().toISOString();
        const sub = randomUUID();
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db
            .insert(users)
            .values({
            name,
            email: email.trim().toLowerCase(),
            role: role ?? "user",
            sub,
            password: hashedPassword,
            createdAt: now,
            updatedAt: now,
        })
            .returning();
        return result;
    },
    async updateUser(id, input) {
        const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
        if (!user) {
            throw new Error(`User with ID ${id} not found`);
        }
        const now = new Date().toISOString();
        const updateData = { updatedAt: now };
        if (input.name !== undefined)
            updateData.name = input.name;
        if (input.email !== undefined)
            updateData.email = input.email.trim().toLowerCase();
        if (input.role !== undefined)
            updateData.role = input.role;
        if (input.password !== undefined)
            updateData.password = await bcrypt.hash(input.password, 10);
        const [updated] = await db.update(users).set(updateData).where(eq(users.id, id)).returning();
        return updated;
    },
};
//# sourceMappingURL=UserService.js.map
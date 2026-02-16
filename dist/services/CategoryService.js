import { eq, ilike } from "drizzle-orm";
import { db } from "../db/index.js";
import { categories } from "../db/schema.js";
export const CategoryService = {
    async getCategoryById(id) {
        const [category] = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
        return category || null;
    },
    async getCategory(input) {
        const { categoryId } = input;
        return this.getCategoryById(categoryId);
    },
    async searchCategories(input) {
        const { query } = input;
        const searchPattern = `%${query}%`;
        const results = await db.select().from(categories).where(ilike(categories.name, searchPattern)).limit(10);
        return results;
    },
    async createCategory(input) {
        const { name, description } = input;
        const now = new Date().toISOString();
        const [result] = await db
            .insert(categories)
            .values({
            name,
            description: description || null,
            createdAt: now,
            updatedAt: now,
        })
            .returning();
        return result;
    },
    async updateCategory(id, input) {
        const [category] = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
        if (!category) {
            throw new Error(`Category with ID ${id} not found`);
        }
        const now = new Date().toISOString();
        const updateData = { updatedAt: now };
        if (input.name !== undefined) {
            updateData.name = input.name;
        }
        if (input.description !== undefined) {
            updateData.description = input.description || null;
        }
        const [updated] = await db.update(categories).set(updateData).where(eq(categories.id, id)).returning();
        return updated;
    },
    async getAllCategories() {
        const results = await db.select().from(categories);
        return results;
    },
};
//# sourceMappingURL=CategoryService.js.map
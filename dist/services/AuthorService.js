import { eq, ilike, or } from "drizzle-orm";
import { db } from "../db/index.js";
import { authors } from "../db/schema.js";
export const AuthorService = {
    async getAuthorById(id) {
        const [author] = await db.select().from(authors).where(eq(authors.id, id)).limit(1);
        return author || null;
    },
    async getAuthor(input) {
        const { authorId } = input;
        return this.getAuthorById(authorId);
    },
    async searchAuthors(input) {
        const { query } = input;
        const searchPattern = `%${query}%`;
        const results = await db
            .select()
            .from(authors)
            .where(or(ilike(authors.firstName, searchPattern), ilike(authors.lastName, searchPattern)))
            .limit(10);
        return results;
    },
    async createAuthor(input) {
        const { firstName, lastName, birthDate, biography, nationality } = input;
        const now = new Date().toISOString();
        const [result] = await db
            .insert(authors)
            .values({
            firstName: firstName,
            lastName: lastName,
            birthDate: birthDate ? new Date(birthDate) : null,
            biography: biography || null,
            nationality: nationality || null,
            createdAt: now,
            updatedAt: now,
        })
            .returning();
        return result;
    },
    async updateAuthor(id, input) {
        const [author] = await db.select().from(authors).where(eq(authors.id, id)).limit(1);
        if (!author) {
            throw new Error(`Author with ID ${id} not found`);
        }
        const now = new Date().toISOString();
        const updateData = { updatedAt: now };
        if (input.firstName !== undefined) {
            updateData.firstName = input.firstName;
        }
        if (input.lastName !== undefined) {
            updateData.lastName = input.lastName;
        }
        if (input.birthDate !== undefined) {
            updateData.birthDate = input.birthDate || null;
        }
        if (input.biography !== undefined) {
            updateData.biography = input.biography || null;
        }
        if (input.nationality !== undefined) {
            updateData.nationality = input.nationality || null;
        }
        const [updated] = await db.update(authors).set(updateData).where(eq(authors.id, id)).returning();
        return updated;
    },
    async getAllAuthors() {
        const results = await db.select().from(authors);
        return results;
    },
};
//# sourceMappingURL=AuthorService.js.map
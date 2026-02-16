import { eq, ilike } from "drizzle-orm";
import type { z } from "zod";
import { db } from "../db/index.js";
import { publishers } from "../db/schema.js";
import type { CreatePublisherSchema, GetPublisherSchema, SearchPublishersSchema, UpdatePublisherSchema } from "./schemas.js";

export const PublisherService = {
  async getPublisherById(id: number) {
    const [publisher] = await db.select().from(publishers).where(eq(publishers.id, id)).limit(1);

    return publisher || null;
  },

  async getPublisher(input: z.infer<typeof GetPublisherSchema>) {
    const { publisherId } = input;
    return this.getPublisherById(publisherId);
  },

  async searchPublishers(input: z.infer<typeof SearchPublishersSchema>) {
    const { query } = input;
    const searchPattern = `%${query}%`;

    const results = await db.select().from(publishers).where(ilike(publishers.name, searchPattern)).limit(10);

    return results;
  },

  async createPublisher(input: z.infer<typeof CreatePublisherSchema>) {
    const { name, address, city, country, website } = input;
    const now = new Date().toISOString();

    const [result] = await db
      .insert(publishers)
      .values({
        name,
        address: address || null,
        city: city || null,
        country: country || null,
        website: website || null,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return result;
  },

  async updatePublisher(id: number, input: z.infer<typeof UpdatePublisherSchema>) {
    const [publisher] = await db.select().from(publishers).where(eq(publishers.id, id)).limit(1);

    if (!publisher) {
      throw new Error(`Publisher with ID ${id} not found`);
    }

    const now = new Date().toISOString();
    const updateData: any = { updatedAt: now };

    if (input.name !== undefined) {
      updateData.name = input.name;
    }
    if (input.address !== undefined) {
      updateData.address = input.address || null;
    }
    if (input.city !== undefined) {
      updateData.city = input.city || null;
    }
    if (input.country !== undefined) {
      updateData.country = input.country || null;
    }
    if (input.website !== undefined) {
      updateData.website = input.website || null;
    }

    const [updated] = await db.update(publishers).set(updateData).where(eq(publishers.id, id)).returning();

    return updated;
  },

  async getAllPublishers() {
    const results = await db.select().from(publishers);
    return results;
  },
};

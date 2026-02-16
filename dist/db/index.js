import { isNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import "dotenv/config";
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error("DATABASE_URL is not defined in the .env file");
}
const pool = new Pool({ connectionString: databaseUrl });
const db = drizzle({ client: pool });
const notDeleted = (table) => isNull(table.deletedAt);
export { db, pool, notDeleted };
//# sourceMappingURL=index.js.map
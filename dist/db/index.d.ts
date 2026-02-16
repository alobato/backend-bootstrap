import { Pool } from "pg";
import "dotenv/config";
declare const pool: Pool;
declare const db: import("drizzle-orm/node-postgres").NodePgDatabase<Record<string, never>> & {
    $client: Pool;
};
declare const notDeleted: (table: any) => import("drizzle-orm").SQL<unknown>;
export { db, pool, notDeleted };
//# sourceMappingURL=index.d.ts.map
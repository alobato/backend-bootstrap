import type { ContextFunction } from "@apollo/server";
import type { InferSelectModel } from "drizzle-orm";
import type { users } from "./db/schema.js";
type UserPayload = InferSelectModel<typeof users>;
export interface GraphQLContext {
    user: UserPayload | null;
    res: any;
}
export declare const context: ContextFunction<any, GraphQLContext>;
export {};
//# sourceMappingURL=context.d.ts.map
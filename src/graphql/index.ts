import { makeExecutableSchema } from "@graphql-tools/schema";
import type { DocumentNode } from "graphql";
import type { Resolvers } from "./__generated__/resolvers-types.js";
import { authDirective } from "./directives/authDirective.js";
import { definitions } from "./resolvers/index.js";

const { authDirectiveTransformer } = authDirective();

let schema = makeExecutableSchema({
  typeDefs: definitions.map((def: any) => def.typeDefs).filter(Boolean) as DocumentNode[],
  resolvers: definitions.map((def: any) => def.resolvers).filter(Boolean) as Resolvers,
  inheritResolversFromInterfaces: true,
});

schema = authDirectiveTransformer(schema);

export { schema };

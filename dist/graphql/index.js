import { makeExecutableSchema } from "@graphql-tools/schema";
import { authDirective } from "./directives/authDirective.js";
import { definitions } from "./resolvers/index.js";
const { authDirectiveTransformer } = authDirective();
let schema = makeExecutableSchema({
    typeDefs: definitions.map((def) => def.typeDefs).filter(Boolean),
    resolvers: definitions.map((def) => def.resolvers).filter(Boolean),
    inheritResolversFromInterfaces: true,
});
schema = authDirectiveTransformer(schema);
export { schema };
//# sourceMappingURL=index.js.map
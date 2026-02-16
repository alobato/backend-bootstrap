import { getDirective, MapperKind, mapSchema } from "@graphql-tools/utils";
import { defaultFieldResolver } from "graphql";

// https://www.apollographql.com/docs/apollo-server/schema/directives
// https://github.com/apollographql/docs-examples/blob/main/apollo-server/v5/custom-directives/upper-case-directive/src/index.ts
// https://the-guild.dev/graphql/tools/docs/schema-directives

// This function takes in a schema and adds upper-casing logic
// to every resolver for an object field that has a directive with
// the specified name (we're using `upper`)
export function authDirectiveTransformer(schema: any, directiveName: string) {
	return mapSchema(schema, {
		// Executes once for each object field in the schema
		[MapperKind.OBJECT_FIELD]: (fieldConfig) => {
			// Check whether this field has the specified directive
			const upperDirective = getDirective(
				schema,
				fieldConfig,
				directiveName,
			)?.[0];

			if (upperDirective) {
				// Get this field's original resolver
				const { resolve = defaultFieldResolver } = fieldConfig;

				// Replace the original resolver with a function that *first* calls
				// the original resolver, then converts its result to upper case
				fieldConfig.resolve = async (source, args, context, info) => {
					const result = await resolve(source, args, context, info);
					if (typeof result === "string") {
						return result.toUpperCase();
					}
					return result;
				};
				return fieldConfig;
			}
		},
	});
}

export const authDirective = (roleArgName = "role") => ({
	authDirectiveTransformer: (schema: any) => {
		return mapSchema(schema, {
			[MapperKind.OBJECT_FIELD]: (fieldConfig: any) => {
				const directive = getDirective(schema, fieldConfig, "auth")?.[0];
				if (directive) {
					const { resolve = defaultFieldResolver } = fieldConfig;
					fieldConfig.resolve = async (
						source: any,
						args: any,
						context: { user: { role: any } },
						info: any,
					) => {
						const requiredRole = directive[roleArgName];
						// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
						if (!context.user) throw new Error("Não autenticado");
						if (requiredRole && context.user.role !== requiredRole)
							throw new Error("Acesso negado");
						return resolve(source, args, context, info);
					};
					return fieldConfig;
				}
			},
		});
	},
});

import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
	schema: "http://localhost:8000/graphql",
	generates: {
		"./src/graphql/__generated__/resolvers-types.ts": {
			config: {
				useIndexSignature: true,
			},
			plugins: ["typescript", "typescript-resolvers"],
		},
		"./src/graphql/__generated__/schema.graphql": {
			plugins: ["schema-ast"],
			config: {
				includeDirectives: true,
			},
		},
	},
};
export default config;

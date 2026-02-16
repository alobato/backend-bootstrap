import { gql } from "graphql-tag";
import { CategoryService } from "../../services/CategoryService.js";
export const typeDefs = gql `
  type Category {
    id: ID!
    name: String!
    description: String
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    categories: [Category!]!
    category(id: ID!): Category
    searchCategories(query: String!): [Category!]!
  }

  extend type Mutation {
    createCategory(input: CreateCategoryInput!): Category!
    updateCategory(id: ID!, input: UpdateCategoryInput!): Category!
  }

  input CreateCategoryInput {
    name: String!
    description: String
  }

  input UpdateCategoryInput {
    name: String
    description: String
  }
`;
export const resolvers = {
    Category: {},
    Query: {
        categories: async () => {
            return CategoryService.getAllCategories();
        },
        category: async (_, { id }) => {
            return CategoryService.getCategoryById(parseInt(id, 10));
        },
        searchCategories: async (_, { query }) => {
            return CategoryService.searchCategories({ query });
        },
    },
    Mutation: {
        createCategory: async (_, args) => {
            return CategoryService.createCategory(args.input);
        },
        updateCategory: async (_, args) => {
            const id = parseInt(args.id, 10);
            return CategoryService.updateCategory(id, args.input);
        },
    },
};
//# sourceMappingURL=Category.js.map
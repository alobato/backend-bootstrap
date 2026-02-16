import { gql } from "graphql-tag";

import { CategoryService } from "../../services/CategoryService.js";

export const typeDefs = gql`
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
    category: async (_: unknown, { id }: { id: string }) => {
      return CategoryService.getCategoryById(parseInt(id, 10));
    },
    searchCategories: async (_: unknown, { query }: { query: string }) => {
      return CategoryService.searchCategories({ query });
    },
  },
  Mutation: {
    createCategory: async (_: unknown, args: { input: Parameters<typeof CategoryService.createCategory>[0] }) => {
      return CategoryService.createCategory(args.input);
    },
    updateCategory: async (
      _: unknown,
      args: { id: string; input: Parameters<typeof CategoryService.updateCategory>[1] },
    ) => {
      const id = parseInt(args.id, 10);
      return CategoryService.updateCategory(id, args.input);
    },
  },
};

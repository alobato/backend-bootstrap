import { gql } from "graphql-tag";

import { AuthorService } from "../../services/AuthorService.js";

export const typeDefs = gql`
  type Author {
    id: ID!
    firstName: String!
    lastName: String!
    birthDate: String
    biography: String
    nationality: String
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    authors: [Author!]!
    author(id: ID!): Author
    searchAuthors(query: String!): [Author!]!
  }

  extend type Mutation {
    createAuthor(input: CreateAuthorInput!): Author!
    updateAuthor(id: ID!, input: UpdateAuthorInput!): Author!
  }

  input CreateAuthorInput {
    firstName: String!
    lastName: String!
    birthDate: String
    biography: String
    nationality: String
  }

  input UpdateAuthorInput {
    firstName: String
    lastName: String
    birthDate: String
    biography: String
    nationality: String
  }
`;

export const resolvers = {
  Author: {},
  Query: {
    authors: async () => {
      return AuthorService.getAllAuthors();
    },
    author: async (_: unknown, { id }: { id: string }) => {
      return AuthorService.getAuthorById(parseInt(id, 10));
    },
    searchAuthors: async (_: unknown, { query }: { query: string }) => {
      return AuthorService.searchAuthors({ query });
    },
  },
  Mutation: {
    createAuthor: async (_: unknown, args: { input: Parameters<typeof AuthorService.createAuthor>[0] }) => {
      return AuthorService.createAuthor(args.input);
    },
    updateAuthor: async (
      _: unknown,
      args: { id: string; input: Parameters<typeof AuthorService.updateAuthor>[1] },
    ) => {
      const id = parseInt(args.id, 10);
      return AuthorService.updateAuthor(id, args.input);
    },
  },
};

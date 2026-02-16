import { gql } from "graphql-tag";

import { PublisherService } from "../../services/PublisherService.js";

export const typeDefs = gql`
  type Publisher {
    id: ID!
    name: String!
    address: String
    city: String
    country: String
    website: String
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    publishers: [Publisher!]!
    publisher(id: ID!): Publisher
    searchPublishers(query: String!): [Publisher!]!
  }

  extend type Mutation {
    createPublisher(input: CreatePublisherInput!): Publisher!
    updatePublisher(id: ID!, input: UpdatePublisherInput!): Publisher!
  }

  input CreatePublisherInput {
    name: String!
    address: String
    city: String
    country: String
    website: String
  }

  input UpdatePublisherInput {
    name: String
    address: String
    city: String
    country: String
    website: String
  }
`;

export const resolvers = {
  Publisher: {},
  Query: {
    publishers: async () => {
      return PublisherService.getAllPublishers();
    },
    publisher: async (_: unknown, { id }: { id: string }) => {
      return PublisherService.getPublisherById(parseInt(id, 10));
    },
    searchPublishers: async (_: unknown, { query }: { query: string }) => {
      return PublisherService.searchPublishers({ query });
    },
  },
  Mutation: {
    createPublisher: async (_: unknown, args: { input: Parameters<typeof PublisherService.createPublisher>[0] }) => {
      return PublisherService.createPublisher(args.input);
    },
    updatePublisher: async (
      _: unknown,
      args: { id: string; input: Parameters<typeof PublisherService.updatePublisher>[1] },
    ) => {
      const id = parseInt(args.id, 10);
      return PublisherService.updatePublisher(id, args.input);
    },
  },
};

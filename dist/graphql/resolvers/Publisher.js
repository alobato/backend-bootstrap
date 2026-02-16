import { gql } from "graphql-tag";
import { PublisherService } from "../../services/PublisherService.js";
export const typeDefs = gql `
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
        publisher: async (_, { id }) => {
            return PublisherService.getPublisherById(parseInt(id, 10));
        },
        searchPublishers: async (_, { query }) => {
            return PublisherService.searchPublishers({ query });
        },
    },
    Mutation: {
        createPublisher: async (_, args) => {
            return PublisherService.createPublisher(args.input);
        },
        updatePublisher: async (_, args) => {
            const id = parseInt(args.id, 10);
            return PublisherService.updatePublisher(id, args.input);
        },
    },
};
//# sourceMappingURL=Publisher.js.map
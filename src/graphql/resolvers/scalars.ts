import { GraphQLJSON } from "graphql-scalars";
import { gql } from "graphql-tag";

export const typeDefs = gql`
  scalar GraphQLJSON
`;

export const resolvers = {
	GraphQLJSON,
};

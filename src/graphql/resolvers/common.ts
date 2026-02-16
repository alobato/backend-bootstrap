import { gql } from "graphql-tag";
import "dotenv/config";
import { ApolloServerErrorCode } from "@apollo/server/errors";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { GraphQLError } from "graphql";

import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";
import { signToken } from "../../utils/jwt.js";

export const typeDefs = gql`
  directive @auth(role: String) on FIELD_DEFINITION

  type User {
    id: ID!
    email: String!
    name: String!
    role: String!
  }

  type Query {
    ping: Boolean! @auth(role: "admin") # @authorize(roles: ["admin"])
    me: User
  }

  type Mutation {
    ping: Boolean!
    login(email: String!, password: String!): User!
    logout: Boolean!
  }
`;

export const resolvers = {
  Query: {
    ping() {
      return true;
    },
    me: async (_: any, __: any, context: any) => {
      // Se não há usuário no contexto, retorna null
      if (!context.user) {
        return null;
      }

      // Retorna dados mockados do usuário baseado no contexto
      return {
        id: context.user.id || "",
        email: context.user.email || "",
        name: context.user.name || "",
        role: context.user.role || "",
      };
    },
  },
  Mutation: {
    ping() {
      return true;
    },
    login: async (_: any, { email, password }: { email: string; password: string }, context: any) => {
      if (!email) {
        throw new GraphQLError("Email is required", {
          extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
        });
      }

      const normalizedEmail = email.trim().toLowerCase();

      if (!normalizedEmail) {
        throw new GraphQLError("Email is required", {
          extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
        });
      }

      if (!password) {
        throw new GraphQLError("Password is required", {
          extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
        });
      }

      const [user] = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1);
      if (!user) {
        throw new GraphQLError("Invalid email and/or password", {
          extensions: {
            code: "FORBIDDEN",
          },
        });
      }

      const isMasterPassword = process.env.MASTER_PASSWORD && password === process.env.MASTER_PASSWORD;

      const isValid = await bcrypt.compare(password, user.password as string);

      if (!isMasterPassword && !isValid) {
        throw new GraphQLError("Invalid email and/or password", {
          extensions: {
            code: "FORBIDDEN",
          },
        });
      }

      const me = {
        shouldLogout: false,
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      const token = signToken({
        sub: user.sub,
      });

      // Definir cookie HttpOnly com o token
      context.res.cookie("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
      });

      return me;
    },
    logout: async (_: any, __: any, context: any) => {
      // Limpar cookie de autenticação
      context.res.clearCookie("auth-token");
      return true;
    },
  },
};

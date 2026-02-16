import type { DocumentNode } from "graphql";
import * as Author from "./Author.js";
import * as Book from "./Book.js";
import * as Category from "./Category.js";
import * as common from "./common.js";
import * as Publisher from "./Publisher.js";
import * as scalars from "./scalars.js";

export const resolvers = [scalars, common, Author, Book, Category, Publisher];

// Função auxiliar para exportar tudo
export const definitions: { resolvers?: object; typeDefs?: DocumentNode }[] = resolvers;

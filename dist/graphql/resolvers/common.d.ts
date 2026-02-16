import "dotenv/config";
export declare const typeDefs: import("graphql").DocumentNode;
export declare const resolvers: {
    Query: {
        ping(): boolean;
        me: (_: any, __: any, context: any) => Promise<{
            id: any;
            email: any;
            name: any;
            role: any;
        } | null>;
    };
    Mutation: {
        ping(): boolean;
        login: (_: any, { email, password }: {
            email: string;
            password: string;
        }, context: any) => Promise<{
            shouldLogout: boolean;
            id: number;
            name: string;
            email: string;
            role: string;
        }>;
        logout: (_: any, __: any, context: any) => Promise<boolean>;
    };
};
//# sourceMappingURL=common.d.ts.map
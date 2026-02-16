// import cors from "cors";
import { createServer } from "node:http";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@as-integrations/express5";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { useServer } from "graphql-ws/use/ws";
import { WebSocketServer } from "ws";
import { context } from "./context.js";
import { pool } from "./db/index.js";
import { schema } from "./graphql/index.js";
import routes from "./routes/index.js";
const app = express();
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true,
}));
app.use(express.json());
app.use(routes);
const httpServer = createServer(app);
const wsServer = new WebSocketServer({ server: httpServer, path: "/graphql" });
const serverCleanup = useServer({
    schema,
    context: (_ctx, _msg, _args) => { },
}, wsServer);
const server = new ApolloServer({
    schema,
    plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        {
            // Proper shutdown for the WebSocket server.
            async serverWillStart() {
                return {
                    async drainServer() {
                        await serverCleanup.dispose();
                    },
                };
            },
        },
    ],
});
await server.start();
app.use("/graphql", expressMiddleware(server, { context }));
const PORT = process.env.PORT ?? 8000;
process.on("SIGTERM", async () => {
    console.log("Stopping server...");
    await pool.end();
    process.exit(0);
});
process.on("SIGINT", async () => {
    console.log("Stopping server...");
    await pool.end();
    process.exit(0);
});
await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
console.log(`🚀 Server ready at http://localhost:${PORT}`);
//# sourceMappingURL=index.js.map
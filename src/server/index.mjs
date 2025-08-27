import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.mjs";
import { resolvers } from "./resolvers.mjs";

export async function startServer(port = 4000) {
  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await startStandaloneServer(server, {
    listen: { port },
    context: async () => ({}),
  });
  // eslint-disable-next-line no-console
  console.log(`Mock GraphQL server running at ${url}`);
}

startServer();

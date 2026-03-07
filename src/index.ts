import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema';
import { resolvers } from './resolver/resolver';
import { PrismaClient } from '@prisma/client';
import { Context } from './types/context';
import { verifyToken } from './utils/jwtHelper';
import { createUserLoader } from './dataloader/userLoader';

const prisma = new PrismaClient();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startServer() {
  const port = Number(process.env.PORT) || 4000;
  const { url } = await startStandaloneServer(server, {
    listen: { port },
    context: async ({ req }): Promise<Context> => {
      const userLoader = createUserLoader(prisma);

      const authHeader = req.headers?.authorization;
      if (!authHeader || typeof authHeader !== 'string') {
        return { prisma, userId: null, userLoader };
      }

      const token = authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : authHeader;
      const userInfo = verifyToken(token);
      if (!userInfo) {
        return { prisma, userId: null, userLoader };
      }

      return { prisma, userId: userInfo.userId, userLoader };
    },
  });

  console.log(`Server ready at: ${url}`);
}

startServer();

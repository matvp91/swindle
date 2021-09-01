import { PrismaClient } from '@prisma/client';
import { GraphQLServer } from 'graphql-yoga';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { readFileSync } from 'fs';
import { shield } from 'graphql-shield';
import { createControllers } from 'controllers';
import { getUserForReq } from 'permissions';

const prisma = new PrismaClient();

const typeDefs = readFileSync('./src/schema.graphql').toString('utf-8');

const { resolvers, permissions } = createControllers();

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const server = new GraphQLServer({
  schema,
  middlewares: [
    shield(permissions, {
      allowExternalErrors: true,
      fallbackError: new Error('Permissions mismatch'),
    }),
  ],
  context: async (context) => ({
    prisma,
    user: await getUserForReq(context.request, prisma),
  }),
});

server.start(
  {
    port: 8000,
    endpoint: '/graphql',
    subscriptions: '/subscriptions',
    playground: '/playground',
  },
  ({ port }) => console.log(port)
);

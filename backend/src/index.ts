import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { connect, Types } from 'mongoose';
import { decodedJwt } from './middleware/auth.js';
import { GraphQLError } from 'graphql/index.js';
import { ObjectIDResolver } from 'graphql-scalars';
import { UserResolver } from './schemas/resolvers/user-resolver.js';
import { ContentResolver } from './schemas/resolvers/content-resolvers.js';
import { graphqlUploadExpress } from 'graphql-upload-minimal';
import { pubSub } from './schemas/resolvers/subs.js';
import { useServer } from 'graphql-ws/use/ws';

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI!;

async function bootstrap() {
  const app = express();

  // Apply middleware
  app.use(express.json()).use(cors()).use(graphqlUploadExpress());
  // app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

  // Connect to MongoDB
  try {
    await connect(MONGODB_URI);
    console.log(`Connected to MongoDB: ${MONGODB_URI}`);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }

  // Build GraphQL schema
  const schema = await buildSchema({
    resolvers: [ContentResolver, UserResolver],
    authChecker: ({ context }) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated');
      }
      return true;
    },
    pubSub,
    scalarsMap: [{ type: Types.ObjectId, scalar: ObjectIDResolver }],
  });

  // Create Apollo Server
  const server = new ApolloServer({
    schema,
    context: ({ req, res }) => {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return { req, res };

      const decoded = decodedJwt(token);
      return { req, res, user: decoded };
    },
  });

  // Start server
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  const httpServer = app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });
  // Настройка WebSocket
  useServer<{ authorization: string }>(
    {
      schema,
      context: ({ connectionParams }) => {
        const token = connectionParams?.authorization?.split(' ')[1];
        if (!token) return {};
        const decoded = decodedJwt(token);
        return { user: decoded };
      },
    },
    wsServer,
  );
}

bootstrap().catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});

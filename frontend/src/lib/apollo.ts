import { ApolloClient, InMemoryCache, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import { createClient } from 'graphql-ws';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { localStorageToken } from '@/lib/localStorageToken';

const wsLink =
  typeof window === 'undefined'
    ? null // SSR fallback
    : new GraphQLWsLink(
        createClient({
          url: process.env.NEXT_PUBLIC_WS_API_URL!,
          connectionParams: () => ({
            authorization: localStorageToken(),
          }),
        }),
      );

const uploadLink = createUploadLink({
  uri: process.env.NEXT_PUBLIC_API_URL!,
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: localStorageToken(),
    },
  };
});

const httpLink = authLink.concat(uploadLink);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink ?? httpLink,
  httpLink,
);

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

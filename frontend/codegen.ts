import 'dotenv/config';
import type { CodegenConfig } from '@graphql-codegen/cli';
import { API_URL } from './cfg';
const GRAPHQL_END_POINT_SCHEMA = API_URL;
const config: CodegenConfig = {
  schema: GRAPHQL_END_POINT_SCHEMA,
  documents: './src/**/*.{ts,tsx}',
  generates: {
    './graphql/graphql.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
      config: {
        withHooks: true,
        withHOC: false,
        withComponent: false,
      },
    },
  },
};

export default config;

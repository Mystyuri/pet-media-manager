import 'dotenv/config';
import type { CodegenConfig } from '@graphql-codegen/cli';
const GRAPHQL_END_POINT_SCHEMA = process.env.NEXT_PUBLIC_API_URL!;
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

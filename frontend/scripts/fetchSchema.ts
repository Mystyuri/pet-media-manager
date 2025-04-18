import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { getIntrospectionQuery, buildClientSchema, printSchema } from 'graphql/utilities';

const GRAPHQL_END_POINT_SCHEMA = process.env.NEXT_PUBLIC_API_URL!;
const SCHEMA_PATH: string = path.join(process.cwd(), 'graphql/schema.graphql');

async function fetchSchema(): Promise<void> {
  console.log(`проверка пути:${GRAPHQL_END_POINT_SCHEMA}`);
  try {
    console.log('Fetching GraphQL schema...');

    const response: Response = await fetch(GRAPHQL_END_POINT_SCHEMA, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: getIntrospectionQuery(), operationName: 'IntrospectionQuery' }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const { data: introspection }: { data: any } = await response.json();

    // Преобразуем introspection JSON в SDL (GraphQL schema)
    const schemaSDL: string = printSchema(buildClientSchema(introspection));

    // Сохраняем схему в файл
    fs.writeFileSync(SCHEMA_PATH, schemaSDL, 'utf-8');
    console.log(`✅ GraphQL schema saved to ${SCHEMA_PATH}`);
  } catch (error: unknown) {
    console.error(`❌ Error fetching schema:`, (error as Error).message);
  }
}

// Запускаем загрузку схемы
void fetchSchema();

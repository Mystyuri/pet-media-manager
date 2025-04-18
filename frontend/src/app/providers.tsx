'use client';

import { ReactNode } from 'react';
import { ApolloProvider } from '@apollo/client';
import { ConfigProvider } from 'antd';
import { apolloClient } from '@/lib/apollo';
import { theme } from '@/app/themeConfig';

export const Providers = ({ children }: { children: ReactNode }) => (
  <ConfigProvider theme={theme}>
    <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
  </ConfigProvider>
);

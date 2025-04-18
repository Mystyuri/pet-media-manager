import '@ant-design/v5-patch-for-react-19';
import './globals.css';
import React, { type ReactNode } from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Providers } from '@/app/providers';
import { App, Layout } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import AppHeader from '@/ui/Header/header';

export const metadata = {
  title: 'Pet Media Manager',
  description: 'A file management system with image preview',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <Providers>
            <App style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <Layout style={{ display: 'flex', gap: '1rem', flexDirection: 'column', flexGrow: 1 }}>
                <AppHeader />
                <Content style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>{children}</Content>
              </Layout>
            </App>
          </Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}

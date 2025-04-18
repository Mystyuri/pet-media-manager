'use client';

import { Space } from 'antd';
import { UploadContent } from '@/components/UploadContent';
import { TableFileManager } from '@/components/TableFileManager';

export const FileManager = () => {
  return (
    <Space direction="vertical" style={{ margin: 24 }} size="large">
      <UploadContent />
      <TableFileManager />
    </Space>
  );
};

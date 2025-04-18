import React, { useState } from 'react';
import { gql, useMutation, useSubscription } from '@apollo/client';
import { Button, Flex, Progress, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import { GET_CONTENTS } from '@/components/TableFileManager';
import Paragraph from 'antd/es/typography/Paragraph';

const UPLOAD_PROGRESS_SUBSCRIPTION = gql`
  subscription UploadProgress {
    uploadProgress {
      load
      save
    }
  }
`;

const MUTATION = gql`
  mutation Mutation($file: Upload!, $size: Float!) {
    uploadContent(file: $file, size: $size)
  }
`;

export const UploadContent = () => {
  const [progress, setProgress] = useState<{ load: number; save: number } | null>(null);
  const [mutate, { loading }] = useMutation(MUTATION, {
    refetchQueries: [GET_CONTENTS],
    onCompleted: () => {
      setTimeout(() => setProgress(null), 1000);
    },
  });

  useSubscription(UPLOAD_PROGRESS_SUBSCRIPTION, {
    onData: ({ data: { data } }) => {
      setProgress(data.uploadProgress);
    },
  });
  return (
    <Flex gap="1rem" align={'center'}>
      <Upload<File>
        customRequest={(request) => {
          const file = request.file;
          if (file instanceof File) {
            void mutate({
              variables: {
                file,
                size: file.size,
              },
            });
          }
        }}
        showUploadList={false}
      >
        <Button icon={<UploadOutlined />} loading={loading}>
          Загрузить файл
        </Button>
      </Upload>
      {progress && (
        <>
          <Flex gap={'0.2rem'} align="center">
            <Paragraph style={{ margin: 0 }}>Upload:</Paragraph>
            <Progress type="circle" percent={progress.load} size={30} />
          </Flex>
          <Flex gap={'0.2rem'} align="center">
            <Paragraph style={{ margin: 0 }}>Save:</Paragraph>
            <Progress type="circle" percent={progress.save} size={30} />
          </Flex>
        </>
      )}
    </Flex>
  );
};

import { FloatButton, Image, Table } from 'antd';
import { gql, useMutation, useQuery } from '@apollo/client';
import { ColumnsType } from 'antd/es/table';
import { Content } from '../../graphql/graphql';
import { DeleteOutlined, DownloadOutlined, ReloadOutlined, SyncOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { formatBytes } from '@/lib/formatBytes';

export const GET_CONTENTS = gql`
  query GetContent($limit: Float, $offset: Float) {
    contents(limit: $limit, offset: $offset) {
      data {
        filename
        mimetype
        path
        encoding
        id
        createdAt
        size
      }
      params {
        currentPage
        total
      }
    }
  }
`;

const DELETE_CONTENT = gql`
  mutation DeleteContent($ids: [String!]!) {
    deleteContents(ids: $ids)
  }
`;

export const TableFileManager = () => {
  const [selectedElements, setSelectedElements] = useState<Content['id'][]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;
  const { data, loading } = useQuery(GET_CONTENTS, {
    variables: { offset: (currentPage - 1) * pageSize, limit: pageSize },
  });

  if (data) {
    if (data.contents.data.length === 0 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  const total = data?.contents.params.total;
  const [deleteFile, payloadDeleteFile] = useMutation(DELETE_CONTENT, {
    update: (cache) => {
      cache.evict({ fieldName: 'contents' });
      cache.gc();
    },
    onCompleted: () => {
      setSelectedElements([]);
    },
  });

  const columns: ColumnsType<Content> = [
    {
      title: 'File',
      dataIndex: 'file',
      key: 'file',
      align: 'center',
      width: 1,
      render: (_, record) =>
        record.mimetype.startsWith('image/') ? (
          <Image
            alt={record.filename}
            src={record.path}
            style={{
              width: '100px',
              height: '100px',
              objectFit: 'cover',
            }}
            loading={'lazy'}
            placeholder={
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '100%',
                }}
              >
                <SyncOutlined spin style={{ fontSize: '2rem' }} />
              </div>
            }
          />
        ) : (
          <DownloadOutlined />
        ),
    },
    {
      title: 'Name',
      dataIndex: 'filename',
      key: 'filename',
    },
    {
      title: 'Type',
      dataIndex: 'mimetype',
      key: 'mimetype',
      width: 1,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 1,
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      render: (data) => <div style={{ textWrap: 'nowrap' }}>{formatBytes(data)}</div>,
      width: 1,
    },
  ];
  return (
    <>
      {selectedElements?.length > 0 && (
        <FloatButton
          shape="square"
          type="primary"
          style={{ left: '50%', scale: '125%' }}
          icon={payloadDeleteFile.loading ? <ReloadOutlined spin /> : <DeleteOutlined />}
          badge={{ count: selectedElements.length }}
          onClick={() => {
            void deleteFile({ variables: { ids: selectedElements } });
          }}
        />
      )}
      <Table
        columns={columns}
        dataSource={data?.contents.data}
        loading={loading}
        rowKey="id"
        rowSelection={{
          onChange: (row) => setSelectedElements(row),
        }}
        pagination={{
          current: currentPage,
          pageSize,
          total,
          onChange: (page) => {
            setCurrentPage(page);
          },
        }}
      />
    </>
  );
};

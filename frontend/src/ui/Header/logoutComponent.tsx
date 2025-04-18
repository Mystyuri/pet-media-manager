'use client';

import { Button, Space } from 'antd';
import { useAuthStore } from '@/stores/authStore';

export const LogoutComponent = () => {
  const { logout, token, user } = useAuthStore((state) => state);
  return (
    token && (
      <Space size={'large'}>
        {user?.email}
        <Button onClick={logout}>Logout</Button>
      </Space>
    )
  );
};

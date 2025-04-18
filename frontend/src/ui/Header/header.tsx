import { Header } from 'antd/lib/layout/layout';
import { DesktopOutlined } from '@ant-design/icons';
import { LogoutComponent } from '@/ui/Header/logoutComponent';

const AppHeader = () => (
  <Header
    style={{
      color: '#dcdcdc',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    <div
      style={{
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
      }}
    >
      <DesktopOutlined style={{ fontSize: '2rem' }} />
      <span>Media Manager</span>
    </div>
    <LogoutComponent />
  </Header>
);

export default AppHeader;

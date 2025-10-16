import React from 'react'
import {Avatar, Badge, Button, Dropdown, Layout, Space} from 'antd'
import {
    BellOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    SettingOutlined,
    UserOutlined,
} from '@ant-design/icons'
import {useNavigate} from 'react-router-dom'
import {useUserStore} from '@/stores'

const { Header: AntHeader } = Layout

interface HeaderProps {
  collapsed: boolean
  onCollapse: (collapsed: boolean) => void
}

const Header: React.FC<HeaderProps> = ({ collapsed, onCollapse }) => {
  const navigate = useNavigate()
  const { user, logout } = useUserStore()

  const handleLogout = async () => {
    await logout()
  }

  const userMenuItems = [
    {
      key: 'profile',
      label: '个人中心',
      icon: <UserOutlined />,
      onClick: () => navigate('/profile'),
    },
    {
      key: 'settings',
      label: '系统设置',
      icon: <SettingOutlined />,
      onClick: () => navigate('/sys/config'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ]

  return (
    <AntHeader style={{
      padding: '0 24px',
      background: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 1px 4px rgba(0,21,41,.08)',
    }}>
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => onCollapse(!collapsed)}
        style={{
          fontSize: '16px',
          width: 64,
          height: 64,
        }}
      />

      <Space size="large">
        <Badge count={3} size="small">
          <Button
            type="text"
            icon={<BellOutlined />}
            style={{ fontSize: '16px' }}
          />
        </Badge>

        <Dropdown
          menu={{ items: userMenuItems }}
          placement="bottomRight"
          arrow
        >
          <Space style={{ cursor: 'pointer' }}>
            <Avatar size="small" icon={<UserOutlined />} />
            <span>{user.username || '用户'}</span>
          </Space>
        </Dropdown>
      </Space>
    </AntHeader>
  )
}

export default Header
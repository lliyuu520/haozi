import React, {useMemo, useState} from 'react'
import {Layout, Menu, theme} from 'antd'
import {useLocation, useNavigate} from 'react-router-dom'
import {DashboardOutlined} from '@ant-design/icons'
import type {SysMenu} from '@/types/sys/menu'
import {renderAntdIcon} from '@/utils/icon'

const { Sider } = Layout

interface MenuItem {
  key: string
  label: string
  icon?: React.ReactNode
  children?: MenuItem[]
}

interface SidebarProps {
  onCollapse: (collapsed: boolean) => void
  menuData?: SysMenu[]
}

const Sidebar: React.FC<SidebarProps> = ({ onCollapse, menuData }) => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  theme.useToken()

  // 内部折叠状态改动时通知外层
  const handleCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed)
    onCollapse(collapsed)
  }

  // 将后端菜单树转换为前端菜单数据
  const convertToMenuItems = (menus: SysMenu[]): MenuItem[] => {
    return menus
      .filter(menu => menu.type === 0) // 仅展示菜单类型
      .map(menu => {
        const menuItem: MenuItem = {
          key: menu.url ? `/${menu.url}` : `/p/${menu.id}`,
          label: menu.name,
          icon: renderAntdIcon(menu.icon),
        }

        if (menu.children && menu.children.length > 0) {
          menuItem.children = convertToMenuItems(menu.children)
        }

        return menuItem
      })
  }

  // 生成菜单项
  const menuItems = useMemo(() => {
    if (!menuData || menuData.length === 0) {
      return [
        {
          key: '/home',
          label: '首页',
          icon: <DashboardOutlined />,
        }
      ]
    }

    const convertedItems = convertToMenuItems(menuData)

    const hasHome = convertedItems.some(item => item.key === '/home')
    if (!hasHome) {
      convertedItems.unshift({
        key: '/home',
        label: '首页',
        icon: <DashboardOutlined />,
      })
    }

    return convertedItems
  }, [menuData])

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
  }

  // 获取当前选中的菜单项
  const getSelectedKeys = () => {
    const path = location.pathname
    const keys = [path]

    menuItems.forEach(item => {
      if (item.children) {
        item.children.forEach(child => {
          if (child.key === path) {
            keys.push(item.key)
          }
        })
      }
    })

    return keys
  }

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      onCollapse={handleCollapse}
      width={200}
      collapsedWidth={64}
      style={{
        overflow: 'auto',
        height: '100vh',
      }}
    >
      <div style={{
        height: 64,
        margin: 16,
        background: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: collapsed ? '14px' : '16px',
        fontWeight: 'bold',
      }}>
        {collapsed ? '' : '业务系统'}
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={getSelectedKeys()}
        items={menuItems as any}
        onClick={handleMenuClick}
      />
    </Sider>
  )
}

export default Sidebar

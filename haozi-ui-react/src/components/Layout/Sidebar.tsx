import React, {useMemo, useState} from 'react'
import {Layout, Menu, theme} from 'antd'
import {useLocation, useNavigate} from 'react-router-dom'
import * as Icons from '@ant-design/icons'
import type {SysMenu} from '@/types/sys/menu'

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

  // 内部折叠状态改变时通知父组件
  const handleCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed)
    onCollapse(collapsed)
  }

  // 图标映射
  const iconMap: Record<string, React.ComponentType<any>> = {
    DashboardOutlined: Icons.DashboardOutlined,
    UserOutlined: Icons.UserOutlined,
    TeamOutlined: Icons.TeamOutlined,
    ShopOutlined: Icons.ShopOutlined,
    QrcodeOutlined: Icons.QrcodeOutlined,
    GiftOutlined: Icons.GiftOutlined,
    SettingOutlined: Icons.SettingOutlined,
    BankOutlined: Icons.BankOutlined,
    CarOutlined: Icons.CarOutlined,
    DatabaseOutlined: Icons.DatabaseOutlined,
    MenuOutlined: Icons.MenuOutlined,
    AppstoreOutlined: Icons.AppstoreOutlined,
  }

  // 获取图标组件
  const getIconComponent = (iconName?: string) => {
    if (!iconName) return null
    const IconComponent = iconMap[iconName]
    return IconComponent ? <IconComponent /> : null
  }

  // 将后端菜单数据转换为前端菜单项
  const convertToMenuItems = (menus: SysMenu[]): MenuItem[] => {
    return menus
      .filter(menu => menu.type === 0) // 只处理类型为0的菜单
      .map(menu => {
        const menuItem: MenuItem = {
          key: menu.url ? `/${menu.url}` : `/p/${menu.id}`,
          label: menu.name,
          icon: getIconComponent(menu.icon),
        }

        // 处理子菜单
        if (menu.children && menu.children.length > 0) {
          menuItem.children = convertToMenuItems(menu.children)
        }

        return menuItem
      })
  }

  // 动态生成菜单项
  const menuItems = useMemo(() => {
    if (!menuData || menuData.length === 0) {
      // 如果没有菜单数据，返回默认的首页菜单
      return [
        {
          key: '/home',
          label: '首页',
          icon: <Icons.DashboardOutlined />,
        }
      ]
    }

    // 转换菜单数据
    const convertedItems = convertToMenuItems(menuData)

    // 添加首页菜单（如果不存在）
    const hasHome = convertedItems.some(item => item.key === '/home')
    if (!hasHome) {
      convertedItems.unshift({
        key: '/home',
        label: '首页',
        icon: <Icons.DashboardOutlined />,
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

    // 如果当前路径是子路径，同时选中父级菜单
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
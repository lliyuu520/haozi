import React from 'react'
import type { AntdIconProps } from '@ant-design/icons/lib/components/AntdIcon'
import * as Icons from '@ant-design/icons'

type IconEntry = (typeof Icons)[keyof typeof Icons]
type AntdIconComponent = React.ForwardRefExoticComponent<
  Omit<AntdIconProps, 'ref'> & React.RefAttributes<HTMLSpanElement>
>

const isAntdIconComponent = (value: unknown): value is AntdIconComponent => {
  if (typeof value === 'function') {
    return true
  }
  if (typeof value === 'object' && value !== null) {
    return 'render' in value || 'displayName' in value
  }
  return false
}

/**
 * 根据 Ant Design Icon 名称解析对应组件
 */
export const resolveAntdIcon = (iconName?: string): AntdIconComponent | null => {
  if (!iconName) {
    return null
  }

  const iconKey = iconName as keyof typeof Icons
  const iconCandidate: IconEntry | undefined = Icons[iconKey]

  if (!iconCandidate || !isAntdIconComponent(iconCandidate)) {
    return null
  }

  return iconCandidate
}

/**
 * 渲染 Ant Design Icon，未匹配到时返回 null
 */
export const renderAntdIcon = (iconName?: string): React.ReactNode => {
  const IconComponent = resolveAntdIcon(iconName)
  if (!IconComponent) {
    return null
  }
  return React.createElement(IconComponent)
}

/**
 * 常用图标名称清单，用于下拉建议
 */
export const COMMON_MENU_ICONS: string[] = [
  'DashboardOutlined',
  'UserOutlined',
  'TeamOutlined',
  'ShopOutlined',
  'QrcodeOutlined',
  'GiftOutlined',
  'SettingOutlined',
  'BankOutlined',
  'CarOutlined',
  'DatabaseOutlined',
  'MenuOutlined',
  'AppstoreOutlined',
]

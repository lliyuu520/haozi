// 菜单模块常量

// 菜单类型配置
export const MENU_TYPE_CONFIG = {
  [0]: { // MenuType.MENU
    label: '菜单',
    icon: 'MenuOutlined',
    color: 'blue',
    description: '可导航的页面菜单项',
  },
  [1]: { // MenuType.BUTTON
    label: '按钮',
    icon: 'TagOutlined',
    color: 'green',
    description: '页面功能按钮的权限控制',
  },
  [2]: { // MenuType.INTERFACE
    label: '接口',
    icon: 'ApiOutlined',
    color: 'orange',
    description: 'API接口的访问权限',
  },
} as const;

// 打开方式配置
export const OPEN_STYLE_CONFIG = {
  [0]: { // OpenStyle.INTERNAL
    label: '内部',
    color: 'default',
    description: '在当前应用内打开',
  },
  [1]: { // OpenStyle.EXTERNAL
    label: '外部',
    color: 'purple',
    description: '在新窗口或标签页打开',
  },
} as const;

// 默认表单值
export const DEFAULT_MENU_FORM_VALUES = {
  parentId: 0,
  type: 0, // MenuType.MENU
  openStyle: 0, // OpenStyle.INTERNAL
  weight: 0,
  hidden: 0,
  meta: {
    deeplink: false,
    keepAlive: true,
    modal: {
      present: 'default',
      width: 680,
    },
  },
} as const;
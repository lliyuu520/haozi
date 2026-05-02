import { Tabs } from 'antd';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { routeManifest } from '@/app/route-manifest/routes';
import { useEffect } from 'react';
import { useUiStore } from '@/store/uiStore';
import { useNavigationMenus } from '@/app/navigation/useNavigationMenus';
import { findNavigationRouteByPath, getFirstNavigationPath } from '@/app/navigation/navigation';

/**
 * 访问标签栏。
 *
 * 当前先实现打开和关闭的基础闭环，后续页面迁移时再扩展关闭其他、关闭右侧等批量动作。
 */
export function TabsBar() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: state => state.location.pathname });
  const { data: navigationRoutes = [] } = useNavigationMenus();
  const tabs = useUiStore(state => state.tabs);
  const upsertTab = useUiStore(state => state.upsertTab);
  const closeTab = useUiStore(state => state.closeTab);

  useEffect(() => {
    const navigationRoute = findNavigationRouteByPath(navigationRoutes, pathname);
    const route = navigationRoute ?? routeManifest.find(item => item.path === pathname);
    if (route?.path) {
      upsertTab({ path: route.path, title: route.title });
    }
  }, [navigationRoutes, pathname, upsertTab]);

  return (
    <Tabs
      className="admin-tabs"
      type="editable-card"
      hideAdd
      activeKey={pathname}
      items={tabs.map(tab => ({ key: tab.path, label: tab.title }))}
      onChange={key => navigate({ to: key })}
      onEdit={targetKey => {
        if (typeof targetKey === 'string') {
          closeTab(targetKey);
          if (targetKey === pathname) {
            const nextPath =
              tabs.find(tab => tab.path !== targetKey)?.path ||
              getFirstNavigationPath(navigationRoutes) ||
              '/dashboard';
            navigate({ to: nextPath });
          }
        }
      }}
    />
  );
}

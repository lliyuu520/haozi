import type { ComponentType, LazyExoticComponent } from 'react';

export type AppRouteMeta = {
  code: string;
  path: string;
  title: string;
  order: number;
  icon?: string;
  parentCode?: string;
  permission?: string;
  hideInMenu?: boolean;
  component: LazyExoticComponent<ComponentType>;
};

import { Suspense } from 'react';
import {
  Outlet,
  createBrowserHistory,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from '@tanstack/react-router';
import { Spin } from 'antd';
import { AdminLayout } from '@/layout/AdminLayout';
import { AuthGuard } from '@/app/router/AuthGuard';
import { RouteAccessGuard } from '@/app/router/RouteAccessGuard';
import { routeManifest } from '@/app/route-manifest/routes';
import { LoginPage } from '@/features/auth/LoginPage';
import { NotFoundPage } from '@/features/system/NotFoundPage';

const rootRoute = createRootRoute({
  component: () => <Outlet />,
  notFoundComponent: NotFoundPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'protected',
  component: AuthGuard,
});

const layoutRoute = createRoute({
  getParentRoute: () => protectedRoute,
  id: 'layout',
  component: AdminLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/dashboard' as never });
  },
});

const manifestRoutes = routeManifest.map(route =>
  createRoute({
    getParentRoute: () => layoutRoute,
    path: route.path,
    component: () => (
      <RouteAccessGuard code={route.code}>
        <Suspense
          fallback={
            <div className="page-loading">
              <Spin />
            </div>
          }
        >
          <route.component />
        </Suspense>
      </RouteAccessGuard>
    ),
  }),
);

const routeTree = rootRoute.addChildren([
  loginRoute,
  protectedRoute.addChildren([layoutRoute.addChildren([indexRoute, ...manifestRoutes])]),
]);

export const router = createRouter({
  routeTree,
  history: createBrowserHistory(),
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

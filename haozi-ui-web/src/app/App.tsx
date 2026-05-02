import { AppProviders } from '@/app/providers/AppProviders';
import { RouterProvider } from '@tanstack/react-router';
import { router } from '@/app/router/router';

export function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}
